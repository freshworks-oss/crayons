import { parse as parseDate, isMatch as parseIsMatch } from 'date-fns';

export const toWideMonthFormat = (displayFormat: string): string =>
  displayFormat.replace(/MMM(?!M)/g, 'MMMM');

export const parseSwedishDate = (
  value: string,
  displayFormat: string,
  date: Date,
  langModule: any
): any => {
  // date-fns parse with MMM fails for Swedish months whose abbreviated name
  // matches the wide name (e.g. mars, juni, juli). Parse with MMMM instead.
  if (!value) return value;
  return parseDate(value, toWideMonthFormat(displayFormat), date, langModule);
};

export const parseIcelandicDate = (value: string, langModule: any): any => {
  // For Icelandic language, the date format is different. There is a discrepency which is handled in this PR https://github.com/date-fns/date-fns/pull/3934
  if (!value) return value;
  const icelandicLanguageDisplayFormat = 'dd MMMM yyyy';
  const icelandicMonthMapper = {
    'jan.': 'jan.',
    'feb.': 'feb.',
    'mars': 'm',
    'apríl': 'apríl',
    'maí': 'maí',
    'júní': 'júní',
    'júlí': 'júlí',
    'ágúst': 'á',
    'sept.': 's',
    'okt.': 'ó',
    'nóv.': 'n',
    'des.': 'd',
  };
  const correctedDate = value?.replace(
    /jan\.|feb\.|mars|apríl|maí|júní|júlí|ágúst|sept\.|okt\.|nóv\.|des\./g,
    (match) => icelandicMonthMapper[match]
  );
  return parseDate(
    correctedDate,
    icelandicLanguageDisplayFormat,
    new Date(),
    langModule
  );
};

export const parseDatepickerValue = (
  value: string,
  displayFormat: string,
  date: Date,
  langModule: any
): any => {
  if (!value) return value;
  if (langModule?.locale?.code === 'is' && displayFormat === 'dd MMM yyyy') {
    return parseIcelandicDate(value, langModule);
  }
  if (langModule?.locale?.code === 'sv' && /MMM(?!M)/.test(displayFormat)) {
    return parseSwedishDate(value, displayFormat, date, langModule);
  }
  return parseDate(value, displayFormat, date, langModule);
};

export const matchDatepickerValue = (
  value: string,
  displayFormat: string,
  langModule: any
): boolean => {
  if (langModule?.locale?.code === 'is') {
    return true;
  }
  if (langModule?.locale?.code === 'sv' && /MMM(?!M)/.test(displayFormat)) {
    return parseIsMatch(value, toWideMonthFormat(displayFormat), langModule);
  }
  return parseIsMatch(value, displayFormat, langModule);
};
