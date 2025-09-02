// leakyBucket.js
import redis from "../config/redis";

export const leakyBucketLimiter = (capacity, leakRatePerSec) => {
  return async (req, res, next) => {
    const key = `leaky:rate_limit:${req.ip}`;
    const now = Date.now();

    const bucket = await redis.hgetall(key);
    let water = bucket.water ? parseFloat(bucket.water) : 0;
    let lastUpdate = bucket.lastUpdate ? parseInt(bucket.lastUpdate) : now;

    const elapsed = (now - lastUpdate) / 1000;
    water = Math.max(0, water - elapsed * leakRatePerSec);

    if (water >= capacity) {
      return res.status(429).json({ error: "Too many requests (leaky bucket)" });
    }

    water += 1;
    await redis.hmset(key, "water", water, "lastUpdate", now);
    await redis.expire(key, 60);

    next();
  };
};


export default leakyBucketLimiter;