
// it is like a client which help talk to redis
import Redis from "ioredis";

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379
});

export default redis;