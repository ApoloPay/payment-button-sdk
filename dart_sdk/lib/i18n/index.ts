import { Dictionary } from './types';
import { es } from './es';
import { en } from './en';

export type Locale = 'es' | 'en';

class I18nService {
  private static _currentLocale: Locale = 'es';
  private static _dictionary: Dictionary = es;

  // Cambiar idioma
  static setLocale(locale: Locale) {
    this._currentLocale = locale;
    this._dictionary = locale === 'en' ? en : es;
  }

  static get current() {
    return this._currentLocale;
  }

  // Función para obtener texto (Tipado seguro para claves anidadas sería complejo, 
  // así que usaremos acceso directo o un getter helper si lo prefieres)
  static get t() {
    return this._dictionary;
  }

  // Helper para interpolar variables: "Hola {name}" -> "Hola Mundo"
  static interpolate(text: string, params: Record<string, string | number>): string {
    return text.replace(/{(\w+)}/g, (match, key) => {
      return typeof params[key] !== 'undefined' ? String(params[key]) : match;
    });
  }
}

// Exportamos una instancia o la clase estática
export { I18nService as I18n };