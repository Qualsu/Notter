import axios from "axios";
import { User } from "./types";

const API_URL = process.env.NEXT_PUBLIC_QUALSU_API

export async function createUser(
  _id: string,
  username: string,
  created: Date | null = null,
  firstname: string | null = null,
  lastname: string | null = null,
  avatar: string | null = null,
  documents: number | null = null,
  publicDocuments: number | null = null,
): Promise<User | null>{
  try {
    const response = await axios.post(`${API_URL}/users/add/${_id}`, {
      username,
      created,
      firstname,
      lastname,
      avatar,
      documents,
      publicDocuments
    });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

export async function getByUsername(username: string): Promise<User | null>{
  try {
    const response = await axios.get(`${API_URL}/users/by_username/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }
};

export async function getById(_id: string): Promise<User | null>{
  try {
    const response = await axios.get(`${API_URL}/users/by_id/${_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by id:", error);
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
  watermark: boolean | null = null
): Promise<User | null>{
  try {
    const response = await axios.put(`${API_URL}/users/update/${_id}`, {
      username,
      firstname,
      lastname,
      avatar,
      privated,
      pined,
      documents,
      publicDocuments,
      watermark
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};