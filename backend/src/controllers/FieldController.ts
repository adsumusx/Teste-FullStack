import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Field } from "../models/Field";
import { z, ZodError } from "zod";

const fieldSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  datatype: z.enum(["string", "number", "boolean", "date"], {
    errorMap: () => ({ message: "Tipo de dado inválido" })
  }),
  isRequired: z.boolean(),
  createdAt: z.date().optional().default(() => new Date())
});

export const createField = async (req: Request, res: Response) => {
  try {
    const body = fieldSchema.parse({
      ...req.body,
      createdAt: new Date()
    });

    const fieldRepo = AppDataSource.getRepository(Field);
    
    const existingField = await fieldRepo.findOneBy({ name: body.name });
    if (existingField) {
      return res.status(400).json({ 
        error: "Já existe um campo com este nome",
        field: existingField
      });
    }

    const field = fieldRepo.create(body);
    await fieldRepo.save(field);

    return res.status(201).json(field);
  } catch (err) {
    console.error("Erro ao criar campo:", err);

    if (err instanceof ZodError) {
      return res.status(400).json({ 
        error: "Erro de validação", 
        details: err.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message
        }))
      });
    }

    return res.status(500).json({ 
      error: "Erro interno ao criar campo",
      message: err instanceof Error ? err.message : String(err)
    });
  }
};

export const getFields = async (_req: Request, res: Response) => {
  try {
    const fieldRepo = AppDataSource.getRepository(Field);
    const fields = await fieldRepo.find({
      order: { createdAt: 'DESC' } 
    });
    return res.json(fields);
  } catch (error) {
    console.error("Erro ao buscar campos:", error);
    return res.status(500).json({ 
      message: "Erro ao buscar campos", 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    });
  }
};