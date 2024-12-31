import { RateLimiter, MINUTE } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

const rateLimiter = new RateLimiter(components.rateLimiter, {
  createDocument: { kind: "token bucket", rate: 5, period: MINUTE, capacity: 5 },
});

export async function limitCreateDocument(ctx: any, userId: any) {
  const { ok, retryAfter } = await rateLimiter.limit(ctx, "createDocument", { key: userId });
  if (!ok) {
    throw new Error(`Rate limit exceeded. Try again after ${retryAfter} seconds.`);
  }
}
