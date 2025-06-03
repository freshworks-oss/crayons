import {
  Component,
  Event,
  Element,
  EventEmitter,
  Prop,
  Watch,
  h,
  Host,
  Listen,
} from '@stencil/core';
import { addRTL } from '../../utils';

@Component({
  tag: 'fw-toggle',
  styleUrl: 'toggle.scss',
  shadow: true,
})
export class Toggle {
  @Element() host!: HTMLElement;
  /**
   * Sets the selected state as the default state. If the attribute’s value is undefined, the value is set to false.
   */
  @Prop({ mutable: true }) checked = false;
  /**
   * Size of the input control.
   */
  @Prop() size: 'small' | 'medium' | 'large' = 'medium';
  /**
   * Name of the component, saved as part of the form data.
   */
  @Prop() name = '';
  /**
   * Specifies whether to disable the control on the interface. If the attribute’s value is undefined, the value is set to false.
   */
  @Prop() disabled = false;
  /**
   * Specifies whether to show the check and cancel icons on toggle button. If the attribute’s value is undefined, the value is set to true.
   */
  @Prop() showIcon = true;
  /**
   * Label for the component, that can be used by screen readers.
   */
  @Prop() label = '';
  /**
   * Triggered when the input control is selected or deselected.
   */
  @Event() fwChange: EventEmitter;

  @Listen('keyup')
  handleKeyUp(ev: KeyboardEvent) {
    if (ev.code === 'Space' || ev.code === 'Enter') {
      this.toggle();
    }
  }

  @Listen('keydown')
  handleKeyDown(ev: KeyboardEvent) {
    if (ev.code === 'Space' || ev.code === 'Enter') {
      ev.preventDefault();
    }
  }

  @Watch('checked')
  watchHandler(newValue: boolean) {
    this.fwChange.emit({ checked: newValue });
  }

  connectedCallback() {
    addRTL(this.host);
  }

  private toggle = (): void => {
    if (!this.disabled) {
      this.checked = !this.checked;
    }
  };

  render() {
    const toggleSize = ['small', 'medium', 'large'].includes(this.size)
      ? this.size
      : 'medium';
    return (
      <Host
        onClick={() => this.toggle()}
        tabindex='0'
        role='switch'
        aria-disabled={this.disabled ? 'true' : 'false'}
        aria-checked={this.checked ? 'true' : 'false'}
        aria-label={this.label}
      >
        <div
          class={{
            'toggle-switch': true,
            [toggleSize]: true,
          }}
        >
          <input
            name={this.name}
            type='checkbox'
            disabled={this.disabled}
            checked={this.checked}
            class='checkboxClass'
          />
          <span
            class={{
              slider: true,
              [toggleSize]: true,
            }}
          >
            {
              <span class='before'>
                {this.showIcon && (
                  <fw-icon
                    name={this.checked ? 'check' : 'cross'}
                    class={{ checked: this.checked }}
                    library='system'
                  ></fw-icon>
                )}
              </span>
            }
          </span>
        </div>
      </Host>
    );
  }
}
