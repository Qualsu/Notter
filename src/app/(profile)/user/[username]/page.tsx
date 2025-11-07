"use client";

import { Cover } from "@/components/cover";
import Image from "next/image";
import { useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Twemoji from 'react-twemoji';
import { Skeleton } from "@/components/ui/skeleton"
import { Navbar } from "@/app/(landing)/_components/navbar";
import toast from "react-hot-toast";
import Error404 from "@/app/errorPage";
import { useUser } from "@clerk/nextjs";
import VerifedBadge from "../../_components/verifed";
import { DocumentList } from "../../_components/documentList";
import { Badges } from "../../_components/badge";
import { getById, getByUsername } from "../../../../../server/users/user";
import { User } from "../../../../../server/users/types";
import { Org } from "../../../../../server/orgs/types";
import { Check, LockKeyhole, Pin } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { ModeratorPanel } from "../../_components/moderatorPanel";

interface UsernameProps {
  params: {
    username: string;
  };
}

export default function UserProfile({ params }: UsernameProps) {
  const { isLoaded, user } = useUser();
  const [profile, setProfile] = useState<User | Org | null>(null);
  const [account, setAccount] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await getByUsername(params.username);
      const accountData = await getById(user?.id as string);
      setProfile(profileData);
      setAccount(accountData)
    };

    fetchProfile();
  }, [params.username, user?.id]);

  const document = useQuery(api.document.getById, {
    userId: profile?._id,
    documentId: profile?.pined === undefined ? null : profile?.pined == "" ? null : profile?.pined as Id<"documents"> | null,
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
      <div className="p-2 px-4 mt-10 border-8 border-white dark:border-[#0a0a0a]">
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
                    <span className="hidden sm:block font-bold whitespace-nowrap">
                      {profile?.firstname} {profile?.lastname} {!profile?.firstname && !profile?.lastname ? profile?.username : ""}
                    </span>

                    <span className="block sm:hidden font-bold">
                      {profile?.firstname}
                      <span className="flex flex-row items-center gap-2">
                        {profile?.lastname}
                        {profile?.badges.verified && (
                          <VerifedBadge text="Верефицированный пользователь" size={7} clicked={false} />
                        )}
                      </span>
                    </span>
                    <div className="hidden sm:block">
                      {profile?.badges.verified && (
                        <VerifedBadge text="Верефицированный пользователь" size={7} clicked={false} />
                      )}
                    </div>
                  </h1>

                  <ModeratorPanel user={profile} />
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
              <Badges profile={profile} />
            </div>
          </div>

          <hr className="bg-[#111111]" />

          {profile?.privated ? (
            user?.username === profile.username || account?.moderator ? (
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
                {profile?.pined != undefined && (
                  <>
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
                          <VerifedBadge text="Заметка верефицирована командой Qualsu" size={6} />
                        )}
                      </a>
                    </div>
                  
                    <div className="border-2 mx-6 pt-6 rounded-lg">
                      <Editor onChange={() => {}} initialContent={document?.content} editable={false} />
                    </div>
                  </>
                )}
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