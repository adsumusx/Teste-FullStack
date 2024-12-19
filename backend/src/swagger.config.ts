import { Options } from "swagger-jsdoc";

//Configurações do Swagger
const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentação da API", 
      version: "1.0.0",
      description: "API do meu sistema",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export default swaggerOptions;