import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { useState } from "react";
import { User } from "../../../../server/users/types";
import { Org } from "../../../../server/orgs/types";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { updateUserBadge } from "../../../../server/users/user";
import { updateUser } from "../../../../server/users/user";
import { updateOrgBadge } from "../../../../server/orgs/org";
import { updateOrg } from "../../../../server/orgs/org";
import { toast } from "react-hot-toast"; // Импортируем toast
import { Switch } from "@/components/ui/switch"; // Предполагаем, что у вас есть компонент Switch
import { useUser } from "@clerk/clerk-react";

interface UserProps {
  user: User | Org | null;
}

export function ModeratorPanel({ user }: UserProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [watermark, setWatermark] = useState(user?.watermark ?? false);
  const [privated, setPrivated] = useState(user?.privated ?? false);
  const [amberSubscription, setAmberSubscription] = useState(user?.premium === 1);
  const [diamondSubscription, setDiamondSubscription] = useState(user?.premium === 2);
  const [verifiedStatus, setVerifiedStatus] = useState(user?.badges.verified ?? false);
  const [contributorStatus, setContributorStatus] = useState(user?.badges.contributor ?? false);
  const [moderatorStatus, setModeratorStatus] = useState(user?.moderator ?? false);
  const { user: clerkUser } = useUser()
  const isOrg = user?._id.startsWith("org_");

  if (user?.moderator === false) {
    return null
  }

  let documentLimit: number = 75;
  let publicDocumentLimit: number = 10;

  if (user?.premium === 1) {
    documentLimit = isOrg ? 500 : 200;
    publicDocumentLimit = isOrg ? 250 : 100;
  } else if (user?.premium === 2) {
    documentLimit = 1000;
    publicDocumentLimit = 1000;
  }

  const handleBadgeToggle = async (badgeName: string) => {
  if (!user) return;

  const currentStatus = badgeName === "verified" ? user?.badges.verified : user?.badges.contributor;
    const newStatus = !currentStatus;

    try {
        const result = isOrg ? 
            await updateOrgBadge(user._id, badgeName, newStatus) :
            await updateUserBadge(user._id, badgeName, newStatus);
        if (result) {
        toast.success(`Бейдж '${badgeName}' обновлен на ${newStatus ? "активен" : "неактивен"}`);
        console.log(`Badge '${badgeName}' updated to ${newStatus}`);

        // Обновляем локальные состояния для отрисовки нового статуса
        if (badgeName === "verified") {
            setVerifiedStatus(newStatus);
        } else if (badgeName === "contributor") {
            setContributorStatus(newStatus);
        }
        }
    } catch (error) {
        toast.error("Произошла ошибка при обновлении бейджа.");
        console.error("Error updating badge:", error);
    }
  };


  const handleSubscriptionToggle = async (subscriptionType: "Amber" | "Diamond") => {
    if (!user) return;

    const newPremium = subscriptionType === "Amber" ? 1 : subscriptionType === "Diamond" ? 2 : 0;

    // Если текущая подписка совпадает с выбранной, то снимаем подписку
    if ((newPremium === 1 && amberSubscription) || (newPremium === 2 && diamondSubscription)) {
      const result = isOrg ? 
        await updateOrg(user._id, null, null, null, null, null, null, null, null, null, null, 0) :
        await updateUser(user._id, null, null, null, null, null, null, null, null, null, null, 0);
      if (result) {
        toast.success("Подписка снята.");
        setAmberSubscription(false);
        setDiamondSubscription(false); // Отключаем оба свитчера
      }
    } else {
      const result = isOrg ? 
        await updateOrg(user._id, null, null, null, null, null, null, null, null, null, null, newPremium) :
        await updateUser(user._id, null, null, null, null, null, null, null, null, null, null, newPremium);
      if (result) {
        toast.success(`Подписка ${subscriptionType} активирована.`);
        if (subscriptionType === "Amber") {
          setAmberSubscription(true);
          setDiamondSubscription(false); // Выключаем Diamond, если включен Amber
        } else {
          setDiamondSubscription(true);
          setAmberSubscription(false); // Выключаем Amber, если включен Diamond
        }
      }
    }
  };

  const handleWatermarkToggle = async () => {
    if (!user) return;
    const newWatermark = !watermark;

    const result = isOrg ? 
        await updateOrg(user._id, null, null, null, null, null, null, null, null, null, newWatermark) : 
        await updateUser(user._id, null, null, null, null, null, null, null, null, newWatermark);
    if (result) {
      toast.success(`Watermark обновлен на ${newWatermark ? "включен" : "выключен"}`);
      setWatermark(newWatermark);
    }
  };

  const handlePrivatedToggle = async () => {
    if (!user) return;
    const newPrivated = !privated;

    const result = isOrg ? 
       await updateOrg(user._id, null, null, null, null, newPrivated) : 
       await updateUser(user._id, null, null, null, null, newPrivated);
    if (result) {
      toast.success(`Профиль обновлен на ${newPrivated ? "приватный" : "публичный"}`);
      setPrivated(newPrivated);
    }
  };

  const handleModeratorToggle = async () => {
    if (!user || !user?.badges.notter || isOrg) return;

    const newModeratorStatus = !moderatorStatus;
    const result = await updateUser(user._id, null, null, null, null, null, null, null, null, null, null, null, newModeratorStatus);
    if (result) {
      toast.success(`${newModeratorStatus ? "Назначен модератором" : "Снят с поста модератора"}`);
      setModeratorStatus(newModeratorStatus); // Обновляем статус модератора
    }
  };

  // Функция для открытия диалога
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  // Функция для закрытия диалога
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger>
          <Button onClick={handleOpenDialog} variant={"outline"} size={"icon"}>
            <Menu />
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle>Панель Модератора</DialogTitle>
          <DialogDescription>
            <p>_id: {user?._id}</p>
            {isOrg && <p>Owner _id: {user?.owner}</p>}
            {isOrg && <p>Members:</p>}
            {isOrg && user?.members.map((member) => (
              <p key={member}>- {member}</p>
            ))}
            {!isOrg && <p>Mail: {user?.mail}</p>}
            <p>Documents: {user?.documents}/{documentLimit}</p>
            <p>Public Documents: {user?.publicDocuments}/{publicDocumentLimit}</p>
            <hr className="my-3" />

            {/* Переключатели для watermark и privated */}
            <div className="flex items-center gap-3">
              <p>Watermark: </p>
              <Switch checked={watermark} onCheckedChange={handleWatermarkToggle} />
            </div>
            <div className="flex items-center gap-3">
              <p>Privated: </p>
              <Switch checked={privated} onCheckedChange={handlePrivatedToggle} />
            </div>

            {/* Переключение для модератора */}
            {user?.badges.notter && clerkUser?.id !== user?._id && (
              <div className="flex items-center gap-3">
                <p>Moderator</p>
                <Switch checked={moderatorStatus} onCheckedChange={handleModeratorToggle} />
              </div>
            )}

            {/* Переключатели для подписки Amber и Diamond */}
            <div className="flex items-center gap-3">
              <p>Amber Subscription: </p>
              <Switch
                checked={amberSubscription}
                onCheckedChange={() => handleSubscriptionToggle("Amber")}
              />
            </div>
            <div className="flex items-center gap-3">
              <p>Diamond Subscription: </p>
              <Switch
                checked={diamondSubscription}
                onCheckedChange={() => handleSubscriptionToggle("Diamond")}
              />
            </div>
            <div className="flex items-center gap-3">
              <p>Verified badge</p>
              <Switch
                checked={verifiedStatus}
                onCheckedChange={() => handleBadgeToggle("verified")}
              />
            </div>
            <div className="flex items-center gap-3">
              <p>Contributor badge</p>
              <Switch
                checked={contributorStatus}
                onCheckedChange={() => handleBadgeToggle("contributor")}
              />
            </div>
          </DialogDescription>
          <DialogClose onClick={handleCloseDialog}>
            Закрыть
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}