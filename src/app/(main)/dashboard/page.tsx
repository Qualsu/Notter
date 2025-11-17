"use client"

import Image from "next/image"
import EmptyImage from "../../../../public/image/Empty.png"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useOrganization, useUser } from "@clerk/nextjs"

export default function Dashboard() {
    const create = useMutation(api.document.create)
    const router = useRouter()
    const { user } = useUser()
    const { organization } = useOrganization()
    const isOrg = organization?.id !== undefined
    const orgId = isOrg ? organization?.id as string : user?.id as string
    
    const onCreate = () => {
        const promise = create({ 
            title: "Новая заметка",
            userId: orgId,
            creatorName: isOrg ? organization?.slug as string : user?.username as string,
            lastEditor: user?.username as string
        })
            .then((documentId) => {
                router.push(`/dashboard/${documentId}`);
                return documentId
            })
            .catch((error) => {
                if (error.message.includes("Rate limit exceeded")) {
                    toast.error("Вы превысили лимит на создание документов. Попробуйте позже")
                } else if (error.message.includes("Rate limited note")){
                    toast.error("Вы достигли лимита в 75 заметок")
                } else {
                    toast.error("Не удалось создать заметку")
                }
                throw error
            })
        
        toast.promise(promise, {
            loading: "Создание заметки...",
            success: "Заметка успешно создана!",
            error: "Не удалось создать заметку"
        })
    }
    
    
    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image 
                src={EmptyImage}
                width="400"
                alt="Empty"

            />
            <h2>
                Пока что тут ничего нет
            </h2>
            <Button onClick={onCreate}>
                <PlusCircle className="h-4 w-4"/>
                Создать заметку
            </Button>
        </div>
    )
}