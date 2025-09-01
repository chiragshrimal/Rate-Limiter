import express from "express"
import redis from "../config/redis.js";

import rateLimiterMiddleware from "../middlewares/rateLimiter.js";

const router= express.Router();

// rateLimiterMiddleware function  will  take two param 1. limit  2. windowsize in sec
router.get("/api/data",rateLimiterMiddleware(5,10),(req,res)=>{
    
    console.log("request comming on the /api/data router");

    res.json({
        message : "take your data which you have required"
    })
})

router.get("/api/redis",rateLimiterMiddleware(5,10),async(req,res)=>{

    const pong = await redis.ping();
    res.json({
        message : `message from the redis is ${pong}`
    })
})

export default router;