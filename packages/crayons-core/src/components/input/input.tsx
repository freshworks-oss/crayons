import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  State,
  h,
} from '@stencil/core';

import { handleKeyDown, renderHiddenField, hasSlot } from '../../utils';
import { PopoverPlacementType } from '../../utils/types';

import FieldControl from '../../function-components/field-control';

@Component({
  tag: 'fw-input',
  styleUrl: 'input.scss',
  shadow: true,
})
export class Input {
  @Element() host!: HTMLElement;
  private nativeInput?: HTMLInputElement;

  @State() hasFocus = false;
  @State() hasPrefix = false;
  @State() hasHintTextSlot = false;
  @State() hasWarningTextSlot = false;
  @State() hasErrorTextSlot = false;
  /**
   * Label displayed on the interface, for the component.
   */
  @Prop() label = '';
  /**
   * Default value displayed in the input box.
   */
  @Prop({ mutable: true }) value?: string | null = '';
  /**
   * Type of value accepted as the input value. If a user enters a value other than the specified type, the input box is not populated.
   */
  @Prop() type: 'text' | 'number' | 'email' | 'url' = 'text';
  /**
   * Specifies whether the browser can display suggestions to autocomplete the text value.
   */
  @Prop() autocomplete: 'on' | 'off' = 'off';
  /**
   * Displays a right-justified clear icon in the text box. Clicking the icon clears the input text. If the attribute’s value is undefined, the value is set to false. For a read-only input box, the clear icon is not displayed unless a default value is specified for the input box.
   */
  @Prop() clearInput = false;
  /**
   * Maximum number of characters a user can enter in the text box.
   */
  @Prop() maxlength?: number;
  /**
   * Minimum number of characters a user must enter in the text box for the value to be valid.
   */
  @Prop() minlength?: number;
  /**
   * Specifies a maximum value that can be entered for the number/decimal input.
   */
  @Prop() max?: number;
  /**
   * Specifies a minimum value that can be entered for the number/decimal input.
   */
  @Prop() min?: number;
  /**
   * The step attribute is used when the type is `number`. It specifies the interval between legal numbers in a number/decimal input element.
   * Works with the min and max attributes to limit the increments at which a value can be set.
   * Possible values are `any` or a positive floating point number.
   * Default value is `any`
   */
  @Prop() step = 'any';
  /**
   * Name of the component, saved as part of form data.
   */
  @Prop() name = '';
  /**
   * Text displayed in the text box before a user enters a value.
   */
  @Prop() placeholder?: string | null;
  /**
   * Theme based on which the text box is styled.
   */
  @Prop() state: 'normal' | 'warning' | 'error' = 'normal';
  /**
   * If true, the user cannot enter a value in the input box. If the attribute’s value is undefined, the value is set to false.
   */
  @Prop() readonly = false;
  /**
   * Specifies the input box as a mandatory field and displays an asterisk next to the label. If the attribute’s value is undefined, the value is set to false.
   */
  @Prop() required = false;
  /**
   * Disables the component on the interface. If the attribute’s value is undefined, the value is set to false.
   */
  @Prop() disabled = false;

  /**
   * Identifier of the icon that is displayed in the left side of the text box. The attribute’s value must be a valid svg file in the repo of icons (assets/icons).
   */
  @Prop() iconLeft: string = undefined;

  /**
   * Identifier of the icon that is displayed in the right side of the text box. The attribute’s value must be a valid svg file in the repo of icons (assets/icons).
   */
  @Prop() iconRight: string = undefined;
  /**
   * Hint text displayed below the text box.
   */
  @Prop() hintText = '';
  /**
   * Warning text displayed below the text box.
   */
  @Prop() warningText = '';
  /**
   * Error text displayed below the text box.
   */
  @Prop() errorText = '';

  /**
   * The optional tooltip's header.
   */
  @Prop() tooltipHeader?: string;

  /**
   * Optional tooltip's content, shown on hover of the input.
   */
  @Prop() tooltipContent?: string;

  /**
   * The tooltip placement type for the optional tooltip.
   */
  @Prop() tooltipPlacement?: PopoverPlacementType;

  /**
   * Truncate title on text overflow
   */
  @Prop() truncateOnOverflow = false;

  /**
   * Triggered when the input box comes into focus.
   */
  @Event() fwFocus: EventEmitter<void>;

  /**
   * Triggered when the input box loses focus.
   */
  @Event() fwBlur: EventEmitter;

  /**
   * Triggered when a value is entered in the input box.
   */
  @Event() fwInput: EventEmitter;

  /**
   * Triggered when clear icon is clicked.
   */
  @Event() fwInputClear: EventEmitter;

  /**
   * Triggered on key down in the input box.
   */
  @Event() fwInputKeyDown: EventEmitter;

  private onInput = (ev: Event) => {
    const input = ev.target as HTMLInputElement | null;
    this.value = input.value || '';
    this.fwInput.emit({
      event: ev,
      name: this.name,
      value: this.getValue(),
    });
  };

