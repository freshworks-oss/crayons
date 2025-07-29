/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  Component,
  Event,
  Element,
  EventEmitter,
  Prop,
  h,
  Host,
} from '@stencil/core';
import { i18nText } from '../utils/form-builder-utils';

@Component({
  tag: 'fw-field-type-menu-item',
  styleUrl: 'field-type-menu-item.scss',
  shadow: true,
})
export class FieldTypeMenuItem {
  @Element() host!: HTMLElement;

  /**
   * Disables the component on the interface. If the attribute’s value is undefined, the value is set to false.
   */
  @Prop({ mutable: true, reflect: true }) disabled = false;
  /**
   * Theme configuration for styling
   */
  @Prop() theme: 'default' | 'dew-light-theme' | 'dew-dark-theme' = 'default';

  /**
   * index attached inside the parent group component
   */
  @Prop() index = -1;
  /**
   * data source used to set and edit the field values
   */
  @Prop() dataProvider = null;
  /**
   * field type attached to the item which will be broadcasted for adding the field type.
   */
  @Prop() value = '';
  /**
   * Label displayed as header in the card.
   */
  @Prop() label = '';
  /**
   * tooltip to be shown on hover
   */
  @Prop() tooltip = '';
  /**
   * backgroundcolor for the icon
   */
  @Prop() iconBackgroundColor = '#ebeff3';
  /**
   * set the icon path to be used
   */
  @Prop() iconName = '';
  /**
   * Name of the component, saved as part of the form data.
   */
  @Prop() name = '';
  /**
   * Triggered when the the add button is clicked.
   */
  @Event() fwAddClick!: EventEmitter;

  private addButtonClickHandler = () => {
    this.fwAddClick.emit({
      value: this.value,
      data: this.dataProvider,
      index: this.index,
    });
  };

  render() {
    console.log(this.theme);
    const strBaseClassName = 'field-type-menu-item';
    let strComponentClassName = strBaseClassName;
    if (this.disabled) {
      strComponentClassName += ` ${strBaseClassName}--disabled`;
    }

    return (
      <Host tabIndex='-1' class={`theme-${this.theme}`}>
        <fw-tooltip placement='right' trigger='hover' content={this.tooltip}>
          <div class={strComponentClassName}>
            <div
              class={`${strBaseClassName}-draggable-container ${strBaseClassName}--${this.theme}`}
              draggable={true}
            >
              <span
                class={`${strBaseClassName}-icon-container`}
                style={{ backgroundColor: this.iconBackgroundColor }}
              >
                <fw-icon size={14} name={this.iconName} color='#475867' />
              </span>
              <label class={`${strBaseClassName}-label`}>
                {i18nText(this.label)}
              </label>
            </div>
            <span
              class={`${strBaseClassName}-add-button-container`}
              onClick={this.addButtonClickHandler}
            >
              <fw-icon size={10} name='plus' color='#12344D'></fw-icon>
            </span>
          </div>
        </fw-tooltip>
      </Host>
    );
  }
}
