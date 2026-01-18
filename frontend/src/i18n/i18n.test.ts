import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import en from './en.json';
import zhCN from './zh-CN.json';
import { translations } from './index';

describe('Translation Completeness', () => {
  /**
   * **Feature: full-refactor, Property 4: 翻译 key 映射完整性**
   * **Validates: Requirements 4.2**
   */
  test('Property 4: all English keys exist in Chinese translation', () => {
    const enKeys = Object.keys(en);
    const zhKeys = Object.keys(zhCN);
    
    enKeys.forEach(key => {
      expect(zhKeys).toContain(key);
    });
  });

  /**
   * **Feature: full-refactor, Property 4: 翻译 key 映射完整性**
   * **Validates: Requirements 4.2**
   */
  test('Property 4: all Chinese keys exist in English translation', () => {
    const enKeys = Object.keys(en);
    const zhKeys = Object.keys(zhCN);
    
    zhKeys.forEach(key => {
      expect(enKeys).toContain(key);
    });
  });

  /**
   * **Feature: full-refactor, Property 4: 翻译 key 映射完整性**
   * **Validates: Requirements 4.2**
   */
  test('Property 4: all translation values are non-empty strings', () => {
    const languages = ['en', 'zh-CN'] as const;
    
    languages.forEach(lang => {
      const t = translations[lang];
      Object.entries(t).forEach(([key, value]) => {
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  /**
   * **Feature: full-refactor, Property 4: 翻译 key 映射完整性**
   * **Validates: Requirements 4.2**
   */
  test('Property 4: for any key, both languages return non-empty string', () => {
    const keys = Object.keys(en) as (keyof typeof en)[];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...keys),
        (key) => {
          const enValue = translations['en'][key];
          const zhValue = translations['zh-CN'][key];
          
          expect(typeof enValue).toBe('string');
          expect(typeof zhValue).toBe('string');
          expect(enValue.length).toBeGreaterThan(0);
          expect(zhValue.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: Math.min(keys.length, 100) }
    );
  });
});
