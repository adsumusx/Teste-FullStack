import { DataSource } from "typeorm";
import { Field } from "../models/Field";
import { Fill } from "../models/Fill";

//Configurações do sqlite
export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Field, Fill],
});