"use client";

import { Cover } from "@/components/cover";
import Image from "next/image";
import { useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Twemoji from 'react-twemoji';
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/app/(landing)/_components/navbar";
import toast from "react-hot-toast";
import Error404 from "@/app/errorPage";
import { useUser } from "@clerk/nextjs";
import VerifedBadge from "../../_components/verifed";
import { DocumentList } from "../../_components/documentList";
import { Badges } from "../../_components/badge";
import { getByUsername } from "../../../../../server/orgs/org";
import { Org } from "../../../../../server/orgs/types";
import { LockKeyhole, Pin } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { User } from "../../../../../server/users/types";

interface OrgProps {
  params: {
    orgname: string;
  };
}

export default function OrgProfile({ params }: OrgProps) {
  const { isLoaded, user } = useUser();
  const [org, setOrg] = useState<Org | User | null>(null);

  useEffect(() => {
    const fetchOrg = async () => {
      const orgData = await getByUsername(params.orgname);
      setOrg(orgData);
    };

    fetchOrg();
  }, [params.orgname]);

  const document = useQuery(api.document.getById, {
    userId: org?._id,
    documentId: org?.pined === undefined ? null : org?.pined == "" ? null : org?.pined as Id<"documents"> | null,
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
      if (org?.username && navigator) {
        await navigator.clipboard.writeText(org.username);
        toast.success("Username copied to clipboard!");
      }
    } catch (error) {
      toast.error("Failed to copy username");
    }
  };

  if (!org) {
    return (
      <>
        <Navbar />
        <Error404 /> ;
      </>
    );
  }

  const isUser = (profile: User | Org): profile is User => {
    return (profile as User).firstname !== undefined;
  };

  const canViewPrivateOrg = org?.privated ? org?.members?.includes(user?.id as string) || user?.username === org.username : true;

  return (
    <>
      <Navbar />
      <div className="p-2 px-4 mt-8 border-8 border-white dark:border-[#0a0a0a]">
        <title>{org?.name + "`s profile"}</title>
        <div className="flex flex-col">
          <Cover url={document?.coverImage || "/default-cover.png"} preview />

          <div className="m-3 flex flex-col md:flex-row md:items-center md:justify-between relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={org?.avatar || "/default-profile.png"}
                  alt="Org Avatar"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl  flex items-center gap-2">
                    {/* Conditional rendering based on profile type */}
                    {isUser(org) ? (
                      <span className="hidden sm:block font-bold whitespace-nowrap">
                        {org?.firstname} {org?.lastname} {!org?.firstname && !org?.lastname ? org?.username : ""}
                      </span>
                    ) : (
                      <span className="hidden sm:block font-bold whitespace-nowrap">{org?.name}</span>
                    )}

                    <span className="block sm:hidden font-bold">
                      {isUser(org) ? org?.firstname : org?.name}
                      <span className="flex flex-row items-center gap-2">
                        {isUser(org) && org?.lastname}
                        {!isUser(org) && org?.name}
                        {org?.badges.verified && (
                          <VerifedBadge text="Верефицированная команда" size={7} clicked={false} />
                        )}
                      </span>
                    </span>
                    <div className="hidden sm:block">
                      {org?.badges.verified && (
                        <VerifedBadge text="Верефицированная команда" size={7} clicked={false} />
                      )}
                    </div>
                  </h1>
                </div>
                <p
                  className="mt-2 text-xl text-primary/80 hover:text-primary hover:underline duration-300 transition-all"
                  onClick={copyUsername}
                >
                  {org?.username}
                </p>
              </div>
            </div>

            <div className="flex flex-row gap-2 bg-black/5 dark:bg-[#111111] p-2 rounded-xl items-center mt-4 md:mt-0 max-w-max text-white">
              <Badges profile={org} />
            </div>
          </div>

          <hr className="bg-[#111111]" />

          {org?.privated ? (
            canViewPrivateOrg ? (
              <>
                <div className="flex flex-col items-center justify-center mx-6 my-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                  <div className="flex items-center gap-2">
                    <LockKeyhole className="w-8 h-8 text-yellow-500" />
                    <strong>Приватная организация:</strong>
                  </div>
                  <p className="text-center">
                    Профиль организации является приватным. Только вы и участники могут видеть содержимое
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
                      <VerifedBadge text="Заметка верефицирована командой Qualsu" size={6} />
                    )}
                  </a>
                </div>
                <div className="border-2 mx-6 pt-6 rounded-lg">
                  <Editor onChange={() => {}} initialContent={document?.content} editable={false} />
                </div>
                <div className="mt-8 mx-6">
                  <h2 className="text-2xl font-bold mb-4">All Notes</h2>
                  {org._id ? (
                    <DocumentList user={org} profile={params.orgname} setProfile={setOrg} />
                  ) : (
                    <p className="text-muted-foreground">Org not loaded</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center mx-6 my-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                <div className="flex items-center gap-2">
                  <LockKeyhole className="w-8 h-8 text-yellow-500" />
                  <strong>Приватная организация:</strong>
                </div>
                <p className="text-center">
                  Этот профиль организации является приватным. Только участники могут видеть содержимое
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

          {!org?.privated && (
            <div className="mt-8 mx-6">
              <h2 className="text-2xl font-bold mb-4">All Notes</h2>
              {org._id ? (
                <DocumentList user={org} profile={params.orgname} setProfile={setOrg} />
              ) : (
                <p className="text-muted-foreground">Org not loaded</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}