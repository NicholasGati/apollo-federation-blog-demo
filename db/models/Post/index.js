const Model = require("../model.js");

class Post extends Model {
  static get tableName() {
    return "posts";
  }

  static beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  static get relationMappings() {
    const Account = require("../Account");
    return {
      _author: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: "posts.author",
          to: "accounts.id",
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["author", "title", "content"],
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        content: { type: "text" },
        author: { type: "string" },
        created_at: { type: "string" },
      },
    };
  }
}

module.exports = Post;
