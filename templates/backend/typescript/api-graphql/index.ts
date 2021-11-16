import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import schema from "./src/resolvers";
import { app } from "./src/components";

(async () => {
  app.get("/", (req, res) => {
    res.redirect("/graphql");
  });
  const server = new ApolloServer({ schema: await schema });
  await server.start();
  server.applyMiddleware({ app });

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`server started on http://localhost:${port}/graphql`);
  });
})();
