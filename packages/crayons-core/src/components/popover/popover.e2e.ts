import { newE2EPage } from '@stencil/core/testing';

describe('fw-popover', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-popover></fw-popover>');
    const element = await page.find('fw-popover');
    expect(element).toHaveClass('hydrated');
  });

  it('should have popover content hidden by default', async () => {
    const page = await newE2EPage();

    await page.setContent(`<fw-popover>
        <fw-button slot="popover-trigger">Open</fw-button>
        <div slot="popover-content">Content</div>
    </fw-popover>`);
    await page.waitForChanges();
    const content = await page.find('fw-popover >>> .popper-content');
    expect(content).not.toHaveAttribute('data-show');
  });

  it('should show content when show() is called and hide when hide() is called', async () => {
    const page = await newE2EPage();

    await page.setContent(`<fw-popover>
        <fw-button slot="popover-trigger">Open</fw-button>
        <div slot="popover-content">Content</div>
    </fw-popover>`);
    const popover = await page.find('fw-popover');
    let content = await page.find('fw-popover >>> .popper-content');

    expect(content).not.toHaveAttribute('data-show');

    await (popover as any).callMethod('show');
    await page.waitForChanges();
    content = await page.find('fw-popover >>> .popper-content');
    expect(content).toHaveAttribute('data-show');

    await (popover as any).callMethod('hide');
    await page.waitForChanges();
    content = await page.find('fw-popover >>> .popper-content');
    expect(content).not.toHaveAttribute('data-show');
  });

  it('should open and show content when trigger is clicked', async () => {
    const page = await newE2EPage();

    await page.setContent(`<fw-popover>
        <fw-button slot="popover-trigger">Currency List</fw-button>
        <fw-list-options id="currency" slot="popover-content"></fw-list-options>
    </fw-popover>`);
    const trigger = await page.find('fw-popover > fw-button');
    await trigger.click();
    await page.waitForChanges();
    const content = await page.find('fw-popover >>> .popper-content');
    expect(content).toHaveAttribute('data-show');
  });

  it('should close the content on clicking on the document by default', async () => {
    const page = await newE2EPage();

    await page.setContent(`<fw-popover hoist>
        <fw-button slot="popover-trigger">Currency List</fw-button>
        <fw-list-options id="currency" slot="popover-content"></fw-list-options>
    </fw-popover>`);
    const trigger = await page.find('fw-popover > fw-button');
    await trigger.click();
    await page.waitForChanges();
    let content = await page.find('fw-popover >>> .popper-content');
    expect(content).toHaveAttribute('data-show');
    await page.evaluate(() => document.body.click());
    await page.waitForChanges();
    content = await page.find('fw-popover >>> .popper-content');
    expect(content).not.toHaveAttribute('data-show');
  });

  it('should open and show content when inside .modal-overlay', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <div class="modal-overlay">
        <fw-popover>
          <fw-button slot="popover-trigger">Open in modal</fw-button>
          <div slot="popover-content">Modal content</div>
        </fw-popover>
      </div>
    `);
    await page.waitForChanges();
    const popover = await page.find('fw-popover');
    await (popover as any).callMethod('show');
    await page.waitForChanges();
    const content = await page.find('fw-popover >>> .popper-content');
    expect(content).toHaveAttribute('data-show');
  });

  it('should open and show content when inside fw-modal', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <fw-modal is-open>
        <fw-popover>
          <fw-button slot="popover-trigger">Open in fw-modal</fw-button>
          <div slot="popover-content">Modal content</div>
        </fw-popover>
      </fw-modal>
    `);
    await page.waitForChanges();
    const popover = await page.find('fw-popover');
    await (popover as any).callMethod('show');
    await page.waitForChanges();
    const content = await page.find('fw-popover >>> .popper-content');
    expect(content).toHaveAttribute('data-show');
  });
});
