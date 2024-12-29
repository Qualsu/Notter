"use client"

import { useOrigin } from "../../../../hooks/use-origin"
import { redirect } from "next/navigation"

export default function PublicLayout({ children }: { children: React.ReactNode }){
    const origin = useOrigin()

    // if(origin !== "https://notter.site"){
    //     redirect("https://notter.tech")
    // }
    
    return (
    <div className="h-full">
        {children}
    </div>
    )
}