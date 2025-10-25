export type Badge = {
  verified: boolean;
  notter: boolean;
  notes_verifed: boolean;
  contributor: boolean;
}

export type User = {
  _id: string;
  _token: string;
  username: string;
  firstname: string;
  lastname: string | null;
  avatar: string | null;
  badges: Badge;
  privated: boolean;
  pined: string | null;
  created: Date | null;
  premium: number;
  moderator: boolean;
}
