//Entrypoint of the backend api

import { app } from "@config";
import { config } from "dotenv";
import {test} from "@repository";
config();
app.get("/", async (req, res) => {
    res.send(await (await test).find());
});
const port = process.env.API_PORT || 3010;
app.listen(port, () => {
  console.log(`Listening on Port ${port}`);
});
