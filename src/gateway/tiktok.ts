import { Effect, Layer, Context, Logger, Schedule } from "effect";
import axios, { AxiosError } from "axios";
import { TikTokConfig } from "../config/tiktok";

interface TikTokToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  access_token_expires_at: number;
}

export class TikTokError {
  readonly _tag = "TikTokError";
  constructor(readonly message: string) {}
}

export interface TikTok {
  getAccessToken: Effect.Effect<TikTokToken, TikTokError>;
  refreshToken: (
    refreshToken: string
  ) => Effect.Effect<TikTokToken, TikTokError>;
  fetchShopData: (accessToken: string) => Effect.Effect<unknown, TikTokError>;
}

export const TikTok = Context.GenericTag<TikTok>("TikTok");

let tokenCache: TikTokToken | null = null;

function generateSign(params: Record<string, string | number>) {
  const { appSecret } = TikTokConfig;
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys.map((k) => `${k}${params[k]}`).join("");
  const strToSign = `${appSecret}/authorization/202309/shops${paramString}${appSecret}`;
  const hmac = require("crypto").createHmac("sha256", appSecret);
  hmac.update(strToSign);
  return hmac.digest("hex");
}

const implementation: TikTok = {
  getAccessToken: Effect.tryPromise({
    try: async () => {
      const { appKey, appSecret, authCode } = TikTokConfig;
      const url = `https://auth.tiktok-shops.com/api/v2/token/get?app_key=${appKey}&app_secret=${appSecret}&auth_code=${authCode}&grant_type=authorized_code`;
      console.log("Requesting token with URL:", url);
      const response = await axios.get(url);
      console.log("Token response:", JSON.stringify(response.data, null, 2));

      const data = response.data.data;

      const result: TikTokToken = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        access_token_expires_at: Date.now() + data.expires_in * 1000,
      };

      tokenCache = result;

      return result;
    },
    catch: (e: unknown) => {
      console.error("Token error details:", e);
      if (e instanceof AxiosError) {
        console.error("Axios error response:", e.response?.data);
        return new TikTokError(
          `Token error: ${e.response?.data?.message || e.message}`
        );
      }
      return new TikTokError("Unknown error occurred during token creation");
    },
  }),

  refreshToken: (refreshToken: string) =>
    Effect.tryPromise({
      try: async () => {
        const { appKey, appSecret } = TikTokConfig;
        console.log(TikTokConfig);
        const url = `https://auth.tiktok-shops.com/api/v2/token/refresh?app_key=${appKey}&app_secret=${appSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`;
        console.log("Refreshing token with URL:", url);
        const response = await axios.get(url);
        console.log(
          "Refresh response:",
          JSON.stringify(response.data, null, 2)
        );

        const data = response.data.data;
        console.log(response.data);
        const result: TikTokToken = {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_in: data.expires_in,
          access_token_expires_at: Date.now() + data.expires_in * 1000,
        };

        tokenCache = result;

        return result;
      },
      catch: (e: unknown) => {
        console.error("Refresh error details:", e);
        if (e instanceof AxiosError) {
          console.error("Axios error response:", e.response?.data);
          return new TikTokError(
            `Refresh error: ${e.response?.data?.message || e.message}`
          );
        }
        return new TikTokError("Unknown error occurred during token refresh");
      },
    }),

  fetchShopData: (accessToken: string) =>
    Effect.tryPromise({
      try: async () => {
        const timestamp = Math.floor(Date.now() / 1000);

        const params = {
          app_key: TikTokConfig.appKey,
          timestamp,
        };

        const sign = generateSign(params);

        const response = await axios.get(
          "https://open-api.tiktokglobalshop.com/authorization/202309/shops",
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

        return response.data;
      },
      catch: (e: unknown) => {
        if (e instanceof AxiosError) {
          return new TikTokError(
            `API error: ${e.response?.data?.message || e.message}`
          );
        }
        return new TikTokError("Unknown error occurred during API call");
      },
    }),
};

export const TikTokLive = Layer.succeed(TikTok, implementation);
