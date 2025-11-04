import { useEffect, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { User } from "../../../../server/users/types";
import { getById } from "../../../../server/users/user";
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

interface DocumentProps {
  _id: Id<"documents">;
  userId: string;
  title: string
  shortId?: string;
  isShort?: boolean;
  isPublished: boolean;
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
  creatorName,
  lastEditor,
  verifed,
  content
}: DocumentProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { user: clerkUser } = useUser();
  const [clerkUserData, setClerkUserData] = useState<User | null>(null);
  const remove = useMutation(api.document.remove);
  const update = useMutation(api.document.update);
  const router = useRouter();

  // локальные состояния для управления UI
  const [localShortId, setLocalShortId] = useState(shortId || "");
  const [localIsShort, setLocalIsShort] = useState(!!isShort);
  const [localIsPublished, setLocalIsPublished] = useState(isPublished);
  const [localVerified, setLocalVerified] = useState(!!verifed);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!clerkUser?.id) return;
      try {
        const data = await getById(clerkUser.id);
        setClerkUserData(data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };
    fetchUserData();
  }, [clerkUser?.id]);

  if (clerkUserData?.moderator !== true) return null;

  const handleUpdate = async (field: string, value: any) => {
    try {
      await update({
        id: _id,
        userId,
        [field]: value,
      });
      toast.success("Обновлено успешно");
    } catch (err: any) {
      toast.error(err.message || "Ошибка при обновлении");
      console.error(err);
    }
  };

  const handleShortIdBlur = async () => {
    if (localShortId === (shortId || "")) {
      return;
    }
    
    const regex = /^[a-z0-9-]{4,30}$/;
    if (!regex.test(localShortId)) {
      toast.error("Short ID должен быть 4–30 символов, только a-z, 0-9 и -");
      setLocalShortId(shortId || ""); // вернуть старое значение
      return;
    }

    await handleUpdate("shortId", localShortId);
  };

  const handleSwitchChange = async (field: string, value: boolean) => {
    // мгновенно обновляем UI
    if (field === "isShort") setLocalIsShort(value);
    if (field === "isPublished") setLocalIsPublished(value);
    if (field === "verifed") setLocalVerified(value);

    await handleUpdate(field, value);
  };

  const onRemove = (documentId: Id<"documents">) => {
    const promise = remove({
      id: documentId,
      userId,
    });

    toast.promise(promise, {
      loading: "Удаляем заметку...",
      success: "Заметка удалена!",
      error: "Не удалось удалить",
    });

    router.push("/dashboard");
  };

  const downloadJson = () => {
    if (content && typeof window !== "undefined") {
      const parsedJson = JSON.parse(content);
      const jsonContent = JSON.stringify(parsedJson, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title}.json`;
      link.click();
      URL.revokeObjectURL(url);
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
          <p>Creator: {creatorName}</p>
          <p>Last editor: {lastEditor}</p>

          <hr className="my-3" />

          {/* Short ID */}
          <div className="flex items-center gap-3">
            <p className="whitespace-nowrap">Short ID:</p>
            <Input
              value={localShortId}
              onChange={(e) => setLocalShortId(e.target.value)}
              onBlur={handleShortIdBlur}
              className="h-8 my-2"
            />
          </div>

          {/* Switches */}
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
            <p>Verifed:</p>
            <Switch
              checked={localVerified}
              onCheckedChange={(value) => handleSwitchChange("verifed", value)}
            />
          </div>

          {/* Удаление */}
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
