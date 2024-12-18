import { DataSource } from "typeorm";
import { Field } from "../models/Field";
import { Fill } from "../models/Fill";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Field, Fill],
});