import { Effect, pipe, Layer, Console, Logger, Runtime } from "effect";
import { FetchShopData } from "./usecase/fetchShopData";
import { TikTokLive } from "./gateway/tiktok";

pipe(
  FetchShopData,
  Effect.tap(Console.log),
  Effect.provide(TikTokLive),
  Effect.catchAll((e) => Console.error("❌ Error", e)),
  Effect.runPromise
);
