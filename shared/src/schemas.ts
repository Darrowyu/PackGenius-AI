import { z } from 'zod';

export const DimensionsSchema = z.object({
  length: z.number().positive('Length must be positive'),
  width: z.number().positive('Width must be positive'),
  height: z.number().positive('Height must be positive'),
});

export const ArrangementSchema = z.object({
  l: z.number().int().min(1, 'Minimum 1'),
  w: z.number().int().min(1, 'Minimum 1'),
  h: z.number().int().min(1, 'Minimum 1'),
});

export const SafetyGapsSchema = z.object({
  l: z.number().min(0, 'Cannot be negative'),
  w: z.number().min(0, 'Cannot be negative'),
  h: z.number().min(0, 'Cannot be negative'),
});

export const PackagingConfigSchema = z.object({
  innerArrangement: ArrangementSchema,
  masterArrangement: ArrangementSchema,
  innerWallThickness: z.number().min(0, 'Cannot be negative'),
});

export const BoxItemSchema = z.object({
  id: z.string().min(1, 'ID is required').max(50, 'ID too long'),
  length: z.number().positive('Length must be positive'),
  width: z.number().positive('Width must be positive'),
  height: z.number().positive('Height must be positive'),
  created_at: z.date().optional(),
});

export const LanguageSchema = z.enum(['en', 'zh-CN']);

export const CalculateRequestSchema = z.object({
  product: DimensionsSchema,
  config: PackagingConfigSchema,
  language: LanguageSchema.default('zh-CN'),
  safetyGaps: SafetyGapsSchema.optional(),
});

export const InventoryBatchSchema = z.array(BoxItemSchema.omit({ created_at: true }));

export const AIAnalysisSchema = z.object({
  recommendation: z.string(),
  materialSuggestion: z.string(),
  efficiencyScore: z.number().min(0).max(100),
  reasoning: z.array(z.string()),
});

export const CalculationResultSchema = z.object({
  foundStart: z.boolean(),
  box: BoxItemSchema,
  isCustom: z.boolean(),
  gapL: z.number(),
  gapW: z.number(),
  gapH: z.number(),
  wasteVolume: z.number(),
  innerBoxDims: DimensionsSchema,
  masterPayloadDims: DimensionsSchema,
  totalItems: z.number().int().positive(),
});
