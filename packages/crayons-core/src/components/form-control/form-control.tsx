/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Prop, h, Element, State, Method } from '@stencil/core';

import { hasSlot } from '../../utils';

import { TranslationController } from '../../global/Translation';

const NATIVE_CONTROLS = ['input', 'select', 'textarea'];

/**
 * @parent form
 */

@Component({
  tag: 'fw-form-control',
  styleUrl: 'form-control.scss',
  shadow: true,
})
export class FormControl {
  @Element() el;

  @Prop()
  type:
    | 'TEXT'
    | 'NUMBER'
    | 'DECIMAL'
    | 'DROPDOWN'
    | 'MULTI_SELECT'
    | 'RADIO'
    | 'CHECKBOX'
    | 'DATE'
    | 'PARAGRAPH'
    | 'EMAIL'
    | 'URL'
    | 'TEL'
    | 'TIME'
    | 'DATE_TIME'
    | 'RELATIONSHIP'
    | 'AUTO_COMPLETE'
    | 'DEPENDENT_FIELD'
    | 'DROPDOWN_LOOKUP'
    | 'DROPDOWN_LOOKUP_SECTION'
    | 'FILES' = 'TEXT';
  @Prop({ reflect: true })
  name: any;
  @Prop()
  label: any;
  @Prop()
  hidden = false;
  @Prop()
  required = false;
  @Prop()
  hint = '';
  @Prop()
  placeholder = '';
  @Prop()
  choices: any = [];
  /**
   * Additional props can be passed here for crayons components. Useful when rendering crayons components implicitly via form-control.
   */
  @Prop({ mutable: true })
  fieldProps?: any = {};
  /**
   * Contains values for crayons components. Useful when rendering crayons components implicitly via form-control.
   * Not required when using controls via slots.
   */
  @Prop()
  controlProps?: any;
  @Prop()
  touched = false;
  @Prop()
  error = '';
  /**
   * Prop to determine whether to render the form-control or not.
   * Default to true.
   */
  @Prop() shouldRender = true;
  /**
   * Value of the slotted custom field on fw-form-control
   */
  @Prop() value;
  /**
   * Disable the field from being editable
   */
  @Prop()
  disabled = false;

  private slotElement;
  private crayonsControlRef;

  @State() hasSlot = false;

