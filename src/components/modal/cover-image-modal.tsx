"use client" 

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog" 
import { useState } from "react" 
import { useMutation } from "convex/react" 
import { useParams } from "next/navigation" 
import { useCoverImage } from "../../../hooks/use-cover-image" 
import { api } from "../../../convex/_generated/api" 
import { Id } from "../../../convex/_generated/dataModel" 
import { DragAndDrop } from "../drag-and-drop" 
import { useOrganization, useUser } from "@clerk/nextjs"
import { uploadFile } from "../../../server/files/file"
import { getById as getUserById } from "../../../server/users/user";
import { getById as getOrgById } from "../../../server/orgs/org";
import toast from "react-hot-toast"

export function CoverImageModal(){
  const params = useParams() 

  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false) 

  const update = useMutation(api.document.update) 
  const coverImage = useCoverImage()

  const { user } = useUser()
  const { organization } = useOrganization()
  const isOrg = organization?.id !== undefined
  const orgId = isOrg ? organization?.id as string : user?.id as string

  const onClose = () => {
    setFile(undefined) 
    setIsSubmitting(false) 
    coverImage.onClose() 
  } 

  const onChange = async (file?: File) => {
    if (!file) return;

    const userdata = isOrg ? 
      await getOrgById(orgId) : 
      await getUserById(orgId);

    const userSize = 
      userdata?.premium == 1 ? 3 
      : userdata?.premium == 2 ? 10 
      : 1;
    const maxSize = userSize * 1024 * 1024

    if (file.size > maxSize) {
      toast.error(`Размер файла не может привышать ${userSize} МБ`);
      coverImage.onClose();
      return;
    }

    setIsSubmitting(true);
    setFile(file);

    const fileUrl = await uploadFile(file);

    await update({
      id: params.documentId as Id<"documents">,
      coverImage: fileUrl,
      userId: orgId,
      lastEditor: user?.username as string
    });

    onClose();
  };


  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogTitle>
        <h1 className="sr-only">Изменить обложку</h1>
      </DialogTitle>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Загрузить Обложку</h2>
        </DialogHeader>
        <DragAndDrop
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  ) 
} 