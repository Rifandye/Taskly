"use strict";

const User = require("../models/user.model");

module.exports = async function (fastify, opts) {
  fastify.get("/auth/users", async function (request, reply) {
    try {
      const users = await User.find();

      reply.status(200).send(users);
    } catch (error) {
      console.log(error);
    }
  });

  fastify.post("/auth/register", async function (request, reply) {
    try {
      const { firstName, lastName, email, password } = request.body;

      if (!firstName)
        throw fastify.httpErrors.badRequest("First Name Required");

      if (!lastName) throw fastify.httpErrors.badRequest("Last Name Required");

      if (!email) throw fastify.httpErrors.badRequest("Email Required");

      if (!password) throw fastify.httpErrors.badRequest("Password Required");

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

  fastify.put("/auth/user/:id", async function (request, reply) {
    try {
      const id = request.params.id;
      let updatedData = { ...request.body };

      if (updatedData.password) {
        updatedData.password = await fastify.bcrypt.hash(updatedData.password);
      }

      const user = await User.findByIdAndUpdate(id, updatedData, {
        new: true,
      });

      if (!user) throw fastify.httpErrors.notFound("User Not Found");

      reply.status(200).send(user);
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.delete("/auth/user/:id", async function (request, reply) {
    try {
      const id = request.params.id;

      const user = await User.findByIdAndDelete(id);

      if (!user) throw fastify.httpErrors.notFound("User Not Found");

      reply
        .status(200)
        .send({ message: "User Sucessfully Deleted", user: user });
    } catch (error) {
      reply.send(error);
    }
  });
};
