const {createClient} = require('redis');

const redisClient = createClient({
    url:process.env.REDIS_URL || "redis://127.0.0.1:6379"
})

redisClient.on("error",(err)=>{
    console.log("Redis Client Error",err)
})

const connectRedis = async () =>{
    try{
        await redisClient.connect();
        console.log("Redis connected successfully")
    }
    catch(err){
        console.log("Redis connection failed", err)
    }
}

module.exports = {redisClient, connectRedis}