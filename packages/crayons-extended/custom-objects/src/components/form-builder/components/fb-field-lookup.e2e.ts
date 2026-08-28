import { newE2EPage } from '@stencil/core/testing';

describe('fw-fb-field-lookup', () => {
  const targetObjects = [
    { value: 1, text: 'Ticket', isNative: true },
    { value: 2, text: 'Contact', isNative: true },
  ];

  it('renders the target select with the static options and no search behavior when targetSelectProps is not set', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-fb-field-lookup></fw-fb-field-lookup>');
    await page.$eval(
      'fw-fb-field-lookup',
      (elm: any, { targetObjects }) => {
        elm.formValues = { isNew: true };
        elm.targetObjects = targetObjects;
      },
      { targetObjects }
    );
    await page.waitForChanges();

    const targetSelect = await page.find('fw-fb-field-lookup >>> .fb-field-lookup-target-select');
    expect(targetSelect).toBeTruthy();

    const search = await targetSelect.getProperty('search');
    const debounceTimer = await targetSelect.getProperty('debounceTimer');
    // unset targetSelectProps (defaults to {}) means neither prop is forwarded - fw-select falls back to its
    // own default local-filter search and default debounceTimer, i.e. today's behavior, unchanged.
    expect(search).toBeFalsy();
    expect(debounceTimer).toBe(300);
  });

  it('threads a custom search function + debounceTimer from targetSelectProps onto the target select', async () => {
    await jest.useFakeTimers();
    const page = await newE2EPage();
    await page.setContent('<fw-fb-field-lookup></fw-fb-field-lookup>');
    await page.$eval(
      'fw-fb-field-lookup',
      (elm: any, { targetObjects }) => {
        elm.formValues = { isNew: true };
        elm.targetObjects = targetObjects;
        elm.targetSelectProps = {
          debounceTimer: 0,
          search: () => Promise.resolve([{ value: 99, text: 'Searched Custom Object' }]),
        };
      },
      { targetObjects }
    );
    await page.waitForChanges();

    const input = await page.find('fw-fb-field-lookup >>> .fb-field-lookup-target-select >>> input');
    await input.click();
    await page.waitForChanges();
    await input.press('a');
    await page.waitForChanges();
    jest.runAllTimers();
    await page.waitForChanges();
    await page.waitForChanges();

    const popover = await page.find('fw-fb-field-lookup >>> .fb-field-lookup-target-select >>> fw-popover');
    const options = await popover.findAll('fw-list-options >>> fw-select-option');
    expect(options.length).toBe(1);
    const selectOption = await options[0].shadowRoot.querySelector('.select-option');
    expect(selectOption['innerText']).toBe('Searched Custom Object');
    jest.useRealTimers();
  });
});
