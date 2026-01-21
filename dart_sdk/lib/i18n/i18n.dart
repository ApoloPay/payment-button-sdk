import 'es.dart';
import 'en.dart';

enum I18nLocale { es, en }

class I18n {
  static I18nLocale _currentLocale = I18nLocale.es;
  static Map<String, dynamic> _dictionary = es;

  static void setLocale(I18nLocale locale) {
    _currentLocale = locale;
    _dictionary = locale == I18nLocale.en ? en : es;
  }

  static I18nLocale get current => _currentLocale;

  static Map<String, dynamic> get t => _dictionary;

  static String interpolate(String text, Map<String, dynamic> params) {
    String result = text;
    params.forEach((key, value) {
      result = result.replaceAll('{$key}', value.toString());
    });
    return result;
  }
}
