import express from "express";
import redis from "../config/redis.js";

import fixedWindowLimiter from "../limiter/fixedWindow.js";
import leakyBucketLimiter from "../limiter/leakyBucket.js";
import tokenBucketLimiter from "../limiter/tokenBucket.js";
import createSlidingWindowLimiter from "../limiter/slidingWindowLog.js";



const router = express.Router();

router.get("/redis",async(req,res)=>{
    const pong= await redis.ping();
    console.log("request come on /redis");
    res.json({
        message : `redis sent the message ${pong}`
    })
})

router.get("/sliding", createSlidingWindowLimiter(10, 5), (req, res) => {
    
  console.log("request come on /sliding");
  res.send("Sliding window OK");
});

router.get("/fixed", fixedWindowLimiter(10, 5), (req, res) => {
    console.log("request come on /fixed")
  res.send("Fixed window OK");
});

router.get("/token", tokenBucketLimiter(5, 1), (req, res) => {
  console.log("request come on /token");
  res.send("Token bucket OK");
});

router.get("/leaky", leakyBucketLimiter(5, 1), (req, res) => {
  console.log("request come on /leaky");  
  res.send("Leaky bucket OK");
});

export default router;
