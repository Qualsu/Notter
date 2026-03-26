import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_QUALSU_API;

export const API = axios.create({
    baseURL: API_URL,
})