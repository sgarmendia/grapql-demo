const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} = require("graphql");

// Define User Type (Postgres)
const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

// Define Document Type (MongoDB)
const DocumentType = new GraphQLObjectType({
  name: "Document",
  fields: {
    id: { type: GraphQLID },
    author: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

// Define Queries and Mutations
module.exports = (pgPool, mongoDb) => {
  // Root Query
  const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      users: {
        type: new GraphQLList(UserType),
        args: {
          names: { type: new GraphQLList(GraphQLString) },
        },
        resolve: async (parent, args) => {
          if (!args.names || args.names.length === 0) {
            const query = `SELECT * FROM users`;
            const res = await pgPool.query(query);
            return res.rows;
          }
          const placeholders = args.names.map((_, index) => `$${index + 1}`).join(", ");
          const query = `SELECT * FROM users WHERE name IN (${placeholders})`;
          const res = await pgPool.query(query, args.names);
          return res.rows;
        },
      },
      documents: {
        type: new GraphQLList(DocumentType),
        args: {
          author: { type: GraphQLString },
          content: { type: GraphQLString },
        },
        resolve: async (parent, args) => {
          const filter = {};
          if (args.author) filter.author = args.author;
          if (args.content) filter.content = { $regex: args.content, $options: "i" };
          return await mongoDb.collection("documents").find(filter).toArray();
        },
      },
    },
  });

  // Mutation
  const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
      // Add a User (Postgres)
      addUser: {
        type: UserType,
        args: {
          name: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, args) => {
          const query = `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`;
          const values = [args.name, args.email];
          const res = await pgPool.query(query, values);
          return res.rows[0];
        },
      },
      // Update a User (Postgres)
      updateUser: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          name: { type: GraphQLString },
          email: { type: GraphQLString },
        },
        resolve: async (parent, args) => {
          const fields = [];
          const values = [args.id];
          if (args.name) {
            fields.push(`name = $${fields.length + 2}`);
            values.push(args.name);
          }
          if (args.email) {
            fields.push(`email = $${fields.length + 2}`);
            values.push(args.email);
          }
          const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $1 RETURNING *`;
          const res = await pgPool.query(query, values);
          return res.rows[0];
        },
      },
      // Delete a User (Postgres)
      deleteUser: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (parent, args) => {
          const query = `DELETE FROM users WHERE id = $1 RETURNING *`;
          const res = await pgPool.query(query, [args.id]);
          return res.rows[0];
        },
      },
      // Add a Document (MongoDB)
      addDocument: {
        type: DocumentType,
        args: {
          author: { type: new GraphQLNonNull(GraphQLString) },
          content: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, args) => {
          const result = await mongoDb.collection("documents").insertOne({
            author: args.author,
            content: args.content,
          });
          return { id: result.insertedId, ...args };
        },
      },
      // Update a Document (MongoDB)
      updateDocument: {
        type: DocumentType,
        args: {
          author: { type: GraphQLString },
          content: { type: GraphQLString },
        },
        resolve: async (parent, args) => {
          const filter = { author: args.author };
          const update = { $set: {} };
          if (args.author) update.$set.author = args.author;
          if (args.content) update.$set.content = args.content;

          const result = await mongoDb
            .collection("documents")
            .findOneAndUpdate(filter, update, { returnDocument: "after" });

          return result.value;
        },
      },
      // Delete a Document (MongoDB)
      deleteDocument: {
        type: DocumentType,
        args: {
          author: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (parent, args) => {
          const filter = { author: args.author };
          const result = await mongoDb.collection("documents").findOneAndDelete(filter);
          return result.value;
        },
      },
    },
  });

  // Return Schema
  return new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
  });
};
