import { apiPost } from "../client"
import { apiRoutes } from "@/config/routing/api.route"
import type { MessageResponse, SendMailFunction } from "@/config/types/api.types"

export const sendMail: SendMailFunction = (mail) => {
  return apiPost<MessageResponse>(apiRoutes.MAIL.SEND, mail)
}
