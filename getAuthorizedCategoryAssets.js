const axios = require("axios");
const {accessToken}=require("./getToken");
const {APP_KEY,APP_SECRET}=process.env;

function generateSign(params){
    const crypto=require("crypto");

    const sortedKeys=Object.keys(params).sort();
    const paramString=sortedKeys.map((key)=>`${key}${params[key]}`).join("");

    const signString=`${APP_SECRET}/authorization/202309/category_assets${paramString}${APP_SECRET}`;       

    const hmac=crypto.createHmac("sha256",APP_SECRET);
    hmac.update(signString);
    return hmac.digest("hex");
}

async function getAuthorizedCategoryAssets(){
    const timestamp=Math.floor(Date.now()/1000);

    const params={
        app_key:APP_KEY,
        sign:"",
        timestamp:timestamp,
    };

    params.sign=generateSign(params);

    try{
        const response=await axios.get("https://open-api.tiktokglobalshop.com/authorization/202309/category_assets",{
            params:params,  
            headers:{
                "x-tts-access-token":accessToken,
            },
        });

        console.log("Authorized category assets:",response.data);
        
    }
    catch(error){
        console.error("Error fetching authorized category assets:",error);
        throw error;
    }
}

getAuthorizedCategoryAssets();