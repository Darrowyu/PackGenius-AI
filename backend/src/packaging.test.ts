import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { findBestBox, DEFAULT_GAPS, BoxItem } from './packaging';

const { l: GAP_L, w: GAP_W, h: GAP_H } = DEFAULT_GAPS;

const dimensionsArb = fc.record({
  length: fc.integer({ min: 1, max: 1000 }),
  width: fc.integer({ min: 1, max: 1000 }),
  height: fc.integer({ min: 1, max: 1000 }),
});

const arrangementArb = fc.record({
  l: fc.integer({ min: 1, max: 10 }),
  w: fc.integer({ min: 1, max: 10 }),
  h: fc.integer({ min: 1, max: 10 }),
});

const configArb = fc.record({
  innerArrangement: arrangementArb,
  masterArrangement: arrangementArb,
  innerWallThickness: fc.integer({ min: 0, max: 10 }),
});

describe('Packaging Calculation', () => {
  /**
   * **Feature: full-refactor, Property 5: 包装计算结果正确性**
   * **Validates: Requirements 5.1, 8.1**
   */
  test('Property 5: innerBoxDims = (product × innerArrangement) + innerWallThickness', () => {
    fc.assert(
      fc.property(dimensionsArb, configArb, (product, config) => {
        const result = findBestBox(product, [], config);
        
        expect(result.innerBoxDims.length).toBe(
          product.length * config.innerArrangement.l + config.innerWallThickness
        );
        expect(result.innerBoxDims.width).toBe(
          product.width * config.innerArrangement.w + config.innerWallThickness
        );
        expect(result.innerBoxDims.height).toBe(
          product.height * config.innerArrangement.h + config.innerWallThickness
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: full-refactor, Property 5: 包装计算结果正确性**
   * **Validates: Requirements 5.1, 8.1**
   */
  test('Property 5: masterPayloadDims = innerBoxDims × masterArrangement', () => {
    fc.assert(
      fc.property(dimensionsArb, configArb, (product, config) => {
        const result = findBestBox(product, [], config);
        
        expect(result.masterPayloadDims.length).toBe(
          result.innerBoxDims.length * config.masterArrangement.l
        );
        expect(result.masterPayloadDims.width).toBe(
          result.innerBoxDims.width * config.masterArrangement.w
        );
        expect(result.masterPayloadDims.height).toBe(
          result.innerBoxDims.height * config.masterArrangement.h
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: full-refactor, Property 5: 包装计算结果正确性**
   * **Validates: Requirements 5.1, 8.1**
   */
  test('Property 5: totalItems = innerArrangement.l×w×h × masterArrangement.l×w×h', () => {
    fc.assert(
      fc.property(dimensionsArb, configArb, (product, config) => {
        const result = findBestBox(product, [], config);
        const expectedTotal =
          (config.innerArrangement.l * config.innerArrangement.w * config.innerArrangement.h) *
          (config.masterArrangement.l * config.masterArrangement.w * config.masterArrangement.h);
        
        expect(result.totalItems).toBe(expectedTotal);
      }),
      { numRuns: 100 }
    );
  });
});


describe('Inventory Matching', () => {
  /**
   * **Feature: full-refactor, Property 6: 库存匹配逻辑正确性**
   * **Validates: Requirements 8.2**
   */
  test('Property 6: when inventory has fitting box, isCustom should be false', () => {
    fc.assert(
      fc.property(dimensionsArb, configArb, (product, config) => {
        const result = findBestBox(product, [], config);
        const minL = result.masterPayloadDims.length + GAP_L;
        const minW = result.masterPayloadDims.width + GAP_W;
        const minH = result.masterPayloadDims.height + GAP_H;
        
        const fittingBox: BoxItem = {
          id: 'FITTING-BOX',
          length: minL + 10,
          width: minW + 10,
          height: minH + 10,
        };
        
        const resultWithInventory = findBestBox(product, [fittingBox], config);
        expect(resultWithInventory.isCustom).toBe(false);
        expect(resultWithInventory.box.id).toBe('FITTING-BOX');
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: full-refactor, Property 6: 库存匹配逻辑正确性**
   * **Validates: Requirements 8.2**
   */
  test('Property 6: selected box dimensions >= masterPayload + safetyGap', () => {
    fc.assert(
      fc.property(dimensionsArb, configArb, (product, config) => {
        const result = findBestBox(product, [], config);
        const minL = result.masterPayloadDims.length + GAP_L;
        const minW = result.masterPayloadDims.width + GAP_W;
        const minH = result.masterPayloadDims.height + GAP_H;
        
        const inventory: BoxItem[] = [
          { id: 'BOX-1', length: minL + 5, width: minW + 5, height: minH + 5 },
          { id: 'BOX-2', length: minL + 50, width: minW + 50, height: minH + 50 },
        ];
        
        const resultWithInventory = findBestBox(product, inventory, config);
        expect(resultWithInventory.box.length).toBeGreaterThanOrEqual(minL);
        expect(resultWithInventory.box.width).toBeGreaterThanOrEqual(minW);
        expect(resultWithInventory.box.height).toBeGreaterThanOrEqual(minH);
      }),
      { numRuns: 100 }
    );
  });
});


describe('Custom Box Generation', () => {
  /**
   * **Feature: full-refactor, Property 7: 定制纸箱生成逻辑正确性**
   * **Validates: Requirements 8.3**
   */
  test('Property 7: when no fitting box exists, isCustom should be true', () => {
    fc.assert(
      fc.property(dimensionsArb, configArb, (product, config) => {
        const result = findBestBox(product, [], config);
        expect(result.isCustom).toBe(true);
        expect(result.box.id).toBe('CUSTOM-NEW');
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: full-refactor, Property 7: 定制纸箱生成逻辑正确性**
   * **Validates: Requirements 8.3**
   */
  test('Property 7: custom box dimensions = masterPayload + safetyGap', () => {
    fc.assert(
      fc.property(dimensionsArb, configArb, (product, config) => {
        const result = findBestBox(product, [], config);
        
        expect(result.box.length).toBe(result.masterPayloadDims.length + GAP_L);
        expect(result.box.width).toBe(result.masterPayloadDims.width + GAP_W);
        expect(result.box.height).toBe(result.masterPayloadDims.height + GAP_H);
        expect(result.gapL).toBe(GAP_L);
        expect(result.gapW).toBe(GAP_W);
        expect(result.gapH).toBe(GAP_H);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: full-refactor, Property 7: 定制纸箱生成逻辑正确性**
   * **Validates: Requirements 8.3**
   */
  test('Property 7: when inventory boxes are too small, isCustom should be true', () => {
    fc.assert(
      fc.property(dimensionsArb, configArb, (product, config) => {
        const tooSmallBox: BoxItem = { id: 'SMALL-BOX', length: 1, width: 1, height: 1 };
        const result = findBestBox(product, [tooSmallBox], config);
        expect(result.isCustom).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});
