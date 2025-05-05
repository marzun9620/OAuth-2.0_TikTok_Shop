import axios, { AxiosError } from "axios";

const appKey = "6g2s247q1cqtl";
const appSecret = "3c0331190b356f9f4ec0a370d3c025d17260a430";

export interface TokenResponse {
  access_token: string;
  access_token_expire_in: number;
  refresh_token: string;
  refresh_token_expire_in: number;
  open_id: string;
  seller_name: string;
  seller_base_region: string;
  user_type: number;
  granted_scopes: string[];
}

export class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenError";
  }
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<TokenResponse> {
  try {
    const url = `https://auth.tiktok-shops.com/api/v2/token/refresh?app_key=${appKey}&app_secret=${appSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`;
    console.log("Refreshing token with URL:", url);

    const response = await axios.get(url);
    console.log("Refresh response:", JSON.stringify(response.data, null, 2));

    if (response.data.code !== 0) {
      throw new TokenError(`Token refresh failed: ${response.data.message}`);
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Refresh error:", error.response?.data || error.message);
      throw new TokenError(
        `Token refresh failed: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new TokenError("Unknown error occurred during token refresh");
  }
}
