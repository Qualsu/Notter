import { API } from "@/config/const/api.const";
import { apiRoutes } from "@/config/routing/api.route";
import type { Mail } from "@/config/types/server.types";

export async function sendMail({
  to,
  subject,
  message
}: Mail) {
  try {
    const response = await API.post(apiRoutes.MAIL.SEND, {
      to,
      subject,
      message
    });
    return response.data;
  } catch (error) {
    return null;
  }
};