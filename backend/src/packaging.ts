export interface Dimensions { length: number; width: number; height: number; }
export interface BoxItem extends Dimensions { id: string; created_at?: Date; }
export interface Arrangement { l: number; w: number; h: number; }
export interface InnerBoxConfig { stackCount: number; } // 叠放数量
export interface PackagingConfig { innerBox: InnerBoxConfig; masterArrangement: Arrangement; innerWallThickness: number; }

export interface CalculationResult {
  foundStart: boolean;
  box: BoxItem;
  isCustom: boolean;
  gapL: number; gapW: number; gapH: number;
  wasteVolume: number;
  innerBoxDims: Dimensions; // 内盒尺寸（自动计算）
  masterPayloadDims: Dimensions; // 外箱内装尺寸
  totalItems: number; // 总产品数量
  stackCount: number; // 每盒叠放数量
}

export interface SafetyGaps { l: number; w: number; h: number; }
export const DEFAULT_GAPS: SafetyGaps = { l: 3, w: 3, h: 2 };
export const getVolume = (d: Dimensions): number => d.length * d.width * d.height;

export const findBestBox = (
  product: Dimensions,
  inventory: BoxItem[],
  config: PackagingConfig,
  gaps: SafetyGaps = DEFAULT_GAPS
): CalculationResult => {
  const { innerBox, masterArrangement, innerWallThickness } = config;
  const stackCount = innerBox.stackCount;

  // 叠放模式：内盒尺寸 = 产品长宽 + 壁厚，高度 = 产品高 × 叠放数量 + 壁厚
  const innerBoxDims: Dimensions = {
    length: product.length + innerWallThickness,
    width: product.width + innerWallThickness,
    height: product.height * stackCount + innerWallThickness,
  };

  // 外箱内装尺寸 = 内盒尺寸 × 外箱排列
  const masterPayloadDims: Dimensions = {
    length: innerBoxDims.length * masterArrangement.l,
    width: innerBoxDims.width * masterArrangement.w,
    height: innerBoxDims.height * masterArrangement.h,
  };

  const minL = masterPayloadDims.length + gaps.l;
  const minW = masterPayloadDims.width + gaps.w;
  const minH = masterPayloadDims.height + gaps.h;
  const payloadVolume = getVolume(masterPayloadDims);

  // 总产品数量 = 叠放数量 × 外箱排列
  const totalItems = stackCount * masterArrangement.l * masterArrangement.w * masterArrangement.h;

  const validBoxes = inventory.filter((box) => {
    const fitsStandard = box.length >= minL && box.width >= minW && box.height >= minH;
    const fitsRotated = box.length >= minW && box.width >= minL && box.height >= minH;
    return fitsStandard || fitsRotated;
  });

  if (validBoxes.length > 0) {
    validBoxes.sort((a, b) => (getVolume(a) - payloadVolume) - (getVolume(b) - payloadVolume));
    const bestBox = validBoxes[0];
    return {
      foundStart: true, box: bestBox, isCustom: false,
      gapL: bestBox.length - masterPayloadDims.length,
      gapW: bestBox.width - masterPayloadDims.width,
      gapH: bestBox.height - masterPayloadDims.height,
      wasteVolume: getVolume(bestBox) - payloadVolume,
      innerBoxDims, masterPayloadDims, totalItems, stackCount
    };
  }

  const customBox: BoxItem = { id: 'CUSTOM-NEW', length: minL, width: minW, height: minH };
  return {
    foundStart: false, box: customBox, isCustom: true,
    gapL: gaps.l, gapW: gaps.w, gapH: gaps.h,
    wasteVolume: getVolume(customBox) - payloadVolume,
    innerBoxDims, masterPayloadDims, totalItems, stackCount
  };
};
