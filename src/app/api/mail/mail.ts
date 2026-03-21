import { API } from "@/config/const/api.const";
import type { Mail } from "@/config/types/server.types";

export async function sendMail({
  to,
  subject,
  message
}: Mail) {
  try {
    const response = await API.post("/mail/send", {
      to,
      subject,
      message
    });
    return response.data;
  } catch (error) {
    return null;
  }
};