  private onFocus = () => {
    this.hasFocus = true;
    this.fwFocus.emit();
  };

  private onBlur = (ev: Event) => {
    this.hasFocus = false;
    this.fwBlur.emit({
      event: ev,
      name: this.name,
    });
  };

  private onKeyDown = (ev: Event) => {
    this.fwInputKeyDown.emit({
      event: ev,
    });
  };

  private showClearButton() {
    return this.clearInput && !this.disabled && this.value?.length > 0;
  }

  private clearTextInput = (ev?: Event) => {
    if (!this.disabled) {
      this.value = '';

      if (this.nativeInput) {
        this.nativeInput.value = '';
      }
      this.fwInputClear.emit({
        event: ev,
        name: this.name,
        value: this.value,
      });
    }
  };

  private getValue(): string {
    return this.value || '';
  }

  private hasValue(): boolean {
    return this.getValue().length > 0;
  }

  /**
   * Sets focus on a specific `fw-input`. Use this method instead of the global `input.focus()`.
   */
  @Method()
  async setFocus() {
    if (this.nativeInput) {
      this.nativeInput.focus();
    }
  }

  renderClearButton() {
    return (
      <div
        class='clear-button'
        role='button'
        tabindex='0'
        onClick={(e) => this.clearTextInput(e)}
        onKeyDown={handleKeyDown(this.clearTextInput)}
      >
        <fw-icon
          class='clear-img'
          name='cross'
          size={8}
          library='system'
        ></fw-icon>
      </div>
    );
  }

  renderIcon(iconName) {
    return <fw-icon name={iconName}></fw-icon>;
  }

  componentWillLoad() {
    this.hasPrefix =
      !!this.host.querySelector('[slot="input-prefix"]') || !!this.iconLeft;
    this.checkSlotContent();
  }

  getAriaDescribedBy(): string {
    if (this.state === 'normal') return `hint-${this.name}`;
    else if (this.state === 'error') return `error-${this.name}`;
    else if (this.state === 'warning') return `warning-${this.name}`;
    return null;
  }

  checkSlotContent() {
    this.hasHintTextSlot = hasSlot(this.host, 'hint-text');
    this.hasWarningTextSlot = hasSlot(this.host, 'warning-text');
    this.hasErrorTextSlot = hasSlot(this.host, 'error-text');
  }

  render() {
    const { host, name, value } = this;

    renderHiddenField(host, name, value);

    return (
      <FieldControl
        inputId={this.name}
        label={this.label}
        labelId={`${this.label}-${this.name}`}
        state={this.state}
        hintTextId={`hint-${this.name}`}
        hintText={this.hintText}
        hasHintTextSlot={this.hasHintTextSlot}
        errorTextId={`error-${this.name}`}
        errorText={this.errorText}
        hasErrorTextSlot={this.hasErrorTextSlot}
        warningTextId={`warning-${this.name}`}
        warningText={this.warningText}
        hasWarningTextSlot={this.hasWarningTextSlot}
        required={this.required}
        tooltipContent={this.tooltipContent}
        tooltipPlacement={this.tooltipPlacement}
        tooltipHeader={this.tooltipHeader}
      >
        <div
          aria-disabled={this.disabled}
          class={{
            'has-value': this.hasValue(),
            'has-focus': this.hasFocus,
          }}
        >
          <div
            class={{
              'input-container': true,
            }}
            part='fw-input-container'
          >
            <div
              class={{
                'input-container-inner': true,
                'has-focus': this.hasFocus,
                'disabled': this.disabled,
                [this.state]: true,
              }}
              part='fw-input-inner-container'
            >
              <div class='inner__content'>
                <div
                  class={{ input__prefix: true, hasContent: this.hasPrefix }}
                >
                  {this.iconLeft && this.renderIcon(this.iconLeft)}
                  <slot name='input-prefix' />
                </div>
                <div class='input__label'>
                  <input
                    ref={(input) => {
                      this.nativeInput = input;
                    }}
                    id={this.name}
                    class={{
                      truncate: this.truncateOnOverflow,
                    }}
                    autoComplete={this.autocomplete}
                    disabled={this.disabled}
                    name={this.name}
                    placeholder={this.placeholder || ''}
                    minLength={this.minlength}
                    maxLength={this.maxlength}
                    min={this.min}
                    max={this.max}
                    readOnly={this.readonly}
                    required={this.required}
                    step={this.step}
                    type={this.type}
                    value={this.value}
                    onInput={this.onInput}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                    onKeyDown={this.onKeyDown}
                    aria-invalid={this.state === 'error'}
                    aria-describedby={this.getAriaDescribedBy()}
                  />
                  {this.showClearButton() && this.renderClearButton()}
                </div>
              </div>
              <div class='inner__suffix'>
                {this.iconRight && this.renderIcon(this.iconRight)}
                <slot name='input-suffix' />
              </div>
            </div>
          </div>
        </div>
      </FieldControl>
    );
  }
}
