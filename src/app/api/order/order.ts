import { apiGet, apiPost, apiPut, removeNullish } from "../client"
import { apiRoutes } from "@/config/routing/api.route"
import type {
  CheckOrderFunction,
  CreateOrderFunction,
  Order,
  SuccessOrderFunction,
} from "@/config/types/api.types"

export const createOrder: CreateOrderFunction = (
  _id,
  userid = null,
  premium = null,
  status = null,
  amount = null
) => {
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

export const checkOrder: CheckOrderFunction = (_id) => {
  return apiGet<Order>(apiRoutes.ORDER.CHECK(_id))
}

export const success: SuccessOrderFunction = (_id) => {
  return apiPut<Order>(apiRoutes.ORDER.SUCCESS(_id))
}
