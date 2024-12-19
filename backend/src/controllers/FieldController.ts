import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Field } from "../models/Field";
import { z, ZodError } from "zod";
import { Not } from "typeorm";
import { Fill } from "../models/Fill";

const fieldSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  datatype: z.enum(["string", "number", "boolean", "date"], {
    errorMap: () => ({ message: "Tipo de dado inválido" })
  }),
  isRequired: z.boolean(),
  createdAt: z.date().optional().default(() => new Date())
});

//Função para criar um novo Campo
export const createField = async (req: Request, res: Response) => {
  try {
    const body = fieldSchema.parse({
      ...req.body,
      createdAt: new Date()
    });

    const fieldRepo = AppDataSource.getRepository(Field);
    
    //Verificar se já existe Campo com mesmo nome 
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

//Função para buscar todos os Campos
export const getFields = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const fieldRepo = AppDataSource.getRepository(Field);
    
    const [fields, total] = await fieldRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit
    });
    return res.json({
      data: fields,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Erro ao buscar campos:", error);
    return res.status(500).json({ 
      message: "Erro ao buscar campos", 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    });
  }
};

//Função para Editar um Campo
export const updateField = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = fieldSchema.parse({
      ...req.body,
      createdAt: new Date()
    });

    const fieldRepo = AppDataSource.getRepository(Field);
    
    const existingField = await fieldRepo.findOneBy({ id });
    if (!existingField) {
      return res.status(404).json({ error: "Campo não encontrado" });
    }

    const nameConflict = await fieldRepo.findOneBy({ 
      name: body.name,
      id: Not(id)
    });
    
    if (nameConflict) {
      return res.status(400).json({ 
        error: "Já existe um campo com este nome",
        field: nameConflict
      });
    }

    await fieldRepo.update(id, body);
    const updatedField = await fieldRepo.findOneBy({ id });

    return res.json(updatedField);
  } catch (err) {
    console.error("Erro ao atualizar campo:", err);

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
      error: "Erro interno ao atualizar campo",
      message: err instanceof Error ? err.message : String(err)
    });
  }
};

//Função para deletar um Campo
export const deleteField = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fieldRepo = AppDataSource.getRepository(Field);
    const fillRepo = AppDataSource.getRepository(Fill);
    
    // Verifica se o campo existe
    const field = await fieldRepo.findOneBy({ id });
    if (!field) {
      return res.status(404).json({ error: "Campo não encontrado" });
    }

    // Verifica se existem preenchimentos relacionados
    const fillCount = await fillRepo.countBy({ fieldId: id });
    if (fillCount > 0) {
      return res.status(400).json({ 
        error: "Não é possível excluir este campo pois existem preenchimentos vinculados a ele",
        details: `Existem ${fillCount} preenchimento(s) utilizando este campo`
      });
    }

    await fieldRepo.delete(id);
    return res.status(204).send();
  } catch (err) {
    console.error("Erro ao deletar campo:", err);
    return res.status(500).json({ 
      error: "Erro ao deletar campo",
      message: err instanceof Error ? err.message : String(err)
    });
  }
};