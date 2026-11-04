import { isValid, format } from 'date-fns';
import sv from 'date-fns/locale/sv';
import enUS from 'date-fns/locale/en-US';
import {
  toWideMonthFormat,
  parseSwedishDate,
  parseDatepickerValue,
  matchDatepickerValue,
} from './datepicker-utils';

const displayFormat = 'dd MMM yyyy';
const referenceDate = new Date(2026, 0, 1);
const svLocale = { locale: sv };

describe('datepicker-utils', () => {
  describe('toWideMonthFormat', () => {
    it('replaces MMM with MMMM in abbreviated month formats', () => {
      expect(toWideMonthFormat('dd MMM yyyy')).toBe('dd MMMM yyyy');
      expect(toWideMonthFormat('MMM dd, yyyy')).toBe('MMMM dd, yyyy');
    });
  });

  describe('parseSwedishDate', () => {
    it.each([
      '28 juli 2026',
      '28 mars 2026',
      '15 juni 2026',
      '15 jan. 2026',
      '10 sep. 2026',
    ])('parses Swedish date "%s" with dd MMM yyyy format', (value) => {
      const parsed = parseSwedishDate(
        value,
        displayFormat,
        referenceDate,
        svLocale
      );
      expect(isValid(parsed)).toBe(true);
    });

    it('returns the value when value is empty', () => {
      expect(parseSwedishDate('', displayFormat, referenceDate, svLocale)).toBe(
        ''
      );
    });
  });

  describe('parseDatepickerValue', () => {
    it('parses Swedish display format using wide month names', () => {
      const parsed = parseDatepickerValue(
        '28 juli 2026',
        displayFormat,
        referenceDate,
        svLocale
      );
      expect(format(parsed, displayFormat, { locale: sv })).toBe(
        '28 juli 2026'
      );
    });

    it('parses default locale display format', () => {
      const parsed = parseDatepickerValue(
        '07/28/2026',
        'MM/dd/yyyy',
        referenceDate,
        { locale: enUS }
      );
      expect(isValid(parsed)).toBe(true);
      expect(format(parsed, 'MM/dd/yyyy')).toBe('07/28/2026');
    });

    it('returns the value when value is empty', () => {
      expect(
        parseDatepickerValue('', displayFormat, referenceDate, svLocale)
      ).toBe('');
    });
  });

  describe('matchDatepickerValue', () => {
    it.each(['28 juli 2026', '28 mars 2026', '15 juni 2026', '15 jan. 2026'])(
      'matches valid Swedish date "%s"',
      (value) => {
        expect(matchDatepickerValue(value, displayFormat, svLocale)).toBe(true);
      }
    );

    it('rejects invalid Swedish date strings', () => {
      expect(matchDatepickerValue('28 foo 2026', displayFormat, svLocale)).toBe(
        false
      );
    });

    it('validates non-Swedish locales using display format', () => {
      expect(
        matchDatepickerValue('07/28/2026', 'MM/dd/yyyy', { locale: enUS })
      ).toBe(true);
      expect(
        matchDatepickerValue('not-a-date', 'MM/dd/yyyy', { locale: enUS })
      ).toBe(false);
    });

    it('returns true for Icelandic locale', () => {
      expect(
        matchDatepickerValue('20.04.2022', displayFormat, {
          locale: { code: 'is' },
        })
      ).toBe(true);
    });
  });
});
