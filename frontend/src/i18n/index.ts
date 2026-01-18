import { Language } from '@/types';
import en from './en.json';
import zhCN from './zh-CN.json';

export const translations: Record<Language, typeof en> = {
  'en': en,
  'zh-CN': zhCN,
};

export type Translation = typeof en;
