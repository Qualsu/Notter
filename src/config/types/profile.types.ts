import type { Id } from "../../../convex/_generated/dataModel"
import type * as React from "react"
import type { Org, User } from "./server.types"

export type VerifedBadgeProps = {
  text: string;
  size: number;
  clicked?: boolean;
  down?: boolean;
}

export type BadgesProps = {
  profile: User | Org
}

export interface UserProps {
  user: User | Org | null;
}

export interface DocumentListProps {
  user: User | Org;
  profile: string;
  setProfile: React.Dispatch<React.SetStateAction<User | Org | null>>;
  parentDocumentId?: Id<"documents">;
  level?: number;
  publicSorted?: boolean;
}

export interface OrgProps {
  params: {
    orgname: string;
  };
}

export interface UsernameProps {
  params: {
    username: string;
  };
}