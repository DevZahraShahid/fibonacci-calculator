//File connects to REDIS, PG, Brokes info between the two
//and then Runs REACT Application
const keys = require("./keys");
const redis = require("redis");

// Express App Setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); //cross origin resource sharing
const app = express(); // handles HTTP Request to and fro the React Server

app.use(cors()); // makes requests among different domains - EXpress API and REact App
app.use(bodyParser.json()); // turns incoming request from React App and turns the body of post request to json value

//Postgres Client Setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

// REDIS Client Setup
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  redis_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

//Express route Handlers
app.get("/", (req, res) => {
  res.send("Hiiii");
});

//all the values that have ever been submitted to PG
app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");
  res.send(values.rows);
});

//all the values that have ever been submitted to our backend- REDIS
app.get("/values/current", async (req, res) => {
  redisClient.hGetAll("values", (err, values) => {
    res.send(values);
  });
});

// REACT -Index Submission
//recieves new values from the React App
app.post("/values", async (req, res) => {
  const index = req.body.index;

  redisClient.hSet("values", index, "NOthing YET!");
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);
  res.send({ working: true });
});

const port = process.env.port || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
