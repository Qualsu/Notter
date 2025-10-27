export type UserBadge = {
  verified: boolean;
  notter: boolean;
  notes_verifed: boolean;
  org_verifed: boolean;
  contributor: boolean;
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
  watermark: boolean | null
  owner: string
  members: Array<string>
}
