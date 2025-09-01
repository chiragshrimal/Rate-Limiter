import express from "express"
import redis from "../config/redis.js";

import rateLimiterMiddleware from "../middlewares/rateLimiter.js";
import fixedWindowLimiter from "../limiter/fixedWindow.js";

const router= express.Router();

// rateLimiterMiddleware function  will  take two param 1. limit  2. windowsize in sec
router.get("/api/slidingWindow",rateLimiterMiddleware(5,10),(req,res)=>{
    
    console.log("request comming on the /api/data router");

    res.json({
        message : "take your data which you have required"
    })
})

router.get("/api/fixedWindow",fixedWindowLimiter(5,10), (req,res)=>{
    
    console.log("request comming from /api/fixedWindow");

    res.json({
        message : "success in fixedWindow"
    })
})


router.get("/api/redis",rateLimiterMiddleware(5,10),async(req,res)=>{

    const pong = await redis.ping();
    res.json({
        message : `message from the redis is ${pong}`
    })
})

export default router;