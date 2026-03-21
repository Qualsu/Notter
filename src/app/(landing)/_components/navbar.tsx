"use client"

import { cn } from "@/lib/utils"
import { useScrollTop } from "../../../components/hooks/use-scroll-top"
import Image from "next/image";
import logoImg from "../../../../public/image/NotterIcon.png"
import { ModeToggle } from "@/components/mode-toggle";
import { useConvexAuth } from "convex/react";
import { SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { pages } from "@/config/routing/pages.route";
import type { NavbarProps } from "@/config/types/landing.types";

export function Navbar({ logo = true }: NavbarProps){
    const scrolled = useScrollTop()
    const {isLoading} = useConvexAuth()

    return (
        <div className={cn(
            "z-50 bg-background fixed top-0 flex items-center justify-between w-full p-6 h-14 dark:bg-zinc-950",
            scrolled && "border-b shadow-sm"
        )}>
            <div className="container mx-3 justify-between flex items-center md:mx-auto">
                <Link href={pages.ROOT}>
                    <Image src={logoImg} height="35" width="35" alt="Notter" className={`${!logo && 'hidden'}`}/>
                </Link>
                <div className="flex items-center gap-2">
                    {!isLoading && (
                        <>
                            <SignedIn>
                                <Link href={pages.DASHBOARD()} className={`${!logo && 'hidden'}`}>
                                    <Button variant="ghost">Перейти</Button>
                                </Link>
                                <div className={`${!logo && 'hidden'} mr-4 items-center mt-1`}>
                                    <UserButton/>
                                </div>
                            </SignedIn>

                            <SignedOut>
                                <SignInButton>
                                    <Link href={pages.AUTH} className={`${!logo && 'hidden'}`}>
                                        <Button variant="ghost">Войти</Button>
                                    </Link>
                                </SignInButton>
                            </SignedOut>
                        </>
                    )}
                    
                    <ModeToggle/>
                </div>
            </div>
        </div>
    )
}
