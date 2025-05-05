const axios = require("axios");
const { accessToken } = require("./getToken");

const { APP_KEY, APP_SECRET } = process.env;

function generateSign(params) {
  const crypto = require("crypto");

  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys
    .map((key) => `${key}${params[key]}`)
    .join("");

  const signString = `${APP_SECRET}/authorization/202309/shops${paramString}${APP_SECRET}`;

  // create HMAC-SHA256 hash
  const hmac = crypto.createHmac("sha256", APP_SECRET);
  hmac.update(signString);
  return hmac.digest("hex");
}

async function getShopData() {
  const timestamp = Math.floor(Date.now() / 1000);

  const params = {
    app_key: APP_KEY,
    sign: "", // To be calculated
    timestamp: timestamp,
  };

  params.sign = generateSign(params);

  try {
    const response = await axios.get("https://open-api.tiktokglobalshop.com/authorization/202309/shops", {
      params: {
        ...params,
      },
      headers: {
        "x-tts-access-token": accessToken,
      },
    });

    console.log("Shop Data Response:");
    console.log(response.data);
  } catch (error) {
    console.error("Failed to fetch shop data:");
    console.error(error.response?.data || error.message);
  }
}

getShopData();
