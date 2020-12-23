const { gql } = require("apollo-server");

module.exports = gql`
  type Post @key(fields: "id") {
    id: ID!
    title: String
    content: String
    author: ID!
    _author: Account!
    created_at: String
  }

  # So in order for Post to reference Account, we must add it to the Post typeDef here by referencing Account as @external
  extend type Account @key(fields: "id") {
    id: ID! @external
  }

  extend type Query {
    posts: [Post]
    post(id: ID!): Post
  }

  extend type Mutation {
    createPost(author: String!, title: String!, content: String!): Post
    updatePost(id: String!, title: String, content: String): Post
    deletePost(id: String!): Int
  }
`;
