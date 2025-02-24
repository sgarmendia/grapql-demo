import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bp from "body-parser";
import pg from "pg";
import { MongoClient } from "mongodb";
import schema from "./schema.js";

const app = express();

// PostgreSQL
const { Pool } = pg;

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
  app.use(bp.json());
  app.use("/graphql", expressMiddleware(server));
  app.listen(4000, () => console.log("GraphQL Server running on http://localhost:4000/graphql"));
}

startServer().catch(err => console.error(err));
