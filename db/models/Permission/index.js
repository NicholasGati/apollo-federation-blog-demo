const Model = require("../model.js");

class Permission extends Model {
  static get tableName() {
    return "permissions";
  }

  static get relationMappings() {
    const Role = require("../Role");
    return {
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: "permissions.permission",
          through: {
            from: "roles_permissions.permission",
            to: "roles_permissions.role",
          },
          to: "roles.role",
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["permission"],
      properties: {
        permission: { type: "string" },
      },
    };
  }
}

module.exports = Permission;
