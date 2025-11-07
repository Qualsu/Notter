import axios from "axios";
import { Mail } from "./types";

const API_URL = process.env.NEXT_PUBLIC_QUALSU_API;

export async function sendMail({
  to,
  subject,
  message
}: Mail) {
  try {
    const response = await axios.post(`${API_URL}/mail/send`, {
      to,
      subject,
      message
    });
    return response.data;
  } catch (error) {
    return null;
  }
};