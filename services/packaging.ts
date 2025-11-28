import { BoxItem, Dimensions, CalculationResult, PackagingConfig } from '../types';
import { GAP_L, GAP_W, GAP_H } from '../constants';

/**
 * Parses CSV string into BoxItem array.
 * Expected format: ID, Length, Width, Height
 */
export const parseInventoryCSV = (csv: string): BoxItem[] => {
  const lines = csv.split('\n');
  const inventory: BoxItem[] = [];

  lines.forEach((line) => {
    const parts = line.split(',').map((p) => p.trim());
    if (parts.length >= 4) {
      const id = parts[0];
      const length = parseFloat(parts[1]);
      const width = parseFloat(parts[2]);
      const height = parseFloat(parts[3]);

      if (id && !isNaN(length) && !isNaN(width) && !isNaN(height)) {
        inventory.push({ id, length, width, height });
      }
    }
  });

  return inventory;
};

export const getVolume = (d: Dimensions): number => d.length * d.width * d.height;

/**
 * Calculates the full packaging hierarchy and finds the best master carton.
 */
export const findBestBox = (
  product: Dimensions, 
  inventory: BoxItem[], 
  config: PackagingConfig
): CalculationResult => {
  
  // 1. Calculate Inner Box Dimensions (Minimum Packaging)
  // Dimensions = (Product * Count) + Inner Wall Allowance
  const innerBoxDims: Dimensions = {
    length: (product.length * config.innerArrangement.l) + config.innerWallThickness,
    width: (product.width * config.innerArrangement.w) + config.innerWallThickness,
    height: (product.height * config.innerArrangement.h) + config.innerWallThickness,
  };

  // 2. Calculate Master Carton Payload Dimensions
  // Dimensions = Inner Box * Master Count
  // Note: We don't add wall thickness here because these are stacked *inside* the master carton.
  // The master carton's internal size must accommodate this stack.
  const masterPayloadDims: Dimensions = {
    length: innerBoxDims.length * config.masterArrangement.l,
    width: innerBoxDims.width * config.masterArrangement.w,
    height: innerBoxDims.height * config.masterArrangement.h,
  };

  // 3. Define Required Search Dimensions (Payload + Safety Gap)
  const minL = masterPayloadDims.length + GAP_L;
  const minW = masterPayloadDims.width + GAP_W;
  const minH = masterPayloadDims.height + GAP_H;

  const payloadVolume = getVolume(masterPayloadDims);

  // 4. Search Inventory
  const validBoxes = inventory.filter((box) => {
    // Standard orientation
    const fitsStandard = box.length >= minL && box.width >= minW && box.height >= minH;
    
    // Rotated base orientation (L fits in W, W fits in L)
    const fitsRotated = box.length >= minW && box.width >= minL && box.height >= minH;

    return fitsStandard || fitsRotated;
  });

  const totalItems = 
    (config.innerArrangement.l * config.innerArrangement.w * config.innerArrangement.h) *
    (config.masterArrangement.l * config.masterArrangement.w * config.masterArrangement.h);

  if (validBoxes.length > 0) {
    // Sort by waste volume
    validBoxes.sort((a, b) => {
      const volA = getVolume(a);
      const volB = getVolume(b);
      return (volA - payloadVolume) - (volB - payloadVolume);
    });

    const bestBox = validBoxes[0];
    
    return {
      foundStart: true,
      box: bestBox,
      isCustom: false,
      gapL: bestBox.length - masterPayloadDims.length,
      gapW: bestBox.width - masterPayloadDims.width,
      gapH: bestBox.height - masterPayloadDims.height,
      wasteVolume: getVolume(bestBox) - payloadVolume,
      innerBoxDims,
      masterPayloadDims,
      totalItems
    };
  }

  // 5. Custom Box Fallback
  const customBox: BoxItem = {
    id: 'CUSTOM-NEW',
    length: minL,
    width: minW,
    height: minH,
  };

  return {
    foundStart: false,
    box: customBox,
    isCustom: true,
    gapL: GAP_L,
    gapW: GAP_W,
    gapH: GAP_H,
    wasteVolume: getVolume(customBox) - payloadVolume,
    innerBoxDims,
    masterPayloadDims,
    totalItems
  };
};
