const uuidv4 = require("uuid").v4;
const path = require("path");
const db = require(path.resolve(__dirname, "../../db"));

module.exports = {
  Post: {
    async __resolveReference(object) {
      return await db.Post.query().findById(object.id);
    },
  },
  Query: {
    async posts() {
      return await db.Post.query().withGraphFetched("_author");
    },
    async post(parent, { id }) {
      return await db.Post.query().withGraphFetched("_author").findById(id);
    },
  },
  Mutation: {
    async createPost(parent, { author, title, content }) {
      const post = await db.Post.query().insertAndFetch({
        id: uuidv4(),
        author,
        title,
        content,
      });

      return post ? post : new Error("There was an error creating this post.");
    },
    async updatePost(parent, args) {
      if (!Object.prototype.hasOwnProperty.call(args, "id")) {
        return new Error("Cannot update post. Post not found.");
      }

      const post = await db.Post.query().findById(args.id);

      if (post === null) {
        return new Error("Post not found.");
      }

      const data = Object.keys(args).reduce((acc, k) => {
        if (["title", "content"].includes(k)) {
          acc[k] = args[k];
        }
        return acc;
      }, {});

      const updatedPost = await db.Post.query().patchAndFetchById(
        args.id,
        data
      );

      return updatedPost
        ? updatedPost
        : new Error("There was an error updating the post.");
    },
    async deletePost(parent, { id }) {
      return await db.Post.query().deleteById(id);
    },
  },
};
