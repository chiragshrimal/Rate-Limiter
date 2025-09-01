import createSlidingWindowLimiter from "../limiter/slidingWindowLog.js";

function rateLimiterMiddleware(limit, windowSizeInSec) {
    // this createSlideingWindowLimiter return function isAllowed
  const limiter = createSlidingWindowLimiter(limit, windowSizeInSec);

  return async (req, res, next) => {
    const key = `rate_limit:${req.ip}`;

    // checking that this request  can forward  next or not 
    const allowed = await limiter(key);

    if (!allowed) {
      return res.status(429).json({
        error: "Too many requests. Please try again later."
      });
    }

    next();
  };
}

export default rateLimiterMiddleware;
