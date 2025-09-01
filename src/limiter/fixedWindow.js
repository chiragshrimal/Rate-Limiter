// fixedWindow.js
import redis from "../config/redis.js";

export const fixedWindowLimiter = (maxRequests, windowSizeInSec) => {
  return async (req, res, next) => {
    const key = `fixed:rate_limit:${req.ip}`;
    const currentWindow = Math.floor(Date.now() / 1000 / windowSizeInSec);

    const windowKey = `${key}:${currentWindow}`;
    const count = await redis.incr(windowKey);

    if (count === 1) {
      await redis.expire(windowKey, windowSizeInSec);
    }

    if (count > maxRequests) {
      return res.status(429).json({ error: "Too many requests (fixed)" });
    }
    next();
  };
};


export default  fixedWindowLimiter;