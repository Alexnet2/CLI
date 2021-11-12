import connection from "@connection";
import { Test } from "@entity";

export const test = (async () => (await connection).getRepository(Test))();
