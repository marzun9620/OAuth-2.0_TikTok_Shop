import axios, { AxiosError } from "axios";
import crypto from "crypto";
import { getFreshAccessToken } from "../utils/tokenManager";

const appKey = "6g2s247q1cqtl";
const appSecret = "3c0331190b356f9f4ec0a370d3c025d17260a430";
const shopCipher = "ROW_vkf2GgAAAACym91vJndajupiWTzH1JuG";

export interface Order {
  order_id: string;
  order_status: string;

}

export interface OrderResponse {
  code: number;
  data: {
    orders: Order[];
  };
  message: string;
  request_id: string;
}

export class OrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderError";
  }
}

function generateSign(params: Record<string, string | number>): string {
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys.map((k) => `${k}${params[k]}`).join("");
  const strToSign = `${appSecret}/order/202309/orders${paramString}${appSecret}`;
  const hmac = crypto.createHmac("sha256", appSecret);
  hmac.update(strToSign);
  return hmac.digest("hex");
}

export async function fetchOrders(orderIds: string[]): Promise<OrderResponse> {
  try {
    // Get a fresh access token before making the API call
    const accessToken = await getFreshAccessToken();

    const timestamp = Math.floor(Date.now() / 1000);
    const params = {
      app_key: appKey,
      shop_cipher: shopCipher,
      timestamp,
      ids: JSON.stringify(orderIds),
    };

    const sign = generateSign(params);

    const response = await axios.get(
      "https://open-api.tiktokglobalshop.com/order/202309/orders",
      {
        params: {
          ...params,
          sign,
        },
        headers: {
          "x-tts-access-token": accessToken,
        },
      }
    );

    console.log("Orders data:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API error:", error.response?.data || error.message);
      throw new OrderError(
        `Order API error: ${error.response?.data?.message || error.message}`
      );
    }
    throw new OrderError("Unknown error occurred during order API call");
  }
}
