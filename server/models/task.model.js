const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    priority: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Task = mongoose.model("Tasks", TaskSchema, "Tasks");

module.exports = Task;
