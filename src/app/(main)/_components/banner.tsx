"use client" 

import { Button } from "@/components/ui/button" 
import { useMutation } from "convex/react" 
import { useRouter } from "next/navigation" 
import { toast } from "react-hot-toast"
import { api } from "../../../../convex/_generated/api" 
import { ConfirmModal } from "@/components/modal/confirm-modal" 
import { Id } from "../../../../convex/_generated/dataModel" 
import { Protect, useOrganization, useUser } from "@clerk/nextjs"

interface BannerProps {
  documentId: Id<"documents"> 
}

export function Banner({ documentId }: BannerProps){
  const router = useRouter() 
  const remove = useMutation(api.document.remove) 
  const restore = useMutation(api.document.restore) 
  const { user } = useUser()
  const { organization } = useOrganization()
  const orgId = organization?.id !== undefined ? organization?.id as string : user?.id as string

  const onRemove = () => {
    const promise = remove({
      id: documentId,
      userId: orgId
    }) 

    toast.promise(promise, {
        loading: "Удаляем заметку...",
        success: "Заметка удалена!",
        error: "Не удалось удалить"
    }) 

    router.push("/dashboard") 
  } 

  const onRestore = () => {
    const promise = restore({
      id: documentId,
      userId: orgId
    }) 

    toast.promise(promise, {
        loading: "Восстановляем...",
        success: "Заметка восстановлена!",
        error: "Не удалось восстановить"
    }) 
  } 

    return (
    <div
      className="fixed w-full z-[100000] flex justify-center bg-rose-500 p-0"
      style={{ minHeight: 40 }}
    >
      <div className="flex flex-col md:flex-row items-center gap-3 w-full max-w-2xl px-4 py-2 text-center md:text-left text-sm text-white">
        <p className="mb-2 md:mb-0">
          Эта заметка перемещена в архив
        </p>
        <Protect
          condition={(check) => {
            return check({
              role: "org:admin"
            }) || organization?.id === undefined
          }}
          fallback={<></>}
        >
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onRestore}
              variant="outline"
              className="h-auto border-white bg-transparent p-1 px-2 font-normal text-white transition hover:bg-white hover:text-rose-500"
            >
              Восстановить
            </Button>
            <ConfirmModal onConfirm={onRemove}>
              <Button
                size="sm"
                variant="outline"
                className="h-auto border-white bg-transparent p-1 px-2 font-normal text-white transition hover:bg-white hover:text-rose-500"
              >
                Удалить безвозвратно
              </Button>
            </ConfirmModal>
          </div>
        </Protect>
      </div>
    </div>
  )
} 