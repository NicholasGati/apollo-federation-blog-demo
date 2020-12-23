const { gql } = require("apollo-server");

module.exports = gql`
  type Account @key(fields: "id") {
    id: ID!
    name: String
    email: String
    role: String
    password: String!
    _role: Role!
    posts: [Post!]
  }

  # So in order for Account to reference Post, we must add it to the Account typeDef here by referencing Post as @external
  extend type Post @key(fields: "id") {
    id: ID! @external
  }

  type Role {
    role: String
    permissions: [Permission!]!
  }

  type Permission {
    permission: String
  }

  extend type Query {
    account(id: ID!): Account
    accounts: [Account]
    viewer: Account!
  }

  extend type Mutation {
    login(email: String!, password: String!): String
    createAccount(
      email: String!
      password: String!
      name: String!
      role: String!
    ): Account
    updateAccount(
      id: ID!
      email: String
      name: String
      password: String
    ): Account
    deleteAccount(id: ID!): Int!
  }
`;
