"use client" 

import { useEffect, useState } from "react" 
import { File } from "lucide-react" 
import { useQuery } from "convex/react" 
import { useRouter } from "next/navigation" 
import { useUser } from "@clerk/clerk-react" 

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command" 
import { api } from "../../convex/_generated/api" 
import { useSearch } from "../../hooks/use-search" 

export function SearchCommand(){
  const { user } = useUser() 
  const router = useRouter() 
  const documents = useQuery(api.document.getSearch) 
  const [isMounted, setIsMounted] = useState(false) 

  const toggle = useSearch((store) => store.toggle) 
  const isOpen = useSearch((store) => store.isOpen) 
  const onClose = useSearch((store) => store.onClose) 

  useEffect(() => {
    setIsMounted(true) 
  }, []) 

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "q" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault() 
        toggle() 
      }
    } 

    document.addEventListener("keydown", down) 
    return () => document.removeEventListener("keydown", down) 
  }, [toggle]) 

  const onSelect = (id: string) => {
    router.push(`/dashboard/${id}`) 
    onClose() 
  } 

  if (!isMounted) {
    return null 
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${user?.username}'s Notter`} />
      <CommandList>
        <CommandEmpty>Ничего не найдено</CommandEmpty>
        <CommandGroup heading="Заметки">
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              value={document.title}
              title={document.title}
              onSelect={() => onSelect(document._id)}
            >
              {document.icon ? (
                <p className="mr-2 text-[1.125rem]">{document.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  ) 
} 