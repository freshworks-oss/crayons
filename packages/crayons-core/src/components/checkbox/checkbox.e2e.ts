import { newE2EPage } from '@stencil/core/testing';

describe('fw-checkbox', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-checkbox></fw-checkbox>');
    const element = await page.find('fw-checkbox');
    expect(element).not.toBeNull();
  });

  it('it renders with check', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-checkbox checked></fw-checkbox>');
    const element = await page.find('fw-checkbox');
    const isChecked = await element.getProperty('checked');
    expect(isChecked).toBe(true);
  });

  it('it emits fwChange when clicked', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-checkbox value="1" name="test">1</fw-checkbox>');
    const element = await page.find('fw-checkbox');
    const fwChange = await page.spyOnEvent('fwChange');
    await element.click();
    expect(fwChange).toHaveReceivedEventDetail({
      meta: { checked: true, indeterminate: false },
      event: {
        isTrusted: true,
      },
      value: '1',
      name: 'test',
    });
  });

  it('it emits fwChange when space is pressed', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-checkbox value="1">1</fw-checkbox>');
    const element = await page.find('fw-checkbox');
    const fwChange = await page.spyOnEvent('fwChange');
    await element.press('Space');
    expect(fwChange).toHaveReceivedEventDetail({
      meta: { checked: true, indeterminate: false },
      value: '1',
      name: '',
      event: {
        isTrusted: true,
      },
    });
  });

  it('it should not emit fwChange when property is set', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-checkbox value="1">1</fw-checkbox>');
    const element = await page.find('fw-checkbox');
    const fwChange = await page.spyOnEvent('fwChange');
    element.setProperty('checked', true);
    await page.waitForChanges();
    expect(fwChange).not.toHaveReceivedEvent();
  });

  it('it should not emit fwChange when disabled', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-checkbox value="1" disabled>1</fw-checkbox>');
    const element = await page.find('fw-checkbox');
    const fwChange = await page.spyOnEvent('fwChange');
    await element.click();
    expect(fwChange.events).toEqual([]);
  });

  it('it should return html structure with slot when content is passed between opening and closing tag', async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<fw-checkbox description="Yes">Select to Agree</fw-checkbox>'
    );
    const element = await page.find('fw-checkbox >>> div');
    console.log(element);
    expect(element).toEqualHtml(`<div class="checkbox-container">
    <input type="checkbox">
    <label>
    <span id="label" class="with-description">
      <slot></slot>
    </span>
    <div id="description">
    Yes
    </div>
    </label>
    </div>`);
  });

  it('should render checkbox with indeterminate state', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-checkbox indeterminate></fw-checkbox>');
    const element = await page.find('fw-checkbox');
    const isIndeterminate = await element.getProperty('indeterminate');
    expect(isIndeterminate).toBe(true);
  });

  it('should toggle from indeterminate to checked when clicked', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-checkbox indeterminate value="test" name="test-name">Test</fw-checkbox>'
    );
    const element = await page.find('fw-checkbox');
    const fwChange = await page.spyOnEvent('fwChange');
    await element.click();
    await page.waitForChanges();
    const isIndeterminate = await element.getProperty('indeterminate');
    const isChecked = await element.getProperty('checked');
    expect(isIndeterminate).toBe(false);
    expect(isChecked).toBe(true);
    expect(fwChange).toHaveReceivedEventDetail({
      meta: { checked: true, indeterminate: false },
      event: {
        isTrusted: true,
      },
      value: 'test',
      name: 'test-name',
    });
  });

  it('should displays minus icon when indeterminate is set', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-checkbox indeterminate>Test</fw-checkbox>');
    await page.waitForChanges();
    const icon = await page.find('fw-checkbox >>> fw-icon');
    expect(icon.getAttribute('name')).toBe('minus');
  });
});
