import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";
import Image from "next/image";
import { Pin } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import Twemoji from 'react-twemoji';
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import { updateUser } from "../../../../server/users/user";
import { User } from "../../../../server/users/types";
import { useUser } from "@clerk/nextjs";
import VerifedBadge from "./verifed";
import { Org } from "../../../../server/orgs/types";
import { updateOrg } from "../../../../server/orgs/org";

interface DocumentListProps {
  user: User | Org;
  profile: string;
  setProfile: React.Dispatch<React.SetStateAction<User | Org | null>>;
  parentDocumentId?: Id<"documents">;
  level?: number;
  publicSorted?: boolean;
}

export function DocumentList({
  user,
  profile,
  setProfile,
  parentDocumentId,
  level = 0,
  publicSorted = true,
}: DocumentListProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { user: clerkUser } = useUser();
  const isOrg = user._id.startsWith("org_")

  const documents = useQuery(api.document.getSidebar, {
    parentDocument: parentDocumentId,
    userId: user?._id,
    publicSorted,
  });

  const onToggleExpand = (documentId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [documentId]: !prev[documentId],
    }));
  };

  const handlePinClick = async (docId: string) => {
    try {
      let updatedUser;
      
      if (docId === user?.pined) {
        updatedUser = isOrg ? 
          await updateOrg(user._id, null, null, null, null, null, "") : 
          await updateUser(user._id, null, null, null, null, null, "");
        if (updatedUser) {
          toast.success("Note unpinned successfully!");
          setProfile((prevProfile) => {
            if (prevProfile) {
              return { ...prevProfile, pined: null };
            }
            return prevProfile;
          });
        }
      } else {
        updatedUser = isOrg ? 
          await updateOrg(user._id, null, null, null, null, null, docId) : 
          await updateUser(user._id, null, null, null, null, null, docId);
        if (updatedUser) {
          toast.success("Note pinned successfully!");
          setProfile((prevProfile) => {
            if (prevProfile) {
              return { ...prevProfile, pined: docId };
            }
            return prevProfile;
          });
        }
      }
    } catch (error) {
      toast.error("Failed to pin/unpin the note");
    }
  };

  if (documents === undefined) {
    return (
      <>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2 p-1">
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ))}
      </>
    );
  }

  if (documents.length === 0 && level === 0) {
    return <p className="text-muted-foreground text-sm ml-2">Пусто</p>;
  }

  return (
    <div className="space-y-2">
      <Twemoji>
        {documents.map((doc) => {
          const isExpanded = expanded[doc._id];

          if (doc.isPublished || !publicSorted) {
            return (
              <div key={doc._id} style={{ paddingLeft: level * 20 }}>
                <div
                  onClick={() => onToggleExpand(doc._id)}
                  className={cn(
                    "flex items-center justify-between hover:bg-secondary/20 rounded-lg transition-colors border-2 m-2 cursor-pointer"
                  )}
                >
                  <div className={`flex items-center gap-2 ${!doc.coverImage ? "p-4" : ""}`}>
                    {doc.icon ? (
                      <span
                        className={`inline-block w-6 h-6 ${doc.coverImage && "ml-4"}`}
                        style={{ lineHeight: 0 }}
                      >
                        {doc.icon}
                      </span>
                    ) : (
                      <FileIcon
                        className={`w-5 h-5 text-muted-foreground ${doc.coverImage && "ml-4"}`}
                      />
                    )}

                    <a
                      href={`/view/${doc._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xl text-primary/80 transition-all duration-300 hover:underline hover:text-primary"
                    >
                      {doc.title}
                    </a>

                    {doc.verifed && (
                      <VerifedBadge text="Заметка верефицирована командой Qualsu" size={6}/>
                    )}
                  </div>

                  {doc.coverImage && (
                    <div className="relative w-64 h-16 overflow-hidden ml-auto">
                      <Image
                        src={doc.coverImage}
                        alt={doc.title}
                        fill
                        className="rounded-r-lg object-cover ml-0.5"
                      />
                    </div>
                  )}
                

                  {(clerkUser?.username === profile || user.owner == clerkUser?.id) && (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePinClick(doc._id);
                        }}
                        className="absolute left-5 -bottom-3"
                      >
                        {doc._id === user?.pined ? (
                          <Pin className="w-6 h-6 text-yellow-500 hover:text-yellow-600 transition-all duration-200" />
                        ) : (
                          <Pin className="w-6 h-6 rotate-45 text-yellow-500 opacity-60 hover:opacity-100 transition-all duration-200" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isExpanded && (
                  <div className="ml-6 border-l border-muted-foreground/30 pl-4">
                    <DocumentList
                      user={user}
                      profile={profile}
                      setProfile={setProfile}
                      parentDocumentId={doc._id}
                      level={level + 1}
                      publicSorted={publicSorted}
                    />
                  </div>
                )}
              </div>
            );
          }

          return (
            <div key={doc._id}>
              <DocumentList
                user={user}
                parentDocumentId={doc._id}
                profile={profile}
                setProfile={setProfile}
                level={0}
                publicSorted={publicSorted}
              />
            </div>
          );
        })}
      </Twemoji>
    </div>
  );
}
