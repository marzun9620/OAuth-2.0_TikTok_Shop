import axios, { AxiosError } from "axios";
import crypto from "crypto";
import { getFreshAccessToken } from "../utils/tokenManager";

const appKey = "6g2s247q1cqtl";
const appSecret = "3c0331190b356f9f4ec0a370d3c025d17260a430";

export interface CategoryAsset {
  category_id: string;
  category_name: string;
  parent_id: string;
  level: number;
  is_leaf: boolean;
  children?: CategoryAsset[];
}

export interface CategoryResponse {
  code: number;
  data: {
    categories: CategoryAsset[];
  };
  message: string;
  request_id: string;
}

export class CategoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CategoryError";
  }
}

function generateSign(params: Record<string, string | number>): string {
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys.map((k) => `${k}${params[k]}`).join("");
  const strToSign = `${appSecret}/authorization/202405/category_assets${paramString}${appSecret}`;
  const hmac = crypto.createHmac("sha256", appSecret);
  hmac.update(strToSign);
  return hmac.digest("hex");
}

export async function fetchCategories(): Promise<CategoryResponse> {
  try {

    const accessToken = await getFreshAccessToken();

    const timestamp = Math.floor(Date.now() / 1000);
    const params = {
      app_key: appKey,
      timestamp,
    };

    const sign = generateSign(params);

    const response = await axios.get(
      "https://open-api.tiktokglobalshop.com/authorization/202405/category_assets",
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

    console.log("Categories data:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API error:", error.response?.data || error.message);
      throw new CategoryError(
        `Category API error: ${error.response?.data?.message || error.message}`
      );
    }
    throw new CategoryError("Unknown error occurred during category API call");
  }
}
