import { window } from './browser';

export function isBs3(): boolean {
  return window.__theme !== 'bs4';
}
