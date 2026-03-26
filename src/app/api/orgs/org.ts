import { API } from "@/config/const/api.const";
import { apiRoutes } from "@/config/routing/api.route";
import type { Org } from "@/config/types/api.types";

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
    const response = await API.post(apiRoutes.ORGS.ADD(_id), {
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
    const response = await API.get(apiRoutes.ORGS.BY_USERNAME(username));
    return response.data;
  } catch (error) {
    return null;
  }
};

export async function getById(_id: string): Promise<Org | null>{
  try {
    const response = await API.get(apiRoutes.ORGS.BY_ID(_id));
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
    const response = await API.put(apiRoutes.ORGS.UPDATE(_id), {
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
    const response = await API.put(apiRoutes.ORGS.UPDATE_BADGE(_id), {
      badge_name: badgeName,
      status
    });
    return response.data;
  } catch (error) {
    return null;
  }
}