import {
  Component,
  Element,
  Event,
  EventEmitter,
  Listen,
  Prop,
  State,
  h,
  Method,
  Watch,
} from '@stencil/core';
import {
  isValid,
  parse as parseDate,
  parseISO,
  getYear,
  getMonth,
  getDate,
  getTime,
  startOfDay,
  getDaysInMonth,
  format,
  isMatch as parseIsMatch,
  formatISO,
  addDays,
  startOfWeek,
} from 'date-fns';
import {
  handleKeyDown,
  renderHiddenField,
  getFocusableChildren,
  hasSlot,
  debounce,
} from '../../utils';
import FieldControl from '../../function-components/field-control';

import { TranslationController } from '../../global/Translation';
import { addRTL } from '../../utils';

const defaultweekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const monthDetails = [
  { value: 'Jan', text: 'January' },
  { value: 'Feb', text: 'February' },
  { value: 'Mar', text: 'March' },
  { value: 'Apr', text: 'April' },
  { value: 'May', text: 'May' },
  { value: 'Jun', text: 'June' },
  { value: 'Jul', text: 'July' },
  { value: 'Aug', text: 'August' },
  { value: 'Sep', text: 'September' },
  { value: 'Oct', text: 'October' },
  { value: 'Nov', text: 'November' },
  { value: 'Dec', text: 'December' },
];

const getMonthNames = (lang): any => {
  if (!lang) {
    return {
      longMonthNames: monthDetails.map((m) => m.text),
      shortMonthNames: monthDetails.map((m) => m.value),
    };
  }

  const shortMonthNames = [];
  const longMonthNames = [];
  for (let i = 0; i <= 11; i++) {
    shortMonthNames.push(lang.localize.month(i, { width: 'abbreviated' }));
    longMonthNames.push(lang.localize.month(i));
  }
  return {
    longMonthNames,
    shortMonthNames,
  };
};

const getWeekDays = (lang): any => {
  if (!lang) return defaultweekDays;
  return Array.from(Array(7)).map((_e, i) =>
    format(addDays(startOfWeek(new Date()), i), 'EEEEE', { locale: lang })
  );
};

