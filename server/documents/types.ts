export interface DocumentProps {
  _id: string;
  title: string;
  userId: string;
  lastEditor: string;
  creatorName: string;
  isArchived: boolean;
  isPublished: boolean;
  shortId?: string;
  content?: string;
  coverImage?: string;
  icon?: string;
  verified?: boolean;
  isShort?: boolean;
}

export interface CreateDocument {
  title: string;
  parentDocument?: string;
  userId: string;
  lastEditor: string;
  creatorName: string;
}

export interface UpdateDocument {
  title?: string;
  content?: string;
  coverImage?: string;
  icon?: string;
  isPublished?: boolean;
  parentDocument?: string | null;
  isArchived?: boolean;
  shortId?: string;
  verified?: boolean;
}
