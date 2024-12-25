"use client"

import { useConvexAuth } from "convex/react"
import { Loader2 } from "lucide-react"
import { redirect } from "next/navigation"
import { Navigation } from "./_components/navigation"
import { SearchCommand } from "@/components/search-command"

export default function MainLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const { isAuthenticated, isLoading } = useConvexAuth()

    if (isLoading){
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin"/>
            </div>
        )
    }
    
    if(!isAuthenticated){
        return redirect("/auth/sign-in")
    }

    return (
      <div className="h-full flex">
        <Navigation/>
        <main className="flex-1 h-full overflow-y-auto">
            <SearchCommand/>
            {children}
        </main>
      </div>
    )
  }