const parseIcelandicDate = (value, langModule) => {
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

const parse = (value, displayFormat, date, langModule) => {
  if (!value) return value;
  if (langModule?.locale?.code === 'is' && displayFormat === 'dd MMM yyyy') {
    return parseIcelandicDate(value, langModule);
  }
  return parseDate(value, displayFormat, date, langModule);
};

const isMatch = (value, displayFormat, langModule) => {
  if (langModule?.locale?.code !== 'is') {
    return parseIsMatch(value, displayFormat, langModule);
  }
  return true;
};

@Component({ tag: 'fw-datepicker', styleUrl: 'datepicker.scss', shadow: true })
export class Datepicker {
  @State() showDatePicker: boolean;
  @State() year: any;
  @State() toYear: string;
  @State() monthDetails: any;
  @State() nextMonthDetails: any;
  @State() month: any;
  @State() todayTimestamp: any;
  @State() selectedDay: any;
  @State() startDate: any;
  @State() endDate: any;
  @State() startDateFormatted: any;
  @State() endDateFormatted: any;
  @State() dateHovered: any;
  @State() supportedYears: any;
  @State() toMonth: number;
  @State() firstFocusElement: HTMLElement = null;
  @State() lastFocusElement: HTMLElement = null;
  @State() popoverContentElement: HTMLElement;
  @State() langModule: any;
  @State() shortMonthNames: any;
  @State() longMonthNames: any;
  @State() weekDays: any;
  @State() hasHintTextSlot = false;
  @State() hasWarningTextSlot = false;
  @State() hasErrorTextSlot = false;
  @State() timeValue = '';
  @State() dateFormat = '';
  @State() selectedTime: any;
  @State() timepickerDate;

  @Element() host: HTMLElement;

  /**
   *   Type of date selection enabled for the calendar. If the value is range, a user can select a date range in the calendar.
   */
  @Prop() mode: 'single date' | 'range' = 'single date';
  /**
   *   Earliest date a user can select in the calendar, if mode is range. Must be a valid ISO date format if set.
   */
  @Prop({ mutable: true }) minDate: string;
  /**
   *   Latest date a user can select in the calendar, if mode is range. Must be a valid ISO date format if set.
   */
  @Prop() maxDate: string;
  /**
   *   Starting date of the date range that is preselected in the calendar, if mode is range. Must be a date later than the min-date value and valid ISO date format.
   */
  @Prop({ mutable: true }) fromDate: string;
  /**
   *   Ending date of the date range that is preselected in the calendar, if mode is range. Must be a date earlier than the max-date value and valid ISO date format.
   */
  @Prop({ mutable: true }) toDate: string;
  /**
   *   Format in which the date values selected in the calendar are populated in the input box. Defaults to the locale specific display format.
   */
  @Prop({ mutable: true }) displayFormat: string;
  /**
   *   Date that is preselected in the calendar, if mode is single date or undefined. If set this must be valid ISO date format.
   */
  @Prop({ mutable: true }) value: string;
  /**
   * Name of the component, saved as part of form data.
   */
  @Prop() name = '';
  /**
   *   Text displayed in the input box before a user selects a date or date range.
   */
  @Prop({ mutable: true }) placeholder: string;

  //({ keyName: 'datepicker.update' })
  @Prop({ mutable: true })
  updateText = '';
  //@i18n({ keyName: 'datepicker.cancel' })
  @Prop({ mutable: true })
  cancelText = '';

  /**
   * Specifies the input box as a mandatory field and displays an asterisk next to the label. If the attribute’s value is undefined, the value is set to false.
   */
  @Prop() required = false;
  /**
   * Theme based on which the input of the datepicker is styled.
   */
  @Prop({ mutable: true }) state: 'normal' | 'warning' | 'error' = 'normal';

  /**
   * Minimum year that needs to be displayed in the year dropdown.
   */
  @Prop({ mutable: true }) minYear = 1970;

  /**
   * Maximum year that needs to be displayed in the year dropdown.
   */
  @Prop({ mutable: true }) maxYear = new Date().getFullYear();

  /**
   *   Locale for which datepicker needs to be shown. Defaults to browser's current locale.
   */
  @Prop({ mutable: true }) locale: string;

  /**
   * Make the input box as readonly. Default `false`
   */
  @Prop() readonly = false;

  /**
   * Make the datepicker box as disabled. Default `false`
   */
  @Prop() disabled = false;
  /**
   * Indicates if footer needs to be shown. Default `true`.
   */
  @Prop() showFooter = true;
  /**
   * Displays a clear icon in the text box. Clicking the icon clears the value. Default `false`
   */
  @Prop() clearInput = false;

  /**
   * Hint text displayed below the text box.
   */
  @Prop() hintText = '';
  /**
   * Warning text displayed below the text box.
   */
  @Prop() warningText = '';
  /**
   * Error text displayed below the text box.
   */
  @Prop() errorText = '';
  /**
   * Label displayed on the interface, for the component.
   */
  @Prop() label = '';
  /**
   * Whether the time-picker should be shown in the date-picker. Supports single date picker only.
   */
  @Prop() showTimePicker = false;
  /**
   * The props for the time picker. Refer the fw-timepicker for valid format.
   */
  @Prop() timeProps = {};
  /**
   * The format of time picker .
   */
  @Prop({ mutable: true }) timeFormat: string;
  /**
   * Debounce timer for date input.
   */
  @Prop() debounceTimer = 800;
  /**
   * Displays alert icon and tooltip when user inputs an invalid date in the textbox. Default value is true.
   */
  @Prop() showErrorOnInvalidDate = true;
  /**
   * Error text displayed on the tooltip for invalid date inputs.
   */
  @Prop() tooltipErrorText;
  /**
   * To make the datepicker occupy full width of the container. Default value is false.
   */
  @Prop() fullWidth = false;
  /**
   * Option to prevent the tooltip from being clipped when the component is placed inside a container with
   * `overflow: auto|hidden|scroll`.
   */
  @Prop() hoistTooltip = true;
  /**
   * Triggered when the update button clicked
   */
  @Event() fwChange: EventEmitter;

  /**
   * Triggered when the input box loses focus.
   */
  @Event() fwBlur: EventEmitter;

  /**
   * Triggered when text is entered in  input box.
   */
  @Event() fwDateInput: EventEmitter;

  private escapeHandler = null;
  private madeInert;
  private nativeInput;
  private isDisplayFormatSet = false;
  private isPlaceholderSet = false;
  private langChangRemoveListener;
  private isNextMonthRestricted = false;
  private isPrevMonthRestricted = false;
  private isDateInvalid = false;
  private initState = this.state;
  private isDateWithinMinDate = true;
  private isDateWithinMaxDate = true;
  private clickedDateValue;

  private makeDatePickerInert() {
    if (!this.madeInert) {
      /**
       * Focus trapping inside datepicker.
       */
      const focusableElements = getFocusableChildren(this.host);
      if (focusableElements.length) {
        this.firstFocusElement = focusableElements[0];
        this.lastFocusElement = focusableElements[focusableElements.length - 1];
        this.lastFocusElement.addEventListener('keydown', (e: any) => {
          !e.shiftKey &&
            e.keyCode === 9 &&
            this.focusElement(this.firstFocusElement);
        });
        this.firstFocusElement.addEventListener('keydown', (e: any) => {
          e.shiftKey &&
            e.keyCode === 9 &&
            this.focusElement(this.lastFocusElement);
        });
      }
      if (this.firstFocusElement) {
        this.focusElement(this.firstFocusElement);
      }
      this.madeInert = true;
    }
    this.escapeHandler = ((e: any) => {
      if (e.keyCode === 27) {
        this.showDatePicker = false;
        this.host.shadowRoot.querySelector('fw-popover').hide();
      }
    }).bind(this);
    document.addEventListener('keydown', this.escapeHandler);
  }

  private emitEvent(event, eventDetails) {
    this.fwChange.emit({
      event: event,
      name: this.name,
      value: eventDetails,
    });
  }

  focusElement(element: HTMLElement) {
    element.focus();
  }

  connectedCallback() {
    addRTL(this.host);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.escapeHandler);
    this.langChangRemoveListener?.();
  }

  private formatDate(value) {
    if (!value) return value;

    return this.displayFormat
      ? formatISO(
          parse(value, this.displayFormat, new Date(), {
            locale: this.langModule,
          })
        )
      : formatISO(new Date(value));
  }

  /**
   * Returns the date value in ISO format.
   */
  @Method()
  async getValue() {
    if (this.mode === 'range') {
      return {
        fromDate:
          (this.startDate &&
            formatISO(
              parse(
                format(new Date(this.startDate), this.displayFormat, {
                  locale: this.langModule,
                }),
                this.displayFormat,
                new Date(),
                {
                  locale: this.langModule,
                }
              )
            )) ||
          undefined,
        toDate:
          (this.endDate &&
            formatISO(
              parse(
                format(new Date(this.endDate), this.displayFormat, {
                  locale: this.langModule,
                }),
                this.displayFormat,
                new Date(),
                {
                  locale: this.langModule,
                }
              )
            )) ||
          undefined,
      };
    }
    return (
      (this.value &&
        formatISO(
          parse(this.value, this.displayFormat, new Date(), {
            locale: this.langModule,
          })
        )) ||
      undefined
    );
  }

  /**
   * Sets focus on a specific `fw-datepicker`. Use this method instead of the global `input.focus()`.
   */
  @Method()
  async setFocus(): Promise<void> {
    if (this.nativeInput) {
      this.nativeInput.setFocus?.();
    }
  }

  /**
   * Clears the input value and unselects selected date.
   */
  @Method()
  async clearValue(): Promise<void> {
    this.clearInputValue();
  }

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case 'Enter':
        this.host.shadowRoot.querySelector('fw-popover').show();
        break;
      case 'ArrowDown':
        event.preventDefault();
    }
    this.makeDatePickerInert();
  }

  @Listen('fwFocus')
  displayDatePicker(): void {
    this.showDatePicker = true;
  }

  @Listen('fwClick')
  handleButtonClick(e) {
    const target = e.composedPath()[0];
    const isUpdateRange = target.classList.value.includes('update-range-value');
    const isUpdateDate = target.classList.value.includes('update-date-value');
    const cancelText =
      this.cancelText || TranslationController.t('datepicker.cancel');
    const updateText =
      this.updateText || TranslationController.t('datepicker.update');

    if (isUpdateRange) {
      if (this.startDate && this.endDate) {
        this.updateValueAndEmitEvent(e);
      }
    } else if (isUpdateDate) {
      this.timeValue = this.selectedTime;
      if (this.isValidDateTime()) {
        this.setDateAndErrorState();
        this.updateValueAndEmitEvent(e);
      }
    }
    if (target.innerText === cancelText && !this.value) {
      if (this.mode === 'range') {
        this.startDate = this.endDate = undefined;
      } else {
        this.selectedDay = undefined;
      }
    }

    if (target.innerText === cancelText) {
      this.handlePopoverClose(e);
    }

    // Close datepicker only for fwClick event of Update and cancel buttons. Since this will
    // be triggered for month and year select dropdown as well the below check is added.
    if (target.innerText === updateText || target.innerText === cancelText) {
      this.showDatePicker = false;
      this.host.shadowRoot.querySelector('fw-popover').hide();
    }
  }

  /**
   * Listener to handle input changes
   */
  @Listen('fwInput')
  handleInputChanges(e) {
    const target = e.composedPath();
    this.handleInputChangeWithDebounce(e, target);
  }

  /**
   * Listener to handle Month Year dropdown.
   */
  @Listen('fwChange')
  handleMonthYearDropDownSelection(e) {
    if (e.composedPath()[0].tagName !== 'FW-DATEPICKER') {
      e.stopImmediatePropagation();
    }

    const newValue = e.detail && e.detail.value;

    if (!newValue) {
      return;
    }
    if (this.mode === 'range') {
      this.handleDateRangeDropDownUpdate(e, newValue);
      this.nextMonthDetails = this.getMonthDetails(this.toYear, this.toMonth);
    } else {
      this.handleSingleDateDropDownUpdate(e, newValue);
    }
    this.monthDetails = this.getMonthDetails(this.year, this.month);
  }

  handleInputChangeWithDebounce = debounce(
    (e, target) => {
      e.stopImmediatePropagation();
      this.emitEvent(e, target[0].value);
      this.fwDateInput.emit({
        event: e,
        name: this.name,
        value: target[0].value,
      });
      if (this.mode === 'range') {
        // Range input
        const val = target[0].value;

        if (!val) {
          this.value = undefined;
        }

        this.processRangeValueChange(val);
      } else {
        // Single Date input
        const val = target[0].value;
        if (!val) {
          this.value = undefined;
        }
        this.processValueChange(val);
      }
    },
    this,
    this.debounceTimer
  );

  handleSingleDateDropDownUpdate(e, newValue) {
    const isMonthUpdate = e
      .composedPath()[0]
      .classList.value.includes('single-month-selector');
    const isYearUpdate = e
      .composedPath()[0]
      .classList.value.includes('single-year-selector');
    const isTimeUpdate = e.composedPath()[0].tagName === 'FW-TIMEPICKER';

    if (isMonthUpdate) {
      this.month = this.shortMonthNames.indexOf(newValue);
    } else if (isYearUpdate) {
      this.year = newValue;
    } else if (isTimeUpdate) {
      this.timeValue = this.selectedTime = newValue;
    }
    this.checkYearRestriction();
  }

  handleDateRangeDropDownUpdate(e, newValue) {
    const isFromMonthUpdate = e
      .composedPath()[0]
      .classList.value.includes('from-month-selector');
    const isFromYearUpdate = e
      .composedPath()[0]
      .classList.value.includes('from-year-selector');
    const isToMonthUpdate = e
      .composedPath()[0]
      .classList.value.includes('to-month-selector');
    const isToYearUpdate = e
      .composedPath()[0]
      .classList.value.includes('to-year-selector');

    if (isFromMonthUpdate) {
      this.month = this.shortMonthNames.indexOf(newValue);
      if (this.month === 11) {
        this.toMonth = 0;
        this.toYear = this.yearCalculation(this.year, 1);
      } else {
        this.toMonth = this.month + 1;
      }
    } else if (isFromYearUpdate) {
      this.year = newValue;
      this.toYear =
        this.month === 11 ? this.yearCalculation(this.year, 1) : this.year;
    } else if (isToMonthUpdate) {
      this.toMonth = this.shortMonthNames.indexOf(newValue);
      if (this.toMonth === 0) {
        this.month = 11;
        this.year = this.yearCalculation(this.toYear, -1);
      } else {
        this.month = this.toMonth - 1;
      }
    } else if (isToYearUpdate) {
      this.toYear = newValue;
      this.year =
        this.toMonth === 0
          ? this.yearCalculation(this.toYear, -1)
          : this.toYear;
    }
  }

  yearCalculation(year, offset) {
    const resultYear = Number(year) + offset;
    return resultYear.toString();
  }

  getSupportedYears = () => {
    const yearsArr = [];
    if (+this.maxYear < +this.minYear) this.maxYear = +this.minYear;
    let year = +this.minYear;
    while (year <= +this.maxYear) {
      yearsArr.push(year.toString());
      year++;
    }
    return yearsArr;
  };

  getFormatFromLocale() {
    this.dateFormat = this.langModule?.formatLong?.date({ width: 'short' });
    return this.showTimePicker
      ? `${this.dateFormat} ${this.timeFormat}`
      : this.dateFormat;
  }

  @Watch('locale')
  async handleLocaleChange(newLocale) {
    this.langModule = await TranslationController.getDateLangModule(newLocale);
  }

  @Watch('minDate')
  handleMinDateChange() {
    this.monthDetails = this.getMonthDetails(this.year, this.month);
    this.mode === 'range' &&
      (this.nextMonthDetails = this.getMonthDetails(this.toYear, this.toMonth));
  }

  @Watch('maxDate')
  handleMaxDateChange() {
    this.monthDetails = this.getMonthDetails(this.year, this.month);
    this.mode === 'range' &&
      (this.nextMonthDetails = this.getMonthDetails(this.toYear, this.toMonth));
  }

  handleUserTimeZoneOffset(date) {
    return (
      new Date(date).valueOf() + new Date(date).getTimezoneOffset() * 60 * 1000
    );
  }

  async componentWillLoad() {
    if (this.mode === 'range' && this.showTimePicker) {
      throw Error('Time picker not supported in Date Range');
    }
    this.langModule = await TranslationController.getDateLangModule(
      this.locale
    );

    this.timeFormat ||= this.langModule?.formatLong?.time({
      width: 'short',
    });

    if (this.displayFormat) {
      this.isDisplayFormatSet = true;
      this.dateFormat = this.displayFormat;
      this.displayFormat = this.showTimePicker
        ? `${this.displayFormat} ${this.timeFormat}`
        : this.displayFormat;
    }
    if (this.placeholder) {
      this.isPlaceholderSet = true;
    }
    this.checkSlotContent();
    this.displayFormat = this.displayFormat || this.getFormatFromLocale();

    this.placeholder = this.placeholder || this.displayFormat;

    const onChange = TranslationController.onChange.bind(TranslationController);
    this.langChangRemoveListener = onChange('lang', async (locale) => {
      this.langModule = await TranslationController.getDateLangModule(locale);
      this.displayFormat = this.isDisplayFormatSet
        ? this.displayFormat
        : this.langModule?.formatLong?.date({ width: 'short' });

      this.placeholder = this.isPlaceholderSet
        ? this.placeholder
        : this.displayFormat;

      if (this.mode === 'range')
        this.placeholder = this.isPlaceholderSet
          ? this.placeholder
          : `${this.displayFormat} ${TranslationController.t(
              'datepicker.to'
            )} ${this.displayFormat}`;

      const monthNames = getMonthNames(this.langModule);
      this.shortMonthNames = monthNames.shortMonthNames;
      this.longMonthNames = monthNames.longMonthNames;
      this.weekDays = getWeekDays(this.langModule);
    });

    if (this.mode === 'range') {
      const today = new Date();
      let [fromDate, toDate] =
        this.value?.split(TranslationController.t('datepicker.to')) || [];
      fromDate = fromDate?.trim();
      toDate = toDate?.trim();
      if (isValid(parseISO(fromDate)) && isValid(parseISO(toDate))) {
        this.fromDate = fromDate;
        this.toDate = toDate;
      }
      if (
        (this.fromDate && !isValid(parseISO(this.fromDate))) ||
        (this.toDate && !isValid(parseISO(this.toDate)))
      ) {
        // Show current month and year if invalid date is provided
        this.year = getYear(today);
        this.month = getMonth(today);
      } else {
        const fromDate = new Date(this.handleUserTimeZoneOffset(this.fromDate));
        this.year = this.fromDate ? getYear(fromDate) : getYear(today);
        this.month = this.fromDate ? getMonth(fromDate) : getMonth(today);
      }
    } else {
      this.processInitDateValue();
    }
    this.setMinMaxYearAndDateValues();
    this.toMonth = this.month === 11 ? 0 : this.month + 1;
    this.toYear =
      this.toMonth === 0 ? this.yearCalculation(this.year, 1) : this.year;
    this.monthDetails = this.getMonthDetails(this.year, this.month);
    this.todayTimestamp = startOfDay(new Date()).valueOf();

    const monthNames = getMonthNames(this.langModule);
    this.shortMonthNames = monthNames.shortMonthNames;
    this.longMonthNames = monthNames.longMonthNames;
    this.weekDays = getWeekDays(this.langModule);
    if (this.value && this.mode !== 'range') {
      this.setDateAndErrorState(true);
      const utcTimeRegex =
        /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})/;
      this.value =
        this.showTimePicker || utcTimeRegex.test(this.value)
          ? format(new Date(this.value), this.displayFormat, {
              locale: this.langModule,
            })
          : format(
              new Date(this.handleUserTimeZoneOffset(this.value)),
              this.displayFormat,
              {
                locale: this.langModule,
              }
            );
    }
    this.showTimePicker && this.setTimepickerDate();
    this.setInitialValues();
    this.checkYearRestriction();
  }

  setInitialValues() {
    this.nextMonthDetails =
      this.month === 11
        ? this.getMonthDetails(this.yearCalculation(this.year, 1), 0)
        : this.getMonthDetails(this.year, this.month + 1);
    if (this.mode === 'range')
      this.placeholder = this.isPlaceholderSet
        ? this.placeholder
        : `${this.displayFormat} ${TranslationController.t('datepicker.to')} ${
            this.displayFormat
          }`;

    this.supportedYears = this.getSupportedYears();
    this.startDate =
      this.fromDate !== undefined
        ? parseISO(this.fromDate).valueOf()
        : undefined;
    this.endDate =
      this.toDate !== undefined ? parseISO(this.toDate).valueOf() : undefined;
    if (this.mode === 'range') {
      if (this.startDate && this.endDate) {
        const formattedFromDate = format(
          new Date(this.startDate),
          this.displayFormat,
          {
            locale: this.langModule,
          }
        );
        const formattedToDate = format(
          new Date(this.endDate),
          this.displayFormat,
          {
            locale: this.langModule,
          }
        );
        this.setDateAndErrorState();
        this.value = `${formattedFromDate} to ${formattedToDate}`;
      } else this.value = undefined;
    }
  }
  setDateAndErrorState(checkDate = false) {
    if (this.mode === 'range' && this.fromDate && this.toDate) {
      const fromDate = parse(this.fromDate, this.displayFormat, new Date(), {
        locale: this.langModule,
      }).valueOf();
      const toDate = parse(this.toDate, this.displayFormat, new Date(), {
        locale: this.langModule,
      }).valueOf();
      this.isDateInvalid = !this.isDatewithinRange(fromDate, toDate);
    } else if (this.mode !== 'range') {
      this.isDateInvalid =
        checkDate &&
        !this.isDateWithinMinMaxDate(parseISO(this.value).valueOf());
    }
    this.state =
      this.showErrorOnInvalidDate && this.isDateInvalid
        ? 'error'
        : this.initState;
  }

  setMinMaxYearAndDateValues() {
    if (this.minDate && this.maxDate)
      this.minDate =
        parseISO(this.minDate).valueOf() > parseISO(this.maxDate).valueOf()
          ? undefined
          : this.minDate;
    this.maxYear = this.maxDate
      ? getYear(new Date(this.handleUserTimeZoneOffset(this.maxDate)))
      : this.maxYear;
    this.minYear =
      this.maxYear > this.minYear
        ? this.minDate
          ? getYear(new Date(this.handleUserTimeZoneOffset(this.minDate)))
          : this.minYear
        : 1970;
  }

  processInitDateValue() {
    const today = new Date();
    if (!this.value) {
      this.year = getYear(today);
      this.month = getMonth(today);
    } else {
      if (!isValid(parseISO(this.value))) {
        // Show current date if invalid date is provided
        this.year = getYear(today);
        this.month = getMonth(today);
        this.selectedDay = getDate(today);
        this.value = undefined;
      } else {
        const utcTimeRegex =
          /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})/;
        const date =
          this.showTimePicker || utcTimeRegex.test(this.value)
            ? new Date(this.value)
            : new Date(this.handleUserTimeZoneOffset(this.value));
        this.year = getYear(date);
        this.month = getMonth(date);
        this.selectedDay = getDate(date);
        this.timeValue = format(getTime(date), 'HH:mm', {
          locale: this.langModule,
        });
        this.selectedTime = this.timeValue;
      }
    }
  }

  processRangeValueChange(val, emitChange = false) {
    let [fromDate, toDate] =
      val?.split(TranslationController.t('datepicker.to')) || [];
    fromDate = fromDate?.trim();
    toDate = toDate?.trim();

    const parsedFromDate = parse(fromDate, this.displayFormat, new Date(), {
      locale: this.langModule,
    });

    const parsedToDate = parse(toDate, this.displayFormat, new Date(), {
      locale: this.langModule,
    });

    const isValidFromDate = isValid(parsedFromDate);
    const isValidToDate = isValid(parsedToDate);

    const year = getYear(
      parse(fromDate, this.displayFormat, new Date(), {
        locale: this.langModule,
      })
    );
    const toYear = getYear(
      parse(toDate, this.displayFormat, new Date(), {
        locale: this.langModule,
      })
    );
    if (
      !isValidFromDate ||
      !isValidToDate ||
      !isMatch(fromDate, this.displayFormat, {
        locale: this.langModule,
      }) ||
      !isMatch(toDate, this.displayFormat, {
        locale: this.langModule,
      }) ||
      year < this.minYear ||
      year > this.maxYear ||
      toYear < this.minYear ||
      toYear > this.maxYear ||
      !this.isDatewithinRange(parsedFromDate.valueOf(), parsedToDate.valueOf())
    ) {
      // Invalid date format
      this.isDateInvalid = !!val;
      this.state =
        this.showErrorOnInvalidDate && this.isDateInvalid
          ? 'error'
          : this.initState;
      this.startDate = this.endDate = undefined;
      this.fromDate = this.toDate = undefined;
      if (!emitChange) this.value = val;
      return;
    }

    this.year = year;
    this.fromDate = fromDate;
    this.toDate = toDate;
    const chosenFromMonth = getMonth(
      parse(fromDate, this.displayFormat, new Date(), {
        locale: this.langModule,
      })
    );
    const chosenToMonth = getMonth(
      parse(toDate, this.displayFormat, new Date(), {
        locale: this.langModule,
      })
    );
    if (chosenFromMonth === chosenToMonth && this.toMonth === chosenFromMonth) {
      this.toMonth = chosenFromMonth;
      this.month = this.toMonth - 1;
    } else {
      this.month = getMonth(
        parse(fromDate, this.displayFormat, new Date(), {
          locale: this.langModule,
        })
      );
      this.toMonth = this.month === 11 ? 0 : this.month + 1;
    }
    this.startDate = parse(fromDate, this.displayFormat, new Date(), {
      locale: this.langModule,
    }).valueOf();

    this.endDate = parse(toDate, this.displayFormat, new Date(), {
      locale: this.langModule,
    }).valueOf();
    this.toYear =
      this.toMonth === 0 ? this.yearCalculation(this.year, 1) : this.year;
    const formattedFromDate = format(
      new Date(this.startDate),
      this.displayFormat,
      {
        locale: this.langModule,
      }
    );
    const formattedToDate = format(new Date(this.endDate), this.displayFormat, {
      locale: this.langModule,
    });
    this.value = `${formattedFromDate} to ${formattedToDate}`;
    this.isDateInvalid = false;
    this.state =
      this.showErrorOnInvalidDate && this.isDateInvalid
        ? 'error'
        : this.initState;
    emitChange &&
      this.fwChange.emit({
        value: val,
      });
  }

  processValueChange(val, emitChange = false) {
    // show error if not ISO format and not display format
    const parsedDate = parse(val, this.displayFormat, new Date(), {
      locale: this.langModule,
    });
    const year = getYear(
      parse(val, this.displayFormat, new Date(), {
        locale: this.langModule,
      })
    );
    if (
      year < this.minYear ||
      year > this.maxYear ||
      !isValid(parsedDate) ||
      !isMatch(val, this.displayFormat, {
        locale: this.langModule,
      }) ||
      !this.isDateWithinMinMaxDate(parsedDate.valueOf(), false)
    ) {
      this.isDateInvalid = !!val;
      this.state =
        this.showErrorOnInvalidDate && this.isDateInvalid
          ? 'error'
          : this.initState;
      this.selectedDay = undefined;
      if (!emitChange) this.value = this.clickedDateValue = val;
      return;
    }

    this.year = year;

    this.month = getMonth(
      parse(val, this.displayFormat, new Date(), {
        locale: this.langModule,
      })
    );
    this.selectedDay = getDate(
      parse(val, this.displayFormat, new Date(), {
        locale: this.langModule,
      })
    );
    if (this.showTimePicker) {
      this.timeValue = format(getTime(new Date(val)), 'HH:mm', {
        locale: this.langModule,
      });
      this.selectedTime = this.timeValue;
      // set the date value in date field
      this.setTimepickerDate();
    }
    this.value = this.formatDateTime();

    this.clickedDateValue = this.value;
    this.setDateAndErrorState();
    emitChange &&
      this.fwChange.emit({
        value: val,
      });
  }

  @Watch('value')
  watchValueChanged(value) {
    if (!value) {
      this.startDate = undefined;
      this.endDate = undefined;
      this.selectedDay = undefined;
      this.value = undefined;
      const date = new Date();
      this.year = getYear(date);
      this.month = getMonth(date);
      this.monthDetails = this.getMonthDetails(this.year, this.month);
      this.timepickerDate = this.selectedTime = undefined;
      this.timeValue = '';
    } else {
      if (this.mode !== 'range') {
        // if the value is of the ISO UTC time format, timezone offset need not be calculated
        // when datepicker is used in form component, the value will be passed to form in UTC ISO format, hence skipping.
        const utcTimeRegex =
          /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})/;
        // If ISO format, format it to display format and validate
        try {
          if (isValid(parseISO(value)))
            value =
              this.showTimePicker || utcTimeRegex.test(value)
                ? format(new Date(value), this.displayFormat, {
                    locale: this.langModule,
                  })
                : format(
                    new Date(this.handleUserTimeZoneOffset(value)),
                    this.displayFormat,
                    {
                      locale: this.langModule,
                    }
                  );
          this.processValueChange(value, true);
          this.checkYearRestriction();
        } catch (e) {
          console.log('Invalid date provided !', e);
        }
      } else {
        try {
          // If ISO format, format it to display format and validate
          let [fromDate, toDate] =
            value?.split(TranslationController.t('datepicker.to')) || [];
          fromDate = fromDate?.trim();
          toDate = toDate?.trim();
          if (isValid(parseISO(fromDate)) && isValid(parseISO(toDate))) {
            this.fromDate = fromDate;
            this.toDate = toDate;
            fromDate = format(
              new Date(this.handleUserTimeZoneOffset(this.fromDate)),
              this.displayFormat,
              {
                locale: this.langModule,
              }
            );
            toDate = format(
              new Date(this.handleUserTimeZoneOffset(this.toDate)),
              this.displayFormat,
              {
                locale: this.langModule,
              }
            );
            value = `${fromDate} to ${toDate}`;
          }
          this.processRangeValueChange(value, true);
        } catch (e) {
          console.log('Invalid date provided !', e);
        }
      }
    }
  }

  setTimepickerDate = (): string => {
    try {
      const date = format(
        new Date(this.year, this.month, this.selectedDay),
        this.dateFormat,
        {
          locale: this.langModule,
        }
      );
      this.timepickerDate = date ?? '';
    } catch (error) {
      return '';
    }
  };

  isValidDateTime = (): boolean => {
    const dateNodes = this.host.shadowRoot.querySelectorAll('.c-day-container');
    // To check if user has selected any date and clicked update, since this.selectedDay will be set if any previous date value already exists.
    const isDateSelected =
      dateNodes?.length > 0 &&
      Object.values(dateNodes).some((node) => {
        return node.classList.contains('highlight-blue');
      });
    if (this.showTimePicker) {
      return !!(isDateSelected && this.selectedDay && this.timeValue);
    }
    if (this.clickedDateValue || this.value) {
      const parsedDate = parse(
        this.clickedDateValue || this.value || this.formatDateTime(),
        this.displayFormat,
        new Date(),
        {
          locale: this.langModule,
        }
      ).valueOf();
      return (
        this.selectedDay &&
        isDateSelected &&
        this.isDateWithinMinMaxDate(parsedDate)
      );
    }
    return this.selectedDay;
  };

  formatDateTime = (): string => {
    if (this.showTimePicker) {
      if (!this.timeValue) return;
      const [hour, minute] = this.timeValue.split(':');
      return format(
        new Date(
          this.year,
          this.month,
          this.selectedDay,
          parseInt(hour),
          parseInt(minute)
        ),
        this.displayFormat,
        {
          locale: this.langModule,
        }
      );
    }
    return format(
      new Date(this.year, this.month, this.selectedDay),
      this.displayFormat,
      {
        locale: this.langModule,
      }
    );
  };

  getDayDetails = (args) => {
    const date = args.index - args.firstDay;
    const day = args.index % 7;
    let prevMonth = args.month - 1;
    let prevYear = Number(args.year);
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    const prevMonthNumberOfDays =
      getDaysInMonth(new Date(prevYear, prevMonth)) || 0;
    const _date =
      (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
    const month = this._getValidDateInMonth(date, args);
    const timestamp = new Date(args.year, args.month, _date).valueOf();
    return { date: _date, day, month, timestamp };
  };

  private _getValidDateInMonth(date, args) {
    if (date < 0 || args.year > this.maxYear || this.minYear > args.year) {
      return -1;
    }
    if (this.minDate !== undefined && this.maxDate !== undefined) {
      const minDate = parseISO(this.minDate);
      const maxDate = parseISO(this.maxDate);
      if (!isValid(minDate) || !isValid(maxDate)) {
        // Invalid minDate or maxDate provided.
        return;
      }
      const argDate = new Date(args.year, args.month, date + 1);

      const isValidDate =
        minDate.valueOf() <= argDate.valueOf() &&
        argDate.valueOf() <= maxDate.valueOf();
      return !isValidDate ? -1 : date >= args.numberOfDays ? 1 : 0;
    } else if (this.minDate !== undefined) {
      const minDate = parseISO(this.minDate);
      if (!isValid(minDate)) {
        // Invalid minDate provided.
        return;
      }
      const argDate = new Date(args.year, args.month, date + 1);

      const isValidDate = minDate.valueOf() <= argDate.valueOf();
      return !isValidDate ? -1 : date >= args.numberOfDays ? 1 : 0;
    } else if (this.maxDate !== undefined) {
      const maxDate = parseISO(this.maxDate);
      if (!isValid(maxDate)) {
        // Invalid minDate or maxDate provided.
        return;
      }
      const argDate = new Date(args.year, args.month, date + 1);

      const isValidDate = maxDate.valueOf() >= argDate.valueOf();
      return !isValidDate ? -1 : date >= args.numberOfDays ? 1 : 0;
    }
    return date >= args.numberOfDays ? 1 : 0;
  }

  private getMonthDetails = (year, month) => {
    const firstDay = new Date(year, month).getDay();
    const numberOfDays = getDaysInMonth(new Date(year, month)) || 0;
    const monthArray = [];
    const rows = 6;
    let currentDay;
    let index = 0;
    const cols = 7;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        currentDay = this.getDayDetails({
          index,
          numberOfDays,
          firstDay,
          year,
          month,
        });
        monthArray.push(currentDay);
        index++;
      }
    }
    return monthArray;
  };

  isDateWithinMinMaxDate(date, checkYear = true) {
    this.isDateWithinMaxDate =
      this.maxDate && !(date <= parseISO(this.maxDate).valueOf())
        ? false
        : true;
    this.isDateWithinMinDate =
      this.minDate && !(parseISO(this.minDate).valueOf() <= date)
        ? false
        : true;
    if (checkYear)
      return (
        this.isDateWithinMaxDate &&
        this.isDateWithinMinDate &&
        this.year <= this.maxYear &&
        this.minYear <= this.year
      );
    else return this.isDateWithinMaxDate && this.isDateWithinMinDate;
  }

  isDatewithinRange(fromDate, toDate) {
    if (this.minDate && !this.maxDate)
      return (
        parseISO(this.minDate).valueOf() <= toDate &&
        parseISO(this.minDate).valueOf() <= fromDate &&
        fromDate <= toDate
      );
    if (this.maxDate && !this.minDate)
      return (
        toDate <= parseISO(this.maxDate).valueOf() &&
        fromDate <= parseISO(this.maxDate).valueOf() &&
        fromDate <= toDate
      );
    if (this.maxDate && this.minDate)
      return (
        toDate <= parseISO(this.maxDate).valueOf() &&
        parseISO(this.minDate).valueOf() <= fromDate &&
        fromDate <= toDate
      );
    else return fromDate <= toDate;
  }

  checkYearRestriction() {
    this.isNextMonthRestricted =
      Number(this.year) >= this.maxYear && this.month === 11 ? true : false;
    this.isPrevMonthRestricted =
      Number(this.year) <= this.minYear && this.month === 0 ? true : false;
  }

  setMonth = (offset) => {
    if (
      (offset === 1 && this.isNextMonthRestricted) ||
      (offset === -1 && this.isPrevMonthRestricted)
    )
      return;

    let year = Number(this.year);
    let month = this.month + offset;
    if (month === -1) {
      month = 11;
      year--;
    } else if (month === 12) {
      month = 0;
      year++;
    }
    this.year = year.toString();
    this.month = month;
    this.toMonth = this.month === 11 ? 0 : this.month + 1;
    this.toYear =
      this.toMonth === 0 ? this.yearCalculation(this.year, 1) : this.year;
    this.monthDetails = this.getMonthDetails(year, month);
    this.nextMonthDetails =
      this.month === 11
        ? this.getMonthDetails(this.yearCalculation(this.year, 1), 0)
        : this.getMonthDetails(this.year, this.month + 1);
    this.checkYearRestriction();
  };

  isCurrentDay = (day) => {
    return day.timestamp === this.todayTimestamp;
  };

  isSelectedDay = ({ date, timestamp }) => {
    if (this.mode !== 'range') {
      const parsedDate = parse(
        this.clickedDateValue || this.value,
        this.displayFormat,
        new Date(),
        {
          locale: this.langModule,
        }
      );
      const isValidDate = isValid(parsedDate);
      return isValidDate
        ? date === this.selectedDay &&
            getMonth(parsedDate) === getMonth(timestamp) &&
            getYear(parsedDate) === getYear(timestamp)
        : date === this.selectedDay;
    }
    return timestamp === this.startDate || timestamp === this.endDate;
  };

  handleDateHover = (day): void => {
    if (this.startDate && !this.endDate) {
      if (this.startDate > day.timestamp) {
        this.endDate = this.startDate;
        this.startDate = undefined;
      }
      this.dateHovered = day.timestamp;
    } else if (!this.startDate && this.endDate) {
      if (this.endDate < day.timestamp) {
        this.startDate = this.endDate;
        this.endDate = undefined;
      }
      this.dateHovered = day.timestamp;
    }
  };

  handleKeyUp(e, day) {
    if (e.code === 'Enter') {
      if (
        e
          .composedPath()
          .find(
            (e) => e.classList && e.classList.value === 'mdp-range-container'
          )
      ) {
        // Range Container
        this.onDateClick(e, day);
        if (this.startDate && this.endDate) {
          this.startDateFormatted = format(
            new Date(this.startDate),
            this.displayFormat,
            {
              locale: this.langModule,
            }
          );
          this.endDateFormatted = format(
            new Date(this.endDate),
            this.displayFormat,
            {
              locale: this.langModule,
            }
          );
          this.value = this.startDateFormatted + ' to ' + this.endDateFormatted;
          this.emitEvent(e, {
            fromDate: this.formatDate(this.startDateFormatted),
            toDate: this.formatDate(this.endDateFormatted),
          });
          this.showDatePicker = false;
          this.host.shadowRoot.querySelector('fw-popover').hide();
        }
      } else {
        // Single Date Container
        this.onDateClick(e, day);
        this.value = format(
          new Date(this.year, this.month, this.selectedDay),
          this.displayFormat,
          {
            locale: this.langModule,
          }
        );
        this.emitEvent(e, this.formatDate(this.value));
        this.showDatePicker = false;
        this.host.shadowRoot.querySelector('fw-popover').hide();
      }
    }
  }

  isInRange = ({ timestamp }) => {
    const { endDate } = this;
    const { startDate } = this;

    if (startDate === endDate) return;
    return (
      startDate && endDate && timestamp >= startDate && timestamp <= endDate
    );
  };

  isHoverInRange({ timestamp }) {
    const { startDate, endDate, dateHovered } = this;
    const startDateCondtion =
      startDate &&
      dateHovered &&
      timestamp <= dateHovered &&
      timestamp >= startDate;
    const endDateCondition =
      endDate &&
      dateHovered &&
      timestamp >= dateHovered &&
      timestamp <= endDate;
    return startDateCondtion || endDateCondition;
  }

  updateValueAndEmitEvent(e) {
    if (this.showSingleDatePicker()) {
      this.value = this.formatDateTime();
      this.showTimePicker && this.setTimepickerDate();
      this.emitEvent(e, this.formatDate(this.value));
    } else if (this.showDateRangePicker()) {
      this.startDateFormatted = format(this.startDate, this.displayFormat, {
        locale: this.langModule,
      });

      this.endDateFormatted = format(this.endDate, this.displayFormat, {
        locale: this.langModule,
      });

      this.fromDate = this.startDateFormatted;
      this.toDate = this.endDateFormatted;

      this.value = this.startDateFormatted + ' to ' + this.endDateFormatted;
      this.emitEvent(e, {
        fromDate: this.formatDate(this.startDateFormatted),
        toDate: this.formatDate(this.endDateFormatted),
      });
    }
  }

  onDateClick = (e, { date, timestamp }) => {
    if (this.showSingleDatePicker()) {
      this.selectedDay = date;
      this.clickedDateValue = this.formatDateTime();
      this.showTimePicker && this.setTimepickerDate();
      if (!this.showFooter) {
        if (this.showTimePicker) this.timeValue = this.selectedTime;
        this.updateValueAndEmitEvent(e);
        this.showDatePicker = false;
        this.host.shadowRoot.querySelector('fw-popover').hide();
      }
    } else if (this.showDateRangePicker()) {
      this.handleRangeSelection(timestamp);
      if (!this.showFooter) {
        if (this.startDate && this.endDate) {
          this.updateValueAndEmitEvent(e);
          this.showDatePicker = false;
          this.host.shadowRoot.querySelector('fw-popover').hide();
        }
      }
      this.dateHovered = '';
    }
  };

  clearInputValue(): void {
    if (this.mode !== 'range') {
      if (this.selectedDay) {
        this.selectedDay = undefined;
      }
    } else {
      if (this.startDate && this.endDate) {
        this.startDate = this.endDate = undefined;
      }
    }
    this.value = undefined;
    this.isDateInvalid = false;
    this.state = this.initState;
  }

  handleInputClear = (e: any) => {
    this.clearInputValue();
    this.emitEvent(e, undefined);
  };

  // handle cancel and popover close
  handlePopoverClose = (e: any) => {
    if (['FW-SELECT', 'FW-TIMEPICKER'].includes(e.target?.tagName)) return;
    if (this.mode === 'range') {
      // handle resetting of startDate and endDate on clicking cancel
      if (this.value && !this.isDateInvalid) {
        let [fromDateStr, toDateStr] =
          this.value?.split(TranslationController.t('datepicker.to')) || [];
        fromDateStr = fromDateStr?.trim();
        toDateStr = toDateStr?.trim();
        const parsedFromDate = parse(
          fromDateStr,
          this.displayFormat,
          new Date(),
          {
            locale: this.langModule,
          }
        ).valueOf();
        const parsedToDate = parse(toDateStr, this.displayFormat, new Date(), {
          locale: this.langModule,
        }).valueOf();
        if (this.startDate !== parsedFromDate) {
          this.startDate = parsedFromDate;
        }
        if (this.endDate !== parsedToDate) {
          this.endDate = parsedToDate;
        }
      } else if ((!this.startDate && !this.endDate) || this.isDateInvalid) {
        this.startDate = this.endDate = undefined;
      }
    } else {
      // handle resetting of selectedDay on clicking cancel
      if (this.value) {
        this.clickedDateValue = this.value;
        const parsedDate = parse(this.value, this.displayFormat, new Date(), {
          locale: this.langModule,
        });
        const date = getDate(parsedDate);
        if (!this.isDateInvalid) {
          if (this.selectedDay !== date) this.selectedDay = date;
        } else {
          this.selectedDay = this.clickedDateValue = undefined;
        }
        if (this.showTimePicker) {
          this.timeValue = format(getTime(new Date(this.value)), 'HH:mm', {
            locale: this.langModule,
          });
          this.timepickerDate = format(new Date(this.value), this.dateFormat, {
            locale: this.langModule,
          });
        }
      } else {
        this.selectedDay = undefined;
        if (this.showTimePicker) {
          this.timepickerDate = undefined;
          this.timeValue = '';
        }
      }
      if (this.timeValue) {
        if (this.selectedTime !== this.timeValue) {
          this.selectedTime = this.timeValue;
        }
      } else this.selectedTime = this.timepickerDate = undefined;
    }
  };

  renderInvalidAlert() {
    return (
      <div class='invalid-alert' slot='input-suffix'>
        <fw-tooltip
          distance='13'
          content={
            this.tooltipErrorText ||
            TranslationController.t('datepicker.tooltipError')
          }
          hoist={this.hoistTooltip}
        >
          <fw-icon name='alert' size={14}></fw-icon>
        </fw-tooltip>
      </div>
    );
  }

  private handleRangeSelection(timestamp) {
    if (this.startDate && this.endDate) {
      this.endDate = undefined;
      this.startDate = timestamp;
    } else if (this.startDate && !this.endDate) {
      if (timestamp >= this.startDate) {
        this.endDate = timestamp;
      } else if (timestamp < this.startDate) {
        this.endDate = this.startDate;
        this.startDate = timestamp;
      }
    } else if (!this.startDate && this.endDate) {
      this.startDate = timestamp;
    } else if (!this.startDate && !this.endDate) {
      this.startDate = timestamp;
    }
  }

  getCellStyle(day) {
    let cellStyle = 'c-day-container';
    if (day.month !== 0) {
      cellStyle += ' disabled';
    }
    if (this.isCurrentDay(day)) {
      cellStyle += ' highlight';
    }
    if (this.isSelectedDay(day)) {
      cellStyle += ' highlight-blue';
    }
    if (this.startDate && this.endDate && this.isInRange(day)) {
      cellStyle += ' highlight-range';
    }
    if (
      ((this.startDate && !this.endDate) ||
        (!this.startDate && this.endDate)) &&
      this.isHoverInRange(day)
    ) {
      cellStyle += ' highlight-range';
    }
    if (day.timestamp === this.startDate) {
      cellStyle += ' start-day';
    }
    if (day.timestamp === this.endDate) {
      cellStyle += ' end-day';
    }
    if (
      this.startDate &&
      this.dateHovered < this.startDate &&
      day.timestamp === this.dateHovered
    ) {
      cellStyle += ' start-day';
    } else if (
      this.endDate &&
      this.dateHovered < this.endDate &&
      day.timestamp === this.dateHovered
    ) {
      cellStyle += ' start-day';
    } else if (
      this.startDate &&
      this.dateHovered > this.startDate &&
      day.timestamp === this.dateHovered
    ) {
      cellStyle += ' end-day';
    }

    return cellStyle;
  }

  private renderCalendar(monthDetails) {
    const days = monthDetails.map((day, index) => {
      return (
        <div class={this.getCellStyle(day)} key={index}>
          <div class='cdc-day'>
            <span
              role='button'
              tabindex={day.month === -1 || day.month === 1 ? '-1' : '0'}
              onClick={(e) => this.onDateClick(e, day)}
              onMouseOver={() => this.handleDateHover(day)}
              onFocus={() => this.handleDateHover(day)}
              onKeyDown={handleKeyDown(() => this.handleDateHover(day))}
              onKeyUp={(e) => this.handleKeyUp(e, day)}
            >
              {day.date}
            </span>
          </div>
        </div>
      );
    });
    return (
      <div class='c-container'>
        <div class='cc-head'>
          {this.weekDays.map((day, index) => (
            <div key={index} class='cch-name'>
              {day}
            </div>
          ))}
        </div>
        <div class='cc-body'>{days}</div>
      </div>
    );
  }
  private showSingleDatePicker() {
    return this.showDatePicker && this.mode !== 'range';
  }
  private showDateRangePicker() {
    return this.showDatePicker && this.mode === 'range';
  }

  private onBlur = async (e: Event) => {
    e.stopImmediatePropagation();
    if ((e as any)?.detail?.event?.relatedTarget?.tagName !== 'SPAN') {
      this.fwBlur.emit({
        event: e,
        name: this.name,
      });
    }
  };

  checkSlotContent() {
    this.hasHintTextSlot = hasSlot(this.host, 'hint-text');
    this.hasWarningTextSlot = hasSlot(this.host, 'warning-text');
    this.hasErrorTextSlot = hasSlot(this.host, 'error-text');
  }

  renderNavButtons(): JSX.Element {
    return (
      <div class='btns'>
        <div class='mdpch-button'>
          <div
            role='button'
            tabindex='0'
            class={`mdpchb-inner ${this.isPrevMonthRestricted && 'disabled'}`}
            onClick={() => this.setMonth(-1)}
            onKeyDown={handleKeyDown(() => this.setMonth(-1))}
          >
            <span class='mdpchbi-left-arrow'></span>
          </div>
        </div>
        <div class='mdpch-button-right'>
          <div
            role='button'
            tabindex='0'
            class={`mdpchb-inner ${this.isNextMonthRestricted && 'disabled'}`}
            onClick={() => this.setMonth(1)}
            onKeyDown={handleKeyDown(() => this.setMonth(1))}
          >
            <span class='mdpchbi-right-arrow'></span>
          </div>
        </div>
      </div>
    );
  }

  renderSupportedYears(chosenYear) {
    // The if/else block adds the year value to the year dropdown if its not present, i.e for invalid dates, we will add and remove it once the user moves to a valid month calendar
    // this is to overcome the issue of year dropdown select value disappearing, if the year value is not present and selected in the dropdown
    // https://github.com/freshworks/crayons/issues/826
    const isChosenYearPresent = this.supportedYears.find((year) => {
      return +year === +chosenYear;
    });
    if (!isChosenYearPresent) {
      this.supportedYears.push(chosenYear.toString());
      this.supportedYears.sort();
    } else {
      +this.supportedYears[this.supportedYears.length - 1] !== +this.maxYear &&
        +this.supportedYears[this.supportedYears.length - 1] !== +chosenYear &&
        this.supportedYears.pop(); // to avoid re rendering array.pop is used rather than filtering and destructuring
    }
    return this.supportedYears.map((year, i) => ({
      value: year,
      key: i,
      selected: +year === +chosenYear,
      text: year,
    }));
  }

  renderFooter(): JSX.Element {
    return (
      <div class='mdpc-footer'>
        <fw-button color='secondary' class='close-date-picker'>
          {this.cancelText || TranslationController.t('datepicker.cancel')}
        </fw-button>
        <fw-button
          color='primary'
          class={
            this.mode === 'range' ? 'update-range-value' : 'update-date-value'
          }
        >
          {this.updateText || TranslationController.t('datepicker.update')}
        </fw-button>
      </div>
    );
  }

  renderTimePicker(): JSX.Element {
    return (
      <div class='time-container'>
        <div>
          <span>{TranslationController.t('datepicker.date')}</span>
          <fw-input
            placeholder={this.dateFormat}
            value={this.timepickerDate}
            readonly
          ></fw-input>
        </div>
        <div>
          <span>{TranslationController.t('datepicker.time')}</span>
          <fw-timepicker
            class='mdc-time'
            sameWidth={false}
            locale={this.locale}
            caret={false}
            optionsPlacement='bottom-end'
            format={this.timeFormat}
            value={this.timeValue}
            allowDeselect={false}
            {...this.timeProps}
          ></fw-timepicker>
        </div>
      </div>
    );
  }

  render(): JSX.Element {
    const { host, name, value } = this;

    renderHiddenField(host, name, value);

    return (
      <FieldControl
        inputId={this.name}
        label={this.label}
        labelId={`${this.label}-${this.name}`}
        state={this.state}
        hintTextId={`hint-${this.name}`}
        hintText={this.hintText}
        hasHintTextSlot={this.hasHintTextSlot}
        errorTextId={`error-${this.name}`}
        errorText={this.errorText}
        hasErrorTextSlot={this.hasErrorTextSlot}
        warningTextId={`warning-${this.name}`}
        warningText={this.warningText}
        hasWarningTextSlot={this.hasWarningTextSlot}
        required={this.required}
      >
        <fw-popover
          same-width='false'
          distance='8'
          placement='bottom-start'
          fallbackPlacements={['top-start']}
          hide-on-tab='false'
          onFwHide={this.handlePopoverClose}
          hoist
        >
          <div
            role='combobox'
            aria-controls='datepicker'
            aria-expanded={this.showDatePicker}
            tabindex='-1'
            onClick={() => !this.disabled && (this.showDatePicker = true)}
            onKeyUp={() => !this.disabled && (this.showDatePicker = true)}
            slot='popover-trigger'
            style={{
              display: this.fullWidth ? 'block' : 'inline-flex',
              alignItems: 'center',
            }}
          >
            <fw-input
              value={this.value}
              name={this.name}
              disabled={this.disabled}
              placeholder={this.placeholder}
              required={this.required}
              onFwBlur={this.onBlur}
              ref={(el) => (this.nativeInput = el)}
              state={this.state}
              readonly={this.showTimePicker || this.readonly}
              clearInput={this.clearInput}
              onFwInputClear={this.handleInputClear}
              style={{
                width: this.fullWidth
                  ? '100%'
                  : this.mode === 'range'
                  ? '235px'
                  : '200px',
              }}
            >
              {this.isDateInvalid &&
                this.showErrorOnInvalidDate &&
                this.renderInvalidAlert()}
              <div class='icon-calendar' slot='input-suffix'>
                <div
                  class={`separator ${this.state === 'error' ? ' error' : ''}`}
                ></div>
                <span
                  class={`date-icon ${this.state === 'error' ? ' error' : ''}`}
                >
                  <fw-icon
                    name={this.showTimePicker ? 'calendar-time' : 'calendar'}
                  ></fw-icon>
                </span>
              </div>
            </fw-input>
          </div>
          {this.showSingleDatePicker() ? (
            <div
              id='datepicker'
              class='datepicker'
              slot='popover-content'
              ref={(el) => (this.popoverContentElement = el)}
            >
              {this.showTimePicker && this.renderTimePicker()}
              <div class='mdp-container'>
                {/* Head section */}
                <div class='mdpc-head'>
                  <div class='mdpch-container'>
                    <span class='mdpchc-month'>
                      <fw-select
                        class='first single-month-selector'
                        value={this.shortMonthNames[this.month]}
                        same-width='false'
                        options-placement='bottom-start'
                        variant='button'
                        options={this.longMonthNames.map((month, i) => ({
                          value: this.shortMonthNames[i],
                          key: i,
                          selected: month === this.longMonthNames[this.month],
                          text: month,
                        }))}
                        allowDeselect={false}
                        boundary={this.popoverContentElement}
                      ></fw-select>
                    </span>

                    <span class='mdpchc-year'>
                      <fw-select
                        class='last single-year-selector'
                        value={this.year}
                        same-width='false'
                        options-placement='bottom-start'
                        variant='button'
                        options={this.renderSupportedYears(this.year)}
                        allow-deselect='false'
                        boundary={this.popoverContentElement}
                      ></fw-select>
                    </span>
                  </div>
                  {this.renderNavButtons()}
                </div>
                {/* Body Section */}
                <div class='mdpc-body'>
                  {this.renderCalendar(this.monthDetails)}
                </div>
              </div>
              {/* Footer Section */}
              {this.showFooter && this.renderFooter()}
            </div>
          ) : (
            ''
          )}
          {this.showDateRangePicker() ? (
            <div
              id='datepicker'
              class='daterangepicker'
              slot='popover-content'
              ref={(el) => (this.popoverContentElement = el)}
            >
              <div class='mdp-range-container'>
                {/* Head section */}
                <div class='mdpc-head'>
                  <div class='mdpch-container'>
                    <span class='mdpchc-month'>
                      <fw-select
                        class='first from-month-selector'
                        value={this.shortMonthNames[this.month]}
                        same-width='false'
                        variant='button'
                        options-placement='bottom-start'
                        options={this.longMonthNames.map((month, i) => ({
                          value: this.shortMonthNames[i],
                          key: i,
                          selected: month === this.longMonthNames[this.month],
                          text: month,
                        }))}
                        allowDeselect={false}
                        boundary={this.popoverContentElement}
                      ></fw-select>
                    </span>
                    <span class='mdpchc-year'>
                      <fw-select
                        class='last from-year-selector'
                        value={this.year}
                        same-width='false'
                        options-placement='bottom-start'
                        variant='button'
                        options={this.renderSupportedYears(this.year)}
                        allow-deselect='false'
                        boundary={this.popoverContentElement}
                      ></fw-select>
                    </span>
                  </div>
                  <div class='mdpch-container-right'>
                    <span class='mdpchc-month'>
                      <fw-select
                        class='first to-month-selector'
                        same-width='false'
                        variant='button'
                        value={this.shortMonthNames[this.toMonth]}
                        options-placement='bottom-start'
                        options={this.longMonthNames.map((month, i) => ({
                          value: this.shortMonthNames[i],
                          key: i,
                          selected: month === this.longMonthNames[this.toMonth],
                          text: month,
                        }))}
                        allowDeselect={false}
                        boundary={this.popoverContentElement}
                      ></fw-select>
                    </span>
                    <span class='mdpchc-year'>
                      <fw-select
                        class='last to-year-selector'
                        value={this.toYear}
                        same-width='false'
                        options-placement='bottom-start'
                        variant='button'
                        options={this.renderSupportedYears(this.toYear)}
                        allow-deselect='false'
                        boundary={this.popoverContentElement}
                      ></fw-select>
                    </span>
                  </div>
                  {this.renderNavButtons()}
                </div>
                {/* Body Section */}
                <div class='body-container'>
                  <div class='mdpc-body'>
                    {this.renderCalendar(this.monthDetails)}
                  </div>
                  <div class='mdpc-body mdpc-body-right'>
                    {this.renderCalendar(this.nextMonthDetails)}
                  </div>
                </div>
              </div>
              {/* Footer Section */}
              {this.showFooter && this.renderFooter()}
            </div>
          ) : (
            ''
          )}
        </fw-popover>
      </FieldControl>
    );
  }
}
