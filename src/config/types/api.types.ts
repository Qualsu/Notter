export interface Mail {
  to: string
  subject: string
  message: string
}

export interface Order {
  _id: string
  userid: string
  premium: number
  status: string
  amount: number
}

export type OrgBadge = {
  verified: boolean;
  notes_verifed: boolean;
  contributor: boolean;
  notter: boolean;
  org_verifed: boolean;
}

export type Org = {
  _id: string;
  username: string;
  owner: string;
  name: string | null;
  firstname: string;
  lastname: string | null;
  members: Array<string>;
  avatar: string | null;
  badges: OrgBadge;
  privated: boolean;
  pined: string | null;
  created: Date | null;
  premium: number;
  documents: number;
  publicDocuments: number;
  verifiedDocuments: number;
  verifiedOrgs: number;
  moderator: boolean;
  watermark: boolean;
  mail: string | null;
}

export type UserBadge = {
  verified: boolean;
  notes_verifed: boolean;
  contributor: boolean;
  notter: boolean;
  org_verifed: boolean;
}

export type User = {
  _id: string;
  username: string;
  name: string;
  firstname: string;
  lastname: string | null;
  avatar: string | null;
  badges: UserBadge;
  privated: boolean;
  pined: string | null;
  created: Date | null;
  premium: number;
  moderator: boolean;
  documents: number;
  publicDocuments: number;
  verifiedDocuments: number;
  verifiedOrgs: number;
  watermark: boolean | null;
  owner: string;
  members: Array<string>;
  mail: string | null;
}