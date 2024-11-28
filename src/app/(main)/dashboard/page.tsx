"use client"

import Image from "next/image"
import EmptyImage from "../../../../public/image/Landing.png"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function Dashboard() {
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
            <Button>
                <PlusCircle className="h-4 w-4"/>
                Создать заметку
            </Button>
        </div>
    )
}