import connection from "./connection";

export const findAll = async () => {
  return connection("example").select("*");
};
