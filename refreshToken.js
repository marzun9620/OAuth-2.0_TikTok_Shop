const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const { APP_KEY, APP_SECRET, REFRESH_TOKEN } = process.env;

async function refreshToken() {
  try {
    const response = await axios.get("https://auth.tiktok-shops.com/api/v2/token/refresh", {
      params: {
        app_key: APP_KEY,
        app_secret: APP_SECRET,
        refresh_token: REFRESH_TOKEN,
        grant_type: "refresh_token",
      },
    });

    const { access_token, refresh_token } = response.data.data;

    console.log("Token refreshed successfully!");
    console.log("New Access Token:", access_token);
    console.log("New Refresh Token:", refresh_token);

    // Return the new access token and refresh token
    return { access_token, refresh_token };
  } catch (error) {
    console.error(" Failed to refresh token:");
    console.error(error.response?.data || error.message);
  }
}

refreshToken();
