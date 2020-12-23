const uuidv4 = require("uuid").v4;
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcrypt");
const db = require(path.resolve(__dirname, "../../db"));
require("dotenv").config();

async function hashPassword(plaintextPassword) {
  const saltRounds = 10;
  return await bcrypt.hash(plaintextPassword, saltRounds);
}

async function passwordValid(input, hash) {
  return await bcrypt.compare(input, hash);
}

module.exports = {
  Account: {
    async __resolveReference(object) {
      return await db.Account.query()
        .withGraphFetched("[posts, _role.[permissions]]")
        .findById(object.id);
    },
  },
  Query: {
    async account(parent, { id }) {
      return await db.Account.query()
        .withGraphFetched("[posts, _role.[permissions]]")
        .findById(id);
    },
    async accounts() {
      return await db.Account.query().withGraphFetched(
        "[posts, _role.[permissions]]"
      );
    },
    async viewer(parent, args, { user }) {
      return await db.Account.query()
        .withGraphFetched("[posts, _role.[permissions]]")
        .findById(user.sub); // sub is from the JWT meaning `subject`
    },
  },
  Mutation: {
    async login(parent, { email, password }) {
      const account = await db.Account.query()
        .withGraphFetched("[posts, _role.[permissions]]")
        .findOne("email", email);

      if (!account) {
        return new Error("There is no account with this email.");
      }

      if (!(await passwordValid(password, account.password))) {
        return new Error("Password does not match.");
      }

      const _permissions = account._role.permissions.map((p) => p.permission);

      // expiresIn: Default numerical value is in seconds. Default string number value is in milliseconds.
      return jwt.sign(
        {
          "https://awesomeapi.com/graphql": {
            role: account.role,
            permissions: _permissions,
          },
        },
        process.env.SECRET_TOKEN,
        { algorithm: "HS256", subject: account.id, expiresIn: "1d" }
      );
    },
    async createAccount(parent, { email, password, name, role }) {
      const existingAccount = await db.Account.query().findOne("email", email);

      if (existingAccount != null) {
        return new Error("This email is already in use.");
      }

      const newAccount = await db.Account.query().insertAndFetch({
        id: uuidv4(),
        password: await hashPassword(password),
        email,
        name,
        role,
      });

      return newAccount
        ? newAccount
        : new Error("There was an error creating the account.");
    },
    async updateAccount(parent, args) {
      if (!Object.prototype.hasOwnProperty.call(args, "id")) {
        return new Error("Cannot update account. ID not present.");
      }

      const account = await db.Account.query().findById(args.id);

      if (account === null) {
        return new Error("Account not found.");
      }

      const data = Object.keys(args).reduce((acc, cur) => {
        if (cur === "password") {
          acc[cur] = hashPassword(args[cur]);
        }

        if (cur === "email" || cur === "name") {
          acc[cur] = args[cur];
        }

        return acc;
      }, {});

      const patchedAccount = await db.Account.query().patchAndFetchById(
        args.id,
        data
      );

      return patchedAccount
        ? patchedAccount
        : new Error("There was an error while updating the account.");
    },
    async deleteAccount(parent, { id }) {
      return await db.Account.query().deleteById(id);
    },
  },
};
