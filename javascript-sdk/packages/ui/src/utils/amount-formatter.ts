import type { Locale } from "@apolopay-sdk/core";

export function amountFormatter(
  amount?: number | string | null,
  options: {
    decimals?: number,
    symbol?: string,
    lang?: Locale
  } = {}
): string {
  const { decimals = 8, symbol, lang = 'es' } = options;
  const locale = {
    'es': 'es-ES',
    'en': 'en-US',
    'pt': 'pt-BR'
  }[lang];

  if (amount === undefined || amount === null || amount === "") {
    amount = 0;
  }

  const amountNumber = Number(amount);
  if (isNaN(amountNumber)) return "0";

  const sign = amountNumber < 0 ? "-" : "";
  
  const absAmountStr = Math.abs(amountNumber).toLocaleString('en-US', {
    useGrouping: false,
    maximumFractionDigits: 20,
  });
  
  let truncatedStr = absAmountStr;

  const parts = absAmountStr.split('.');
  if (parts.length > 1) {
    const integerPart = parts[0];
    const decimalPart = parts[1];
    if (decimals === 0) {
      truncatedStr = integerPart;
    } else {
      truncatedStr = `${integerPart}.${decimalPart.slice(0, decimals)}`;
    }
  }

  const finalAmount = Number(`${sign}${truncatedStr}`);

  const formatOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  };

  try {
    return finalAmount.toLocaleString(locale, {
      ...formatOptions,
      style: symbol ? 'currency' : 'decimal',
      currency: symbol,
    });
  } catch (error) {
    const formattedNumber = finalAmount.toLocaleString(locale, {
      ...formatOptions,
      style: 'decimal',
    });
    return symbol ? `${formattedNumber} ${symbol}` : formattedNumber;
  }
}