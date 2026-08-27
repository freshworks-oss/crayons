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

  it('should emit leaf fwChange for shared field name on cascade selection', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-co-nested-select></fw-co-nested-select>');
    const element = await page.find('fw-co-nested-select');

    element.setProperty('options', sampleOptions);
    element.setProperty('name', 'category_co');
    await page.waitForChanges();

    const fwChange = await page.spyOnEvent('fwChange');
    await element.triggerEvent('fwChange', {
      detail: {
        meta: { selectedOptions: [sampleOptions[1]] },
        level: 0,
        name: 'category_co',
      },
    });
    await page.waitForChanges();
    await element.triggerEvent('fwChange', {
      detail: {
        meta: { selectedOptions: [sampleOptions[1].choices[0]] },
        level: 1,
        name: 'category_co',
      },
    });
    await page.waitForChanges();

    const leafEmits = fwChange.events.filter(
      (event) =>
        event.detail &&
        event.detail.meta === undefined &&
        event.detail.name === 'category_co'
    );
    expect(leafEmits.length).toBeGreaterThanOrEqual(1);
    expect(leafEmits[leafEmits.length - 1].detail).toEqual({
      name: 'category_co',
      value: 'crm',
    });
  });

  it('should emit empty value for incomplete cascade (parent still has choices)', async () => {
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

    const leafEmits = fwChange.events.filter(
      (event) =>
        event.detail &&
        event.detail.meta === undefined &&
        event.detail.name === 'category_co'
    );
    expect(leafEmits.length).toBeGreaterThanOrEqual(1);
    expect(leafEmits[leafEmits.length - 1].detail).toEqual({
      name: 'category_co',
      value: '',
    });
  });

  it('should forward disabled to nested fw-selects', async () => {
    const page = await newE2EPage();

    await page.setContent(
      '<fw-co-nested-select disabled="true"></fw-co-nested-select>'
    );
    const element = await page.find('fw-co-nested-select');
    element.setProperty('options', sampleOptions);
    element.setProperty('name', 'category_co');
    await page.waitForChanges();

    const select = await page.find(
      'fw-co-nested-select >>> fw-co-nested-node >>> fw-select'
    );
    expect(await select.getProperty('disabled')).toBe(true);
  });

  it('should update fw-form values when cascade leaf is selected', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-form></fw-form>');
    await page.$eval(
      'fw-form',
      (elm: any, options) => {
        elm.formSchema = {
          name: 'test_form',
          fields: [
            {
              id: '1',
              name: 'category_co',
              label: 'Category',
              type: 'DROPDOWN_LOOKUP_SECTION',
              choices: options,
              required: false,
              field_options: {},
            },
          ],
        };
        elm.initialValues = {};
      },
      sampleOptions
    );
    await page.waitForChanges();

    const nestedSelect = await page.find(
      'fw-form >>> fw-form-control >>> fw-co-nested-select'
    );
    expect(nestedSelect).not.toBeNull();

    const fwChange = await page.spyOnEvent('fwChange');

    // Drive the same @Listen path production cascade uses (meta + level + shared name).
    await page.$eval(
      'fw-form',
      (formEl, options) => {
        const nested = formEl.shadowRoot
          ?.querySelector('fw-form-control')
          ?.shadowRoot?.querySelector('fw-co-nested-select');
        if (!nested) {
          throw new Error('fw-co-nested-select not found under fw-form');
        }
        nested.dispatchEvent(
          new CustomEvent('fwChange', {
            bubbles: true,
            composed: true,
            detail: {
              meta: { selectedOptions: [options[1]] },
              level: 0,
              name: 'category_co',
            },
          })
        );
        nested.dispatchEvent(
          new CustomEvent('fwChange', {
            bubbles: true,
            composed: true,
            detail: {
              meta: { selectedOptions: [options[1].choices[0]] },
              level: 1,
              name: 'category_co',
            },
          })
        );
      },
      sampleOptions
    );
    await page.waitForChanges();

    const leafEmits = fwChange.events.filter(
      (event) =>
        event.detail &&
        event.detail.meta === undefined &&
        event.detail.name === 'category_co'
    );
    expect(leafEmits.length).toBeGreaterThanOrEqual(1);
    expect(leafEmits[leafEmits.length - 1].detail).toEqual({
      name: 'category_co',
      value: 'crm',
    });

    const form = await page.find('fw-form');
    const result = await form.callMethod('getValues');
    expect(result.values.category_co).toBe('crm');
  });

  it('should restore cascade levels when valuePath is set after mount', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-co-nested-select></fw-co-nested-select>');
    const element = await page.find('fw-co-nested-select');

    element.setProperty('options', sampleOptions);
    element.setProperty('name', 'category_co');
    await page.waitForChanges();

    expect(
      await page.find('fw-co-nested-select >>> fw-co-nested-node')
    ).not.toBeNull();

    element.setProperty('valuePath', ['hardware', 'computer', 'mac']);
    await page.waitForChanges();

    const pathValues = await page.evaluate(() => {
      const values = [];
      let node = document
        .querySelector('fw-co-nested-select')
        ?.shadowRoot?.querySelector('fw-co-nested-node');

      while (node) {
        values.push(node.value || '');
        const shadow = node.shadowRoot;
        node =
          shadow?.querySelector('.nest_indent fw-co-nested-node') ||
          shadow?.querySelector('.nest > fw-co-nested-node');
      }

      return values;
    });

    expect(pathValues).toEqual(['hardware', 'computer', 'mac']);
  });

  it('should re-seed root node when value is set after mount', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-co-nested-select></fw-co-nested-select>');
    const element = await page.find('fw-co-nested-select');

    element.setProperty('options', sampleOptions);
    element.setProperty('name', 'category_co');
    await page.waitForChanges();

    let rootNode = await page.find('fw-co-nested-select >>> fw-co-nested-node');
    expect(await rootNode.getProperty('value')).toBe('');

    element.setProperty('value', 'software');
    await page.waitForChanges();

    rootNode = await page.find('fw-co-nested-select >>> fw-co-nested-node');
    expect(await rootNode.getProperty('value')).toBe('software');
  });
});
