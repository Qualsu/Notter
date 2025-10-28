import axios from "axios";
import { Order } from "./types";

const API_URL = process.env.NEXT_PUBLIC_QUALSU_API

export async function createOrder(
  _id: string,
  userid: string | null = null,
  premium: number | null = null,
  status: string | null = null,
  amount: number | null = null
): Promise<Order | null>{
  try {
    const response = await axios.post(`${API_URL}/order/create`, {
      userid,
      premium,
      status,
      amount
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
};

export async function success(
  _id: string
): Promise<Order | null>{
  try {
    const response = await axios.put(`${API_URL}/order/success/${_id}`);
    return response.data;
  } catch (error) {
    console.error("Error successing order:", error);
    return null;
  }
};