  renderControl(): JSX.Element {
    if (this.hasSlot) return null;
    if (!this.name) return null;

    let cmp;
    switch (this.type) {
      case 'TEXT':
      case 'NUMBER':
      case 'DECIMAL':
      case 'EMAIL':
      case 'TEL':
      case 'URL': {
        const type =
          this.type === 'DECIMAL' ? 'number' : this.type?.toLowerCase();
        const componentProps = {
          ...this.fieldProps,
          name: this.name,
          placeholder: this.placeholder,
          label: this.label,
          required: this.required,
          disabled: this.disabled,
          type: type,
          ...this.controlProps?.inputProps(this.name, type),
          state: (this.touched && this.error && 'error') || 'normal',
          ['hint-text']: this.hint,
          ['error-text']: TranslationController.t(this.error, {
            field: this.label || this.name,
          }),
        };

        cmp = (
          <fw-input
            {...componentProps}
            ref={(el) => (this.crayonsControlRef = el)}
          ></fw-input>
        );
        break;
      }
      case 'PARAGRAPH':
        {
          const componentProps = {
            ...this.fieldProps,
            name: this.name,
            placeholder: this.placeholder,
            label: this.label,
            required: this.required,
            disabled: this.disabled,
            ...this.controlProps?.inputProps(
              this.name,
              this.type?.toLowerCase()
            ),
            state: (this.touched && this.error && 'error') || 'normal',
            ['hint-text']: this.hint,
            ['error-text']: TranslationController.t(this.error, {
              field: this.label || this.name,
            }),
          };
          cmp = (
            <fw-textarea
              {...componentProps}
              ref={(el) => (this.crayonsControlRef = el)}
            ></fw-textarea>
          );
        }
        break;

      case 'DATE':
        {
          const componentProps = {
            ...this.fieldProps,
            name: this.name,
            placeholder: this.placeholder,
            label: this.label,
            required: this.required,
            disabled: this.disabled,
            ...this.controlProps?.inputProps(
              this.name,
              this.type?.toLowerCase()
            ),
            state: (this.touched && this.error && 'error') || 'normal',
            ['hint-text']: this.hint,
            ['error-text']: TranslationController.t(this.error, {
              field: this.label || this.name,
            }),
          };
          cmp = (
            <fw-datepicker
              {...componentProps}
              ref={(el) => (this.crayonsControlRef = el)}
            ></fw-datepicker>
          );
        }
        break;

      case 'DATE_TIME':
        {
          const componentProps = {
            ...this.fieldProps,
            name: this.name,
            placeholder: this.placeholder,
            label: this.label,
            required: this.required,
            disabled: this.disabled,
            ...this.controlProps?.inputProps(
              this.name,
              this.type?.toLowerCase()
            ),
            state: (this.touched && this.error && 'error') || 'normal',
            ['hint-text']: this.hint,
            ['error-text']: TranslationController.t(this.error, {
              field: this.label || this.name,
            }),
            showTimePicker: true,
          };
          cmp = (
            <fw-datepicker
              {...componentProps}
              ref={(el) => (this.crayonsControlRef = el)}
            ></fw-datepicker>
          );
        }
        break;

      case 'CHECKBOX':
        {
          const componentProps = {
            ...this.fieldProps,
            name: this.name,
            placeholder: this.placeholder,
            label: '',
            required: this.required,
            disabled: this.disabled,
            ...this.controlProps?.checkboxProps(
              this.name,
              this.type?.toLowerCase()
            ),
            state: (this.touched && this.error && 'error') || 'normal',
            ['hint-text']: this.hint,
            ['error-text']: TranslationController.t(this.error, {
              field: this.label || this.name,
            }),
          };
          cmp = (
            <fw-checkbox
              {...componentProps}
              ref={(el) => (this.crayonsControlRef = el)}
            >
              {this.label}
            </fw-checkbox>
          );
        }
        break;

      case 'RADIO':
        {
          const controlProps = this.controlProps?.radioProps(
            this.name,
            this.type?.toLowerCase()
          );
          const componentProps = {
            ...this.fieldProps,
            'name': this.name,
            'placeholder': this.placeholder,
            'label': this.label,
            'required': this.required,
            'allow-empty': true,
            'state': (this.touched && this.error && 'error') || 'normal',
            ['hint-text']: this.hint,
            ['error-text']: TranslationController.t(this.error, {
              field: this.label || this.name,
            }),
            ...controlProps,
          };
          cmp = (
            <fw-radio-group
              {...componentProps}
              ref={(el) => (this.crayonsControlRef = el)}
            >
              {this.choices
                .sort((a, b) => {
                  const apos = a?.position ?? 0;
                  const bpos = b?.position ?? 0;
                  return apos - bpos;
                })
                ?.map((ch) => {
                  const val = ch[componentProps.optionValuePath] || ch.value;
                  const label = ch[componentProps.optionLabelPath] || ch.value;
                  return (
                    <fw-radio
                      name={this.name}
                      value={val}
                      disabled={this.disabled}
                      state={this.touched && this.error ? 'error' : 'normal'}
                    >
                      {label}
                    </fw-radio>
                  );
                })}
            </fw-radio-group>
          );
        }
        break;

      case 'DROPDOWN':
      case 'MULTI_SELECT':
      case 'DEPENDENT_FIELD':
      case 'DROPDOWN_LOOKUP':
      case 'DROPDOWN_LOOKUP_SECTION':
        {
          const controlProps = this.controlProps?.selectProps(
            this.name,
            this.type?.toLowerCase()
          );

          const fieldOptions = this.fieldProps?.field_options;

          let componentProps = {
            ...this.fieldProps,
            name: this.name,
            placeholder: this.placeholder,
            label: this.label,
            required: this.required,
            disabled: this.disabled,
            multiple: this.type === 'MULTI_SELECT',
            state: (this.touched && this.error && 'error') || 'normal',
            ['hint-text']: this.hint,
            ['error-text']: TranslationController.t(this.error, {
              field: this.label || this.name,
            }),
          };

          componentProps = {
            ...componentProps,
            ...controlProps,
            options: this.choices.sort((a, b) => {
              const apos = a?.position ?? 0;
              const bpos = b?.position ?? 0;
              return apos - bpos;
            }),
          };

          // This is to handle formserv payload which might contain a field_options object, which has parameters, option_value_path and option_label_path,
          // that denotes which property of choices object(form schema) needs to be displayed as label and which should be stored in the backend as value
          if (fieldOptions?.option_value_path)
            componentProps['optionValuePath'] = fieldOptions.option_value_path;
          if (fieldOptions?.option_label_path)
            componentProps['optionLabelPath'] = fieldOptions.option_label_path;

          if (this.type === 'DROPDOWN_LOOKUP_SECTION') {
            // Cascading lookup-backed dropdowns (custom-objects dependent lookups) always render via the
            // dedicated custom-objects nested select, which understands the lookup choice tree directly.
            componentProps.selectProps = this.controlProps?.selectProps;
            cmp = h('fw-co-nested-select', {
              ...componentProps,
              ref: (el) => (this.crayonsControlRef = el),
            });
          } else if (this.type === 'DEPENDENT_FIELD') {
            componentProps.selectProps = this.controlProps.selectProps;
            cmp = (
              <fw-nested-select
                {...componentProps}
                ref={(el) => (this.crayonsControlRef = el)}
              ></fw-nested-select>
            );
          } else {
            cmp = (
              <fw-select
                {...componentProps}
                ref={(el) => (this.crayonsControlRef = el)}
              ></fw-select>
            );
          }
        }
        break;

      case 'RELATIONSHIP':
      case 'AUTO_COMPLETE':
        {
          const controlProps = this.controlProps?.selectProps(
            this.name,
            this.type?.toLowerCase()
          );

          const fieldOptions = this.fieldProps?.field_options;

          const componentProps = {
            ...this.fieldProps,
            name: this.name,
            placeholder: this.placeholder,
            label: this.label,
            required: this.required,
            disabled: this.disabled,
            state: (this.touched && this.error && 'error') || 'normal',
            ['hint-text']: this.hint,
            ['error-text']: TranslationController.t(this.error, {
              field: this.label || this.name,
            }),
          };

          if (
            Array.isArray(controlProps?.value) &&
            typeof controlProps.value[0] === 'object'
            // handle multi_select, select [{}] initialValues
          ) {
            componentProps.selectedOptions = controlProps.value;
          }

          if (componentProps.selectedOptions?.length > 0) {
            this.crayonsControlRef?.setSelectedOptions(
              componentProps.selectedOptions
            );
          } else if (!controlProps?.value) {
            this.crayonsControlRef?.setSelectedOptions([]);
          }
          componentProps.noDataText =
            TranslationController.t('search.startTyping');

          if (fieldOptions?.option_value_path)
            componentProps['optionValuePath'] = fieldOptions.option_value_path;
          if (fieldOptions?.option_label_path)
            componentProps['optionLabelPath'] = fieldOptions.option_label_path;

          cmp = (
            <fw-select
              {...componentProps}
              ref={(el) => (this.crayonsControlRef = el)}
            ></fw-select>
          );
        }
        break;

      case 'TIME':
        {
          const componentProps = {
            ...this.fieldProps,
            name: this.name,
            placeholder: this.placeholder,
            label: this.label,
            required: this.required,
            disabled: this.disabled,
            ...this.controlProps?.inputProps(
              this.name,
              this.type?.toLowerCase()
            ),
            state: (this.touched && this.error && 'error') || 'normal',
            ['hint-text']: this.hint,
            ['error-text']: TranslationController.t(this.error, {
              field: this.label || this.name,
            }),
          };
          cmp = (
            <fw-timepicker
              {...componentProps}
              ref={(el) => (this.crayonsControlRef = el)}
            ></fw-timepicker>
          );
        }
        break;
      case 'FILES':
        {
          const multiple = this.fieldProps?.multiple ? true : false;
          const errorText =
            this.touched && this.error
              ? TranslationController.t(this.error, {
                  field: this.label || this.name,
                })
              : '';
          const controlProps = this.controlProps?.fileProps(
            this.name,
            multiple
          );
          const componentProps = {
            ...this.fieldProps,
            name: this.name,
            description: this.placeholder,
            required: this.required,
            isBatchUpload: true,
            isFormLabel: true,
            hintText: this.hint,
            errorText: errorText,
          };
          if (controlProps?.value) {
            componentProps.initialFiles = controlProps.value;
          }
          cmp = (
            <fw-file-uploader-2
              {...componentProps}
              ref={(el) => (this.crayonsControlRef = el)}
            ></fw-file-uploader-2>
          );
        }
        break;
    }
    return cmp;
  }

