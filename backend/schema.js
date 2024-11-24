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
    id: { type: GraphQLString },
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
          name: { type: GraphQLString },
        },
        resolve: async (parent, args) => {
          const query = `SELECT * FROM users WHERE name ILIKE $1`;
          const values = [`%${args.name || ''}%`];
          const res = await pgPool.query(query, values);
          return res.rows;
        },
      },
      documents: {
        type: new GraphQLList(DocumentType),
        resolve: async () => {
          return await mongoDb.collection("documents").find().toArray();
        },
      },
    },
  });

  return new GraphQLSchema({
    query: RootQuery,
  });
};
