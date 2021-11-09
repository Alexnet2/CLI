import moment from "moment";
import { appendFileSync } from "fs";
export default class ExampleException extends Error {
  constructor(message: string) {
    super(message);
    appendFileSync(
      //TODO development the root path
      "",
      // `${root_path}/src/tmp/logs/process_error.log`,
      `${message}=>${moment().format("YYYY-MM-DD HH:mm:ss")}\n`
    );
    this.name = "Example =>";
    this.stack = "";
  }
}
