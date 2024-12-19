import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Fill } from "../models/Fill";
import { Field } from "../models/Field";
import { z } from "zod";

// Schema para criação de Fill
const createFillSchema = z.object({
  fieldId: z.string().uuid(),
  value: z.union([z.string(), z.number(), z.boolean(), z.date()]),
  isRequired: z.boolean(),
});

// Schema para atualização de Fill - todas as propriedades são opcionais
const updateFillSchema = z.object({
  fieldId: z.string().uuid().optional(),
  value: z.union([z.string(), z.number(), z.boolean(), z.date()]).optional(),
  isRequired: z.boolean().optional(),
});

//Função para criar um novo preenchimento
export const createFill = async (req: Request, res: Response) => {
  try {
    const body = createFillSchema.parse(req.body);

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
            return res
              .status(400)
              .json({ error: "Valor deve ser booleano (true ou false)" });
          }
          parsedValue = body.value.toLowerCase() === "true";
        } else if (typeof body.value === "boolean") {
          parsedValue = body.value;
        } else {
          return res
            .status(400)
            .json({ error: "Valor deve ser booleano (true ou false)" });
        }
        valueForQuery = parsedValue.toString();
        break;

      case "date":
        if (typeof body.value === "string") {
          if (isNaN(Date.parse(body.value))) {
            return res
              .status(400)
              .json({ error: "Valor deve ser uma data válida" });
          }
          parsedValue = new Date(body.value);
        } else if (body.value instanceof Date) {
          parsedValue = body.value;
        } else {
          return res
            .status(400)
            .json({ error: "Valor deve ser uma data válida" });
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
export const getFills = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const fillRepo = AppDataSource.getRepository(Fill);

    const [fills, total] = await fillRepo.findAndCount({
      order: { createdAt: "DESC" },
      skip,
      take: limit,
    });
    return res.json({
      data: fills,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar preenchimentos:", error);
    return res.status(500).json({ error: "Erro ao buscar preenchimentos" });
  }
};

//Função para editar um preenchimento
export const updateFill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = updateFillSchema.parse(req.body);
    console.log(body)

    const fillRepo = AppDataSource.getRepository(Fill);
    const fieldRepo = AppDataSource.getRepository(Field);

    const existingFill = await fillRepo.findOneBy({ id });
    if (!existingFill) {
      return res.status(404).json({ error: "Preenchimento não encontrado" });
    }

    if (body.fieldId) {
      const field = await fieldRepo.findOneBy({ id: body.fieldId });
      if (!field) {
        return res.status(404).json({ error: "Campo não encontrado" });
      }
    }
    // Atualiza apenas os campos fornecidos
    await fillRepo.update(id, {
      ...existingFill,
      ...body,
    });

    const updatedFill = await fillRepo.findOneBy({ id });
    return res.json(updatedFill);

  }  catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "Erro de validação", 
        details: err.errors 
      });
    }
    return res.status(400).json({ error: "Erro ao atualizar preenchimento" });
  }
};

//Função para deletar um preenchimento
export const deleteFill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fillRepo = AppDataSource.getRepository(Fill);

    const fill = await fillRepo.findOneBy({ id });
    if (!fill) {
      return res.status(404).json({ error: "Preenchimento não encontrado" });
    }

    await fillRepo.delete(id);
    return res.status(204).send();
  } catch (err) {
    console.error("Erro ao deletar preenchimento:", err);
    return res.status(500).json({ error: "Erro ao deletar preenchimento" });
  }
};
