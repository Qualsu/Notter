"use client" 

import { cn } from "@/lib/utils" 
import Image from "next/image" 
import { Button } from "./ui/button" 
import { ImageIcon, X } from "lucide-react" 
import { useMutation, useQuery } from "convex/react" 
import { useParams } from "next/navigation" 
import { useEdgeStore } from "@/lib/edgestore" 
import { Skeleton } from "./ui/skeleton" 
import { api } from "../../convex/_generated/api" 
import { useCoverImage } from "../../hooks/use-cover-image" 
import { Id } from "../../convex/_generated/dataModel" 
import { useOrganization, useUser } from "@clerk/nextjs"

interface CoverImageProps {
  url?: string 
  preview?: boolean 
}

export function Cover({ url, preview }: CoverImageProps){
  const { edgestore } = useEdgeStore() 
  const { user } = useUser()
  const { organization } = useOrganization()

  const orgId = organization?.id !== undefined ? organization?.id as string : user?.id as string
  const params = useParams() 
  const coverImage = useCoverImage() 
  const removeCoverImage = useMutation(api.document.removeCoverImage) 
  
  const onRemove = async () => {
    if (url) {
      await edgestore.publicFiles.delete({
        url: url,
      }) 
    }
    removeCoverImage({
      id: params.documentId as Id<"documents">,
      userId: orgId
    }) 
  } 

  return (
    <div
      className={cn(
        "group relative h-[35vh] w-full",
        !url && "h-[12vh]",
        url && "bg-muted",
      )}
    >
      {!!url && (
        <Image src={url} fill alt="cover" className="object-cover" priority />
      )}
      {url && !preview && (
        <div className="absolute bottom-5 right-5 flex items-center gap-x-2 opacity-0 group-hover:opacity-100">
          <Button
            onClick={() => coverImage.onReplace(url)}
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Изменить обложку
          </Button>
          <Button
            onClick={onRemove}
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
          >
            <X className="h-4 w-4" />
            Убрать
          </Button>
        </div>
      )}
    </div>
  ) 
} 

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="h-[12vh] w-full" /> 
}