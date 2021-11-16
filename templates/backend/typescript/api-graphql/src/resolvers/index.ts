import { buildSchema, NonEmptyArray } from "type-graphql";
import { readdirSync } from "fs";
export default (async () => {
  const resolvers = <NonEmptyArray<Function>>await Promise.all(
    readdirSync(__dirname)
      .filter((file) => file != "index.ts")
      .map(async (file) => {
        return (await import(`./${file}`)).default;
      })
  );
  
  return await buildSchema({
    resolvers,
    emitSchemaFile: true,
  });
})();
