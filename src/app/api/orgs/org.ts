import { createProfileApi } from "../profile-api"
import { apiRoutes } from "@/config/routing/api.route"
import type { Org } from "@/config/types/api.types"

const orgsApi = createProfileApi<Org>(apiRoutes.ORGS)

export function createOrg(
  _id: string,
  username: string | null,
  owner: string | null,
  created: Date | null = null,
  name: string | null = null,
  members: string[] | null = null,
  avatar: string | null = null,
  documents: number | null = null,
  publicDocuments: number | null = null,
  verifiedDocuments: number | null = null
): Promise<Org | null> {
  return orgsApi.create(_id, {
    username,
    owner,
    created,
    members,
    name,
    avatar,
    documents,
    publicDocuments,
    verifiedDocuments,
  })
}

export const getByUsername = orgsApi.getByUsername
export const getById = orgsApi.getById

export function updateOrg(
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
  verifiedDocuments: number | null = null
): Promise<Org | null> {
  return orgsApi.update(_id, {
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
    verifiedDocuments,
  })
}

export const updateOrgBadge = orgsApi.updateBadge
