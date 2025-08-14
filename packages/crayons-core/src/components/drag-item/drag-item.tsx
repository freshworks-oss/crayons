import { Component, Element, State, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'fw-drag-item',
  styleUrl: 'drag-item.scss',
  shadow: true,
})
export class DragItem {
  @Element() el: HTMLElement;
  @State() draggable = false;

  private dragIcon?: HTMLElement;

  /**
   * Whether the drag is disabled or not.
   */
  @Prop() disabled = false;
  /**
   * Whether the drag icon should be visible.
   */
  @Prop() showDragIcon = true;
  /**
   * Pinned position of the drag item, other drag item cannot be placed above or below it.
   */
  @Prop() pinned: 'top' | 'bottom';

  componentDidLoad() {
    if (this.pinned) return;
    this.dragIcon?.addEventListener(
      'mousedown',
      this.toggleDraggable.bind(this)
    );

    this.dragIcon?.addEventListener(
      'mouseout',
      this.toggleDraggable.bind(this)
    );
  }

  toggleDraggable() {
    this.draggable = !this.draggable;
  }

  disconnectedCallback() {
    this.dragIcon?.removeEventListener('mousedown', this.toggleDraggable);
    this.dragIcon?.removeEventListener('mouseout', this.toggleDraggable);
  }

  render() {
    return (
      <Host draggable={this.draggable}>
        <div
          class={{
            'drag-item': true,
          }}
          draggable={this.draggable}
        >
          {this.showDragIcon && (
            <span
              class={
                !this.pinned ? 'drag-item__prefix' : 'drag-item__prefix pinned'
              }
            >
              <fw-icon
                class={{ 'drag-icon': true, 'drag': !this.pinned }}
                name={!this.pinned ? 'drag' : 'lock'}
                ref={(dragIcon) => (this.dragIcon = dragIcon)}
              ></fw-icon>
            </span>
          )}
          <span class='drag-item__label'>
            <slot></slot>
          </span>
          <span class='drag-item__suffix'>
            <slot name='suffix'></slot>
          </span>
        </div>
      </Host>
    );
  }
}
