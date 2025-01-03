"use client"

import { cn } from "@/lib/utils"
import { Archive, ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings2 } from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { ElementRef, useEffect, useRef, useState } from "react"
import { useMediaQuery } from 'usehooks-ts'
import { UserItem } from "./user-item"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Item } from "./item"
import { toast } from "sonner"
import { DocumentList } from "./document-list"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TrashBox } from "./trash-box"
import { useSearch } from "../../../../hooks/use-search"
import { useSettings } from "../../../../hooks/use-settings"
import { Navbar } from "./navbar"
import { useOrganization, useUser } from "@clerk/clerk-react"
import { Id } from "../../../../convex/_generated/dataModel"

export function Navigation(){
    const router = useRouter()
    const settings = useSettings()
    const seacrh = useSearch()
    const params = useParams()
    const pathname = usePathname()
    const { user } = useUser()
    const { organization } = useOrganization()
    const isMobile = useMediaQuery("(max-width: 768px)")
    const create = useMutation(api.document.create)
    const update = useMutation(api.document.update)
    const orgId = organization?.id !== undefined ? organization?.id as string : user?.id as string

    const isResizingRef = useRef(false)
    const sidebarRef = useRef<ElementRef<"aside">>(null)
    const navbarRef = useRef<ElementRef<"div">>(null)
    const [isResetting, setIsResetting] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(isMobile)

    useEffect(() => {
        if (isMobile) {
            collapse()
        } else {
            resetWidth()
        }
    }, [isMobile])
    
    useEffect(() => {
        if (isMobile) {
            collapse()
        }
    }, [pathname, isMobile])

    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault()
        event.stopPropagation()

        isResizingRef.current = true
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
    }

    const handleMouseMove = (event: MouseEvent) => {
        if (!isResizingRef.current) return
        let newWidth = event.clientX

        if (newWidth < 240) newWidth = 240
        if (newWidth > 480) newWidth = 480

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.setProperty("left", `${newWidth}px`);
            navbarRef.current.style.setProperty(
              "width",
              `calc(100% - ${newWidth}px)`,
            );
          }
    }

    const handleMouseUp = () => {
        isResizingRef.current = false
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
    }

    const resetWidth = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false)
            setIsResetting(true)

            sidebarRef.current.style.width = isMobile ? "100%" : "240px"
            navbarRef.current.style.setProperty(
                "width",
                isMobile ? "0" : ""
            )
            navbarRef.current.style.setProperty(
                "left", 
                isMobile ? "100%" : "240px"
            )
            setTimeout(() => setIsResetting(false), 300)
        }
    }

    const collapse = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true)
            setIsResetting(true)

            sidebarRef.current.style.width = "0"
            navbarRef.current.style.setProperty("width", "100%")
            navbarRef.current.style.setProperty("left", "0")
            setTimeout(() => setIsResetting(false), 300)
        }
    }

    const handleCreate = () => {
        const promise = create({ 
            title: "Новая заметка",
            userId: orgId,
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
    
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const draggedId = event.dataTransfer.getData("text/plain");
        
        if (draggedId) {
            const promise = update({
                id: draggedId as Id<"documents">,
                userId: orgId,
                parentDocument: null,
                lastEditor: user?.username as string
            });
    
            toast.promise(promise, {
                loading: "Перемещаем...",
                success: "Заметка успешно перемещена!",
                error: "Не удалось переместить заметку"
            })
        }
    };

    return (
        <>
            <aside 
            ref={sidebarRef} 
            className={cn(
                "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
                isResetting && "transition-all ease-in-out duration-300",
                isMobile && "w-0"
            )}
            >
                <div 
                onClick={collapse}
                role="button" 
                className={cn(
                    "h-6 w-6 text-muted-foreground rounded-sm hover:bg-primary/5 dark:hover:bg-primary/10 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                    isMobile && "opacity-100"
                )}>
                    <ChevronsLeft className="h-6 w-6"/>
                </div>
                <div
                    onDragOver={(e) => {
                        e.preventDefault()
                        e.dataTransfer.dropEffect = 'move'
                    }} 
                    onDrop={handleDrop}
                >
                    <UserItem/>
                    <Item
                        label="Поиск"
                        icon={Search}
                        isSearch
                        onClick={seacrh.onOpen}
                    />
                    <Item
                        label="Настройки"
                        icon={Settings2}
                        onClick={settings.onOpen}
                    />
                    <Item 
                        onClick={handleCreate} 
                        label="Новая заметка" 
                        icon={PlusCircle}
                    />
                </div>
                <div className="mt-4">
                    <DocumentList/>
                    <Item onClick={handleCreate} icon={Plus} label="Добавить заметку"/>
                    <Popover>
                        <PopoverTrigger className="w-full mt-4">
                            <Item label="Архив" icon={Archive} />
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-72 z-[99999]" side={isMobile ? "bottom" : "right"}>
                            <TrashBox />
                        </PopoverContent>
                    </Popover>
                </div>
                <div 
                onMouseDown={handleMouseDown}
                onClick={resetWidth}
                className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"/>
            </aside>
            <div 
            ref={navbarRef}
            className={cn(
                "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
                isResetting && "transition-all ease-in-out duration-300",
                isMobile && "left-0 w-full"
            )}>
                {!!params.documentId ? (
                    <Navbar
                        isCollapsed={isCollapsed}
                        onResetWidth={resetWidth}
                    />
                ) : (
                    <nav className="bg-transparent px-3 py-2 w-full">
                        {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground hover:bg-primary/5 dark:hover:bg-primary/10"/>}
                    </nav>
                )}

            </div>
        </>
    )
}