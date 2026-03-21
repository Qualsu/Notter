import { API } from "@/config/const/api.const";
import type { User } from "@/config/types/server.types";

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
    const response = await API.post(`/users/add/${_id}`, {
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
    const response = await API.get(`/users/by_username/${username}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export async function getById(_id: string): Promise<User | null>{
  try {
    const response = await API.get(`/users/by_id/${_id}`);
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
    const response = await API.put(`/users/update/${_id}`, {
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
    const response = await API.put(`/users/update_badge/${_id}`, {
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
    const response = await API.put(`/users/change_verified_orgs/${_id}?change=${change}`);
    return response.data;
  } catch (error) {
    return null;
  }
}