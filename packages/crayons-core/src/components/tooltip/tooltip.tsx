import { Component, Element, Prop, Method, h } from '@stencil/core';
import { PopoverPlacementType, PopoverTriggerType } from '../../utils/types';
import { hasSlot } from '../../utils';

@Component({
  tag: 'fw-tooltip',
  styleUrl: 'tooltip.scss',
  shadow: true,
})
export class Tooltip {
  /**
   * To get access to the host element.
   */
  @Element() host: HTMLElement;
  /**
   * Placement of the popover content with respect to the popover trigger.
   */
  @Prop() placement: PopoverPlacementType = 'top';
  /**
   * Alternative placement for popover if the default placement is not possible.
   */
  @Prop() fallbackPlacements: [PopoverPlacementType] = ['top'];
  /**
   * Content of the tooltip.
   */
  @Prop() content = '';

  /**
   * Header of the tooltip.
   */
  @Prop() header = '';
  /**
   * Distance defines the distance between the popover trigger and the popover content along y-axis.
   */
  @Prop() distance = '10';
  /**
   * The trigger event on which the popover-content is displayed. The available options are
   * 'click' | 'manual' | 'hover', in case of 'manual' no trigger event will be set.
   */
  @Prop() trigger: PopoverTriggerType = 'hover';
  /**
   * Option to prevent the tooltip from being clipped when the component is placed inside a container with
   * `overflow: auto|hidden|scroll`.
   */
  @Prop() hoist = false;

  /**
   * Private
   * Reference to popover element.
   */
  private popoverRef: HTMLFwPopoverElement;
  /**
   * Private
   * Set to true if we want to render slot instead of default footer.
   */
  private custom = null;

  /**
   * lifecycle event, called once just after the component is first connected to the DOM.
   */
  componentWillLoad() {
    if (this.custom === null) {
      this.custom = hasSlot(this.host, 'tooltip-content');
    }
  }

  /**
   * Shows the tooltip.
   * @returns promise that resolves to true
   */
  @Method()
  async show() {
    this.popoverRef.show();
    return true;
  }
  /**
   * Hides the tooltip.
   * @returns promise that resolves to true
   */
  @Method()
  async hide() {
    this.popoverRef.hide();
    return true;
  }

  /**
   * Renders trigger and content elements through fw-popper element.
   * @returns {JSX.Element}
   */
  render(): JSX.Element {
    // Auto-detect if tooltip is inside a modal and force hoist
    const isInsideModal =
      this.host.closest('fw-modal, .modal-overlay') !== null;
    const shouldHoist = this.hoist || isInsideModal;

    return (
      <fw-popover
        trigger={this.trigger}
        placement={this.placement}
        fallbackPlacements={this.fallbackPlacements}
        sameWidth={false}
        distance={this.distance}
        disable-transition='true'
        has-border='false'
        hoist={shouldHoist}
        ref={(popoverRef) => (this.popoverRef = popoverRef)}
      >
        <slot slot='popover-trigger'></slot>
        {this.custom ? (
          <div class='tooltip' slot='popover-content' role='tooltip'>
            <slot name='tooltip-content'></slot>
          </div>
        ) : (
          this.content.trim().length && (
            <div
              class={{ tooltip: true, header: !!this.header.length }}
              slot='popover-content'
              role='tooltip'
            >
              {!!this.header?.length && <h3>{this.header}</h3>}
              {this.content.trim()}
            </div>
          )
        )}
      </fw-popover>
    );
  }
}
