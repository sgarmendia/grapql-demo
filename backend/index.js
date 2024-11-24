const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const { MongoClient } = require("mongodb");
const schema = require("./schema");

const app = express();

// PostgreSQL
const pgPool = new Pool({
  user: "user",
  host: "postgres",
  database: "demo",
  password: "password",
  port: 5432,
});

// MongoDB
const mongoClient = new MongoClient("mongodb://mongodb:27017");

async function startServer() {
  await mongoClient.connect();
  const mongoDb = mongoClient.db("demo");

  const server = new ApolloServer({
    schema: schema(pgPool, mongoDb),
  });

  await server.start();
  app.use(bodyParser.json());
  app.use("/graphql", expressMiddleware(server));
  app.listen(4000, () => console.log("GraphQL Server running on http://localhost:4000/graphql"));
}

startServer().catch(err => console.error(err));
