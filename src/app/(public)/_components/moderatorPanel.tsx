import { useEffect, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { User } from "../../../../server/users/types";
import { getById as getUserById } from "../../../../server/users/user";
import { getById as getOrgById } from "../../../../server/orgs/org";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, FileJson, Menu, Trash, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/modal/confirm-modal";
import { sendMail } from "../../../../server/mail/mail";

interface DocumentProps {
  _id: Id<"documents">;
  userId: string;
  title: string
  shortId?: string;
  isShort?: boolean;
  isPublished: boolean;
  isAcrhived?: boolean;
  creatorName?: string;
  lastEditor?: string;
  verifed?: boolean;
  content?: string
}

export function ModeratorPanel({
  _id,
  userId,
  title,
  shortId,
  isShort,
  isPublished,
  isAcrhived,
  creatorName,
  lastEditor,
  verifed,
  content
}: DocumentProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { user: clerkUser } = useUser();
  const [clerkUserData, setClerkUserData] = useState<User | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const remove = useMutation(api.document.remove);
  const update = useMutation(api.document.update);
  const router = useRouter();

  const [localShortId, setLocalShortId] = useState(shortId || "");
  const [localIsShort, setLocalIsShort] = useState(!!isShort);
  const [localIsPublished, setLocalIsPublished] = useState(isPublished);
  const [localIsArchived, setLocalIsArchived] = useState(!!isAcrhived);
  const [localVerified, setLocalVerified] = useState(!!verifed);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!clerkUser?.id) return;
      try {
        const data = await getUserById(clerkUser.id);
        setClerkUserData(data);

        const isOrg = userId.startsWith("org_")
        const owner = isOrg ? await getOrgById(userId) : null
        const userdata = isOrg ? 
          await getUserById(owner?.owner as string) : 
          await getUserById(userId);
        setUserData(userdata);
      } catch (error) {

      }
    };
    fetchUserData();
  }, [clerkUser?.id, userId]);

  if (clerkUserData?.moderator !== true) return null;

  const sendNotification = async (action: string, success: boolean, details: string) => {
    if (!userData?.mail || !success) return;

    try {
      let subject = "";
      let message = "";

      switch (action) {
        case "публикация":
          subject = `Публикация вашей заметки "${title}" была обновлена`;
          message = `${userData.username}!\n\nВаша заметка "${title}" была ${details}.\nПосмотреть: ${`https://notter.tech/view/${_id}`}`;
          break;
        case "короткая ссылка":
          subject = `Ссылка на вашу заметку "${title}" была обновлена`;
          message = `${userData.username}!\n\nShort ID вашей заметки "${title}" был ${details}.\nПосмотреть: ${`https://notter.tech/view/${_id}`}`;
          break;
        case "архивация":
          subject = `Архивация вашей заметки "${title}" была обновлена`;
          message = `${userData.username}!\n\nВаша заметка "${title}" была ${details}.\nПосмотреть: ${`https://notter.tech/view/${_id}`}`;
          break;
        case "верификация":
          subject = `Верификация вашей заметки "${title}" была обновлена`;
          message = `${userData.username}!\n\nВаша заметка "${title}" была ${details}.\nПосмотреть: ${`https://notter.tech/view/${_id}`}`;
          break;
        case "удаление":
          subject = `Удаление вашей заметки "${title}"`;
          message = `${userData.username}!\n\nВаша заметка "${title}" была удалена.\nПосмотреть: ${`https://notter.tech/view/${_id}`}`;
          break;
        default:
          subject = `Изменение вашей заметки "${title}"`;
          message = `${userData.username}!\n\nВаша заметка "${title}" была обновлена. Детали: ${details}.\nПосмотреть: ${`https://notter.tech/view/${_id}`}`;
          break;
      }

      message += `\nПо всем вопросам обращайтесь на https://feedback.qual.su`;

      await sendMail({
        to: userData.mail,
        subject,
        message
      });
    } catch (error) {

    }
  };

  const handleUpdate = async (field: string, value: any, actionDescription: string) => {
    let details = "";

    switch (field) {
      case "isShort":
        details = `Короткая ссылка была ${value ? "включена" : "выключена"}`;
        break;
      case "isPublished":
        details = `Публикация была ${value ? "опубликована" : "снята с публикации"}`;
        break;
      case "isAcrhived":
        details = `Заметка была ${value ? "архивирована" : "восстановлена из архива"}`;
        break;
      case "verifed":
        details = `Верификация была ${value ? "подтверждена" : "отменена"}`;
        break;
      case "shortId":
        details = `Short ID был изменен на "${value}"`;
        break;
      default:
        details = `Изменено поле "${field}" на ${value}`;
    }

    try {
      await update({
        id: _id,
        userId,
        [field]: value,
      });
      toast.success("Обновлено успешно");
      await sendNotification(actionDescription, true, details);
    } catch (err: any) {
      const errorMessage = err.message || "Ошибка при обновлении";
      toast.error(errorMessage);
      await sendNotification(actionDescription, false, errorMessage);
    }
  };

  const handleShortIdBlur = async () => {
    if (localShortId === (shortId || "")) {
      return;
    }
    
    const regex = /^[a-z0-9-]{4,30}$/;
    if (!regex.test(localShortId)) {
      const errorMessage = "Short ID должен быть 4–30 символов, только a-z, 0-9 и -";
      toast.error(errorMessage);
      setLocalShortId(shortId || "");
      await sendNotification("изменение Short ID", false, errorMessage);
      return;
    }

    const actionDescription = `Short ID изменен с "${shortId || 'не установлен'}" на "${localShortId}"`;
    await handleUpdate("shortId", localShortId, actionDescription);
  };

  const handleSwitchChange = async (field: string, value: boolean) => {
    const fieldNames: { [key: string]: string } = {
      "isShort": "короткая ссылка",
      "isPublished": "публикация",
      "isAcrhived": "архивация",
      "verifed": "верификация"
    };

    const actionDescription = `${fieldNames[field]} ${value ? "включена" : "выключена"}`;

    if (field === "isShort") setLocalIsShort(value);
    if (field === "isPublished") setLocalIsPublished(value);
    if (field === "isAcrhived") setLocalIsArchived(value);
    if (field === "verifed") setLocalVerified(value);

    await handleUpdate(field, value, actionDescription);
  };

  const onRemove = async (documentId: Id<"documents">) => {
    const promise = remove({
      id: documentId,
      userId,
    });

    toast.promise(promise, {
      loading: "Удаляем заметку...",
      success: "Заметка удалена!",
      error: "Не удалось удалить",
    });

    try {
      await promise;
      await sendNotification("документ удален", true, "документ удален");
      router.push("/dashboard");
    } catch (error: any) {
      const errorMessage = error.message || "Ошибка при удалении";
      await sendNotification("удаление документа", false, errorMessage);
    }
  };

  const downloadJson = () => {
    if (content && typeof window !== "undefined") {
      try {
        const parsedJson = JSON.parse(content);
        const jsonContent = JSON.stringify(parsedJson, null, 2);
        const blob = new Blob([jsonContent], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title}.json`;
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        toast.error("Ошибка при создании JSON файла");
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <Button onClick={() => setDialogOpen(true)} variant={"outline"} size={"icon"}>
          <Menu />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Панель Модератора</DialogTitle>
        <DialogDescription>
          <p>_id: {_id}</p>
          <p>User ID: {userId}</p>
          <p>Short ID: {shortId}</p>
          <p className="flex flex-row items-center gap-1">
            Is short: {isShort ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </p>
          <p className="flex flex-row items-center gap-1">
            Is published: {isPublished ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </p>
          <p className="flex flex-row items-center gap-1">
            Is archived: {isAcrhived ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </p>
          <p>Creator: {creatorName}</p>
          <p>Last editor: {lastEditor}</p>

          <hr className="my-3" />

          <div className="flex items-center gap-3">
            <p className="whitespace-nowrap">Short ID:</p>
            <Input
              value={localShortId}
              onChange={(e) => setLocalShortId(e.target.value)}
              onBlur={handleShortIdBlur}
              className="h-8 my-2"
            />
          </div>

          <div className="flex items-center gap-3">
            <p>IsShort:</p>
            <Switch
              checked={localIsShort}
              onCheckedChange={(value) => handleSwitchChange("isShort", value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <p>IsPublished:</p>
            <Switch
              checked={localIsPublished}
              onCheckedChange={(value) => handleSwitchChange("isPublished", value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <p>IsArchived:</p>
            <Switch
              checked={localIsArchived}
              onCheckedChange={(value) => handleSwitchChange("isAcrhived", value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <p>Verifed:</p>
            <Switch
              checked={localVerified}
              onCheckedChange={(value) => handleSwitchChange("verifed", value)}
            />
          </div>

          <div className="flex flex-row items-center gap-2">
            <ConfirmModal onConfirm={() => onRemove(_id)}>
                <Button variant={"outline"} className="mt-4">
                Удалить <Trash className="h-4 w-4 text-muted-foreground" />
                </Button>
            </ConfirmModal>

            <Button variant={"outline"} className="mt-4" onClick={downloadJson}>
                <FileJson className="h-4 w-4" /> Скачать JSON
            </Button>
          </div>
        </DialogDescription>
        <DialogClose onClick={() => setDialogOpen(false)}>Закрыть</DialogClose>
      </DialogContent>
    </Dialog>
  );
}