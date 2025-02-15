import { COLUMN_WIDTH, GUTTER_SIZE } from './constants';

export const moduleW2LocalWidth = (moduleW: number) => moduleW * COLUMN_WIDTH - GUTTER_SIZE;
export const moduleX2LocalX = (moduleX: number) => moduleW2LocalWidth(moduleX) + GUTTER_SIZE * 2;
export const moduleY2LocalY = (moduleY: number) => moduleY + GUTTER_SIZE;
export const localX2ModuleX = (left: number) => Math.round(left / COLUMN_WIDTH);
export const localY2ModuleY = (top: number) => top;
