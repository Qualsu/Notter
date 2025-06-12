"use client" 

import { useRouter } from "next/navigation" 
import { useOrganization, useUser } from "@clerk/clerk-react" 
import { useMutation, useQuery } from "convex/react" 
import { toast } from "react-hot-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" 
import { Archive, MoreHorizontal, Trash, Undo } from "lucide-react" 
import { Button } from "@/components/ui/button" 
import { Skeleton } from "@/components/ui/skeleton" 
import { Id } from "../../../../convex/_generated/dataModel" 
import { api } from "../../../../convex/_generated/api" 
import { Protect } from "@clerk/nextjs"

interface MenuProps {
  documentId: Id<"documents"> 
}

export function Menu({ documentId }: MenuProps){
  const router = useRouter() 
  const { user } = useUser()
  const { organization } = useOrganization()
  const orgId = organization?.id !== undefined ? organization?.id as string : user?.id as string
  const archive = useMutation(api.document.archive)
  const restore = useMutation(api.document.restore)
  const document = useQuery(api.document.getById, {
    documentId: documentId as Id<"documents">,
    userId: orgId
  })

  const onArchive = () => {
    const promise = archive({
      id: documentId,
      userId: orgId
    })

    toast.promise(promise, {
        loading: "Перемещаем в архив...",
        success: "Заметка перемещена в архив!",
        error: "Не удалось переместить в архив"
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

    router.push(`/dashboard/${documentId}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
      <Protect
          condition={(check) => {
              return check({
                  role: "org:admin"
              }) || document?.userId === user?.id
          }}
          fallback={<></>}
      >
        {!document?.isAcrhived ? (
            <DropdownMenuItem onClick={onArchive}>
                <Archive className="h-4 w-4" />
                Архивировать
            </DropdownMenuItem>
        ) : (
            <DropdownMenuItem onClick={onRestore}>
                <Undo className="h-4 w-4" />
                Восстановить
            </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
      </Protect>
        <div className="p-1 text-xs text-muted-foreground">
            Заметка создана: {document?.userName}
        </div>
        <div className="p-1 text-xs text-muted-foreground">
            Последнее изменение от: {document?.lastEditor}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  ) 
} 

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-8 w-8" /> 
} 