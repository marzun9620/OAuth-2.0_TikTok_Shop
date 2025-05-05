import { Effect, pipe } from "effect";
import { TikTok } from "../gateway/tiktok";

export const FetchShopData = pipe(
  Effect.flatMap(TikTok, (sdk) =>
    Effect.flatMap(
      Effect.suspend(() => sdk.getAccessToken),
      (token) =>
        Effect.flatMap(
          Effect.suspend(() => sdk.fetchShopData(token.access_token)),
          (shopData) =>
            Effect.succeed({
              access_token: token.access_token,
              refresh_token: token.refresh_token,
              expires_in: token.expires_in,
              expires_at: new Date(
                token.access_token_expires_at * 1000
              ).toISOString(),
              shop_data: shopData,
            })
        )
    )
  )
);
