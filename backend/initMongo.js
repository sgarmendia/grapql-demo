const DATABASE = "demo";

export async function initMongo(client) {
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

    return db;
  } catch (err) {
    if (client) {
      await client.close();
    }
    console.error("Error initializing MongoDB:", err);
  }
}
