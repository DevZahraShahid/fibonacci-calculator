// primary logic for connecting to Redis, watching indices
// and calculating fib value

const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,

  // asks Redis server to reconnect after every 1 sec
  // if it loses connection
  redis_strategy: () => 1000,
});

//client duplicated so that when a client is listening/subscribing/publishing on REdis
// we need a different connection for serving other purpose
const sub = redisClient.duplicate();

// fib sequence - recursion
function fib(ind) {
  if (ind < 2) return 1;
  return fib(ind - 1) + fib(ind - 2);
}

// anytime we get a new message;
// a new indices in redis then this callback func runs
// which calculates the fib value of that function and
// adds it using hash set where key is index and value is fib value

sub.on("message", (channel, message) => {
  redisClient.hSet("values", message, fib(parseInt(message)));
});

// console.log("okay");
