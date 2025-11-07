import axios from "axios";
import { Org } from "./types";

const API_URL = process.env.NEXT_PUBLIC_QUALSU_API

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
    const response = await axios.post(`${API_URL}/orgs/add/${_id}`, {
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
    const response = await axios.get(`${API_URL}/orgs/by_username/${username}`);
    return response.data;
  } catch (error) {
    return null;
  }
};

export async function getById(_id: string): Promise<Org | null>{
  try {
    const response = await axios.get(`${API_URL}/orgs/by_id/${_id}`);
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
    const response = await axios.put(`${API_URL}/orgs/update/${_id}`, {
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
    const response = await axios.put(`${API_URL}/orgs/update_badge/${_id}`, {
      badge_name: badgeName,
      status
    });
    return response.data;
  } catch (error) {
    return null;
  }
}