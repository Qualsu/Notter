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
import { useEdgeStore } from "@/lib/edgestore" 
import { DragAndDrop } from "../drag-and-drop" 

export function CoverImageModal(){
  const params = useParams() 

  const [file, setFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false) 

  const update = useMutation(api.document.update) 
  const coverImage = useCoverImage() 
  const { edgestore } = useEdgeStore() 

  const onClose = () => {
    setFile(undefined) 
    setIsSubmitting(false) 
    coverImage.onClose() 
  } 

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true) 
      setFile(file) 

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url
        }
      }) 

      await update({
        id: params.documentId as Id<"documents">,
        coverImage: res.url
      }) 

      onClose() 
    }
  } 

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