import { API } from "@/config/const/api.const";
import type { Org } from "@/config/types/server.types";

export async function createOrg(
  _id: string,
  username: string | null,
  owner: string | null,
  created: Date | null = null,
  name: string | null = null,
  members: string[] | null = null,
  avatar: string | null = null,
  documents: number | null = null,
  publicDocuments: number | null = null,
  verifiedDocuments: number | null = null,
): Promise<Org | null>{
  try {
    const response = await API.post(`/orgs/add/${_id}`, {
      username,
      owner,
      created,
      members,
      name,
      avatar,
      documents,
      publicDocuments,
      verifiedDocuments
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export async function getByUsername(username: string): Promise<Org | null>{
  try {
    const response = await API.get(`/orgs/by_username/${username}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export async function getById(_id: string): Promise<Org | null>{
  try {
    const response = await API.get(`/orgs/by_id/${_id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export async function updateOrg(
  _id: string,
  username: string | null = null,
  owner: string | null = null,
  name: string | null = null,
  avatar: string | null = null,
  privated: boolean | null = null,
  pined: string | null = null,
  documents: number | null = null,
  publicDocuments: number | null = null,
  members: string[] | null = null,
  watermark: boolean | null = null,
  premium: number | null = null,
  verifiedDocuments: number | null = null,
): Promise<Org | null>{
  try {
    const response = await API.put(`/orgs/update/${_id}`, {
      username,
      name,
      owner,
      avatar,
      privated,
      pined,
      documents,
      members,
      publicDocuments,
      watermark,
      premium,
      verifiedDocuments
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export async function updateOrgBadge(
  _id: string,
  badgeName: string,
  status: boolean
): Promise<{ message: string } | null> {
  try {
    const response = await API.put(`/orgs/update_badge/${_id}`, {
      badge_name: badgeName,
      status
    });
    return response.data;
  } catch (error) {
    return null;
  }
}