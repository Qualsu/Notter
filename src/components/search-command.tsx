"use client" 

import { useEffect, useState } from "react" 
import { File } from "lucide-react" 
import { useQuery } from "convex/react" 
import { useRouter } from "next/navigation" 
import { useOrganization, useUser } from "@clerk/nextjs" 

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
import Twemoji from 'react-twemoji';

export function SearchCommand(){
  const { user } = useUser() 
  const { organization } = useOrganization()
  const router = useRouter()
  const orgId = organization?.id !== undefined ? organization?.id as string : user?.id as string
  const documents = useQuery(api.document.getSearch, {
    userId: orgId
  }) 
  const [isMounted, setIsMounted] = useState(false) 
  const [searchValue, setSearchValue] = useState("");

  const toggle = useSearch((store) => store.toggle) 
  const isOpen = useSearch((store) => store.isOpen) 
  const onClose = useSearch((store) => store.onClose) 

  useEffect(() => {
    setIsMounted(true) 
  }, []) 

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
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

  const filteredDocuments = documents?.filter((document) => {
    if (!searchValue.trim()) return true;
    const queryWords = searchValue.toLowerCase().split(/\s+/).filter(Boolean);
    const title = document.title.toLowerCase();
    return queryWords.every(word => title.includes(word));
  });

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder="Поиск по заметкам"
        value={searchValue}
        onValueChange={setSearchValue}
      />
      <CommandList>
        <CommandEmpty>Ничего не найдено</CommandEmpty>
        {filteredDocuments && filteredDocuments.length > 0 && (
          <CommandGroup heading="Заметки">
            {filteredDocuments.map((document) => (
              <CommandItem
                key={document._id}
                value={document.title}
                title={document.title}
                onSelect={() => onSelect(document._id)}
              >
                <Twemoji options={{ className: 'twemoji' }}>
                  {document.icon ? (
                    <p className="mr-2 text-[1.125rem]">{document.icon}</p>
                  ) : (
                    <File className="mr-2 h-4 w-4" />
                  )}
                </Twemoji>
                <span>{document.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
} 