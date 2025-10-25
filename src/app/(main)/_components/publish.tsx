"use client"

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover" 
import { useMutation, useQuery } from "convex/react" 
import { useState, useEffect } from "react" 
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button" 
import { Check, Copy, Globe } from "lucide-react" 
import { Doc } from "../../../../convex/_generated/dataModel" 
import { api } from "../../../../convex/_generated/api" 
import { Checkbox } from "@/components/ui/checkbox"
import { useOrigin } from "../../../../hooks/use-origin"
import { Protect, useOrganization, useUser } from "@clerk/nextjs"
import { updateUser } from "../../../../server/users/user"
import { getById } from "../../../../server/users/user"

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
  const [publicDocumentLimit, setPublicDocumentLimit] = useState<number>(10)

  const currentPublicDocuments = useQuery(api.document.getPublicDocumentCount, {
    userId: orgId
  }) 

  const fetchUserData = async () => {
    if (user?.id) {
      const userData = await getById(user.id)
      if (userData) {
        let publicLimit = 10;
        if (userData.premium === 1) {
          publicLimit = 100;
        } else if (userData.premium === 2) {
          publicLimit = 1000;
        }
        setPublicDocumentLimit(publicLimit)
      }
    }
  }

  useEffect(() => {
    fetchUserData()
  })

  const handleCheckboxChange = () => {
    setIsShortUrl((prev) => !prev)
  }

  const url = isShortUrl ? `${origin}/${initialData.shortId}` : `${origin}/view/${initialData._id}`

  const onPublish = async () => {
    if (currentPublicDocuments !== undefined && currentPublicDocuments >= publicDocumentLimit) {
      toast.error(`Вы достигли лимита на публикацию в ${publicDocumentLimit} публичных заметок`);
      return;
    }

    setIsSubmitting(true) 

    const promise = update({
      id: initialData._id,
      isPublished: true,
      userId: orgId,
      lastEditor: user?.username as string
    }).finally(() => setIsSubmitting(false)) 

    toast.promise(promise, {
      loading: "Публикуем...",
      success: "Заметка опубликована!",
      error: "Не удалось опубликовать",
    }) 

    if (user?.id && currentPublicDocuments !== undefined) {
      const updatedPublicCount = Number(currentPublicDocuments) + 1;

      updateUser(user.id, null, null, null, null, null, null, null, updatedPublicCount);
    }
  } 

  const onUnpublish = async () => {
    setIsSubmitting(true) 

    const promise = update({
      id: initialData._id,
      isPublished: false,
      userId: orgId,
      lastEditor: user?.username as string
    }).finally(() => setIsSubmitting(false)) 

    toast.promise(promise, {
      loading: "Отменяем публикацию...",
      success: "Заметка убрана с публикации!",
      error: "Не удалось отменить публикацию",
    }) 

    if (user?.id && currentPublicDocuments !== undefined) {
      const updatedPublicCount = Math.max(Number(currentPublicDocuments) - 1, 0);
      updateUser(user.id, null, null, null, null, null, null, null, updatedPublicCount)
      console.log("upd")
    }
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
      <PopoverTrigger>
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
            <Protect
                condition={(check) => {
                    return check({
                        role: "org:admin"
                    }) || organization?.id === undefined
                }}
                fallback={<></>}
            >
              <Button
                size="sm"
                className="w-full text-xs"
                disabled={isSubmitting}
                onClick={onUnpublish}
              >
                Отменить публикацию
              </Button>
            </Protect>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="mb-2 h-8 w-8 text-muted-foreground " />
            <p>Поделитесь своей заметкой</p>
            <Protect
              condition={(check) => {
                return check({
                  role: "org:admin"
                }) || organization?.id === undefined
              }}
              fallback={
              <span className="text-[0.7rem] text-muted-foreground text-center w-full block">
                Публиковать могут только администраторы организации
              </span>
              }
            >
              <span className="mb-2 text-xs text-muted-foreground">
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
            </Protect>
          </div>
        )}
      </PopoverContent>
    </Popover>
  ) 
}
