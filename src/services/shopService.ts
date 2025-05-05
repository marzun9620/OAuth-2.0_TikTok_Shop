import axios, { AxiosError } from "axios";
import crypto from "crypto";

const appKey = "6g2s247q1cqtl";
const appSecret = "3c0331190b356f9f4ec0a370d3c025d17260a430";

export interface Shop {
  cipher: string;
  code: string;
  id: string;
  name: string;
  region: string;
  seller_type: string;
}

export interface ShopResponse {
  code: number;
  data: {
    shops: Shop[];
  };
  message: string;
  request_id: string;
}

export class ShopError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShopError";
  }
}

function generateSign(params: Record<string, string | number>): string {
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys.map((k) => `${k}${params[k]}`).join("");
  const strToSign = `${appSecret}/authorization/202309/shops${paramString}${appSecret}`;
  const hmac = crypto.createHmac("sha256", appSecret);
  hmac.update(strToSign);
  return hmac.digest("hex");
}

export async function fetchShops(accessToken: string): Promise<ShopResponse> {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const params = {
      app_key: appKey,
      timestamp,
    };

    const sign = generateSign(params);

    const response = await axios.get(
      "https://open-api.tiktokglobalshop.com/authorization/202309/shops",
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

    console.log("Shops data:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API error:", error.response?.data || error.message);
      throw new ShopError(
        `Shop API error: ${error.response?.data?.message || error.message}`
      );
    }
    throw new ShopError("Unknown error occurred during shop API call");
  }
}
