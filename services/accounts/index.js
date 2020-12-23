const { ApolloServer } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { applyMiddleware } = require("graphql-middleware");
const permissions = require("./permissions");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

const server = new ApolloServer({
  schema: applyMiddleware(
    buildFederatedSchema([{ typeDefs, resolvers }]),
    permissions
  ),
  context: ({ req }) => {
    const user = req.headers.user ? JSON.parse(req.headers.user) : null;
    return { user };
  },
});

const port = 4001;
server.listen({ port }).then(({ url }) => {
  console.log(`Accounts Service listening on port: ${port}`);
});

// {
//   "Authorization": "Bearer "
// }
