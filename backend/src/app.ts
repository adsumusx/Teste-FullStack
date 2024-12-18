import express from "express";
import cors from "cors"; 
import router from "./routes";
import { AppDataSource } from "./database/data-source";

const app = express();

app.use(cors()); 

app.use(express.json());

app.use(router);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });

export default app;