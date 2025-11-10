import { Component, Element, Prop, h } from '@stencil/core';
import { hasSlot } from '../../utils';

/**
 * @parent modal
 */

@Component({
  tag: 'fw-modal-title',
  styleUrl: 'modal-title.scss',
  shadow: true,
})
export class ModalTitle {
  @Element() el: HTMLElement;

  /**
   * The title text to be displayed on the modal
   */
  @Prop() titleText: string;

  /**
   * The title text to be displayed on the modal
   */
  @Prop() description: string;

  /**
   * The icon to be displayed with the title
   */
  @Prop() icon = '';

  /**
   * The size of the icon to be displayed with the title
   */
  @Prop() iconSize = 16;

  /**
   * Set to true if we want to render slot instead of default footer
   */
  custom = null;

  /**
   * lifecycle event, called once just after the component is first connected to the DOM
   */
  componentWillLoad() {
    if (this.custom === null) {
      this.custom = hasSlot(this.el);
    }
  }

  /**
   * renders Icon in Modal header.
   * @returns {JSX.Element}
   */
  renderIcon(): JSX.Element {
    return (
      <span class={'modal-title-icon'}>
        <fw-icon
          name={this.icon}
          size={this.iconSize}
          src={
            'https://cdn.jsdelivr.net/npm/@freshworks/crayons-icon@4.2.0-dew.0/dist/icons'
          }
        ></fw-icon>
      </span>
    );
  }

  /**
   * renders slot content when custom attribute is passed, else displays the default
   * icon, title and description with close button in the header.
   * @returns {JSX.Element}
   */
  render(): JSX.Element {
    return (
      <div class='modal-header-container'>
        <div class='modal-header'>
          {this.custom ? (
            <slot></slot>
          ) : (
            <div class='modal-header-body'>
              <div class='modal-title'>
                {this.icon !== '' ? this.renderIcon() : null}
                <label class='title-label'>{this.titleText}</label>
              </div>
              {this.description && (
                <label class='description'>{this.description}</label>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
