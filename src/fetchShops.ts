import { refreshAccessToken } from "./services/tokenService";
import { fetchShops } from "./services/shopService";

const refreshToken =
  "ROW_60qo0wAAAADamCSdeJGBUy03_ojpCRLEa3fUPcBoj_Luqkx4eGkdG5fr8RLtpcInX3TGFjIE99U";

async function main() {
  try {
    // First refresh the access token
    const tokenResponse = await refreshAccessToken(refreshToken);

    // Then fetch shops data using the new access token
    const shopsResponse = await fetchShops(tokenResponse.access_token);

    return shopsResponse;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Execute the function
main().catch(console.error);
