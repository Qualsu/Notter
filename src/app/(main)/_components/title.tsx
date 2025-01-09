"use client"

import { useMutation } from "convex/react"
import { Doc } from "../../../../convex/_generated/dataModel"
import { api } from "../../../../convex/_generated/api"
import { ChangeEvent, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useOrganization, useUser } from "@clerk/nextjs"

interface TitleProps{
    initialData: Doc<"documents">
}

export function Title({ initialData }: TitleProps){
    const inputRef = useRef<HTMLInputElement>(null)
    const update = useMutation(api.document.update)
    const { user } = useUser()
    const { organization } = useOrganization()
    const orgId = organization?.id !== undefined ? organization?.id as string : user?.id as string
    const [title, setTitle] = useState(initialData.title || "Новая заметка")
    const [isEditing, setIsEditing] = useState(false)

    const enableInput = () => {
        setTitle(initialData.title) 
        setIsEditing(true) 
        setTimeout(() => {
          inputRef.current?.focus() 
          inputRef.current?.setSelectionRange(0, inputRef.current.value.length) 
        }, 0) 
      } 
    
      const disabledInput = () => {
        setIsEditing(false) 
      } 
    
      const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value)
        update({
          id: initialData._id,
          title: event.target.value || "Новая заметка",
          userId: orgId,
          lastEditor: user?.username as string
        }) 
      } 
    
      const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
          disabledInput() 
        }
      } 

    return (
        <div className="flex items-center gap-x-1">
            {!!initialData.icon && <p>{initialData.icon}</p>}
            {isEditing ? (
                <Input
                    ref={inputRef}
                    onClick={enableInput}
                    onBlur={disabledInput}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={title}
                    className="h-7 px-2 focus-visible:ring-transparent"
                />
            ) : (
                <Button
                    onClick={enableInput}
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 font-normal"
                >
                    <span className="truncate text-sm">{initialData?.title}</span>
                </Button>
            )}
        </div>
    )
}

Title.Skeleton = function TitleSkeleton() {
    return <Skeleton className="h-6 w-20 rounded-md" />
}