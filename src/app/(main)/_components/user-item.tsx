"use client"

import { OrganizationSwitcher, useOrganization, useUser } from "@clerk/clerk-react"
import { pages } from "@/config/routing/pages.route"
import Link from "next/link"
import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ChevronRight } from "lucide-react"

export function UserItem(){
    const { user } = useUser()
    const { organization } = useOrganization()
    const isOrg = organization?.id !== undefined

    const image = (user as any)?.imageUrl || (user as any)?.profileImageUrl || (user as any)?.image || null

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center w-full gap-2 p-2 hover:bg-accent">
                        <Avatar className="h-6 w-6">
                            {image ? (
                                <AvatarImage src={image} alt={user?.username ?? user?.fullName ?? "user"} className="object-cover" />
                            ) : (
                                <AvatarFallback className="text-sm">{(user?.username || "?").charAt(0).toUpperCase()}</AvatarFallback>
                            )}
                        </Avatar>
                        <div className="text-sm text-muted-foreground font-medium truncate max-w-[8rem]">{user?.username ?? user?.fullName ?? "Пользователь"}</div>
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-52 p-3 flex flex-col items-start ml-2" align="start">
                    <OrganizationSwitcher afterSelectOrganizationUrl={pages.DASHBOARD()} />

                    <DropdownMenuSeparator/>
                    
                    <Link 
                        href={pages.PROFILE(isOrg, isOrg ? organization?.slug ?? "" : user?.username ?? "")} 
                        className="text-sm text-primary/65 flex flex-row hover:text-primary/80"
                    >
                        Перейти в профиль <ChevronRight className="w-5 h-5"/>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}