  componentWillUpdate(): void {
    this.setSlotElementValue();
  }

  /**
   * Set Focus on the child
   */
  @Method()
  async setFocus() {
    if (!this.hasSlot) {
      await this.crayonsControlRef?.setFocus?.();
    } else {
      this.slotElement?.focus?.();
    }
  }

  private handleSlotChange() {
    this.hasSlot = hasSlot(this.el);
    this.slotElement = [...this.el.querySelectorAll('*')].filter((el: any) => {
      return NATIVE_CONTROLS.includes(el?.tagName?.toLowerCase());
    })?.[0];

    this.setSlotElementValue();
  }

  /**
   * Set Value on the slotted control field on fw-form-control.
   * Useful for setting initialValues on the slotted control field
   * Assumes that the slotted control field has a prop named `value`
   */
  private setSlotElementValue() {
    if (this.slotElement) {
      setTimeout(() => {
        switch (this.type) {
          case 'CHECKBOX':
            this.slotElement.checked = this.value ?? false;
            break;
          default:
            this.slotElement.value = this.value ?? '';
        }
      }, 100);
    }
  }

  render(): JSX.Element {
    return (
      this.shouldRender && (
        <div class={`form-control-container ${this.hidden ? 'd-none' : ''}`}>
          {this.renderControl()}
          {this.hasSlot && (
            <label
              htmlFor={this.name}
              class={{
                label: true,
                required: this.required,
              }}
            >
              {this.label}
            </label>
          )}
          <slot onSlotchange={() => this.handleSlotChange()}></slot>
          {this.hasSlot && !(this.touched && this.error) && (
            <div class='hint' id={`hint-${this.name}`}>
              {this.hint}
            </div>
          )}
          {this.hasSlot && this.touched && this.error && (
            <div class='error' id={`error-${this.name}`}>
              {TranslationController.t(this.error, {
                field: this.label || this.name,
              })}
            </div>
          )}
        </div>
      )
    );
  }
}
