"use client"

import { cn } from "@/lib/utils"
import { useScrollTop } from "../../../../hooks/use-scroll-top"
import Image from "next/image";
import logoImg from "../../../../public/image/NotterMini.png"
import { ModeToggle } from "@/components/mode-toggle";
import { useConvexAuth } from "convex/react";
import { SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";

export function Navbar(){
    const scrolled = useScrollTop()
    const {isLoading, isAuthenticated} = useConvexAuth()

    return (
        // <div className={cn(
        //     "z-50 bg-background fixed top-0 flex items-center justify-between w-full p-6 h-14 dark:bg-zinc-950",
        //     scrolled && "border-b shadow-sm"
        // )}>
        //     <a href="/">
        //         <Image src={logoImg} height="40" alt="KenyCloud Logo" className="drop-shadow-xl"/>
        //     </a>
        //     <div className="flex items-center justify-center gap-x-4">
        //         {isLoading && (
        //             <div className="animate-spin mr-4">
        //                 <Loader2/>
        //             </div>
        //         )}
                
        //         {!isLoading && (
        //             <>
        //                 <SignedIn>
        //                     <a href="/dashboard" className="hidden sm:block">
        //                         <Button variant="ghost">Перейти {"->"}</Button>
        //                     </a>
        //                     <div className="mr-4"><UserButton/></div>
        //                 </SignedIn>

        //                 <SignedOut>
        //                     <SignInButton>
        //                         <a href="/auth/sign-in">
        //                             <Button variant="ghost">Войти</Button>
        //                         </a>
        //                     </SignInButton>
        //                 </SignedOut>
        //             </>
        //         )}
                
        //         <ModeToggle/>
        //     </div>
        // </div>
        <div className={cn(
            "z-50 bg-background fixed top-0 flex items-center justify-between w-full p-6 h-14 dark:bg-zinc-950",
            scrolled && "border-b shadow-sm"
        )}>
            <div className="container mx-3 justify-between flex items-center md:mx-auto">
                <Link href="/">
                    <Image src={logoImg} height="35" width="35" alt="Notter" className="drop-shadow-xl"/>
                </Link>
                <div className="flex gap-2">
                    {!isLoading && (
                        <>
                            <SignedIn>
                                <a href="/dashboard" className="hidden sm:block">
                                    <Button variant="ghost">Перейти {"->"}</Button>
                                </a>
                                <div className="mr-4"><UserButton/></div>
                            </SignedIn>

                            <SignedOut>
                                <SignInButton>
                                    <a href="/auth/sign-in">
                                        <Button variant="ghost">Войти</Button>
                                    </a>
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
