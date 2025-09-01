import express from "express"
import redis from "../config/redis.js";

const router= express.Router();


router.get("/api/data", (req,res)=>{

    console.log("request comming on the /api/data router");

    res.json({
        message : "take your data which you have required"
    })
})

router.get("/api/redis",async(req,res)=>{

    const pong = await redis.ping();
    res.json({
        message : `message from the redis is ${pong}`
    })
})

export default router;