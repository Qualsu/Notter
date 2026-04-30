import { apiPut } from "../client"
import { createProfileApi } from "../profile-api"
import { apiRoutes } from "@/config/routing/api.route"
import type { User } from "@/config/types/api.types"

const usersApi = createProfileApi<User>(apiRoutes.USERS)

export function createUser(
  _id: string,
  username: string,
  created: Date | null = null,
  firstname: string | null = null,
  lastname: string | null = null,
  avatar: string | null = null,
  documents: number | null = null,
  publicDocuments: number | null = null,
  verifiedDocuments: number | null = null,
  mail: string | null = null
): Promise<User | null> {
  return usersApi.create(_id, {
    username,
    created,
    firstname,
    lastname,
    avatar,
    documents,
    publicDocuments,
    verifiedDocuments,
    mail,
  })
}

export const getByUsername = usersApi.getByUsername
export const getById = usersApi.getById

export function updateUser(
  _id: string,
  username: string | null = null,
  firstname: string | null = null,
  lastname: string | null = null,
  avatar: string | null = null,
  privated: boolean | null = null,
  pined: string | null = null,
  documents: number | null = null,
  publicDocuments: number | null = null,
  verifiedDocuments: number | null = null,
  watermark: boolean | null = null,
  mail: string | null = null,
  premium: number | null = null,
  moderator: boolean | null = null
): Promise<User | null> {
  return usersApi.update(_id, {
    username,
    firstname,
    lastname,
    avatar,
    privated,
    pined,
    documents,
    publicDocuments,
    verifiedDocuments,
    watermark,
    mail,
    premium,
    moderator,
  })
}

export const updateUserBadge = usersApi.updateBadge

export function changeVerifiedOrgs(_id: string, change: number) {
  return apiPut<{ message: string }>(apiRoutes.USERS.CHANGE_VERIFIED_ORGS(_id, change))
}
