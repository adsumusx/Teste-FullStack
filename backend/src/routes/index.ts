import { Router } from "express";
import { createField, getFields } from "../controllers/FieldController";
import { createFill, getFills } from "../controllers/FillController";

const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Field:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identificador único do campo.
 *         name:
 *           type: string
 *           description: Nome do campo.
 *         datatype:
 *           type: string
 *           enum: [string, number, boolean, date]
 *           description: Tipo de dado do campo.
 *         isRequired:
 *           type: boolean
 *           description: Indica se o campo é obrigatório.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do campo.
 *     Fill:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identificador único do preenchimento.
 *         fieldId:
 *           type: string
 *           format: uuid
 *           description: Identificador do campo relacionado.
 *         value:
 *           oneOf:
 *             - type: string
 *             - type: number
 *             - type: boolean
 *             - type: string
 *               format: date
 *           description: Valor do preenchimento.
 *         isRequired:
 *           type: boolean
 *           description: Indica se o preenchimento é obrigatório.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do preenchimento.
 */

/**
 * @swagger
 * /fields:
 *   post:
 *     summary: Cria um novo campo.
 *     tags:
 *       - Fields
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Field'
 *     responses:
 *       201:
 *         description: Campo criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Field'
 *       400:
 *         description: Erro de validação ou erro ao criar o campo.
 */
router.post("/fields", createField);

/**
 * @swagger
 * /fields:
 *   get:
 *     summary: Retorna todos os campos.
 *     tags:
 *       - Fields
 *     responses:
 *       200:
 *         description: Lista de campos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Field'
 */
router.get("/fields", getFields);
/**
 * @swagger
 * /fills:
 *   post:
 *     summary: Cria um novo preenchimento.
 *     tags:
 *       - Fills
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fieldId:
 *                 type: string
 *                 format: uuid
 *                 description: Identificador do campo relacionado.
 *               value:
 *                 oneOf:
 *                   - type: string
 *                   - type: number
 *                   - type: boolean
 *                   - type: string
 *                     format: date
 *                 description: Valor do preenchimento.
 *               isRequired:
 *                 type: boolean
 *                 description: Indica se o preenchimento é obrigatório.
 *     responses:
 *       201:
 *         description: Preenchimento criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fill'
 *       400:
 *         description: Erro de validação ou erro ao criar o preenchimento.
 */
router.post("/fills", createFill);
/**
 * @swagger
 * /fills:
 *   get:
 *     summary: Retorna todos os preenchimentos.
 *     tags:
 *       - Fills
 *     responses:
 *       200:
 *         description: Lista de preenchimentos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Fill'
 */
router.get("/fills", getFills);

export default router;
