const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const { APP_KEY, APP_SECRET, AUTH_CODE } = process.env;

let accessToken = "";

async function getToken() {
  try {
    const response = await axios.get("https://auth.tiktok-shops.com/api/v2/token/get", {
      params: {
        app_key: APP_KEY,
        app_secret: APP_SECRET,
        auth_code: AUTH_CODE,
        grant_type: "authorized_code",
      },
    });

    accessToken = response.data.access_token;
    console.log("Access Token:", response.data.access_token);
    console.log("Token fetched successfully");
    return accessToken;
  } catch (error) {
    console.error("Failed to fetch token:");
    console.error(error.response?.data || error.message);
    throw new Error("Token fetch failed");
  }
}

module.exports = { getToken, accessToken };
