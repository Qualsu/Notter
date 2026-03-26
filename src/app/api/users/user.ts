import { API } from "@/config/const/api.const";
import { apiRoutes } from "@/config/routing/api.route";
import type { User } from "@/config/types/api.types";

export async function createUser(
  _id: string,
  username: string,
  created: Date | null = null,
  firstname: string | null = null,
  lastname: string | null = null,
  avatar: string | null = null,
  documents: number | null = null,
  publicDocuments: number | null = null,
  verifiedDocuments: number | null = null,
  mail: string | null = null
): Promise<User | null>{
  try {
    const response = await API.post(apiRoutes.USERS.ADD(_id), {
      username,
      created,
      firstname,
      lastname,
      avatar,
      documents,
      publicDocuments,
      verifiedDocuments,
      mail
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export async function getByUsername(username: string): Promise<User | null>{
  try {
    const response = await API.get(apiRoutes.USERS.BY_USERNAME(username));
    return response.data;
  } catch (error) {
    return null;
  }
};

export async function getById(_id: string): Promise<User | null>{
  try {
    const response = await API.get(apiRoutes.USERS.BY_ID(_id));
    return response.data;
  } catch (error) {
    return null;
  }
};

export async function updateUser(
  _id: string,
  username: string | null = null,
  firstname: string | null = null,
  lastname: string | null = null,
  avatar: string | null = null,
  privated: boolean | null = null,
  pined: string | null = null,
  documents: number | null = null,
  publicDocuments: number | null = null,
  verifiedDocuments: number | null = null,
  watermark: boolean | null = null,
  mail: string | null = null,
  premium: number | null = null,
  moderator: boolean | null = null
): Promise<User | null>{
  try {
    const response = await API.put(apiRoutes.USERS.UPDATE(_id), {
      username,
      firstname,
      lastname,
      avatar,
      privated,
      pined,
      documents,
      publicDocuments,
      verifiedDocuments,
      watermark,
      mail,
      premium,
      moderator
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export async function updateUserBadge(
  _id: string,
  badgeName: string,
  status: boolean
): Promise<{ message: string } | null> {
  try {
    const response = await API.put(apiRoutes.USERS.UPDATE_BADGE(_id), {
      badge_name: badgeName,
      status
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function changeVerifiedOrgs(
  _id: string,
  change: number
): Promise<{ message: string } | null> {
  try {
    const response = await API.put(
      apiRoutes.USERS.CHANGE_VERIFIED_ORGS(_id, change)
    );
    return response.data;
  } catch (error) {
    return null;
  }
}