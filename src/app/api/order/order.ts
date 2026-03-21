import { API } from "@/config/const/api.const";
import type { Order } from "@/config/types/server.types";

export async function createOrder(
  _id: string,
  userid: string | null = null,
  premium: number | null = null,
  status: string | null = null,
  amount: number | null = null
): Promise<Order | null>{
  try {
    const response = await API.post("/order/create", {
      userid,
      premium,
      status,
      amount
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export async function checkOrder(
  _id: string
): Promise<Order | null>{
  try {
    const response = await API.get(`/order/check/${_id}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function success(
  _id: string
): Promise<Order | null>{
  try {
    const response = await API.put(`/order/success/${_id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};