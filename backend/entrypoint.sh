#!/bin/bash

echo "Waiting for databases to be ready..."
./wait-for-it.sh postgres:5432 -- echo "Postgres is up"
./wait-for-it.sh mongodb:27017 -- echo "MongoDB is up"

echo "Initializing MongoDB..."
node initMongo.js

echo "Starting the server..."
npm start
