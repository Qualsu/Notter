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
  documents: number
  publicDocuments: number
  verifiedDocuments: number
  verifiedOrgs: number
  watermark: boolean | null
  owner: string
  members: Array<string>
  mail: string | null
}
