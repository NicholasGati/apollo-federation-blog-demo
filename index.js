// Gateway API
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const cors = require("cors");
const expressJwt = require("express-jwt");
require("dotenv").config();

const port = 4000;
const app = express();

// Allow Cross-Origin_Resource-Sharing on allowed origins
const allowList = ["http://localhost:4000", "http://localhost:3000"];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowList.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS!"));
    }
  },
};

app.use(cors(corsOptions));
app.use(
  expressJwt({
    secret: process.env.SECRET_TOKEN,
    algorithms: ["HS256"],
    credentialsRequired: false,
  })
);

const gateway = new ApolloGateway({
  serviceList: [
    { name: "accounts", url: "http://localhost:4001" },
    { name: "posts", url: "http://localhost:4002" },
  ],
  buildService({ name, url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        request.http.headers.set(
          "user",
          context.user ? JSON.stringify(context.user) : null
        );
      },
    });
  },
});

const server = new ApolloServer({
  gateway,
  subscriptions: false, // subscriptions are not supported in current federation version
  introspection: false,
  context: ({ req }) => {
    const user = req.user || null;
    return { user };
  },
});

server.applyMiddleware({ app });

app.listen({ port }, () => {
  console.log(
    `Server listening on http://localhost:${port}${server.graphqlPath}`
  );
});
