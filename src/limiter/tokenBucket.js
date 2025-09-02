// tokenBucket.js
import redis from "./redisClient.js";

export const tokenBucketLimiter = (capacity, refillRatePerSec) => {
  return async (req, res, next) => {
    const key = `token:rate_limit:${req.ip}`;
    const now = Date.now();

    const bucket = await redis.hgetall(key);
    let tokens = bucket.tokens ? parseFloat(bucket.tokens) : capacity;
    let lastRefill = bucket.lastRefill ? parseInt(bucket.lastRefill) : now;

    const elapsed = (now - lastRefill) / 1000;
    tokens = Math.min(capacity, tokens + elapsed * refillRatePerSec);

    if (tokens < 1) {
      return res.status(429).json({ error: "Too many requests (token bucket)" });
    }

    tokens -= 1;
    await redis.hmset(key, "tokens", tokens, "lastRefill", now);
    await redis.expire(key, 60); // avoid unbounded growth

    next();
  };
};
