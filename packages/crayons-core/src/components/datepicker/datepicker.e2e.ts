import { newE2EPage } from '@stencil/core/testing';
import { format, addMonths, getMonth, parse } from 'date-fns';

describe('fw-datepicker', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-datepicker></fw-datepicker>');
    const element = await page.find('fw-datepicker');
    expect(element).toHaveClass('hydrated');
  });

  it('should show and hide the datepicker popup when click', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-datepicker></fw-datepicker>');
    const element = await page.find('fw-datepicker >>> fw-input');
    await element.click();
    const popup = await page.find('fw-datepicker >>> .datepicker');
    expect(popup).toBeTruthy();

    const updateEle = await page.find(
      'fw-datepicker >>> fw-button.close-date-picker'
    );
    await updateEle.click();

    const datePickerEle = await page.find('fw-datepicker >>> .datepicker');
    expect(datePickerEle).toBeFalsy();
  });

  it('should emit fwChange when it is updated', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-datepicker></fw-datepicker>');
    const fwChange = await page.spyOnEvent('fwChange');
    const element = await page.find('fw-datepicker >>> fw-input');
    await element.click();
    const popup = await page.find(
      'fw-datepicker >>> .datepicker .mdp-container'
    );
    expect(popup).toBeTruthy();

    const dateEle = await page.findAll('fw-datepicker >>> .c-day-container');
    await (await dateEle[14].find('span')).click();

    const updateEle = await page.find(
      'fw-datepicker >>> fw-button.update-date-value'
    );
    expect(updateEle).toBeTruthy();
    await updateEle.click();
    expect(fwChange).toHaveReceivedEvent();
  });

  it('range picker should render and emit fwChange', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-datepicker mode="range"></fw-datepicker>');
    const fwChange = await page.spyOnEvent('fwChange');
    const element = await page.find('fw-datepicker >>> fw-input');
    await element.click();
    const popup = await page.find('fw-datepicker >>> .daterangepicker');
    expect(popup).toBeTruthy();

    const dateEle = await page.findAll('fw-datepicker >>> .c-day-container');
    await (await dateEle[14].find('span')).click();
    await (await dateEle[16].find('span')).click();

    const updateEle = await page.find(
      'fw-datepicker >>> fw-button.update-range-value'
    );
    expect(updateEle).toBeTruthy();
    await updateEle.click();
    expect(fwChange).toHaveReceivedEvent();
  });

  it('date should be as per format', async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<fw-datepicker display-format="yyyy-MM-dd"></fw-datepicker>'
    );
    const element = await page.find('fw-datepicker >>> fw-input');
    await element.click();

    const dateEle = await page.find(
      'fw-datepicker >>> .c-day-container.highlight:not(.disabled) span'
    );
    await dateEle.click();

    const updateEle = await page.find(
      'fw-datepicker >>> fw-button.update-date-value'
    );
    await updateEle.click();

    const datePickerValue = await element.getProperty('value');
    const todayValue = format(new Date(), 'yyyy-MM-dd');

    expect(datePickerValue.toString()).toBe(todayValue.toString());
  });

  it('daterange picker calenders should be sequential months ', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-datepicker mode="range"></fw-datepicker>');

    const component = await page.find('fw-datepicker');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('fw-datepicker >>> fw-input');
    await element.click();

    const fromMonth = await page.find(
      'fw-datepicker >>> fw-select.from-month-selector >>> input'
    );
    const fromMonthValue = await fromMonth.getProperty('value');
    const toMonth = await page.find(
      'fw-datepicker >>> fw-select.to-month-selector >>> input'
    );
    const toMonthValue = await toMonth.getProperty('value');

    expect(
      getMonth(addMonths(parse(fromMonthValue, 'MMM', new Date()), 1))
    ).toBe(getMonth(parse(toMonthValue, 'MMM', new Date())));
  });

  it('both calenders of daterange picker should update', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-datepicker mode="range"></fw-datepicker>');

    const component = await page.find('fw-datepicker');
    expect(component).toHaveClass('hydrated');

    const element = await page.find('fw-datepicker >>> fw-input');
    await element.click();

    const rightArrow = await page.findAll('fw-datepicker >>> .mdpchb-inner');
    await rightArrow[1].click();

    const updatedFromMonth = await page.find(
      'fw-datepicker >>> fw-select.from-month-selector >>> input'
    );
    const updatedFromMonthValue = await updatedFromMonth.getProperty('value');
    const updatedToMonth = await page.find(
      'fw-datepicker >>> fw-select.to-month-selector >>> input'
    );
    const updateToMonthValue = await updatedToMonth.getProperty('value');

    expect(
      getMonth(addMonths(parse(updatedFromMonthValue, 'MMM', new Date()), 1))
    ).toBe(getMonth(parse(updateToMonthValue, 'MMM', new Date())));
  });

  it('should restrict user from navigating to the year that falls outside of minYear when specified', async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<fw-datepicker min-year="2019" max-year="2020" value="2019-01-01"></fw-datepicker>'
    );
    const element = await page.find('fw-datepicker >>> fw-input');
    await element.click();
    const dateEle = await page.findAll('fw-datepicker >>> .mdpchb-inner');
    await dateEle[0].click();

    const minYear = await page.find(
      'fw-datepicker >>> fw-select.single-year-selector >>> input'
    );
    const minYearVal = await minYear.getProperty('value');
    expect(minYearVal).toBe('2019');
  });

  it('should restrict user from navigating to the year that falls outside of maxYear when specified', async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<fw-datepicker min-year="2019" max-year="2020" value="2020-12-01"></fw-datepicker>'
    );
    const element = await page.find('fw-datepicker >>> fw-input');
    await element.click();
    const dateEle = await page.findAll('fw-datepicker >>> .mdpchb-inner');
    await dateEle[1].click();

    const maxYear = await page.find(
      'fw-datepicker >>> fw-select.single-year-selector >>> input'
    );
    const maxYearVal = await maxYear.getProperty('value');
    expect(maxYearVal).toBe('2020');
  });

  it('should ignore min-year value and set minyear as per min-date when min-year and min-date contradict', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker min-year="2021" min-date="2020-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');
    const minYear = await dp.getProperty('minYear');
    expect(minYear).toBe(2020);
  });

  it('should ignore maxYear value and set maxYear as per max-date when max-year and max-date contradict', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker max-year="2022" max-date="2022-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');

    const maxYear = await dp.getProperty('maxYear');
    expect(maxYear).toBe(2022);
  });

  it('should ignore minYear value and set minYear as the default value 1970 when min-year and max-year contradict', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker max-year="2020" min-year="2022"></fw-datepicker>'
    );
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');
    const element = await page.find('fw-datepicker >>> fw-input');
    await element.click();
    const minYear = await dp.getProperty('minYear');
    const maxYear = await dp.getProperty('maxYear');
    expect(maxYear).toBe(2020);
    expect(minYear).toBe(1970);
  });

  it('should ignore minDate value and set maxYear as per maxDate when maxDate and minDate contradict', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker max-date="2022-07-31" min-date="2023-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');
    const element = await page.find('fw-datepicker >>> fw-input');
    await element.click();
    const yearDropdown = await page.find(
      'fw-datepicker >>> fw-select.single-year-selector'
    );
    const monthDropdown = await page.find(
      'fw-datepicker >>> fw-select.single-month-selector'
    );
    const maxYear = await dp.getProperty('maxYear');
    const minYear = await dp.getProperty('minYear');
    expect(maxYear).toBe(2022);
    expect(minYear).toBe(1970);
    yearDropdown.setAttribute('value', '2023');
    await page.waitForChanges();
    monthDropdown.setAttribute('value', 'Sep');
    await page.waitForChanges();
    const dates = await page.findAll('fw-datepicker >>> .c-day-container');
    const flag = dates.every((date) => {
      return true && date.getAttribute('class').includes('disabled');
    });
    expect(flag).toBeTruthy();
  });

  it('should give precendence to maxDate over minDate, minYear and maxYear when they all contradict and should set maxYear as per maxDate and the months should be disabled beyond maxDate', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker max-year="2020" min-year="2019" max-date="2021-07-31" min-date="2022-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');
    const element = await page.find('fw-datepicker >>> fw-input');
    await element.click();
    const yearDropdown = await page.find(
      'fw-datepicker >>> fw-select.single-year-selector'
    );
    const monthDropdown = await page.find(
      'fw-datepicker >>> fw-select.single-month-selector'
    );
    const maxYear = await dp.getProperty('maxYear');
    const minYear = await dp.getProperty('minYear');
    expect(maxYear).toBe(2021);
    expect(minYear).toBe(2019);
    yearDropdown.setAttribute('value', '2022');
    await page.waitForChanges();
    monthDropdown.setAttribute('value', 'Jul');
    await page.waitForChanges();
    const dates = await page.findAll('fw-datepicker >>> .c-day-container');
    const flag = dates.every((date) => {
      return true && date.getAttribute('class').includes('disabled');
    });
    expect(flag).toBeTruthy();
  });

  it('should set maxYear as per maxDate, minYear as the default year and the months should be disabled beyond maxDate', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker max-year="2020" max-date="2020-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');
    const element = await page.find('fw-datepicker >>> fw-input');
    await element.click();
    const yearDropdown = await page.find(
      'fw-datepicker >>> fw-select.single-year-selector'
    );
    const monthDropdown = await page.find(
      'fw-datepicker >>> fw-select.single-month-selector'
    );
    const maxYear = await dp.getProperty('maxYear');
    const minYear = await dp.getProperty('minYear');
    expect(maxYear).toBe(2020);
    expect(minYear).toBe(1970);
    yearDropdown.setAttribute('value', '2020');
    await page.waitForChanges();
    monthDropdown.setAttribute('value', 'Dec');
    await page.waitForChanges();
    const dates = await page.findAll('fw-datepicker >>> .c-day-container');
    const flag = dates.every((date) => {
      return true && date.getAttribute('class').includes('disabled');
    });
    expect(flag).toBeTruthy();
  });

  it('should set minYear as per minDate, maxYear as the current year and the months should be disabled beyond minDate', async () => {
    const page = await newE2EPage();
    const fullYear = new Date().getFullYear();
    await page.setContent(
      '<fw-datepicker min-year="2020" min-date="2020-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');
    const element = await page.find('fw-datepicker >>> fw-input');
    await element.click();
    const yearDropdown = await page.find(
      'fw-datepicker >>> fw-select.single-year-selector'
    );
    const monthDropdown = await page.find(
      'fw-datepicker >>> fw-select.single-month-selector'
    );
    const maxYear = await dp.getProperty('maxYear');
    const minYear = await dp.getProperty('minYear');
    expect(maxYear).toBe(fullYear);
    expect(minYear).toBe(2020);
    yearDropdown.setAttribute('value', '2020');
    await page.waitForChanges();
    monthDropdown.setAttribute('value', 'Feb');
    await page.waitForChanges();
    const dates = await page.findAll('fw-datepicker >>> .c-day-container');
    const flag = dates.every((date) => {
      return true && date.getAttribute('class').includes('disabled');
    });
    expect(flag).toBeTruthy();
  });

  it('should highlight the input box and show alert icon when value is passed and it falls beyond maxDate', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker max-date="2022-07-31" value="2023-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const shadow = await page.find(
      'fw-datepicker >>> fw-input >>> :first-child'
    );
    const alertElement = await shadow.find('.invalid-alert');
    expect(alertElement).toBeTruthy();
  });

  it('should highlight the input box and show alert icon when value is passed and it falls beyond minDate', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker min-date="2022-07-31" value="2020-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const shadow = await page.find(
      'fw-datepicker >>> fw-input >>> :first-child'
    );
    const alertElement = await shadow.find('.invalid-alert');
    expect(alertElement).toBeTruthy();
  });

  it('should highlight the input box and show alert icon when invalid input is entered in the date input textbox', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker show-error-on-invalid-date></fw-datepicker>'
    );
    await page.waitForChanges();
    const input = await page.find('fw-datepicker >>> fw-input');
    await input.click();
    await input.press('KeyA');
    await page.waitForChanges();
    await input.press('KeyB');
    await page.waitForChanges();
    await page.waitForTimeout(2500);
    const shadow = await page.find(
      'fw-datepicker >>> fw-input >>> :first-child'
    );
    const alertElement = await shadow.find('.invalid-alert');
    expect(alertElement).toBeTruthy();
  });

  it('should not update the value when a valid value is present and user moves to the next month using the right arrow key and clicks update button, where the next month dates are disabled as it falls beyond maxDate', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker max-date="2022-07-31" value="2022-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const input = await page.find('fw-datepicker >>> fw-input');
    await input.click();
    const arrowKeys = await page.findAll('fw-datepicker >>> .mdpchb-inner');
    await arrowKeys[1].click();
    await page.waitForChanges();
    const dates = await page.findAll('fw-datepicker >>> .c-day-container');
    const flag = dates.every((date) => {
      return true && date.getAttribute('class').includes('disabled');
    });
    expect(flag).toBeTruthy();
    const footer = await page.find('fw-datepicker >>> .mdpc-footer');
    const footerBtns = await footer.findAll('fw-button');
    await footerBtns[1].click();
    await page.waitForChanges();
    const val = await input.getProperty('value');
    expect(val).toBe('07/31/2022');
  });

  it('should emit the details in fwDateInput event when value is entered in the date input textbox', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-datepicker></fw-datepicker>');
    await page.waitForChanges();
    const fwDateInput = await page.spyOnEvent('fwDateInput');
    const input = await page.find('fw-datepicker >>> fw-input');
    await input.click();
    await input.press('KeyA');
    await page.waitForChanges();
    await input.press('KeyB');
    await page.waitForChanges();
    await page.waitForTimeout(2500);
    expect(fwDateInput).toHaveReceivedEvent();
    expect(fwDateInput).toHaveReceivedEventDetail({
      event: { isTrusted: false },
      name: '',
      value: 'ab',
    });
  });

  it('should update the value of the date input when value is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-datepicker value="2022-07-31"></fw-datepicker>');
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');
    await dp.setProperty('value', '2020-07-25');
    await page.waitForChanges();
    const val = await dp.getProperty('value');
    expect(val).toBe('07/25/2020');
    const shadow = await page.find(
      'fw-datepicker >>> fw-input >>> :first-child'
    );
    const alertElement = await shadow.find('.invalid-alert');
    expect(alertElement).toBeFalsy();
  });

  it('should highlight date input and show alert icon when the passed value is not in ISO format', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-datepicker value="2022-07-31"></fw-datepicker>');
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');
    await dp.setProperty('value', '25/07/2020');
    await page.waitForChanges();
    await page.waitForChanges();
    const shadow = await page.find(
      'fw-datepicker >>> fw-input >>> :first-child'
    );
    const alertElement = await shadow.find('.invalid-alert');
    expect(alertElement).toBeTruthy();
  });

  it('should highlight the input box and show alert icon when value is passed and it falls beyond maxYear', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker max-year="2022" value="2023-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const shadow = await page.find(
      'fw-datepicker >>> fw-input >>> :first-child'
    );
    const alertElement = await shadow.find('.invalid-alert');
    expect(alertElement).toBeTruthy();
  });

  it('should highlight the input box and show alert icon when value is passed and it falls beyond minYear', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker min-year="2022" value="2020-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const shadow = await page.find(
      'fw-datepicker >>> fw-input >>> :first-child'
    );
    const alertElement = await shadow.find('.invalid-alert');
    expect(alertElement).toBeTruthy();
  });

  it('should ignore min-year value and set minyear as per min-date when min-year and min-date contradict when the mode is range', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker mode="range" min-year="2021" min-date="2020-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');
    const minYear = await dp.getProperty('minYear');
    expect(minYear).toBe(2020);
  });

  it('should ignore maxYear value and set maxYear as per max-date when max-year and max-date contradict when the mode is range', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker mode="range" max-year="2023" max-date="2022-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');

    const maxYear = await dp.getProperty('maxYear');
    expect(maxYear).toBe(2022);
  });

  it('should ignore minYear value and set minYear as the default value 1970 when min-year and max-year contradict when the mode is range', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker mode="range" max-year="2020" min-year="2022"></fw-datepicker>'
    );
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');
    const element = await page.find('fw-datepicker >>> fw-input');
    await element.click();
    const minYear = await dp.getProperty('minYear');
    const maxYear = await dp.getProperty('maxYear');
    expect(maxYear).toBe(2020);
    expect(minYear).toBe(1970);
  });

  it('should ignore minDate value and set maxYear as per maxDate when maxDate and minDate contradict when the mode is range', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker mode="range" max-date="2022-07-31" min-date="2023-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');
    const element = await page.find('fw-datepicker >>> fw-input');
    await element.click();
    const yearDropdown = await page.find(
      'fw-datepicker >>> fw-select.from-year-selector'
    );
    const monthDropdown = await page.find(
      'fw-datepicker >>> fw-select.from-month-selector'
    );
    const maxYear = await dp.getProperty('maxYear');
    const minYear = await dp.getProperty('minYear');
    expect(maxYear).toBe(2022);
    expect(minYear).toBe(1970);
    yearDropdown.setAttribute('value', '2023');
    await page.waitForChanges();
    monthDropdown.setAttribute('value', 'Sep');
    await page.waitForChanges();
    const dates = await page.findAll('fw-datepicker >>> .c-day-container');
    const flag = dates.every((date) => {
      return date.getAttribute('class').includes('disabled');
    });
    expect(flag).toBeTruthy();
  });

  it('should give precendence to maxDate over minDate, minYear and maxYear when they all contradict and should set maxYear as per maxDate and the months should be disabled beyond maxDate, when the mode is range', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker mode="range" max-year="2020" min-year="2019" max-date="2021-07-31" min-date="2022-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');
    const element = await page.find('fw-datepicker >>> fw-input');
    await element.click();
    const yearDropdown = await page.find(
      'fw-datepicker >>> fw-select.from-year-selector'
    );
    const monthDropdown = await page.find(
      'fw-datepicker >>> fw-select.from-month-selector'
    );
    const maxYear = await dp.getProperty('maxYear');
    const minYear = await dp.getProperty('minYear');
    expect(maxYear).toBe(2021);
    expect(minYear).toBe(2019);
    yearDropdown.setAttribute('value', '2022');
    await page.waitForChanges();
    monthDropdown.setAttribute('value', 'Jul');
    await page.waitForChanges();
    const dates = await page.findAll('fw-datepicker >>> .c-day-container');
    const flag = dates.every((date) => {
      return date.getAttribute('class').includes('disabled');
    });
    expect(flag).toBeTruthy();
  });

  it('should set maxYear as per maxDate, minYear as the default year and the months should be disabled beyond maxDate, when the mode is range', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker mode="range" max-year="2020" max-date="2020-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');
    const element = await page.find('fw-datepicker >>> fw-input');
    await element.click();
    const yearDropdown = await page.find(
      'fw-datepicker >>> fw-select.from-year-selector'
    );
    const monthDropdown = await page.find(
      'fw-datepicker >>> fw-select.from-month-selector'
    );
    const maxYear = await dp.getProperty('maxYear');
    const minYear = await dp.getProperty('minYear');
    expect(maxYear).toBe(2020);
    expect(minYear).toBe(1970);
    yearDropdown.setAttribute('value', '2020');
    await page.waitForChanges();
    monthDropdown.setAttribute('value', 'Dec');
    await page.waitForChanges();
    const dates = await page.findAll('fw-datepicker >>> .c-day-container');
    const flag = dates.every((date) => {
      return true && date.getAttribute('class').includes('disabled');
    });
    expect(flag).toBeTruthy();
  });

  it('should set minYear as per minDate, maxYear as the current year and the months should be disabled beyond minDate, when the mode is range', async () => {
    const page = await newE2EPage();
    const fullyear = new Date().getFullYear();
    await page.setContent(
      '<fw-datepicker mode="range" min-year="2020" min-date="2020-07-31" value="2020-07-25 to 2020-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');
    const element = await page.find('fw-datepicker >>> fw-input');
    await element.click();
    const yearDropdown = await page.find(
      'fw-datepicker >>> fw-select.from-year-selector'
    );
    const monthDropdown = await page.find(
      'fw-datepicker >>> fw-select.from-month-selector'
    );
    const maxYear = await dp.getProperty('maxYear');
    const minYear = await dp.getProperty('minYear');
    expect(maxYear).toBe(fullyear);
    expect(minYear).toBe(2020);
    yearDropdown.setAttribute('value', '2020');
    await page.waitForChanges();
    monthDropdown.setAttribute('value', 'Feb');
    await page.waitForChanges();
    const dates = await page.findAll('fw-datepicker >>> .c-day-container');
    const flag = dates.every((date) => {
      return true && date.getAttribute('class').includes('disabled');
    });
    expect(flag).toBeTruthy();
  });

  it('should highlight the input box and show alert icon when value is passed and it falls beyond maxDate, when the mode is range', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker mode="range" max-date="2022-07-31" value="2023-07-31 to 2023-08-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const shadow = await page.find(
      'fw-datepicker >>> fw-input >>> :first-child'
    );
    const alertElement = await shadow.find('.invalid-alert');
    expect(alertElement).toBeTruthy();
  });

  it('should highlight the input box and show alert icon when value is passed and it falls beyond minDate, when the mode is range', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker mode="range" min-date="2022-07-31" value="2020-07-31 to 2020-08-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const shadow = await page.find(
      'fw-datepicker >>> fw-input >>> :first-child'
    );
    const alertElement = await shadow.find('.invalid-alert');
    expect(alertElement).toBeTruthy();
  });

  it('should highlight the input box and show alert icon when invalid input is entered in the date input textbox, when the mode is range', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-datepicker mode="range"></fw-datepicker>');
    await page.waitForChanges();
    const input = await page.find('fw-datepicker >>> fw-input');
    await input.click();
    await input.press('KeyA');
    await page.waitForChanges();
    await input.press('KeyB');
    await page.waitForChanges();
    await page.waitForTimeout(2500);
    const shadow = await page.find(
      'fw-datepicker >>> fw-input >>> :first-child'
    );
    const alertElement = await shadow.find('.invalid-alert');
    expect(alertElement).toBeTruthy();
  });

  it('should not update the value when a valid value is present and user moves to the next month using the right arrow key and clicks update button, where the next month dates are disabled as it falls beyond maxDate, when the mode is range', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker mode="range" max-date="2022-07-31" value="2022-07-30 to 2022-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const input = await page.find('fw-datepicker >>> fw-input');
    await input.click();
    const arrowKeys = await page.findAll('fw-datepicker >>> .mdpchb-inner');
    await arrowKeys[1].click();
    await page.waitForChanges();
    const dates = await page.findAll('fw-datepicker >>> .c-day-container');
    const flag = dates.every((date) => {
      return true && date.getAttribute('class').includes('disabled');
    });
    expect(flag).toBeTruthy();
    const footer = await page.find('fw-datepicker >>> .mdpc-footer');
    const footerBtns = await footer.findAll('fw-button');
    await footerBtns[1].click();
    await page.waitForChanges();
    const val = await input.getProperty('value');
    expect(val).toBe('07/30/2022 to 07/31/2022');
  });

  it('should emit the details in fwDateInput event when value is entered in the date input textbox, when the mode is range', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-datepicker mode="range" ></fw-datepicker>');
    await page.waitForChanges();
    const fwDateInput = await page.spyOnEvent('fwDateInput');
    const input = await page.find('fw-datepicker >>> fw-input');
    await input.click();
    await input.press('KeyA');
    await page.waitForChanges();
    await input.press('KeyB');
    await page.waitForChanges();
    await page.waitForTimeout(2500);
    expect(fwDateInput).toHaveReceivedEvent();
    expect(fwDateInput).toHaveReceivedEventDetail({
      event: { isTrusted: false },
      name: '',
      value: 'ab',
    });
  });

  it('should update the value of the date input when value is set, when the mode is range', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker mode="range" value="2022-07-31 to 2022-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');
    await dp.setProperty('value', '2020-08-30 to 2020-08-31');
    await page.waitForChanges();
    const val = await dp.getProperty('value');
    expect(val).toBe('08/30/2020 to 08/31/2020');
    const shadow = await page.find(
      'fw-datepicker >>> fw-input >>> :first-child'
    );
    const alertElement = await shadow.find('.invalid-alert');
    expect(alertElement).toBeFalsy();
  });

  it('should highlight date input and show alert icon when the passed value is not in ISO format, when the mode is range', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker mode="range" value="2022-07-30 to 2022-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');
    await dp.setProperty('value', '2020-30-08 to 2020-31-08');
    await page.waitForChanges();
    await page.waitForChanges();
    const shadow = await page.find(
      'fw-datepicker >>> fw-input >>> :first-child'
    );
    const alertElement = await shadow.find('.invalid-alert');
    expect(alertElement).toBeTruthy();
  });

  it('should highlight the input box and show alert icon when value is passed and it falls beyond maxYear, when the mode is range', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker mode="range" max-year="2022" value="2023-07-30 to 2023-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const shadow = await page.find(
      'fw-datepicker >>> fw-input >>> :first-child'
    );
    const alertElement = await shadow.find('.invalid-alert');
    expect(alertElement).toBeTruthy();
  });

  it('should highlight the input box and show alert icon when value is passed and it falls beyond minYear, when the mode is range', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker mode="range" min-year="2022" value="2020-07-30 to 2020-07-31"></fw-datepicker>'
    );
    await page.waitForChanges();
    const shadow = await page.find(
      'fw-datepicker >>> fw-input >>> :first-child'
    );
    const alertElement = await shadow.find('.invalid-alert');
    expect(alertElement).toBeTruthy();
  });

  it('should not update the date value when the arrow keys are clicked in date time picker', async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<fw-datepicker show-time-picker value="2022-07-22T06:00:00.000Z"></fw-datepicker>'
    );
    const input = await page.find('fw-datepicker >>> fw-input');
    await input.click();
    const dateEle = await page.findAll('fw-datepicker >>> .mdpchb-inner');
    await dateEle[0].click();
    const timeContainer = await page.find('fw-datepicker >>> .time-container');
    const dateInput = await timeContainer.find('fw-input input');
    const dateVal = await dateInput.getAttribute('value');
    expect(dateVal).toBe('07/22/2022');
  });

  it('should update the value of the date input when value is set, when the locale is is', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker locale="is" value="2022-04-20"></fw-datepicker>'
    );
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');
    await dp.setProperty('value', '2022-04-20');
    await page.waitForChanges();
    const val = await dp.getProperty('value');
    expect(val).toBe('20.04.2022');
    const shadow = await page.find(
      'fw-datepicker >>> fw-input >>> :first-child'
    );
    const alertElement = await shadow.find('.invalid-alert');
    expect(alertElement).toBeFalsy();
  });

  it('should update the value of the date input when value is set, when the locale is is', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-datepicker locale="is" value="2022-11-20"></fw-datepicker>'
    );
    await page.waitForChanges();
    const dp = await page.find('fw-datepicker');
    await dp.setProperty('value', '2022-11-20');
    await page.waitForChanges();
    const val = await dp.getProperty('value');
    expect(val).toBe('20.11.2022');
    const shadow = await page.find(
      'fw-datepicker >>> fw-input >>> :first-child'
    );
    const alertElement = await shadow.find('.invalid-alert');
    expect(alertElement).toBeFalsy();
  });
});
