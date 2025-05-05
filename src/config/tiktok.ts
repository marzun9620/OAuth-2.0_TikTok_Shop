import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.APP_KEY || !process.env.APP_SECRET || !process.env.AUTH_CODE) {
  throw new Error(
    "Missing required environment variables. Please check your .env file."
  );
}
console.log(process.env.AUTH_CODE);


export const TikTokConfig = {
  appKey: process.env.APP_KEY,
  appSecret: process.env.APP_SECRET,
  authCode: process.env.AUTH_CODE,
};
