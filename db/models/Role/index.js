const Model = require("../model");

class Role extends Model {
  static get tableName() {
    return "roles";
  }

  static get relationMappings() {
    // https://vincit.github.io/objection.js/guide/relations.html#examples
    const Permission = require("../Permission");
    return {
      permissions: {
        relation: Model.ManyToManyRelation,
        modelClass: Permission,
        join: {
          from: "roles.role",
          through: {
            from: "roles_permissions.role",
            to: "roles_permissions.permission",
          },
          to: "permissions.permission",
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["role"],
      properties: {
        role: { type: "string" },
      },
    };
  }
}

module.exports = Role;
