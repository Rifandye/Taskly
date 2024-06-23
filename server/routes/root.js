"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    try {
      const userCollection = this.mongo.db.collection("Users"); // Accessing database via this.mongo.db
      const users = await userCollection.find().toArray(); //

      reply.send(users);
    } catch (error) {
      console.log(error);
    }
  });
};
