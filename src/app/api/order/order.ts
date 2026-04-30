import { apiGet, apiPost, apiPut, removeNullish } from "../client"
import { apiRoutes } from "@/config/routing/api.route"
import type { Order } from "@/config/types/api.types"

export function createOrder(
  _id: string,
  userid: string | null = null,
  premium: number | null = null,
  status: string | null = null,
  amount: number | null = null
): Promise<Order | null> {
  void _id

  return apiPost<Order>(
    apiRoutes.ORDER.CREATE,
    removeNullish({
      userid,
      premium,
      status,
      amount,
    })
  )
}

export function checkOrder(_id: string): Promise<Order | null> {
  return apiGet<Order>(apiRoutes.ORDER.CHECK(_id))
}

export function success(_id: string): Promise<Order | null> {
  return apiPut<Order>(apiRoutes.ORDER.SUCCESS(_id))
}
