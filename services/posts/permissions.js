const { and, or, rule, shield } = require("graphql-shield");
const path = require("path");
const db = require(path.resolve(__dirname, "../../db"));

function getPermissions(user) {
  if (user && user["https://awesomeapi.com/graphql"]) {
    return user["https://awesomeapi.com/graphql"].permissions;
  }
  return [];
}

// Own Posts
const canReadOwnPost = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("read:own_post");
});

const isReadingOwnPost = rule()(async (parent, { id }, { user }) => {
  const post = await db.Post.query().findById(id);
  return user.sub === post.author;
});

const canCreateOwnPost = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("create:own_post");
});

const canUpdateOwnPost = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("update:own_post");
});

const canDeleteOwnPost = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("delete:own_post");
});

const isCreatingOwnPost = rule()((parent, { author }, { user }) => {
  return author === user.sub;
});

// Any Posts
const canReadAnyPost = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("read:any_post");
});

const canCreateAnyPost = rule()((parent, { author }, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("create:any_post");
});

const canUpdateAnyPost = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("update:any_post");
});

const canDeleteAnyPost = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("delete:any_post");
});

// Enforcing RBAC on Accounts
module.exports = shield({
  Query: {
    post: or(and(canReadOwnPost, isReadingOwnPost), canReadAnyPost),
    posts: canReadAnyPost,
  },
  Mutation: {
    createPost: or(and(canCreateOwnPost, isCreatingOwnPost), canCreateAnyPost),
    updatePost: or(and(canUpdateOwnPost, isReadingOwnPost), canUpdateAnyPost),
    deletePost: or(and(canDeleteOwnPost, isReadingOwnPost), canDeleteAnyPost),
  },
});
