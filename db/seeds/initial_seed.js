exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await knex("accounts").del();
  await knex("accounts").insert([
    {
      id: "66397e93-0f67-4777-bc2a-5b9bf2d503bb",
      email: "nicholas@gmail.com",
      name: "nicholas",
      password: "$2b$10$d1f9R92he8KjFFZdbbCXwO2FOsAGS7LpcycnnmaN4OqBG4wPN2iCy",
      role: "admin",
    },
    {
      id: "a326e563-69a9-47e3-8453-fa1663c10b2c",
      email: "manisha@gmail.com",
      name: "manisha",
      password: "$2b$10$d1f9R92he8KjFFZdbbCXwO2FOsAGS7LpcycnnmaN4OqBG4wPN2iCy",
      role: "author",
    },
    {
      id: "6f14d7a7-7e24-4665-b675-46996519c358",
      email: "marie@gmail.com",
      name: "marie",
      password: "$2b$10$d1f9R92he8KjFFZdbbCXwO2FOsAGS7LpcycnnmaN4OqBG4wPN2iCy",
      role: "subscriber",
    },
    {
      id: "3565143f-2aa5-47c8-b249-e2fe8440f8c6",
      email: "jaime@gmail.com",
      name: "jaime",
      password: "$2b$10$d1f9R92he8KjFFZdbbCXwO2FOsAGS7LpcycnnmaN4OqBG4wPN2iCy",
      role: "subscriber",
    },
  ]);

  await knex("roles").del();
  await knex("roles").insert([
    { role: "admin" },
    { role: "author" },
    { role: "subscriber" },
  ]);

  await knex("permissions").del();
  await knex("permissions").insert([
    { permission: "create:any_account" },
    { permission: "read:any_account" },
    { permission: "read:own_account" },
    { permission: "update:any_account" },
    { permission: "update:own_account" },
    { permission: "delete:any_account" },
    { permission: "delete:own_account" },

    { permission: "create:own_post" },
    { permission: "read:own_post" },
    { permission: "read:any_post" },
    { permission: "update:own_post" },
    { permission: "update:any_post" },
    { permission: "delete:own_post" },
    { permission: "delete:any_post" },
  ]);

  await knex("roles_permissions").del();
  await knex("roles_permissions").insert([
    { role: "admin", permission: "create:any_account" },
    { role: "admin", permission: "read:any_account" },
    { role: "admin", permission: "update:any_account" },
    { role: "admin", permission: "delete:any_account" },
    { role: "admin", permission: "create:own_post" },
    { role: "admin", permission: "read:any_post" },
    { role: "admin", permission: "update:own_post" },
    { role: "admin", permission: "delete:any_post" },

    { role: "author", permission: "create:own_post" },
    { role: "author", permission: "read:any_post" },
    { role: "author", permission: "update:own_post" },
    { role: "author", permission: "delete:own_post" },
    { role: "author", permission: "read:own_account" },
    { role: "author", permission: "update:own_account" },
    { role: "author", permission: "delete:own_account" },

    { role: "subscriber", permission: "read:own_account" },
    { role: "subscriber", permission: "update:own_account" },
    { role: "subscriber", permission: "delete:own_account" },
    { role: "subscriber", permission: "read:any_post" },
  ]);

  // Posts
  await knex("posts").insert([
    {
      id: "4883ba92-58d2-47f1-b237-9eb2615cfeb5",
      title: "My First Post",
      content: "Hello World!",
      author: "66397e93-0f67-4777-bc2a-5b9bf2d503bb",
    },
    {
      id: "1b9e908d-5c80-450c-9a92-dcf54995d2df",
      title: "My Second Post",
      content: "Hello World again! This is wonderful! I created a second post!",
      author: "66397e93-0f67-4777-bc2a-5b9bf2d503bb",
    },
  ]);
};
