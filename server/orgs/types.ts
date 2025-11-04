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
  members: Array<string>
  avatar: string | null;
  badges: OrgBadge;
  privated: boolean;
  pined: string | null;
  created: Date | null;
  premium: number;
  documents: number
  publicDocuments: number
  verifiedDocuments: number
  verifiedOrgs: number
  moderator: boolean
  watermark: boolean
  mail: string | null
}
