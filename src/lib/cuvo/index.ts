import "server-only";
import type { CuvoClient } from "./types";
import { mockClient } from "./mock";
import { liveClient } from "./live";
export * from "./types";

/** `CUVO_MODE=live` with `CUVO_API_KEY` talks to api.cuvo.co (test or live key); anything else plays the sandbox locally. */
export function cuvo(): CuvoClient {
  const key = process.env.CUVO_API_KEY;
  return process.env.CUVO_MODE === "live" && key ? liveClient(key) : mockClient;
}
export const cuvoMode = () => (process.env.CUVO_MODE === "live" && process.env.CUVO_API_KEY ? (process.env.CUVO_API_KEY.startsWith("cuvo_sk_test_") ? "sandbox" : "live") : "mock");
