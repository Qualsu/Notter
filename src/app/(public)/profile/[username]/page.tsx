"use client";

import { Cover } from "@/components/cover";
import Image from "next/image";
import { Check, LockKeyhole, Pin } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Twemoji from 'react-twemoji';
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Navbar } from "@/app/(landing)/_components/navbar";
import toast from "react-hot-toast";
import { getByUsername } from "../../../../../server/users/user";
import { User } from "../../../../../server/users/types";
import Error404 from "@/app/errorPage";
import { useUser } from "@clerk/nextjs";
import VerifedBadge from "../_components/verifed";
import { DocumentList } from "../_components/documentList";

interface UsernameProps {
  params: {
    username: string;
  };
}

export default function UserProfile({ params }: UsernameProps) {
  const { isLoaded, user } = useUser();
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await getByUsername(params.username);
      setProfile(profileData);
    };

    fetchProfile();
  }, [params.username]);

  const document = useQuery(api.document.getById, {
    userId: profile?._id,
    documentId: profile?.pined === undefined ? null : profile?.pined as Id<"documents"> | null,
  });
  const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);

  if (!isLoaded || document === undefined) {
    return (
      <div className="p-2 px-4 border-8 border-[#0a0a0a]">
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
            <Skeleton className="hidden md:block h-10 w-[120px] rounded-xl" />
          </div>

          <Skeleton className="block md:hidden h-10 w-[120px] rounded-xl mb-3 ml-3" />

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

  const copyUsername = async () => {
    try {
      if (profile?.username && navigator) {
        await navigator.clipboard.writeText(profile.username);
        toast.success("Username copied to clipboard!");
      }
    } catch (error) {
      toast.error("Failed to copy username");
    }
  };

  if (!profile) {
    return (
      <>
        <Navbar />
        <Error404 />;
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="p-2 px-4 mt-8 border-8 border-white dark:border-[#0a0a0a]">
        <title>{params.username + "`s profile"}</title>
        <div className="flex flex-col">
          <Cover url={document?.coverImage || "/default-cover.png"} preview />

          <div className="m-3 flex flex-col md:flex-row md:items-center md:justify-between relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={profile?.avatar || "/default-profile.png"}
                  alt="Profile Picture"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl  flex items-center gap-2">
                    <span className="hidden sm:block font-bold whitespace-nowrap">{profile?.firstname} {profile?.lastname} {!profile?.firstname && !profile?.lastname ? profile?.username : ""}</span>
                    <span className="block sm:hidden font-bold">
                      {profile?.firstname}
                      <span className="flex flex-row items-center gap-2">
                        {profile?.lastname}
                        {!profile?.firstname && !profile?.lastname ? profile?.username : ""}
                        {profile?.badges.verified && (
                          <VerifedBadge text="Верефицированный пользователь" size={7} clicked={false}/>
                        )}
                      </span>
                    </span>
                    <div className="hidden sm:block">
                      {profile?.badges.verified && (
                        <VerifedBadge text="Верефицированный пользователь" size={7} clicked={false}/>
                      )}
                    </div>
                  </h1>
                </div>
                <p
                  className="mt-2 text-xl text-primary/80 hover:text-primary hover:underline duration-300 transition-all"
                  onClick={copyUsername}
                >
                  {profile?.username}
                </p>
              </div>
            </div>

            <div className="flex flex-row gap-2 bg-black/5 dark:bg-[#111111] p-2 rounded-xl items-center mt-4 md:mt-0 max-w-max text-white">
              {profile?.badges.notter && (
                <div className="relative group select-none">
                  <Image
                    src="/badge/Notter.png"
                    alt="Notter Icon"
                    width={27}
                    height={27}
                    className="transform transition-transform duration-200 hover:scale-110"
                  />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap text-yellow-200">
                    Разработчик Notter
                  </span>
                </div>
              )}

              {profile?.badges.notes_verifed && (
                <div className="relative group select-none">
                  <Image
                    src="/badge/NoteVerifed.png"
                    alt="Note Verifed Icon"
                    width={25}
                    height={25}
                    className="transform transition-transform duration-200 hover:scale-110"
                  />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap">
                    Создатель верефицированных заметок
                  </span>
                </div>
              )}

              {profile?.moderator && (
                <div className="relative group select-none mx-0.5">
                  <Image
                    src="/badge/Moderator.png"
                    alt="Note Verifed Icon"
                    width={24}
                    height={24}
                    className="transform transition-transform duration-200 hover:scale-110"
                  />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap text-orange-300">
                    Модератор
                  </span>
                </div>
              )}

              {profile?.badges.contributor && (
                <div className="relative group select-none">
                  <Image
                    src="/badge/Contributor.png"
                    alt="Note Verifed Icon"
                    width={28}
                    height={28}
                    className="transform transition-transform duration-200 hover:scale-110"
                  />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap text-rose-400">
                    Внесенный вклад
                  </span>
                </div>
              )}

              {profile?.premium == 1 && (
                <div className="relative group">
                  <Image
                    src="/badge/Amber.png"
                    alt="Note Verifed Icon"
                    width={25}
                    height={25}
                    className="transform transition-transform duration-200 hover:scale-110"
                  />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap">
                    Notter Gem: <span className="text-amber-300">Amber</span>
                  </span>
                </div>
              )}

              {profile?.premium == 2 && (
                <div className="relative group select-none">
                  <Image
                    src="/badge/Diamond.png"
                    alt="Note Verifed Icon"
                    width={25}
                    height={25}
                    className="transform transition-transform duration-200 hover:scale-110"
                  />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap">
                    Notter Gem: <span className="text-cyan-300">Diamond</span>
                  </span>
                </div>
              )}

              <div className="relative group ml-1.5">
                <Image
                  src="/badge/ID.png"
                  alt="ID Icon"
                  width={25}
                  height={25}
                  className="transform transition-transform duration-200 hover:scale-110"
                />
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap">
                  Дата регистрации:
                  <p>{profile?.created ? new Date(profile.created).toLocaleDateString() : "undefined"}</p>
                </span>
              </div>
            </div>
          </div>

          <hr className="bg-[#111111]" />

          {profile?.privated ? (
            user?.username === profile.username ? (
              <>
                <div className="flex flex-col items-center justify-center mx-6 my-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                  <div className="flex items-center gap-2">
                    <LockKeyhole className="w-8 h-8 text-yellow-500" />
                    <strong>Приватный профиль:</strong>
                  </div>
                  <p className="text-center">
                    Ваш профиль является приватным. Только вы можете видеть его содержимое
                  </p>
                </div>
                <div className="flex flex-row items-center my-4 mx-6 text-muted-foreground">
                  <Pin className="w-5 h-5 -rotate-45 mr-1" />
                  {document?.icon && (
                    <span className="inline-block w-6 h-6 m-1" style={{ lineHeight: 0 }}>
                      <Twemoji>{document.icon}</Twemoji>
                    </span>
                  )}
                  <a
                    className="text-xl flex flex-row items-center gap-1.5 hover:underline hover:text-primary/70 transition-all duration-300"
                    href={`/view/${document?._id}`}
                  >
                    <span className="font-bold">{document?.title}</span>
                    {document?.verifed && (
                      <div className="relative group select-none">
                        <Check className="w-5 h-5 text-yellow-400 transform transition-transform duration-200 hover:scale-110" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center whitespace-nowrap text-yellow-200">
                          Заметка верефицирована командой Qualsu
                        </span>
                      </div>
                    )}
                  </a>
                </div>
                <div className="border-2 mx-6 pt-6 rounded-lg">
                  <Editor onChange={() => {}} initialContent={document?.content} editable={false} />
                </div>
                <div className="mt-8 mx-6">
                  <h2 className="text-2xl font-bold mb-4">All Notes</h2>
                  {profile._id ? (
                    <DocumentList user={profile} profile={params.username} setProfile={setProfile} />
                  ) : (
                    <p className="text-muted-foreground">User not loaded</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center mx-6 my-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                <div className="flex items-center gap-2">
                  <LockKeyhole className="w-8 h-8 text-yellow-500" />
                  <strong>Приватный профиль:</strong>
                </div>
                <p className="text-center">
                  Этот профиль является приватным. Только владелец может его просматривать
                </p>
              </div>
            )
          ) : (
            document && (
              <>
                <div className="flex flex-row items-center my-4 mx-6 text-muted-foreground">
                  <Pin className="w-5 h-5 -rotate-45 mr-1" />
                  {document.icon && (
                    <span className="inline-block w-6 h-6 m-1" style={{ lineHeight: 0 }}>
                      <Twemoji>{document.icon}</Twemoji>
                    </span>
                  )}
                  <a
                    className="text-xl font-bold hover:underline hover:text-primary/70 transition-all duration-300"
                    href={`/view/${document._id}`}
                  >
                    {document.title}
                  </a>
                </div>
                <div className="border-2 mx-6 pt-6 rounded-lg">
                  <Editor onChange={() => {}} initialContent={document.content} editable={false} />
                </div>
              </>
            )
          )}

          {!profile?.privated && (
            <div className="mt-8 mx-6">
              <h2 className="text-2xl font-bold mb-4">All Notes</h2>
              {profile._id ? (
                <DocumentList user={profile} profile={params.username} setProfile={setProfile} />
              ) : (
                <p className="text-muted-foreground">User not loaded</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}