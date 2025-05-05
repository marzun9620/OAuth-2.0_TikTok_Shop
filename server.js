const { getToken } = require("./getToken");
//const { getShopData } = require("./getShopData");

(async () => {
  try {
    const token = await getToken();
    console.log("Access Token:", token);
    //await getShopData();
  } catch (error) {
    //console.error("Error fetching token or shop data:", error.message);
  }
})();
