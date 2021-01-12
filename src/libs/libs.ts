import { Dict } from '../common';
import { math } from './math';
import { func_tools } from './func_tools';

export const libs = new Map<string, Dict>([
    ['math', math],
    ['func_tools', func_tools],
]);
