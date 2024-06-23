const createTaskSchema = {
  body: {
    type: "object",
    required: ["name", "status", "deadline", "priority", "category"],
    properties: {
      name: { type: "string" },
      status: { type: "string" },
      deadline: { type: "string", format: "date-time" },
      priority: { type: "string" },
      category: { type: "string" },
    },
  },
};

module.exports = { createTaskSchema };
