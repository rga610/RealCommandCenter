import redis from "../lib/core-services/cache/redisService.js";  // Notice the `.js` import

async function testRedis() {
  console.log("🔄 Storing test key in Redis...");

  await redis.set("test_key", "Hello, Upstash Redis!");
  const value = await redis.get("test_key");

  console.log("✅ Redis is working! Value:", value);
}

testRedis();
