"use client"

import { cn } from "@/lib/utils"
import { Archive, ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { ElementRef, useEffect, useRef, useState } from "react"
import { useMediaQuery } from 'usehooks-ts'
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { getById as getUserById } from "../../../../server/users/user"
import { getById as getOrgById } from "../../../../server/orgs/org"
import { Progress } from "@/components/ui/progress"
import { toast } from "react-hot-toast"
import { useOrganization, useUser } from "@clerk/clerk-react"
import { UserItem } from "./user-item"
import { Item } from "./item"
import { DocumentList } from "./document-list"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TrashBox } from "./trash-box"
import { useSearch } from "../../../../hooks/use-search"
import { useSettings } from "../../../../hooks/use-settings"
import { Navbar } from "./navbar"

export function Navigation() {
    const router = useRouter()
    const settings = useSettings()
    const seacrh = useSearch()
    const params = useParams()
    const { user } = useUser()
    const { organization } = useOrganization()
    const isMobile = useMediaQuery("(max-width: 768px)")
    const create = useMutation(api.document.create)
    const isOrg = organization?.id !== undefined
    const orgId = isOrg ? organization?.id as string : user?.id as string

    const isResizingRef = useRef(false)
    const sidebarRef = useRef<ElementRef<"aside">>(null)
    const navbarRef = useRef<ElementRef<"div">>(null)
    const [isResetting, setIsResetting] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(isMobile)

    const [documentCount, setDocumentCount] = useState<number>(0)
    const [documentPublicCount, setDocumentPublicCount] = useState<number>(0)
    const [premiumLevel, setPremiumLevel] = useState<number>(0)

    const fetchOrgData = async () => {
        if (isOrg && organization?.id) {
            const orgData = await getOrgById(organization.id)
            if (orgData) {
                setDocumentCount(orgData.documents || 0)
                setDocumentPublicCount(orgData.publicDocuments || 0)
                setPremiumLevel(orgData.premium || 0)
            }
        }
    }

    const fetchUserData = async () => {
        if (!isOrg && user?.id) {
            const userData = await getUserById(user.id)
            if (userData) {
                setDocumentCount(userData.documents || 0)
                setDocumentPublicCount(userData.publicDocuments || 0)
                setPremiumLevel(userData.premium || 0)
            }
        }
    }

    useEffect(() => {
        if (isOrg) {
            fetchOrgData()
        } else {
            fetchUserData()
        }
    }, [user?.id, organization?.id])

    let documentLimit: number = 75
    let publicDocumentLimit: number = 10

    if (premiumLevel === 1) {
        documentLimit = isOrg ? 500 : 200
        publicDocumentLimit = isOrg ? 250 : 100
    } else if (premiumLevel === 2) {
        documentLimit = 1000
        publicDocumentLimit = 1000
    }

    const documentProgress = (documentCount / documentLimit) * 100
    const publicDocumentProgress = (documentPublicCount / publicDocumentLimit) * 100

    const getProgressColor = (progress: number) => {
        if (progress >= 95) return "[&>div]:bg-red-600"
        if (progress >= 75) return "[&>div]:bg-yellow-500"
        return ""
    }

    const handleCreate = () => {
        if (documentCount >= documentLimit) {
            toast.error(`Вы достигли лимита на создание в ${documentLimit} заметок`);
            return;
        }

        const promise = create({
            title: "Новая заметка",
            userId: orgId,
            lastEditor: user?.username as string,
            creatorName: isOrg ? organization?.slug as string : user?.username as string,
        })
            .then((documentId) => {
                router.push(`/dashboard/${documentId}`)
                return documentId
            })
            .catch((error) => {
                toast.error("Не удалось создать заметку")
            })

        toast.promise(promise, {
            loading: "Создание заметки...",
            success: "Заметка успешно создана!",
            error: "Не удалось создать заметку"
        })
    }

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
            sidebarRef.current.style.width = `${newWidth}px`
            navbarRef.current.style.setProperty("left", `${newWidth}px`)
            navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`)
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
            navbarRef.current.style.setProperty("width", isMobile ? "0" : "")
            navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px")
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

    return (
        <>
            <aside ref={sidebarRef} className={cn(
                "group/sidebar h-full bg-[#fcfcfc] dark:bg-[#111111] overflow-y-auto relative flex w-60 flex-col z-[99999]",
                isResetting && "transition-all ease-in-out duration-300",
                isMobile && "w-0"
            )}>
                <div onClick={collapse} role="button" className={cn(
                    "h-6 w-6 text-muted-foreground rounded-sm hover:bg-primary/5 dark:hover:bg-primary/10 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                    isMobile && "opacity-100"
                )}>
                    <ChevronsLeft className="h-6 w-6" />
                </div>

                <div>
                    <UserItem />
                    <Item label="Поиск" icon={Search} isSearch onClick={seacrh.onOpen} />
                    <Item label="Настройки" icon={Settings2} onClick={settings.onOpen} />
                    <Item onClick={handleCreate} label="Новая заметка" icon={PlusCircle} />
                </div>

                <div className="mt-4">
                    <DocumentList />
                    <Item onClick={handleCreate} icon={Plus} label="Добавить заметку" />
                    <Popover>
                        <PopoverTrigger className="w-full mt-4">
                            <Item label="Архив" icon={Archive} />
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-72 z-[99999]" side={isMobile ? "bottom" : "right"}>
                            <TrashBox />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="mt-4 mx-3">
                    <div className="text-sm text-muted-foreground">
                        <span className="font-bold">Заметки:</span> {documentCount}/{documentLimit}
                    </div>
                    <Progress value={documentProgress} max={100} className={`mt-2 ${getProgressColor(documentProgress)}`} />

                    <div className="text-sm text-muted-foreground mt-4">
                        <span className="font-bold">Публичные заметки:</span> {documentPublicCount}/{publicDocumentLimit}
                    </div>
                    <Progress value={publicDocumentProgress} max={100} className={`mt-2 ${getProgressColor(publicDocumentProgress)}`} />

                    {/* Новый блок предупреждений при превышении лимита */}
                    {(documentCount >= documentLimit || documentPublicCount >= publicDocumentLimit) && (
                        <div className="mt-2 text-sm text-red-400 dark:text-red-200">
                            {(documentCount >= documentLimit || documentPublicCount >= publicDocumentLimit) && (
                                <div>
                                    Достигнут лимит по заметкам. Оформите{" "}
                                    <a href="/buy" className="group inline-flex transition-all duration-300">
                                        <span className="group-hover:text-logo-yellow group-hover:underline transition-colors duration-300">N</span>
                                        <span className="group-hover:text-logo-light-yellow group-hover:underline transition-colors duration-300 mr-1">otter</span>
                                        <span className="group-hover:text-logo-cyan group-hover:underline transition-colors duration-300">Gem</span>
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="absolute bottom-4 left-0 w-full flex justify-center items-center">
                    <a href={isOrg ? `/org/${organization?.slug}` : `/user/${user?.username}`} className="text-sm text-primary/50 hover:text-primary/80 transition-all duration-200">Перейти в профиль</a>
                </div>
                <div onMouseDown={handleMouseDown} onClick={resetWidth} className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0" />
            </aside>

            <div ref={navbarRef} className={cn(
                "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
                isResetting && "transition-all ease-in-out duration-300",
                isMobile && "left-0 w-full"
            )}>
                {!!params.documentId ? (
                    <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
                ) : (
                    <nav className="bg-transparent px-3 py-2 w-full">
                        {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground hover:bg-primary/5 dark:hover:bg-primary/10" />}
                    </nav>
                )}
            </div>
        </>
    )
}
