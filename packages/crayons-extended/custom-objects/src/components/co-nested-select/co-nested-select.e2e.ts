import { newE2EPage } from '@stencil/core/testing';

describe('fw-co-nested-select', () => {
  const sampleOptions = [
    {
      id: 'hardware',
      value: 'Hardware',
      name: 'category_dd2',
      choices: [
        {
          id: 'computer',
          value: 'Computer',
          name: 'category_dd3',
          choices: [
            { id: 'mac', value: 'Mac' },
            { id: 'pc', value: 'PC' },
          ],
        },
      ],
    },
    {
      id: 'software',
      value: 'Software',
      name: 'category_dd2',
      choices: [{ id: 'crm', value: 'CRM' }],
    },
  ];

  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-co-nested-select></fw-co-nested-select>');
    const element = await page.find('fw-co-nested-select');
    expect(element).toHaveClass('hydrated');
  });

  it('should render fw-co-nested-node with options when options are provided', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-co-nested-select></fw-co-nested-select>');
    const element = await page.find('fw-co-nested-select');

    element.setProperty('options', sampleOptions);
    element.setProperty('name', 'category_co');
    await page.waitForChanges();

    const node = await page.find('fw-co-nested-select >>> fw-co-nested-node');
    expect(node).not.toBeNull();
    expect(await node.getProperty('options')).toEqual(sampleOptions);
    expect(await node.getProperty('name')).toBe('category_co');
  });

  it('should render external field label and panel when label is set', async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<fw-co-nested-select name="category_co" label="Category" required="true"></fw-co-nested-select>'
    );
    await page.waitForChanges();

    const label = await page.find(
      'fw-co-nested-select >>> label.field-control-label'
    );
    expect(label).not.toBeNull();
    expect(label).toHaveClass('required');
    expect(label.textContent).toBe('Category');
    expect(label.getAttribute('id')).toBe(
      'fw-co-nested-select-label-category_co'
    );

    const panel = await page.find(
      'fw-co-nested-select >>> .field-control-panel'
    );
    expect(panel).not.toBeNull();
  });

  it('should not render external field label when label is empty', async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<fw-co-nested-select name="category_co"></fw-co-nested-select>'
    );
    await page.waitForChanges();

    const label = await page.find(
      'fw-co-nested-select >>> label.field-control-label'
    );
    expect(label).toBeNull();
  });

  it('should pass rootLabelledBy to fw-co-nested-node when label is set', async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<fw-co-nested-select name="category_co" label="Category"></fw-co-nested-select>'
    );
    await page.waitForChanges();

    const node = await page.find('fw-co-nested-select >>> fw-co-nested-node');
    expect(await node.getProperty('rootLabelledBy')).toBe(
      'fw-co-nested-select-label-category_co'
    );
  });

  it('should not use external label aria when host label is whitespace only', async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<fw-co-nested-select name="category_co" label="   "></fw-co-nested-select>'
    );
    await page.waitForChanges();

    const label = await page.find(
      'fw-co-nested-select >>> label.field-control-label'
    );
    expect(label).toBeNull();

    const node = await page.find('fw-co-nested-select >>> fw-co-nested-node');
    expect(await node.getProperty('rootLabelledBy')).toBe('');
  });

  it('should emit fwChange when nested selection changes', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-co-nested-select></fw-co-nested-select>');
    const element = await page.find('fw-co-nested-select');

    element.setProperty('options', sampleOptions);
    element.setProperty('name', 'category_co');
    await page.waitForChanges();

    const fwChange = await page.spyOnEvent('fwChange');
    await element.triggerEvent('fwChange', {
      detail: {
        meta: { selectedOptions: [sampleOptions[0]] },
        level: 0,
        name: 'category_co',
      },
    });
    await page.waitForChanges();

    expect(fwChange).toHaveReceivedEvent();
  });
});
