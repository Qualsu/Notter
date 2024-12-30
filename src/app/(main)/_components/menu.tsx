"use client" 

import { useRouter } from "next/navigation" 
import { useOrganization, useUser } from "@clerk/clerk-react" 
import { useMutation, useQuery } from "convex/react" 
import { toast } from "sonner" 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" 
import { MoreHorizontal, Trash, Undo } from "lucide-react" 
import { Button } from "@/components/ui/button" 
import { Skeleton } from "@/components/ui/skeleton" 
import { Id } from "../../../../convex/_generated/dataModel" 
import { api } from "../../../../convex/_generated/api" 

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
        {!document?.isAcrhived ? (
            <DropdownMenuItem onClick={onArchive}>
                <Trash className="mr-2 h-4 w-4" />
                Удалить
            </DropdownMenuItem>
        ) : (
            <DropdownMenuItem onClick={onRestore}>
                <Undo className="mr-2 h-4 w-4" />
                Восстановить
            </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <div className="p-2 text-xs text-muted-foreground">
            Последнее изменение от: {user?.username}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  ) 
} 

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-8 w-8" /> 
} 