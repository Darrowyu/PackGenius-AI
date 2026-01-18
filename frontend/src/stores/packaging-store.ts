import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Dimensions, PackagingConfig, CalculationResult, AIAnalysis, Language, BoxItem } from '@/types';
import { api } from '@/lib/api';
import { DEFAULT_INNER_WALL, GAP_L, GAP_W, GAP_H } from '@/lib/constants';
import { translations } from '@/i18n';

interface PackagingStore {
  product: Dimensions;
  config: PackagingConfig;
  safetyGaps: { l: number; w: number; h: number };
  language: Language;
  inventory: BoxItem[];
  result: CalculationResult | null;
  aiAnalysis: AIAnalysis | null;
  isLoading: boolean;
  error: string | null;

  setProduct: (dims: Partial<Dimensions>) => void;
  setConfig: (cfg: Partial<PackagingConfig>) => void;
  setSafetyGaps: (gaps: Partial<{ l: number; w: number; h: number }>) => void;
  setLanguage: (lang: Language) => void;
  setInventory: (items: BoxItem[]) => void;
  calculate: () => Promise<void>;
  reset: () => void;
  clearError: () => void;
}

const initialProduct: Dimensions = { length: 0, width: 0, height: 0 };
const initialConfig: PackagingConfig = {
  innerBox: { stackCount: 50 }, // 默认叠放50个
  masterArrangement: { l: 1, w: 1, h: 1 },
  innerWallThickness: DEFAULT_INNER_WALL,
};

export const usePackagingStore = create<PackagingStore>()(
  devtools(
    (set, get) => ({
      product: initialProduct,
      config: initialConfig,
      safetyGaps: { l: GAP_L, w: GAP_W, h: GAP_H },
      language: 'zh-CN',
      inventory: [],
      result: null,
      aiAnalysis: null,
      isLoading: false,
      error: null,

      setProduct: (dims) => set((state) => ({ product: { ...state.product, ...dims } }), false, 'setProduct'),
      setConfig: (cfg) => set((state) => ({ config: { ...state.config, ...cfg } }), false, 'setConfig'),
      setSafetyGaps: (gaps) => set((state) => ({ safetyGaps: { ...state.safetyGaps, ...gaps } }), false, 'setSafetyGaps'),
      setLanguage: (lang) => set({ language: lang }, false, 'setLanguage'),
      setInventory: (items) => set({ inventory: items }, false, 'setInventory'),
      clearError: () => set({ error: null }, false, 'clearError'),

      calculate: async () => {
        const { product, config, language, safetyGaps } = get();
        const t = translations[language];
        if (product.length <= 0 || product.width <= 0 || product.height <= 0) {
          set({ error: t.errorInvalidDims }, false, 'calculate/error');
          return;
        }

        set({ isLoading: true, error: null, result: null, aiAnalysis: null }, false, 'calculate/start');
        try {
          const res = await api.post<{ result: CalculationResult; aiAnalysis: AIAnalysis | null }>(
            '/calculate',
            { product, config, language, safetyGaps }
          );
          set({ result: res.result, aiAnalysis: res.aiAnalysis, isLoading: false }, false, 'calculate/success');
        } catch (err) {
          set({ error: t.errorCalcFailed, isLoading: false }, false, 'calculate/fail');
        }
      },

      reset: () => set({
        product: initialProduct,
        config: initialConfig,
        result: null,
        aiAnalysis: null,
        error: null,
      }, false, 'reset'),
    }),
    { name: 'PackagingStore' }
  )
);
