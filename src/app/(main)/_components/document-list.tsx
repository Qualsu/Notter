"use client"

import { useParams } from "next/navigation"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Item } from "./item"
import { cn } from "@/lib/utils"
import { FileIcon } from "lucide-react"
import { useOrganization, useUser } from "@clerk/nextjs"

interface DocumentListProps {
    parentDocumentId?: Id<"documents">
    level?: number
    data?: Doc<"documents">[]
}

export function DocumentList({
    parentDocumentId,
    level = 0
}: DocumentListProps){
    const params = useParams()
    const router = useRouter()
    const { user } = useUser()
    const { organization } = useOrganization()
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})

    const onExpand = (documentId: string) => {
        setExpanded(prevExpanded => ({
            ...prevExpanded,
            [documentId]: !prevExpanded[documentId]
        }))
    }

    const documents = useQuery(api.document.getSidebar, {
        parentDocument: parentDocumentId,
        userId: organization?.id !== undefined ? organization?.id as string : user?.id as string
    })

    const onRedirect = (documentId: string) => {
        router.push(`/dashboard/${documentId}`) // redirect to docId
    }

    if (documents === undefined) {
        return (
            <>
                <Item.Skeleton level={level}/>
                {level === 0 && (
                    <>
                        <Item.Skeleton level={level}/>
                        <Item.Skeleton level={level}/>
                    </>
                )}
            </>
        )
    }

    return (
        <>
            <p 
                style={{
                    paddingLeft: level ? `${(level * 12) + 25}px` : undefined
                }}
                className={cn("hidden text-sm font-medium text-muted-foreground/80",
                    expanded && "last:block",
                    level === 0 && "hidden"
                )}
            >
                Нету заметок
            </p>
            {documents?.map((document) => (
                <div key={document._id}>
                <Item
                    id={document._id}
                    onClick={() => onRedirect(document._id)}
                    label={document.title}
                    icon={FileIcon}
                    documentIcon={document.icon}
                    active={params.documentId === document._id}
                    level={level}
                    onExpand={() => onExpand(document._id)}
                    expanded={expanded[document._id]}
                />
                {expanded[document._id] && (
                    <DocumentList parentDocumentId={document._id} level={level + 1} />
                )}
                </div>
            ))}
        </>
    )
}