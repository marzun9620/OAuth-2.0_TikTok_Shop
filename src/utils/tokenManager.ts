import { refreshAccessToken } from "../services/tokenService";

const refreshToken =
  "ROW_60qo0wAAAADamCSdeJGBUy03_ojpCRLEa3fUPcBoj_Luqkx4eGkdG5fr8RLtpcInX3TGFjIE99U";

export async function getFreshAccessToken(): Promise<string> {
  try {
    const tokenResponse = await refreshAccessToken(refreshToken);
    return tokenResponse.access_token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}
