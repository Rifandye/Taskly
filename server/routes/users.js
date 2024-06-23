"use strict";

const User = require("../models/user.model");
const { createUserSchema, loginSchema } = require("../schemas/user.schemas");

module.exports = async function (fastify, opts) {
  fastify.get("/auth/users", async function (request, reply) {
    try {
      const users = await User.find();

      reply.status(200).send(users);
    } catch (error) {
      console.log(error);
    }
  });

  fastify.post(
    "/auth/register",
    createUserSchema,
    async function (request, reply) {
      try {
        const { firstName, lastName, email, password } = request.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
          throw fastify.httpErrors.conflict("User already registered");

        const hashedPassword = await fastify.bcrypt.hash(password);

        const user = await User.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
        });

        reply.status(201).send(user);
      } catch (error) {
        console.log(error);
        reply.send(error);
      }
    }
  );

  fastify.post("/auth/login", loginSchema, async function (request, reply) {
    try {
      const { email, password } = request.body;

      const user = await User.findOne({ email });
      if (!user) throw fastify.httpErrors.badRequest("User Not Registered");

      const comparedPass = fastify.bcrypt.compare(password, user.password);
      if (!comparedPass)
        throw fastify.httpErrors.badRequest("Invalid Password");

      const access_token = fastify.jwt.sign(user);

      reply.status(200).send({ access_token });
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.get("/auth/user/:id", async function (request, reply) {
    try {
      const id = request.params.id;

      const user = await User.findById(id);

      if (!user) throw fastify.httpErrors.notFound("User Not Found");

      reply.status(200).send(user);
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.put(
    "/auth/user/:id",
    { onRequest: [fastify.authenticate] },
    async function (request, reply) {
      try {
        const id = request.params.id;

        const userWhoLoggedIn = request.user._doc;

        if (id !== userWhoLoggedIn._id.toString()) {
          throw fastify.httpErrors.forbidden("Unauthorized to update user");
        }

        let updatedData = { ...request.body };

        if (updatedData.password) {
          updatedData.password = await fastify.bcrypt.hash(
            updatedData.password
          );
        }

        const user = await User.findByIdAndUpdate(id, updatedData, {
          new: true,
        });

        if (!user) throw fastify.httpErrors.notFound("User Not Found");

        reply.status(200).send(user);
      } catch (error) {
        reply.send(error);
      }
    }
  );

  fastify.delete(
    "/auth/user/:id",
    { onRequest: [fastify.authenticate] },
    async function (request, reply) {
      try {
        const id = request.params.id;

        const userWhoLoggedIn = request.user._doc;

        if (id !== userWhoLoggedIn._id.toString()) {
          throw fastify.httpErrors.forbidden("Unauthorized to delete user");
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) throw fastify.httpErrors.notFound("User Not Found");

        reply
          .status(200)
          .send({ message: "User Deleted Successfully", user: user });
      } catch (error) {
        reply.send(error);
      }
    }
  );
};
