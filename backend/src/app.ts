import express from "express";
import cors from "cors"; 
import router from "./routes";
import { AppDataSource } from "./database/data-source";

const app = express();

app.use(cors()); 

app.use(express.json());

app.use(router);

//Inicializa o banco de dados
AppDataSource.initialize()
  .then(() => {
    console.log("Banco de dados Conectado!");
  })
  .catch((err) => {
    console.error("Erro na conexão com o Banco de dados:", err);
    process.exit(1);
  });

export default app;