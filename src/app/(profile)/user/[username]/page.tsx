"use client";

import { use, useEffect, useState } from "react";
import { Cover } from "@/components/cover";
import Image from "next/image";
import { useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton"
import Twemoji from "react-twemoji";
import toast from "react-hot-toast";
import Error404 from "@/app/not-found";
import { useUser } from "@clerk/nextjs";
import VerifedBadge from "../../_components/verifed";
import { DocumentList } from "../../_components/documentList";
import { Badges } from "../../_components/badge";
import { getById, getByUsername } from "../../../api/users/user";
import { LockKeyhole, Pin } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { ModeratorPanel } from "../../_components/moderatorPanel";
import Link from "next/link";
import { pages } from "@/config/routing/pages.route";
import { images } from "@/config/routing/image.route";
import type { UsernameProps } from "@/config/types/profile.types";
import type { Org, User } from "@/config/types/api.types";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export default function UserProfile({ params }: UsernameProps) {
  const { username } = use(params);
  const { isLoaded, user } = useUser();
  const [profile, setProfile] = useState<User | Org | null>(null);
  const [account, setAccount] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      const profileData = await getByUsername(username);
      const accountData = await getById(user?.id as string);
      setProfile(profileData);
      setAccount(accountData);
      setProfileLoading(false);
    };

    fetchProfile();
  }, [username, user?.id]);

  const document = useQuery(api.document.getById, {
    userId: profile?._id,
    documentId: profile?.pined === undefined ? null : profile?.pined == "" ? null : profile?.pined as Id<"documents"> | null,
  });
  if (!isLoaded || profileLoading || document === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-logo-yellow/10 px-4 pb-10 pt-20 dark:to-logo-cyan/10">
        <div className="mx-auto w-full max-w-[1380px] rounded-3xl border border-white/50 bg-white/75 p-3 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/75">
          <div className="flex flex-col">
            <Skeleton className="h-[320px] w-full rounded-2xl" />
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

            <hr className="mx-3 border-black/10 dark:border-white/10" />

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
      </div>
    );
  }

  const copyUsername = async () => {
    try {
      if (profile?.username && navigator) {
        await navigator.clipboard.writeText(profile.username);
        toast.success("Юзернейм скопирован!");
      }
    } catch (error) {
      toast.error("Не удалось скопировать юзернейм");
    }
  };

  if (!profile) {
    return (
        <Error404 />
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-logo-yellow/10 px-4 pb-12 pt-20 dark:to-logo-cyan/10">
        <title>{username + "`s profile"}</title>
        <div className="pointer-events-none absolute left-0 top-24 h-72 w-72 rounded-full bg-logo-light-yellow/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-64 h-72 w-72 rounded-full bg-logo-cyan/15 blur-3xl" />

        <div className="relative mx-auto flex w-full max-w-[1380px] flex-col rounded-3xl border border-white/50 bg-white/75 p-3 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/75">
          <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
            <Cover url={document?.coverImage || images.DEFAULT.COVER} preview />
          </div>

          <div className="m-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={profile?.avatar || images.DEFAULT.PROFILE}
                  alt="Profile Picture"
                  width={80}
                  height={80}
                  className="rounded-full ring-2 ring-white/70 dark:ring-white/15"
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
                  className="mt-1 inline-flex cursor-pointer rounded-lg bg-background/70 py-1 text-base text-primary/80 transition-all duration-300 hover:text-primary"
                  onClick={copyUsername}
                >
                  @{profile?.username}
                </p>
              </div>
            </div>

            <div className="mt-2 flex max-w-max flex-row items-center gap-2 rounded-2xl border border-black/5 bg-background/70 p-2.5 shadow-sm dark:border-white/10 md:mt-0">
              <Badges profile={profile} />
            </div>
          </div>

          <hr className="mx-3 border-black/10 dark:border-white/10" />

          {profile?.privated ? (
            user?.username === profile.username || account?.moderator ? (
              <>
                <div className="mx-6 my-4 flex flex-col items-center justify-center rounded-2xl border border-amber-300/50 bg-amber-50/80 p-4 text-amber-800 dark:border-amber-300/20 dark:bg-amber-900/30 dark:text-amber-100">
                  <div className="flex items-center gap-2">
                    <LockKeyhole className="h-6 w-6 text-amber-500" />
                    <strong>Приватный профиль:</strong>
                  </div>
                  <p className="text-center">
                    Ваш профиль является приватным. Только вы можете видеть его содержимое
                  </p>
                </div>
                {profile?.pined != undefined && (
                  <>
                    <div className="mx-6 my-4 flex flex-row items-center rounded-xl border border-black/5 bg-background/70 px-3 py-2 text-muted-foreground dark:border-white/10">
                      <Pin className="mr-1 h-5 w-5 -rotate-45" />
                      {document?.icon && (
                        <span className="inline-block w-6 h-6 m-1" style={{ lineHeight: 0 }}>
                          <Twemoji>{document.icon}</Twemoji>
                        </span>
                      )}
                      <Link
                        className="text-xl flex flex-row items-center gap-1.5 hover:text-primary/70 transition-all duration-300"
                        href={pages.VIEW(document?._id as string)}
                      >
                        <span className="font-bold">{document?.title}</span>
                        {document?.verifed && (
                          <VerifedBadge text="Заметка верефицирована командой Qualsu" size={6} />
                        )}
                      </Link>
                    </div>
                  
                    <div className="mx-6 rounded-2xl border border-black/10 bg-background/70 pt-6 shadow-sm dark:border-white/10">
                      <Editor onChange={() => {}} initialContent={document?.content} editable={false} documentId={document?._id as string}/>
                    </div>
                  </>
                )}
                <div className="mt-8 mx-6">
                  <h2 className="mb-4 text-2xl font-bold">Заметки</h2>
                  {profile._id ? (
                    <DocumentList user={profile} profile={username} setProfile={setProfile} />
                  ) : (
                    <p className="text-muted-foreground">User not loaded</p>
                  )}
                </div>
              </>
            ) : (
              <div className="mx-6 my-4 flex flex-col items-center justify-center rounded-2xl border border-amber-300/50 bg-amber-50/80 p-4 text-amber-800 dark:border-amber-300/20 dark:bg-amber-900/30 dark:text-amber-100">
                <div className="flex items-center gap-2">
                  <LockKeyhole className="h-6 w-6 text-amber-500" />
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
                <div className="mx-6 my-4 flex flex-row items-center rounded-xl border border-black/5 bg-background/70 px-3 py-2 text-muted-foreground dark:border-white/10">
                  <Pin className="mr-1 h-5 w-5 -rotate-45" />
                  {document.icon && (
                    <span className="inline-block w-6 h-6 m-1" style={{ lineHeight: 0 }}>
                      <Twemoji>{document.icon}</Twemoji>
                    </span>
                  )}
                  <Link
                    className="text-xl font-bold transition-all duration-300 hover:text-primary/70"
                    href={pages.VIEW(document._id)}
                  >
                    {document.title}
                  </Link>
                </div>
                <div className="mx-6 rounded-2xl border border-black/10 bg-background/70 pt-6 shadow-sm dark:border-white/10">
                  <Editor onChange={() => {}} initialContent={document.content} editable={false} documentId={document._id}/>
                </div>
              </>
            )
          )}

          {!profile?.privated && (
            <div className="mt-8 mx-6">
              <h2 className="mb-4 text-2xl font-bold">Заметки</h2>
              {profile._id ? (
                <DocumentList user={profile} profile={username} setProfile={setProfile} />
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
