const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList } = require("graphql");

// Define User Type (Postgres)
const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

// Define Document Type (MongoDB)
const DocumentType = new GraphQLObjectType({
  name: "Document",
  fields: {
    author: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

// Define Queries
module.exports = (pgPool, mongoDb) => {
  const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      users: {
        type: new GraphQLList(UserType),
        args: {
          names: { type: new GraphQLList(GraphQLString) }, // Accept an array of names
        },
        resolve: async (parent, args) => {
          if (!args.names || args.names.length === 0) {
            // Fetch all users if no names are provided
            const query = `SELECT * FROM users`;
            const res = await pgPool.query(query);
            return res.rows;
          }

          // Dynamically construct the IN clause for filtering
          const placeholders = args.names.map((_, index) => `$${index + 1}`).join(", ");
          const query = `SELECT * FROM users WHERE name IN (${placeholders})`;
          const res = await pgPool.query(query, args.names);
          return res.rows;
        },
      },
      documents: {
        type: new GraphQLList(DocumentType),
        args: {
          author: { type: GraphQLString }, // Filter by author
          content: { type: GraphQLString }, // Optional filter by content
        },
        resolve: async (parent, args) => {
          const filter = {};

          if (args.author) {
            filter.author = args.author;
          }
          if (args.content) {
            filter.content = { $regex: args.content, $options: "i" }; // Case-insensitive regex match
          }

          return await mongoDb.collection("documents").find(filter).toArray();
        },
      },
    },
  });

  return new GraphQLSchema({
    query: RootQuery,
  });
};
