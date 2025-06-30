import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  Watch,
  h,
  Listen,
  Method,
  State,
} from '@stencil/core';

import { renderHiddenField, hasSlot } from '../../utils';
@Component({
  tag: 'fw-checkbox',
  styleUrl: 'checkbox.scss',
  shadow: true,
})
export class Checkbox {
  @Element() host!: HTMLElement;
  /**
   * Sets the state of the check box to selected. If the attribute’s value is undefined, the value is set to false.
   */
  @Prop({ mutable: true, reflect: true }) checked = false;
  /**
   * Sets the state of the check box to partially selected (neither checked nor unchecked). If the attribute's value is undefined, the value is set to false.
   */
  @Prop({ mutable: true, reflect: true }) indeterminate = false;
  /**
   * Disables the check box on the interface. If the attribute's value is undefined, the value is set to false.
   */
  @Prop({ mutable: true, reflect: true }) disabled = false;
  /**
   * Description to be displayed for the checkbox.
   */
  @Prop() description = '';
  /**
   * @deprecated Use `description` instead.
   * Label displayed on the interface, for the check box.
   */
  @Prop() label = '';
  /**
   * Name of the component, saved as part of form data.
   */
  @Prop() name = '';
  /**
   * Identifier corresponding to the component, that is saved when the form data is saved.
   */
  @Prop() value = '';
  /**
   * Specifies the input box as a mandatory field and displays an asterisk next to the label. If the attribute’s value is undefined, the value is set to false.
   */
  @Prop() required = false;

  /**
   * Theme based on which the checkbox is styled.
   */
  @Prop() state: 'normal' | 'warning' | 'error' = 'normal';
  /**

  /**
   * Hint text displayed below the radio group.
   */
  @Prop() hintText = '';
  /**
   * Warning text displayed below the radio group.
   */
  @Prop() warningText = '';
  /**
   * Error text displayed below the radio group.
   */
  @Prop() errorText = '';

  @State() hasHintTextSlot = false;
  @State() hasWarningTextSlot = false;
  @State() hasErrorTextSlot = false;

  /**
   * Triggered when the checkbox state is modified.
   */
  @Event() fwChange!: EventEmitter;

  /**
   * Triggered when the check box comes into focus.
   */
  @Event() fwFocus!: EventEmitter<void>;

  /**
   * Triggered when the check box loses focus.
   */
  @Event() fwBlur!: EventEmitter;

  private checkbox!: HTMLInputElement;

  componentDidLoad() {
    this.checkbox.checked = this.checked;
    this.checkbox.disabled = this.disabled;
    this.checkbox.indeterminate = this.indeterminate;
  }

  @Watch('checked')
  checkChanged(isChecked: boolean) {
    this.checkbox.checked = isChecked;
  }

  @Watch('indeterminate')
  checkIndeterminate(isIndeterminate: boolean) {
    this.checkbox.indeterminate = isIndeterminate;
    if (isIndeterminate) {
      this.checked = false;
      this.checkbox.checked = false;
    }
  }

  componentWillLoad() {
    this.checkSlotContent();
  }
  checkSlotContent() {
    this.hasHintTextSlot = hasSlot(this.host, 'hint-text');
    this.hasWarningTextSlot = hasSlot(this.host, 'warning-text');
    this.hasErrorTextSlot = hasSlot(this.host, 'error-text');
  }

  /**
   * Sets focus on a `fw-checkbox`.
   */
  @Method()
  async setFocus() {
    this.host?.focus();
  }

  @Watch('disabled')
  disabledChanged(isDisabled: boolean) {
    this.checkbox.disabled = isDisabled;
  }

  @Listen('keydown')
  handleKeydown(ev: KeyboardEvent) {
    if (ev.code === 'Space') {
      ev.preventDefault();
    }
  }

  @Listen('keyup')
  handleKeyup(ev: KeyboardEvent) {
    if (ev.code === 'Space') {
      this.toggle(ev);
    }
  }

  private onFocus = () => {
    this.fwFocus.emit();
  };

  private onBlur = (e: Event) => {
    this.fwBlur.emit({
      event: e,
      name: this.name,
    });
  };

  private toggle = (e: any) => {
    if (!this.disabled) {
      if (this.indeterminate) {
        this.indeterminate = false;
        this.checkbox.indeterminate = false;
      }
      this.checked = !this.checked;
      this.fwChange.emit({
        event: e,
        value: this.value,
        name: this.name,
        meta: { checked: this.checked, indeterminate: this.indeterminate },
      });
    }
  };

  getAriaDescribedBy(): string {
    if (this.state === 'normal') return `hint-${this.name}`;
    else if (this.state === 'error') return `error-${this.name}`;
    else if (this.state === 'warning') return `warning-${this.name}`;
    return null;
  }

  render() {
    const { host, name, value } = this;

    if (this.checked) {
      renderHiddenField(host, name, value);
    }

    const hasHintText = this.hintText ? true : this.hasHintTextSlot;
    const hasErrorText = this.errorText ? true : this.hasErrorTextSlot;
    const hasWarningText = this.warningText ? true : this.hasWarningTextSlot;

    const showHintText = this.state === 'normal' ? true : false;
    const showErrorText = this.state === 'error' ? true : false;
    const showWarningText = this.state === 'warning' ? true : false;

    const hintTextId = `hint-${this.name}`;
    const warningTextId = `warning-${this.name}`;
    const errorTextId = `error-${this.name}`;

    return (
      <Host
        role='checkbox'
        tabIndex='0'
        aria-disabled={this.disabled ? 'true' : 'false'}
        aria-checked={
          this.indeterminate ? 'mixed' : this.checked ? 'true' : 'false'
        }
        aria-labelledby='label'
        aria-describedby={`description ${this.getAriaDescribedBy()}`}
        onClick={this.toggle}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        aria-invalid={this.state === 'error'}
      >
        <div class={{ 'checkbox-container': true, 'disabled': this.disabled }}>
          <input
            type='checkbox'
            ref={(el) => (this.checkbox = el)}
            required={this.required}
            name={this.name}
            id={this.name}
          ></input>
          <label class={{ error: this.state === 'error' }}>
            <span
              id='label'
              class={{
                'with-description': this.description !== '',
                'required': this.required,
              }}
            >
              <slot />
            </span>
            {this.description !== '' || this.label !== '' ? (
              <div id='description'>
                {this.description ? this.description : this.label}
              </div>
            ) : (
              ''
            )}
            {(this.checked || this.indeterminate) && (
              <span class='after'>
                <fw-icon
                  name={this.indeterminate ? 'minus' : 'check'}
                  color={this.disabled ? '#92A2B1' : '#ffffff'}
                  size={8}
                ></fw-icon>
              </span>
            )}
          </label>
        </div>
        {showHintText && hasHintText && (
          <div
            id={hintTextId}
            class='field-control-hint-text'
            aria-hidden={hasHintText ? 'false' : 'true'}
          >
            <slot name='hint-text'>{this.hintText}</slot>
          </div>
        )}

        {showErrorText && hasErrorText && (
          <div
            id={errorTextId}
            class='field-control-error-text'
            aria-hidden={hasErrorText ? 'false' : 'true'}
          >
            <slot name='error-text'>{this.errorText}</slot>
          </div>
        )}

        {showWarningText && hasWarningText && (
          <div
            id={warningTextId}
            class='field-control-warning-text'
            aria-hidden={hasWarningText ? 'false' : 'true'}
          >
            <slot name='warning-text'>{this.warningText}</slot>
          </div>
        )}
      </Host>
    );
  }
}
