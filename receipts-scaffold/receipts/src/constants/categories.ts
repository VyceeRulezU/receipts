// src/constants/categories.ts

import type { Category } from '../types';

export const CATEGORY_META: Record<
  Category,
  { label: string; color: string; bgColor: string }
> = {
  food:      { label: 'Food',      color: '#E8593C', bgColor: 'rgba(232,89,60,0.15)' },
  transport: { label: 'Transport', color: '#F2A623', bgColor: 'rgba(242,166,35,0.15)' },
  data:      { label: 'Data',      color: '#4A90D9', bgColor: 'rgba(74,144,217,0.15)' },
  fun:       { label: 'Fun',       color: '#9B8FE8', bgColor: 'rgba(155,143,232,0.15)' },
  other:     { label: 'Other',     color: '#5a5a58', bgColor: 'rgba(90,90,88,0.15)' },
};

export const CATEGORIES = Object.keys(CATEGORY_META) as Category[];

export const CATEGORY_COLORS = Object.values(CATEGORY_META).map(m => m.color);
