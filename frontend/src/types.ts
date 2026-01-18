export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface BoxItem extends Dimensions {
  id: string;
  createdAt?: string;
}

export interface Arrangement {
  l: number;
  w: number;
  h: number;
}

export interface InnerBoxConfig {
  stackCount: number; // 叠放数量（产品在高度方向堆叠）
}

export interface PackagingConfig {
  innerBox: InnerBoxConfig; // 内盒配置（叠放模式）
  masterArrangement: Arrangement; // 外箱排列（装多少个内盒）
  innerWallThickness: number; // 内盒壁厚/材质预留
}

export interface CalculationResult {
  foundStart: boolean;
  box: BoxItem;
  isCustom: boolean;
  gapL: number;
  gapW: number;
  gapH: number;
  wasteVolume: number;
  innerBoxDims: Dimensions; // 内盒尺寸（自动计算）
  masterPayloadDims: Dimensions; // 外箱内装尺寸
  totalItems: number; // 总产品数量
  stackCount: number; // 每盒叠放数量
}

export interface AIAnalysis {
  recommendation: string;
  materialSuggestion: string;
  efficiencyScore: number;
  reasoning: string[];
}

export type Language = 'en' | 'zh-CN';
