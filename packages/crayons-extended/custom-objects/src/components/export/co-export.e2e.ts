import { newE2EPage } from '@stencil/core/testing';

describe('fw-co-export', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-co-export></fw-co-export>');
    const element = await page.find('fw-co-export');
    expect(element).toHaveClass('hydrated');
  });

  it('should not render modal when isOpen is false', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-co-export is-open="false"></fw-co-export>');
    const modal = await page.find('fw-co-export >>> fw-modal');
    expect(await modal.getProperty('isOpen')).toBe(false);
  });

  it('should render modal when isOpen is true', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-co-export is-open="true"></fw-co-export>');
    const modal = await page.find('fw-co-export >>> fw-modal');
    expect(await modal.getProperty('isOpen')).toBe(true);
  });

  it('should emit fwExport event when export button is clicked', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <fw-co-export is-open="true" value='{"fields": [{"id": "1", "label": "Field 1", "selected": true}]}'>
      </fw-co-export>
    `);

    const fwExport = await page.spyOnEvent('fwExport');
    const exportButton = await page.find(
      'fw-co-export >>> fw-modal-footer fw-button:last-child'
    );

    await exportButton.click();
    await page.waitForChanges();

    expect(fwExport).toHaveReceivedEvent();
  });

  it('should emit fwCloseExport event when close button is clicked', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-co-export is-open="true"></fw-co-export>');

    const fwCloseExport = await page.spyOnEvent('fwCloseExport');
    const closeButton = await page.find(
      'fw-co-export >>> fw-modal-footer fw-button:first-child'
    );

    await closeButton.click();
    await page.waitForChanges();

    expect(fwCloseExport).toHaveReceivedEvent();
  });

  it('should close modal when close method is called', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-co-export is-open="true"></fw-co-export>');
    const element = await page.find('fw-co-export');

    await element.callMethod('close');
    await page.waitForChanges();

    expect(await element.getProperty('isOpen')).toBe(false);
  });

  it('should open modal when open method is called', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-co-export is-open="false"></fw-co-export>');
    const element = await page.find('fw-co-export');

    await element.callMethod('open');
    await page.waitForChanges();

    expect(await element.getProperty('isOpen')).toBe(true);
  });

  it('should render fields when value is provided', async () => {
    const page = await newE2EPage();
    const testValue = {
      fields: [
        { id: '1', label: 'Field 1', selected: true },
        { id: '2', label: 'Field 2', selected: false },
      ],
    };

    await page.setContent(`<fw-co-export is-open="true"></fw-co-export>`);
    const element = await page.find('fw-co-export');

    element.setProperty('value', testValue);
    await page.waitForChanges();

    const fieldElements = await page.findAll(
      'fw-co-export >>> fw-co-export-field'
    );
    expect(fieldElements.length).toBe(2);
  });

  it('should update selected count when field selection changes', async () => {
    const page = await newE2EPage();
    const testValue = {
      fields: [
        { id: '1', label: 'Field 1', selected: true },
        { id: '2', label: 'Field 2', selected: false },
      ],
    };

    await page.setContent(`<fw-co-export is-open="true"></fw-co-export>`);
    const element = await page.find('fw-co-export');

    element.setProperty('value', testValue);
    await page.waitForChanges();

    // Wait a bit more for the value watcher to process the update
    await page.waitForTimeout(100);
    await page.waitForChanges();

    const selectedCount = await page.find(
      'fw-co-export >>> .co-export-field-header-selected-count-label:last-child'
    );
    expect(selectedCount.textContent).toContain('1/2 selected');
  });

  it('should filter fields when search is performed', async () => {
    const page = await newE2EPage();
    const testValue = {
      fields: [
        { id: '1', label: 'Name Field', selected: true },
        { id: '2', label: 'Email Field', selected: false },
      ],
    };

    await page.setContent(`<fw-co-export is-open="true"></fw-co-export>`);
    const element = await page.find('fw-co-export');

    element.setProperty('value', testValue);
    await page.waitForChanges();

    const searchInput = await page.find(
      'fw-co-export >>> fw-input.co-export-field-search'
    );
    await searchInput.triggerEvent('fwInput', { detail: { value: 'Name' } });
    await page.waitForChanges();

    // Wait for debounced search to complete (debounce timeout is 1000ms)
    await page.waitForTimeout(1100);
    await page.waitForChanges();

    const fieldElements = await page.findAll(
      'fw-co-export >>> fw-co-export-field'
    );
    expect(fieldElements.length).toBe(1);
  });

  it('should select all fields when select all checkbox is checked', async () => {
    const page = await newE2EPage();
    const testValue = {
      fields: [
        { id: '1', label: 'Field 1', selected: false },
        { id: '2', label: 'Field 2', selected: false },
      ],
    };

    await page.setContent(`<fw-co-export is-open="true"></fw-co-export>`);
    const element = await page.find('fw-co-export');

    element.setProperty('value', testValue);
    await page.waitForChanges();

    const selectAllCheckbox = await page.find(
      'fw-co-export >>> fw-checkbox.co-export-field-select-all'
    );
    await selectAllCheckbox.triggerEvent('fwChange', {
      detail: { meta: { checked: true } },
    });
    await page.waitForChanges();

    const selectedCount = await page.find(
      'fw-co-export >>> .co-export-field-header-selected-count-label:last-child'
    );
    expect(selectedCount.textContent).toContain('2/2 selected');
  });
});
