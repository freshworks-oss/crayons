import { newE2EPage } from '@stencil/core/testing';

interface ROTrackedWindow extends Window {
  ResizeObserver: new (cb: () => void) => { disconnect(): void };
  __roCreated: number;
  __roDisconnected: number;
}

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

  describe('resize observer', () => {
    const popoverHtml = `<fw-popover>
        <fw-button slot="popover-trigger">Open</fw-button>
        <div slot="popover-content">Content</div>
    </fw-popover>`;

    // Wraps the native ResizeObserver to track instances created and
    // the number of disconnect() calls, before any component code runs.
    const trackResizeObserver = async (page) => {
      await page.evaluateOnNewDocument(() => {
        const w = window as unknown as ROTrackedWindow;
        const Native = w.ResizeObserver;
        w.__roCreated = 0;
        w.__roDisconnected = 0;
        w.ResizeObserver = class extends Native {
          constructor(cb) {
            super(cb);
            w.__roCreated++;
          }
          disconnect() {
            w.__roDisconnected++;
            super.disconnect();
          }
        };
      });
    };

    it('should create only one ResizeObserver across multiple re-renders', async () => {
      const page = await newE2EPage();
      await trackResizeObserver(page);
      await page.setContent(popoverHtml);
      await page.waitForChanges();

      const popover = await page.find('fw-popover');
      const created = () =>
        page.evaluate(() => (window as unknown as ROTrackedWindow).__roCreated);
      expect(await created()).toBe(1);

      // Trigger several re-renders by toggling the popover and a prop
      for (let i = 0; i < 3; i++) {
        await popover.callMethod('show');
        await page.waitForChanges();
        await popover.callMethod('hide');
        await page.waitForChanges();
      }
      popover.setProperty('placement', 'top');
      await page.waitForChanges();
      popover.setProperty('placement', 'bottom');
      await page.waitForChanges();

      expect(await created()).toBe(1);
    });

    it('should reposition the popper when the content is resized', async () => {
      const page = await newE2EPage();
      await page.setContent(popoverHtml);
      await page.waitForChanges();

      const popover = await page.find('fw-popover');
      await popover.callMethod('show');
      await page.waitForChanges();

      const content = await page.find('fw-popover >>> .popper-content');
      expect(content).toHaveAttribute('data-show');

      // Grow the slotted content; the popover should stay open and rendered
      await page.evaluate(() => {
        const el = document.querySelector('[slot="popover-content"]');
        (el as HTMLElement).style.height = '300px';
      });
      await page.waitForChanges();

      const afterResize = await page.find('fw-popover >>> .popper-content');
      expect(afterResize).toHaveAttribute('data-show');
    });

    it('should disconnect the ResizeObserver when the popover is removed', async () => {
      const page = await newE2EPage();
      await trackResizeObserver(page);
      await page.setContent(popoverHtml);
      await page.waitForChanges();

      expect(
        await page.evaluate(
          () => (window as unknown as ROTrackedWindow).__roDisconnected
        )
      ).toBe(0);

      await page.evaluate(() => document.querySelector('fw-popover')?.remove());
      await page.waitForChanges();

      expect(
        await page.evaluate(
          () => (window as unknown as ROTrackedWindow).__roDisconnected
        )
      ).toBe(1);
    });
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
