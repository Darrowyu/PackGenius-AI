import { z } from 'zod';
import {
  DimensionsSchema,
  ArrangementSchema,
  SafetyGapsSchema,
  PackagingConfigSchema,
  BoxItemSchema,
  LanguageSchema,
  CalculateRequestSchema,
  AIAnalysisSchema,
  CalculationResultSchema,
} from './schemas';

export type Dimensions = z.infer<typeof DimensionsSchema>;
export type Arrangement = z.infer<typeof ArrangementSchema>;
export type SafetyGaps = z.infer<typeof SafetyGapsSchema>;
export type PackagingConfig = z.infer<typeof PackagingConfigSchema>;
export type BoxItem = z.infer<typeof BoxItemSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type CalculateRequest = z.infer<typeof CalculateRequestSchema>;
export type AIAnalysis = z.infer<typeof AIAnalysisSchema>;
export type CalculationResult = z.infer<typeof CalculationResultSchema>;

export interface HistoryItem {
  id: number;
  product: Dimensions;
  config: PackagingConfig;
  result: CalculationResult & { aiAnalysis?: AIAnalysis };
  created_at: Date;
}

export interface ApiError {
  error: string;
  details?: z.ZodError['errors'];
}

export interface ApiSuccess<T> {
  success: true;
  data?: T;
  count?: number;
}
