const Task = require("../models/task.model");
const { createTaskSchema } = require("../schemas/task.schemas");

module.exports = async function (fastify, opts) {
  fastify.get(
    "/tasks",
    { onRequest: [fastify.authenticate] },
    async function (request, reply) {
      try {
        const user = request.user._doc._id;

        const tasks = await Task.find({ userId: user });

        reply.status(200).send(tasks);
      } catch (error) {
        reply.send(error);
      }
    }
  );

  fastify.post(
    "/tasks",
    {
      onRequest: [fastify.authenticate],
      schema: createTaskSchema,
    },
    async function (request, reply) {
      try {
        const user = request.user._doc._id;

        const task = await Task.create({ ...request.body, userId: user });

        reply.status(201).send(task);
      } catch (error) {
        reply.send(error);
      }
    }
  );

  fastify.delete(
    "/tasks/:id",
    { onRequest: [fastify.authenticate] },
    async function (request, reply) {
      try {
        const id = request.params.id;

        const task = await Task.findByIdAndDelete(id);
        if (!task) throw fastify.httpErrors.notFound("Task Not Found");

        reply
          .status(200)
          .send({ message: "Task Deleted Successfully", task: task });
      } catch (error) {
        reply.send(error);
      }
    }
  );

  fastify.put(
    "/tasks/:id",
    { onRequest: [fastify.authenticate] },
    async function (request, reply) {
      try {
        const id = request.params.id;

        const task = await Task.findByIdAndUpdate(id, request.body, {
          new: true,
        });

        if (!task) throw fastify.httpErrors.notFound("Task Not Found");

        reply
          .status(200)
          .send({ message: "Task Updated Successfully", task: task });
      } catch (error) {
        reply.send(error);
      }
    }
  );
};
