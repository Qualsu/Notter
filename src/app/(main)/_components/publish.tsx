"use client" 

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover" 
import { useMutation } from "convex/react" 
import { useState } from "react" 
import { toast } from "sonner" 
import { Button } from "@/components/ui/button" 
import { Check, Copy, Globe } from "lucide-react" 
import { Doc } from "../../../../convex/_generated/dataModel" 
import { api } from "../../../../convex/_generated/api" 
import { Checkbox } from "@/components/ui/checkbox"
import { useOrigin } from "../../../../hooks/use-origin"
import { useOrganization, useUser } from "@clerk/nextjs"

interface PublishProps {
  initialData: Doc<"documents"> 
}

export function Publish({ initialData }: PublishProps){
  const origin = useOrigin() 
  const update = useMutation(api.document.update) 
  const { user } = useUser()
  const { organization } = useOrganization()
  const orgId = organization?.id !== undefined ? organization?.id as string : user?.id as string
  const [copied, setCopied] = useState(false) 
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isShortUrl, setIsShortUrl] = useState(false)

  const handleCheckboxChange = () => {
    setIsShortUrl((prev) => !prev)
  }

  const url = isShortUrl ? `https://nttr.pw/${initialData.shortId}` : `https://notter.site/view/${initialData._id}`

  const onPublish = () => {
    setIsSubmitting(true) 

    const promise = update({
      id: initialData._id,
      isPublished: true,
      userId: orgId
    }).finally(() => setIsSubmitting(false)) 

    toast.promise(promise, {
      loading: "Публикуем...",
      success: "Заметка опубликована!",
      error: "Не удалось опубликовать",
    }) 
  } 

  const onUnpublish = () => {
    setIsSubmitting(true) 

    const promise = update({
      id: initialData._id,
      isPublished: false,
      userId: orgId
    }).finally(() => setIsSubmitting(false)) 

    toast.promise(promise, {
      loading: "Отменяем публикацию...",
      success: "Заметка убрана с публикации!",
      error: "Не удалось отменить публикацию",
    }) 
  } 

  const onCopy = () => {
    navigator.clipboard.writeText(url) 
    setCopied(true) 

    setTimeout(() => {
      setCopied(false) 
    }, 1000) 
  } 

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          Опубликовать
          {initialData.isPublished && (
            <Globe className="h-4 w-4 text-sky-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className=" h-4 w-4 animate-pulse text-sky-500" />
              <p className="text-xs font-medium text-sky-500">
                Эта заметка находится в открытом доступе
              </p>
            </div>
            <div className="flex items-center">
              <input
                value={url}
                className="h-8 flex-1 rounded-l-md border bg-muted px-2 text-xs"
                disabled
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex flex-row items-center">
                <Checkbox checked={isShortUrl} onCheckedChange={handleCheckboxChange}/> 
                <p className="ml-1 text-xs">Сократить ссылку</p>
            </div>

            <Button
              size="sm"
              className="w-full text-xs"
              disabled={isSubmitting}
              onClick={onUnpublish}
            >
              Отменить публикацию
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="mb-2 h-8 w-8 text-muted-foreground " />
            <p>Поделитесь свой заметкой</p>
            <span className="mb-4 text-xs text-muted-foreground">
              Поделитесь своими мыслями с другими
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-xs"
              size="sm"
            >
              Опубликовать
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  ) 
} 