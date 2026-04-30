import { apiGet, apiPost, apiPut, removeNullish } from "./client"

type ProfileRoutes = {
  ADD: (_id: string) => string
  BY_USERNAME: (username: string) => string
  BY_ID: (_id: string) => string
  UPDATE: (_id: string) => string
  UPDATE_BADGE: (_id: string) => string
}

type MessageResponse = { message: string }

export function createProfileApi<TProfile>(routes: ProfileRoutes) {
  return {
    create(_id: string, payload: Record<string, unknown>) {
      return apiPost<TProfile>(routes.ADD(_id), removeNullish(payload))
    },

    getByUsername(username: string) {
      return apiGet<TProfile>(routes.BY_USERNAME(username))
    },

    getById(_id: string) {
      return apiGet<TProfile>(routes.BY_ID(_id))
    },

    update(_id: string, payload: Record<string, unknown>) {
      return apiPut<TProfile>(routes.UPDATE(_id), removeNullish(payload))
    },

    updateBadge(_id: string, badgeName: string, status: boolean) {
      return apiPut<MessageResponse>(routes.UPDATE_BADGE(_id), {
        badge_name: badgeName,
        status,
      })
    },
  }
}
