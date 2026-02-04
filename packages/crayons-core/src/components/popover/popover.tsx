import {
  Component,
  Element,
  Listen,
  State,
  Event,
  EventEmitter,
  Method,
  Prop,
  h,
  Watch,
} from '@stencil/core';
import { createPopper, Instance } from '@popperjs/core';
import { PopoverPlacementType, PopoverTriggerType } from '../../utils/types';
import { popperModifierRTL } from '../../utils';

@Component({
  tag: 'fw-popover',
  styleUrl: 'popover.scss',
  shadow: true,
})
export class Popover {
  private popperDiv: HTMLElement;
  private contentRef: any;
  private triggerRef: any;
  private triggerRefSlot: any = null;
  private overlay: HTMLElement;
  private resizeObserver;
  private timerId: any;

  @Element() host: HTMLElement;

  @State() popperInstance: Instance;
  @State() isOpen = false;
  @State() popperOptions;

  /**
   * Placement of the popover content with respect to the popover trigger.
   */
  @Prop() placement: PopoverPlacementType = 'bottom';
  /**
   * Alternative placement for popover if the default placement is not possible.
   */
  @Prop() fallbackPlacements: [PopoverPlacementType] = ['top'];
  /**
   * The area that the popup will be checked for overflow relative to.
   */
  @Prop() boundary: HTMLElement;
  /**
   * Skidding defines the distance between the popover trigger and the popover content along x-axis.
   */
  @Prop() skidding = '0';
  /**
   * Distance defines the distance between the popover trigger and the popover content along y-axis.
   */
  @Prop() distance = '0';
  /**
   * Variant defines the style of the popover-content.
   */
  @Prop() variant: 'select' | 'date-picker' = 'select';
  /**
   * Whether the popover-content width to be same as that of the popover-trigger.
   */
  @Prop() sameWidth = true;
  /**
   * The trigger event on which the popover-content is displayed. The available options are
   * 'click' | 'manual' | 'hover', in case of 'manual' no trigger event will be set.
   */
  @Prop() trigger: PopoverTriggerType = 'click';
  /**
   * Option to determine if popover-content has a border.
   */
  @Prop() hasBorder = true;
  /**
   * Option to prevent the tooltip from being clipped when the component is placed inside a container with
   * `overflow: auto|hidden|scroll`.
   */
  @Prop() hoist = false;
  /**
   * Option to disable the popover animation on hide and show.
   */
  @Prop() disableTransition = false;
  /**
   * Whether to focus on the element in popover-content slot on opening the dropdown.
   */
  @Prop() autoFocusOnContent = false;
  /**
   * Indicates whether popover contents should be hidden on pressing Tab.
   */
  @Prop() hideOnTab = true;
  /**
   * Indicates the delay after which popover will be shown.
   */
  @Prop() showAfter = 0;
  /**
   * Indicates the delay after which popover will be hidden.
   */
  @Prop() hideAfter = 0;
  /**
   * Triggered whenever the popover contents is open/displayed.
   */
  @Event() fwShow: EventEmitter;
  /**
   * Triggered whenever the popover contents is closed/hidden.
   */
  @Event() fwHide: EventEmitter;

  @Listen('keydown')
  onKeyDown(ev) {
    switch (ev.key) {
      case 'Tab':
        this.hideOnTab && this.hide();
        break;
      case 'Escape':
        this.hide();
        break;
    }
  }

