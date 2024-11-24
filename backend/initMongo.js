const { MongoClient } = require("mongodb");

const MONGO_URI = "mongodb://mongodb:27017";
const DATABASE = "demo";

async function initMongo() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DATABASE);

    const documentsCollection = db.collection("documents");

    // Check if the collection already has the data
    const existingDocs = await documentsCollection.find({}).toArray();

    if (existingDocs.length === 0) {
      console.log("Initializing MongoDB with sample data...");
      
      // Insert initial data
      await documentsCollection.insertMany([
        { content: "Document 1" },
        { content: "Document 2" },
        { content: "Document 3" },
      ]);

      console.log("MongoDB initialized successfully.");
    } else {
      console.log("MongoDB already initialized. Skipping data insertion.");
    }
  } catch (err) {
    console.error("Error initializing MongoDB:", err);
  } finally {
    await client.close();
  }
}

initMongo();
