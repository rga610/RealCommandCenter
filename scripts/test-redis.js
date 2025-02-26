import redis from "../lib/redis.js";  // Notice the `.js` import

async function testRedis() {
  console.log("🔄 Storing test key in Redis...");

  await redis.set("test_key", "Hello, Upstash Redis!");
  const value = await redis.get("test_key");

  console.log("✅ Redis is working! Value:", value);
}

testRedis();
