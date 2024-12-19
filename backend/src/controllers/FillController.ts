import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Fill } from "../models/Fill";
import { Field } from "../models/Field";
import { z } from "zod";
import { isNumberObject } from "util/types";

const fillSchema = z.object({
  fieldId: z.string().uuid(),
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.date()
  ]),
  isRequired: z.boolean(),
}).refine(data => {

  return true;
}, {
  message: "Validação de preenchimento falhou"
});

//Função para criar um novo preenchimento
export const createFill = async (req: Request, res: Response) => {
  try {

    const body = fillSchema.parse(req.body);

    const fillRepo = AppDataSource.getRepository(Fill);
    const fieldRepo = AppDataSource.getRepository(Field);

    const field = await fieldRepo.findOneBy({ id: body.fieldId });
    if (!field) {
      return res.status(400).json({ error: "Campo não encontrado!" });
    }

    let parsedValue: string | number | boolean | Date = body.value;
    let valueForQuery: string;
    //Verificar o tipo do valor do campo e se foi preenchido corretamente
    switch (field.datatype) {
      case "number":
        if (isNaN(Number(body.value))) {
          return res.status(400).json({ error: "Valor deve ser numérico" });
        }
        parsedValue = body.value;
        valueForQuery = parsedValue.toString();
        break;
    
      case "boolean":
        if (typeof body.value === "string") {
          if (!["true", "false"].includes(body.value.toLowerCase())) {
            return res.status(400).json({ error: "Valor deve ser booleano (true ou false)" });
          }
          parsedValue = body.value.toLowerCase() === "true";
        } else if (typeof body.value === "boolean") {
          parsedValue = body.value;
        } else {
          return res.status(400).json({ error: "Valor deve ser booleano (true ou false)" });
        }
        valueForQuery = parsedValue.toString();
        break;
    
      case "date":
        if (typeof body.value === "string") {
          if (isNaN(Date.parse(body.value))) {
            return res.status(400).json({ error: "Valor deve ser uma data válida" });
          }
          parsedValue = new Date(body.value);
        } else if (body.value instanceof Date) {
          parsedValue = body.value;
        } else {
          return res.status(400).json({ error: "Valor deve ser uma data válida" });
        }
        valueForQuery = parsedValue.toISOString();
        break;
    
      default:
        if (typeof body.value !== "string") {
          return res.status(400).json({ error: "Valor deve ser uma string" });
        }
        parsedValue = body.value;
        valueForQuery = parsedValue;
        break;
    }
    //Verificar se já existe um Preenchimento com o campo e valor igual
    const exists = await fillRepo.findOneBy({
      fieldId: body.fieldId,
      value: valueForQuery, 
    });

    if (exists) {
      return res.status(400).json({ error: "Preenchimento já existe!" });
    }

    const fill = fillRepo.create(body);
    await fillRepo.save(fill);

    return res.status(201).json(fill);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Erro ao criar preenchimento" });
  }
};

//Função para buscar todos os preenchimentos
export const getFills = async (_req: Request, res: Response) => {
  const fills = await AppDataSource.getRepository(Fill).find();
  return res.json(fills);
};