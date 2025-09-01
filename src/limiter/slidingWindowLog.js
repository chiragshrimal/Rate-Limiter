import redis from "../config/redis.js";

// limit --> number of request
// windowSizeInSec --> size of the window in sec
function createSlidingWindowLimiter(limit, windowSizeInSec) {
  // key --> ip address of any request
  return async function isAllowed(key) {
    const now = Date.now();
    const minScore = now - windowSizeInSec * 1000;

    const pipeline = redis.multi();
    pipeline.zremrangebyscore(key, 0, minScore);
    pipeline.zadd(key, now, `${now}`);
    pipeline.zcard(key);
    pipeline.expire(key, windowSizeInSec);

    const results = await pipeline.exec();
    const count = results[2][1]; // actual cardinality

    console.log("count", count);

    return count <= limit;
  };
}

export default createSlidingWindowLimiter;
