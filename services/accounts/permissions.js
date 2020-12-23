const { and, or, rule, shield } = require("graphql-shield");

function getPermissions(user) {
  if (user && user["https://awesomeapi.com/graphql"]) {
    return user["https://awesomeapi.com/graphql"].permissions;
  }
  return [];
}

const isAuthenticated = rule()((parent, args, { user }) => {
  return user !== null;
});

// Checking for valid permissions

// Any Account
const canCreateAnyAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("create:any_account");
});

const canReadAnyAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("read:any_account");
});

const canUpdateAnyAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("update:any_account");
});

const canDeleteAnyAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("delete:any_account");
});

// Own Account
const canReadOwnAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("read:own_account");
});

const canUpdateOwnAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("update:own_account");
});

const canDeleteOwnAccount = rule()((parent, args, { user }) => {
  const userPermissions = getPermissions(user);
  return userPermissions.includes("delete:own_account");
});

const isReadingOwnAccount = rule()((parent, { id }, { user }) => {
  return user && user.sub === id;
});

// Enforcing RBAC on Accounts
module.exports = shield({
  Query: {
    account: or(and(canReadOwnAccount, isReadingOwnAccount), canReadAnyAccount),
    accounts: canReadAnyAccount,
    viewer: isAuthenticated,
  },
  Mutation: {
    createAccount: canCreateAnyAccount,
    updateAccount: or(
      and(canUpdateOwnAccount, isReadingOwnAccount),
      canUpdateAnyAccount
    ),
    deleteAccount: or(
      and(canDeleteOwnAccount, isReadingOwnAccount),
      canDeleteAnyAccount
    ),
  },
});
