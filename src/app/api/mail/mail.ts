import { apiPost } from "../client"
import { apiRoutes } from "@/config/routing/api.route"
import type { Mail } from "@/config/types/api.types"

export function sendMail(mail: Mail) {
  return apiPost(apiRoutes.MAIL.SEND, mail)
}
