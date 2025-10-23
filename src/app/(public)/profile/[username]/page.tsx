"use client"

import { useUser } from "@clerk/nextjs";
import { Cover } from "@/components/cover"
import Image from "next/image";
import { Check, Pin } from "lucide-react";
import { api } from "../../../../../convex/_generated/api"
import { useQuery } from "convex/react" 
import { useMemo } from "react" 
import dynamic from "next/dynamic";
import Twemoji from 'react-twemoji';
import IDIcon from "../../../../../public/badge/ID.png"
import NoteIcon from "../../../../../public/badge/NoteVerifed.png"
import NotterIcon from "../../../../../public/badge/Notter.png"
import { Skeleton } from "@/components/ui/skeleton"

interface UsernameProps {
  params: {
    username: string
  }
}

export default function UserProfile({ params }: UsernameProps) {
  const { user, isLoaded } = useUser();

  const document = useQuery(api.document.getByShortId, {
    shortId: "4TC3"
  });

  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  const publishedDocuments = useQuery(api.document.getSidebar, {
    userId: user?.id as string,
    parentDocument: undefined
  });

  const filteredPublicDocs = publishedDocuments?.filter(doc => doc.isPublished) || [];

  const renderDocuments = (docs: any[]) => {
    return docs.map((doc) => (
      <div key={doc._id}>
        <a href={`/view/${doc._id}`} className="flex items-center justify-between hover:bg-secondary/20 rounded-lg transition-colors border-2 m-2">
          <div className={`flex items-center gap-2 ${!doc.coverImage ? 'p-4' : ''}`}>
            {doc.icon && <span className="inline-block w-6 h-6" style={{ lineHeight: 0 }}>{doc.icon}</span>}
            <p className={`text-xl transition-all duration-300 ${doc.coverImage && "ml-3"}`}>{doc.title}</p>
          </div>
          {doc.coverImage && (
            <div className="relative w-64 h-16 overflow-hidden ml-auto">
              <Image
              src={doc.coverImage}
              alt={doc.title}
              layout="fill"
              objectFit="cover"
              className="rounded-r-lg ml-0.5"
              />
            </div>
          )}
        </a>
        {/* Render child documents recursively */}
        {doc.children && doc.children.length > 0 && (
          <>
            <hr className="my-4" />
            {renderDocuments(doc.children)}
          </>
        )}
      </div>
    ));
  };

  if (!isLoaded || document === undefined || publishedDocuments === undefined) {
    return (
      <div className="p-2 px-8 border-8 border-[#0a0a0a]">
        <div className="flex flex-col">
          <Skeleton className="h-[400px] w-full" />
          
          <div className="m-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-[100px] w-[100px] rounded-full" />
              <div>
                <Skeleton className="h-8 w-[200px] mb-2" />
                <Skeleton className="h-6 w-[150px]" />
              </div>
            </div>
            
            <Skeleton className="h-10 w-[120px] rounded-xl" />
          </div>

          <hr className="bg-[#111111]" />

          <div className="mt-8 mx-6">
            <Skeleton className="h-8 w-[200px] mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-16 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 px-8 border-8 border-[#0a0a0a]">
      <title>{params.username}`s Profile</title>
        <div className="flex flex-col">
          <Cover
            url="https://media.discordapp.net/attachments/1426624893092495453/1430963053599658290/hcRdgOG0.png?ex=68fbafb1&is=68fa5e31&hm=01ecb10c06a0eb1c7c8c04345c8b89a47b89b90996077c111f322a3abf2c8fd7&=&format=webp&quality=lossless&width=1529&height=860"
            preview
          />

          <div className="m-3 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={"https://media.discordapp.net/attachments/1426624893092495453/1430963076798349352/1932500_thackerzo2d_hominid.png?ex=68fbafb7&is=68fa5e37&hm=751da8e3ed6e17801c430102ea7c686b98fda35fb0a97e778803e810cd61ac72&=&format=webp&quality=lossless&width=823&height=796"}
                  alt="Profile Picture"
                  width={100}
                  height={100}
                  className="rounded-full border-[8px] dark:border-neutral-950 shadow-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{user?.fullName}</h1>
                  <Check
                    className="w-6 h-6 text-yellow-400"
                    style={{ filter: "drop-shadow(0 0px 2px rgba(250,204,21))" }}
                  />
                </div>
                <p className="mt-2 text-xl text-primary/80 hover:text-primary hover:underline duration-300 transition-all">{user?.username}</p>
              </div>
            </div>

            <div className="flex flex-row gap-2 bg-[#111111] p-2 rounded-xl items-center">
              <div className="relative group">
                <Image src="/badge/Notter.png" alt="Notter Icon" width={25} height={25} 
                  className="transform transition-transform duration-200 hover:scale-110" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap text-yellow-200">
                  Разработчик Notter
                </span>
              </div>
              
              <div className="relative group">
                <Image src="/badge/NoteVerifed.png" alt="Note Verifed Icon" width={25} height={25} 
                  className="transform transition-transform duration-200 hover:scale-110" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap">
                  Создатель проверенных заметок
                </span>
              </div>

              <div className="relative group ml-1.5">
                <Image src="/badge/ID.png" alt="ID Icon" width={25} height={25} 
                  className="transform transition-transform duration-200 hover:scale-110" />
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap">
                  Дата регистрации: 
                  <p>{user?.createdAt ? user.createdAt.toLocaleDateString() : "undefined"}</p>
                </span>
              </div>
            </div>
          </div>

          <hr className="bg-[#111111]" />

          {document && (
            <>
              <div className="flex flex-row items-center my-4 mx-6 text-muted-foreground">
                <Pin className="w-5 h-5 -rotate-45 mr-1" />
                {document.icon && <span className="inline-block w-6 h-6 m-1" style={{ lineHeight: 0 }}>
                  <Twemoji>{document.icon}</Twemoji>
                </span>}
                <a className="text-xl font-bold hover:underline hover:text-primary/70 transition-all duration-300" href={`/view/${document._id}`}>{document.title}</a>
                {document.isPublished}
              </div>
              <div className="border-2 mx-6 pt-6 rounded-lg">
                <Editor onChange={() => {}} initialContent={document.content} editable={false} />
              </div>
            </>
          )}

          <div className="mt-8 mx-6">
            <h2 className="text-2xl font-bold mb-4">Published Notes</h2>
            <div className="space-y-4">
              <Twemoji>
                {renderDocuments(filteredPublicDocs)}
              </Twemoji>
              {filteredPublicDocs.length === 0 && (
                <p className="text-muted-foreground text-sm">No published notes yet</p>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