  @Method()
  async show() {
    if (!this.isOpen) {
      clearTimeout(this.timerId);
      if (this.showAfter > 0) await this.delay(this.showAfter);
      this.sameWidth &&
        (this.popperDiv.style.width =
          String(this.triggerRef.getBoundingClientRect().width) + 'px');

      // Create popper instance if it's not available
      !this.popperInstance && this.createPopperInstance();

      this.popperDiv.setAttribute('data-show', '');
      // Enable the event listeners
      this.popperInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...options.modifiers,
          { name: 'eventListeners', enabled: true },
        ],
      }));
      this.popperInstance.update();
      if (this.trigger !== 'hover') {
        this.overlay.style.display = 'block';
      }
      this.isOpen = !this.isOpen;
      if (this.contentRef?.tagName === 'FW-LIST-OPTIONS') {
        const listOptionsElement = this.contentRef as HTMLFwListOptionsElement;
        listOptionsElement.scrollToLastSelected();
      }
      this.autoFocusOnContent &&
        (this.contentRef.setFocus
          ? this.contentRef.setFocus()
          : this.contentRef.focus?.());
      this.fwShow.emit();
    }
  }

  @Method()
  async hide() {
    if (this.isOpen) {
      clearTimeout(this.timerId);
      if (this.hideAfter > 0) await this.delay(this.hideAfter);
      this.popperDiv.removeAttribute('data-show');
      // Disable the event listeners
      this.popperInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...options.modifiers,
          { name: 'eventListeners', enabled: false },
        ],
      }));
      if (this.trigger !== 'hover') {
        this.overlay.style.display = 'none';
      }
      this.isOpen = !this.isOpen;
      if (this.contentRef?.tagName === 'FW-LIST-OPTIONS') {
        const listOptionsElement = this.contentRef as HTMLFwListOptionsElement;
        listOptionsElement.clearFilter();
      }
      this.autoFocusOnContent &&
        (this.triggerRef.setFocus
          ? this.triggerRef.setFocus()
          : this.triggerRef.focus?.());
      this.fwHide.emit();
    }
  }

  @Watch('boundary')
  @Watch('placement')
  @Watch('fallbackPlacements')
  handlePlacementChange(): void {
    this.popperInstance?.destroy();
    this.popperInstance = null;
    this.setPopperOptions();
    this.updatePopper();
  }

  setPopperOptions() {
    // Auto-detect if popover is inside a modal and force fixed strategy
    const isInsideModal =
      this.host.closest('fw-modal, .modal-overlay') !== null;
    const useFixedStrategy = this.hoist || isInsideModal;

    this.popperOptions = {
      placement: this.placement,
      strategy: useFixedStrategy ? 'fixed' : 'absolute',
      modifiers: [
        {
          name: 'flip',
          options: {
            fallbackPlacements: this.fallbackPlacements,
          },
        },
        {
          name: 'preventOverflow',
          options: {
            boundary: isInsideModal
              ? 'viewport'
              : this.boundary || 'clippingParents',
          },
        },
        {
          name: 'offset',
          options: {
            offset: [Number(this.skidding), Number(this.distance)],
          },
        },
        popperModifierRTL,
      ],
    };
  }

  componentWillLoad() {
    this.contentRef = this.host.querySelector('[slot="popover-content"]');
    this.triggerRef = this.host.querySelector('[slot="popover-trigger"]');
    if (this.triggerRef.nodeName === 'SLOT') {
      const assignedElements = this.triggerRef.assignedElements();
      if (assignedElements.length) {
        this.triggerRefSlot = assignedElements[0];
      }
    }
    if (this.trigger === 'click') {
      this.triggerRef.addEventListener(this.trigger, () => {
        if (this.isOpen) {
          this.hide();
        } else {
          this.show();
        }
      });
    } else if (this.trigger === 'hover') {
      const trigger = this.triggerRefSlot || this.triggerRef;
      trigger.addEventListener('focus', this.show.bind(this));
      trigger.addEventListener('blur', this.hide.bind(this));
      trigger.addEventListener('mouseenter', this.show.bind(this));
      this.host.addEventListener('mouseleave', (event: any) => {
        const eventPath = event.path ? event.path : event.composedPath();
        const tooltip = eventPath.filter(
          (node) => node.nodeName === 'FW-TOOLTIP'
        )[0];
        if (tooltip) {
          const mouseLeaveHandler = (() => {
            const hoverElements = document.querySelectorAll(':hover');
            const index = [].indexOf.call(hoverElements, tooltip);
            if (index < 0) {
              this.hide();
            }
          }).bind(this);
          setTimeout(mouseLeaveHandler, 200);
        } else {
          this.hide();
        }
      });
    }
    this.setPopperOptions();
  }

  private async delay(ms: number) {
    return new Promise((res) => {
      this.timerId = setTimeout(res, ms);
    });
  }

  updatePopper() {
    if (this.isOpen) {
      !this.popperInstance && this.createPopperInstance();
      // recompute position of popper
      this.popperInstance?.update();
    }
  }

  componentDidRender = () => {
    // Observe popper content for change in size and update popper position
    this.resizeObserver = new ResizeObserver(this.updatePopper.bind(this));
    this.resizeObserver.observe(this.popperDiv);
  };

  disconnectedCallback() {
    this.removeResizeObserver();
    this.popperInstance?.destroy();
    clearTimeout(this.timerId);
  }

  private removeResizeObserver = () => {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  };

  createPopperInstance() {
    const triggerRef = this.triggerRefSlot || this.triggerRef;
    this.popperInstance = createPopper(
      triggerRef,
      this.popperDiv,
      this.popperOptions
    );
  }

  render() {
    return [
      <slot name='popover-trigger' />,
      <div
        class={{
          'popper-content': true,
          'no-border': !this.hasBorder,
          'no-transition': this.disableTransition,
        }}
        ref={(popperDiv) => (this.popperDiv = popperDiv)}
      >
        <slot name='popover-content' />
      </div>,
      this.trigger !== 'hover' && (
        <div
          aria-hidden='true'
          class='overlay'
          ref={(overlay) => (this.overlay = overlay)}
          onClick={() => this.hide()}
        />
      ),
    ];
  }
}
