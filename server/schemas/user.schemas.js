const createUserSchema = {
  schema: {
    body: {
      type: "object",
      required: ["firstName", "lastName", "email", "password"],
      properties: {
        firstName: { type: "string" },
        lastName: { type: "string" },
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 6 },
      },
    },
  },
};

const loginSchema = {
  schema: {
    body: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 6 },
      },
    },
  },
};

module.exports = { createUserSchema, loginSchema };
