import { describe, it, expect, afterEach } from 'vitest';
import { I18n } from './index';

describe('I18n', () => {
  afterEach(() => {
    I18n.setLocale('es');
  });

  it('defaults to the Spanish dictionary', () => {
    expect(I18n.current).toBe('es');
    expect(I18n.t.successes.success).toBe('Éxito');
  });

  it('switches to the English dictionary on setLocale', () => {
    I18n.setLocale('en');

    expect(I18n.current).toBe('en');
    expect(I18n.t.successes.success).toBe('Success');
  });

  it('interpolates {placeholders} and leaves unknown ones untouched', () => {
    const result = I18n.interpolate('Hi {name}, you have {count} items', { name: 'Ana' });
    expect(result).toBe('Hi Ana, you have {count} items');
  });
});
