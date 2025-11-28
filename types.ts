export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface BoxItem extends Dimensions {
  id: string;
}

export interface Arrangement {
  l: number;
  w: number;
  h: number;
}

export interface PackagingConfig {
  innerArrangement: Arrangement; // How products are packed into Inner Box
  masterArrangement: Arrangement; // How Inner Boxes are packed into Master Carton
  innerWallThickness: number; // Thickness allowance for inner box material (mm)
}

export interface CalculationResult {
  foundStart: boolean;
  box: BoxItem; // The final Master Carton (stock or custom)
  isCustom: boolean;
  
  // Gaps relative to the Master Carton Payload
  gapL: number;
  gapW: number;
  gapH: number;
  wasteVolume: number; // in mm^3

  // Intermediate Details
  innerBoxDims: Dimensions; // Size of one Inner Pack
  masterPayloadDims: Dimensions; // Total size of all Inner Packs stacked
  totalItems: number; // Total products per master carton
}

export interface AIAnalysis {
  recommendation: string;
  materialSuggestion: string;
  efficiencyScore: number;
  reasoning: string[];
}

export type Language = 'en' | 'cn';