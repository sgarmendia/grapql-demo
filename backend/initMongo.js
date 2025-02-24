import { MongoClient } from "mongodb";

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

    if (!existingDocs[0]?.content || !existingDocs[0]?.author) {
      console.log("Initializing MongoDB with sample data...");

      await documentsCollection.deleteMany({});
      
      // Insert initial data
      await documentsCollection.insertMany([
        { content: "Mongo Document 1 content",
          author: "Ainara"
        },
        { content: "Mongo Document 2 content",
          author: "Patricia"
        },
        { content: "Mongo Document 3 content",
          author: "Silvia"
        },
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
