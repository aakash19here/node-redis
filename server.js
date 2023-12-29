const express = require("express");
const axios = require("axios").default;
const redis = require("./client");

const app = express();

app.get("/", async (req, res) => {
  const cachedValue = await redis.get("todos");

  if (cachedValue) return res.json(JSON.parse(cachedValue));

  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/todos"
  );

  await redis.set("todos", JSON.stringify(data));
  await redis.expire("todos", 20);

  return res.json(data);
});

app.listen(3001);
