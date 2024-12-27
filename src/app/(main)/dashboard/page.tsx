"use client"

import Image from "next/image"
import EmptyImage from "../../../../public/image/Landing.png"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { toast } from "sonner"
import { redirect, useRouter } from "next/navigation"
import { useOrigin } from "../../../../hooks/use-origin"

export default function Dashboard() {
    const create = useMutation(api.document.create)
    const router = useRouter()
    const origin = useOrigin()
    
    if(origin === "https://notter.site" || origin === "http://nttr.pw"){
        redirect("https://notter.tech")
    }

    const onCreate = () => {
        const promise = create({ title: "Новая заметка" })
            .then((documentId) => router.push(`/dashboard/${documentId}`))
        
        toast.promise(promise, {
            loading: "Создания заметки...",
            success: "Заметка успешно создана!",
            error: "Не удалось создать заметку"
        })
    }
    
    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image 
                src={EmptyImage}
                width="300"
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