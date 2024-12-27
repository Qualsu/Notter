"use client"

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { MenuIcon } from "lucide-react";
import { Title } from "./title";
import { Banner } from "./banner";
import { Menu } from "./menu";
import { Publish } from "./publish";

interface NavbarProps{
    isCollapsed: boolean
    onResetWidth: () => void
}

export function Navbar({ isCollapsed, onResetWidth }: NavbarProps){
    const params = useParams()
    const document = useQuery(api.document.getById, {
        documentId: params.documentId as Id<"documents">
    })

    if(document === undefined){
        return (
            <nav className="flex w-full items-center gap-x-2 bg-background px-3 py-2 justify-between">
                <Title.Skeleton/>
                <div className="flex items-center gap-x-2">
                    <Menu.Skeleton/>
                </div>
            </nav>
        )
    }

    if (document === null) return null
    
    return (
        <>
            <nav className="flex w-full items-center gap-x-2 bg-background px-3 py-2">
                {isCollapsed && (
                    <button aria-label="Menu">
                        <MenuIcon
                        onClick={onResetWidth}
                        className="h-6 w-6 text-muted-foreground"
                        />
                    </button>
                )}
                <div className="flex w-full items-center justify-between">
                    <Title initialData={document} />
                    <div className="flex items-center gap-x-2">
                        {!document.isAcrhived && (
                            <Publish initialData={document} />
                        )}
                        <Menu documentId={document._id} />
                    </div>
                </div>
            </nav>
            {document.isAcrhived && <Banner documentId={document._id} />}
        </>
    )
}