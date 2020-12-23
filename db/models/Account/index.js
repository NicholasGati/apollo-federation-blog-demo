const Model = require("../model.js");

class Account extends Model {
  static get tableName() {
    return "accounts";
  }

  // will setup permissions here
  static get relationMappings() {
    const Role = require("../Role");
    const Post = require("../Post");
    return {
      _role: {
        relation: Model.HasOneRelation,
        modelClass: Role,
        join: {
          from: "accounts.role",
          to: "roles.role",
        },
      },
      posts: {
        relation: Model.HasManyRelation,
        modelClass: Post,
        join: {
          from: "accounts.id",
          to: "posts.author",
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["id", "email", "role"],
      properties: {
        id: { type: "string" },
        email: { type: "string" },
        name: { type: "string" },
        role: { type: "string" },
      },
    };
  }
}

module.exports = Account;
