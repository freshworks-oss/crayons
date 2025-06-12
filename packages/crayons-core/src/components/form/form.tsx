/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Component,
  Prop,
  State,
  Element,
  h,
  Method,
  Watch,
  Event,
  EventEmitter,
  Fragment,
} from '@stencil/core';
import { v4 as uuidv4 } from 'uuid';
import {
  FormValues,
  FormTouched,
  FormErrors,
  FormUtils,
  FormProps,
  FormSubmit,
  FormRequired,
} from './form-declaration';
import {
  validateYupSchema,
  prepareDataForValidation,
  yupToFormErrors,
  generateDynamicInitialValues,
  generateDynamicValidationSchema,
  serializeForm,
  translateErrors,
  getMappedSchema,
  getValueForField,
  LEGO,
  formServFieldTypes,
} from './form-util';
import { debounce, hasSlot } from '../../utils';
@Component({
  tag: 'fw-form',
  styleUrl: 'form.scss',
  shadow: true,
})
export class Form {
  @Element() el!: any;

  private controls: any;
  private fields: any;
  private isInternalUpdate = false;
  private internalUpdateResetTimer: any;

  /**
   * Initial field values of the form. It is an object with keys pointing to field name
   */
  @Prop() initialValues?: any = {};

  /** Validate the form's values with an async function.
   * Should return a Promise which resolves to an errors object.
   * The keys in the errors object must match with the field names.
   */
  @Prop() validate?: any;

  /**
   * Schema to render Dynamic Form. Contains an array of fields pointing to each form control.
   * Please see the usage reference for examples.
   */
  @Prop() formSchema?: any = {};

  /**
   * YUP based validation schema for handling validation
   */
  @Prop() validationSchema?: any = {};

  /** Tells Form to validate the form on each input's onInput event */
  @Prop() validateOnInput? = true;
  /** Tells Form to validate the form on each input's onBlur event */
  @Prop() validateOnBlur? = true;

  /** The number of milliseconds to delay before doing validation on Input */
  @Prop() wait = 200;

  /**
   * Id to uniquely identify the Form. If not set, a random Id will be generated.
   */
  @Prop() formId = uuidv4();

  /**
   * Mapper Type - LEGO | FORMSERV | CUSTOM.
   * Defaults to `LEGO`.
   */
  @Prop() mapperType: 'LEGO' | 'FORMSERV' | 'CUSTOM' = LEGO;

  /**
   * A custom type mapper object that maps the type of your fields in the schema to the Internal Field Types.
   * Internal Field Types are `TEXT`, `DROPDOWN`, `EMAIL` etc.
   * In the example below, `1` is the type of a field in your schema
   * that needs to correspond to `TEXT` type.
   * Please pass include the mapper for all the field types that you want to support.
   * Example typeMapper object : {
          'CUSTOM_TEXT': { type: 'TEXT' },
          'SELECT': { type: 'DROPDOWN' },
          'TEL': { type: 'PHONE_NUMBER' },
          'CHECKBOX': { type: 'CHECKBOX' },
          'TEXTAREA': { type: 'PARAGRAPH' },
          'DATETIME': { type: 'DATE_TIME' },
          'INTEGER': { type: 'NUMBER' },
        }
   */
  @Prop() customTypeMapper: any = {};

  @State() values: FormValues = {} as any;
  @State() touched: FormTouched<FormValues> = {} as any;
  @State() errors: FormErrors<FormValues> = {} as any;

  @State() formValidationSchema;
  @State() formInitialValues;

  @State() formSchemaState = this.formSchema;
  @State() hasSlot = false;

  @State() fieldSearchText;

  /**
   * fwFormValuesChanged - event that gets emitted when values change.
   */
  @Event() fwFormValuesChanged: EventEmitter;

  /**
   * fwFormValueChanged - event that gets emitted when value in a form field changes.
   */
  @Event() fwFormValueChanged: EventEmitter;

  private debouncedHandleInput: any;
  private handleInputListener: any;
  private handleBlurListener: any;
  private handleChangeListener: any;

  private prevValues = {};

  async componentWillLoad() {
    this.debouncedHandleInput = debounce(this.handleInput, this, this.wait);

    this.handleInputListener = this.el.addEventListener(
      'fwInput',
      this.debouncedHandleInput
    );
    this.handleBlurListener = this.el.addEventListener(
      'fwBlur',
      this.handleBlur
    );
    this.handleChangeListener = this.el.addEventListener(
      'fwChange',
      this.handleInput
    );

    await this.handleSchemaPropsChange();
  }

  @Watch('formSchema')
  @Watch('mapperType')
  @Watch('customTypeMapper')
  async schemaPropsChangeHandler() {
    this.controls = null;
    await this.handleSchemaPropsChange();
  }

  @Watch('initialValues')
  async initialValuesHandler(initialValues) {
    let schema = this.formSchemaState;

    if (this.hasSlot) {
      // for static form get the schema from slots
      schema = this.getFormSchemaFromSlots();
    }
    await this.handleFormSchemaAndInitialValuesChange(schema, initialValues);
  }

  @Watch('values')
  valuesChangeHandler(values) {
    this.fwFormValuesChanged.emit({
      value: values,
    });
  }

  async handleSchemaPropsChange() {
    const newSchema = getMappedSchema({
      type: this.mapperType,
      schema: this.formSchema,
      customTypeMapper: this.customTypeMapper,
    });

    this.formSchemaState = newSchema;
    await this.handleFormSchemaAndInitialValuesChange(
      newSchema,
      this.initialValues
    );
  }

  async handleFormSchemaAndInitialValuesChange(formSchema, initialValues) {
    const getSectionFields = (fields = []) => {
      return fields.reduce((acc, field) => {
        // Update the type based on formServFieldTypes
        field.type = formServFieldTypes[field.type]?.type || field.type;
        return {
          ...acc,
          [field.name]: field,
          ...getSectionFields(field?.fields || []),
        };
      }, {});
    };

    this.fields = formSchema?.fields?.reduce((acc, field) => {
      // If there are Section fields, add them as well, outside of `fields` key
      const nestedFields = getSectionFields(field?.fields || []);

      return {
        ...acc,
        [field.name]: field,
        ...nestedFields,
      };
    }, {});

    this.formValidationSchema =
      generateDynamicValidationSchema(formSchema, this.validationSchema) || {};
    this.formInitialValues =
      generateDynamicInitialValues(formSchema, initialValues) || {};

    this.values = this.formInitialValues;
    this.prevValues = this.values;

    const initialValuesKeys = Object.keys(initialValues);

    for (const field of Object.keys(this.formInitialValues)) {
      this.errors[field] = null;
      if (initialValuesKeys?.includes(field)) this.touched[field] = true;
      else this.touched[field] = false;
    }

    await this.handleValidation();
  }

  // get Form Controls and pass props to children
  componentDidLoad() {
    this.controls = this.getFormControls();
    if (this.hasSlot) this.passPropsToChildren(this.controls);
    // adding a timeout since this lifecycle method is called before its child in React apps.
    // Bug with react wrapper.
    setTimeout(() => {
      this.setFocusOnError();
    }, 10);
  }

  // pass props to form-control children
  componentWillUpdate() {
    if (!this.controls || !this.controls.length) {
      this.controls = this.getFormControls();
    }
    if (this.hasSlot) this.passPropsToChildren(this.controls);
  }

  handleSlotChange() {
    this.hasSlot = hasSlot(this.el);
    this.controls = this.getFormControls();

    /** Create implicit validation rules based
     *  on slotted form-controls for static form
     */
    // setup initialValues and validation rules
    this.handleFormSchemaAndInitialValuesChange(
      this.getFormSchemaFromSlots(),
      this.initialValues
    );
  }

  disconnectedCallback() {
    this.el?.removeEventListener?.('fwBlur', this.handleBlurListener);
    this.el?.removeEventListener?.('fwInput', this.handleInputListener);
    this.el?.removeEventListener?.('fwChange', this.handleChangeListener);
    if (this.internalUpdateResetTimer) {
      clearTimeout(this.internalUpdateResetTimer);
    }
  }

  handleSubmit = async (event: Event): Promise<FormSubmit> => {
    event?.preventDefault();
    event?.stopPropagation();

    let isValid = false,
      touchedState = {};

    await this.handleValidation();

    const keys = [...Object.keys(this.values), ...Object.keys(this.errors)];

    keys.forEach(
      (k: string) => (touchedState = { ...touchedState, [k]: true })
    );
    // on clicking submit, mark all fields as touched
    this.touched = { ...this.touched, ...touchedState };

    isValid = !this.errors || Object.keys(this.errors).length === 0;
    if (!isValid) {
      this.setFocusOnError();
    }

    let serializedValues = { ...this.values };

    if (this.formSchemaState && Object.keys(this.formSchemaState).length > 0) {
      serializedValues = serializeForm(serializedValues, this.fields);
    }

    this.prevValues = this.values;

    const translatedErrors = await translateErrors(this.errors, this.fields);

    return { values: serializedValues, errors: translatedErrors, isValid };
  };

  handleReset = async (event?: Event): Promise<void> => {
    event?.preventDefault();
    event?.stopPropagation();
    this.values = this.formInitialValues;
    this.prevValues = this.values;

    let touchedState = {};
    const initialValuesKeys = Object.keys(this.initialValues);

    initialValuesKeys.forEach(
      (k: string) => (touchedState = { ...touchedState, [k]: true })
    );
    this.touched = touchedState;

    if (initialValuesKeys && initialValuesKeys.length > 0) {
      await this.handleValidation();
      this.setFocusOnError();
    }
  };

  handleValidation = async () => {
    let validationErrors = {};

    // run validations against validationSchema if present
    if (
      this.formValidationSchema &&
      Object.keys(this.formValidationSchema).length
    ) {
      const pr = validateYupSchema(
        prepareDataForValidation(this.values),
        this.formValidationSchema
      );
      try {
        await pr;
        validationErrors = {}; // reset errors if no errors from validation
      } catch (err) {
        validationErrors = yupToFormErrors(err);
      }
    }

    // run validations with validate function if passed as prop and merge with the errors from the above step
    if (this.validate && typeof this.validate === 'function') {
      try {
        validationErrors = {
          ...validationErrors,
          ...((await this.validate(this.values)) || {}),
        };
      } catch (err) {
        console.error(`Error in calling validate function ${err.message}`);
        validationErrors = { ...validationErrors };
      }
    }

    this.errors = validationErrors;
  };

  handleInput = async (event: Event) => {
    const details = (event as any).detail;
    if (!details || !details.name) return;
    const { name, value, meta, files } = details;

    let componentValue;

    if (meta && 'checked' in meta) {
      componentValue = meta.checked;
    } else if (files) {
      componentValue = files;
    } else {
      componentValue = value;
    }

    // reset for section fields when values changed

    if (!this.isInternalUpdate) {
      const previousfield = this.formSchema?.fields?.find(
        (field) => field.name === name
      );

      if (previousfield && previousfield?.field_options?.has_sections) {
        const selectedObj = previousfield?.choices?.find(
          ({ id }) => id === this.values[name]
        );

        selectedObj?.dependent_ids?.field?.forEach((fieldId) => {
          const fieldOption = previousfield?.fields.find(
            ({ id }) => id === fieldId
          );

          const isDependentField = fieldOption?.field_options?.dependent;

          if (isDependentField) {
            // If the field is dependent, we need to delete all the values of the dependent fields
            let next = fieldOption;

            while (next) {
              delete this.values[next.name];
              next = next.fields?.[0];
            }
          } else {
            delete this.values[fieldOption?.name];
          }
        });
      }
    }

    this.values = {
      ...this.values,
      [name]: componentValue,
    };

    this.fwFormValueChanged.emit({
      field: name,
      value: componentValue,
    });

    if (meta && meta.shouldValidate === false) {
      return;
    }

    /** Validate, if user wants to validateOnInput */
    if (this.validateOnInput) {
      this.touched = { ...this.touched, [name]: true };
      await this.handleValidation();
    }
  };

  handleBlur = async (event: Event) => {
    const details = (event as any).detail;
    if (!details || !details.name) return;
    const { name } = details;

    /** Validate, if user wants to validateOnBlur */
    if (this.validateOnBlur) {
      this.touched = { ...this.touched, [name]: true };
      if (this.prevValues?.[name] !== this.values?.[name]) {
        // validate only if the previous value is different from the current value
        await this.handleValidation();
      }
    }
  };

  setFocus = (field) => {
    const control = this.controls?.find((control) => control.name === field);
    control?.setFocus();
  };

  setFocusOnError = () => {
    const firstErrorField = Object.keys(this.errors || {})
      .sort((a, b) => {
        return this.fields?.[a]?.position - this.fields?.[b]?.position;
      })
      .find((field) => {
        return this.touched[field] === true;
      });

    if (firstErrorField) this.setFocus(firstErrorField);
  };

  private getFormControls() {
    const children = Array.from([
      ...this.el.shadowRoot.querySelectorAll('*'),
      ...this.el.querySelectorAll('*'),
    ]).filter((el: HTMLElement) =>
      ['fw-form-control'].includes(el.tagName.toLowerCase())
    );
    return children;
  }

  private passPropsToChildren(controls) {
    controls?.forEach((control: any) => {
      this.passPropsToChild(control);
    });
  }

  private passPropsToChild(control: any) {
    const error = this.errors[control.name];
    const touched = this.touched[control.name];
    control.controlProps = this.composedUtils();
    control.error = error ?? '';
    control.touched = touched || false;
    control.shouldRender = this.shouldRenderFormControl(control);
    control.value = getValueForField(this.values, control);
  }

  private composedUtils = (): FormUtils => {
    const inputProps = (field: string) => ({
      value: this.values[field],
    });

    const radioProps = (field: string) => ({
      value: this.values[field],
    });

    const checkboxProps = (field: string) => ({
      checked: !!this.values[field],
    });

    const selectProps = (field: string, inputType) => ({
      value:
        inputType === 'multi_select'
          ? this.values[field] ?? []
          : this.values[field] ?? '',
    });

    const fileProps = (field: string, multiple: boolean) => {
      let value: any = [];
      if (this.values[field]) {
        if (multiple) {
          value = this.values[field];
        } else {
          value = this.values[field][0] ? [this.values[field][0]] : [];
        }
      }
      return { value };
    };

    const formProps: FormProps = {
      action: 'javascript:void(0);',
      onSubmit: this.handleSubmit,
      onReset: this.handleReset,
    };

    return {
      inputProps,
      selectProps,
      checkboxProps,
      radioProps,
      fileProps,
      formProps,
    };
  };

  private shouldRenderFormControl = (control) => {
    const type = control?.type;
    const isValidType = type !== '' && type !== null && type !== undefined;
    const shouldRender = isValidType
      ? this.fieldSearchText
        ? control.label
            ?.toLowerCase()
            ?.includes(this.fieldSearchText.toLowerCase())
        : true
      : false;
    return shouldRender;
  };

  private getFormSchemaFromSlots = () => {
    const fields = this.controls.map((control) => ({
      type: control.type,
      name: control.name,
      required: control.required,
    }));

    return { fields };
  };

  /** Return if a field is disabled or not
   * if `editable` property is set to `false` in the field object of the form schema,
   * then the field is considered to be disabled.
   */
  private isDisabledField(field) {
    if (!field) return false;
    const isDisabled =
      Object.prototype.hasOwnProperty.call(field, 'editable') &&
      field.editable === false;
    return isDisabled;
  }

  /**
   * Method to set value on the form field.
   *
   * param: field - name of the form field
   * param: value - value of the form field
   * param: shouldValidate - should this form field be validated with the updated value. Default to true.
   */
  @Method()
  async setFieldValue(
    field: string,
    value: any,
    shouldValidate = true
  ): Promise<void> {
    // Don't set value if the field is disabled
    const isDisabledField = this.isDisabledField(this.fields?.[field]);
    if (isDisabledField) return;

    this.values = { ...this.values, [field]: value };

    if (shouldValidate) {
      this.touched = { ...this.touched, [field]: true };
      await this.handleValidation();
    }
  }

  /**
   * Method to set values on the form fields.
   *
   * param: valuesObj - Object with key as form field name and value as the updated value for the field
   * example: `{ first_name: "new name", last_name: "new last name" }`
   * param: shouldValidate - should this form be validated with the updated values. Default to true.
   */
  @Method()
  async setFieldsValue(
    valuesObj: FormValues,
    shouldValidate = true,
    isManualUpdate = false
  ): Promise<void> {
    if (!valuesObj) return;

    if (isManualUpdate) {
      this.isInternalUpdate = true;
    }
    let newValues = { ...this.values };
    let newTouchedFields = { ...this.touched };

    Object.keys(valuesObj).forEach((field) => {
      // Don't set value if the field is disabled
      const isDisabledField = this.isDisabledField(this.fields?.[field]);
      if (!isDisabledField) {
        newValues = { ...newValues, [field]: valuesObj[field] };
        if (shouldValidate) {
          newTouchedFields = { ...newTouchedFields, [field]: true };
        }
      }
    });

    this.values = { ...newValues };
    this.touched = { ...newTouchedFields };

    if (shouldValidate) {
      await this.handleValidation();
    }

    if (isManualUpdate) {
      // Adding a delay to ensure that handleInput is called before resetting the isInternalUpdate flag.
      this.internalUpdateResetTimer = setTimeout(() => {
        this.isInternalUpdate = false;
      }, 1000);
    }
  }

  /**
   * Method to set errors on the form fields.
   *
   * If you use `setErrors`, your errors will be wiped out by next `validate` or `validationSchema` call which can be triggered by the user typing (a change event) or blurring an input (a blur event).
   * Note: this assumed you have not manually set `validateOnInput` and `validateOnBlur` props to `false` (they are `true` by default).
   *
   * param: errorObj - key value pair of [fieldName]: ErrorMessage
   * example: `{ first_name: 'firstname is required' }`
   */
  @Method()
  async setFieldErrors(errorObj: FormErrors<FormValues>): Promise<void> {
    Object.entries(errorObj)?.forEach(([field, value]) => {
      this.errors = { ...this.errors, [field]: value as string };
      this.touched = { ...this.touched, [field]: true };
    });
    this.setFocusOnError();
  }

  /**
   * setFieldChoices Method to set field choices for a DROPDOWN/MULTI_SELECT/RADIO fields in formschema.
   * choices must be in the form of array with the below format:
   * [{
      id: 1,
      value: 'open',
      position: 1,
      dependent_ids: {},
    }].
   * fieldOptions is an optional parameter, must be an object with keys being option_label_path and option_value_path.
   * option_label_path refers to the key used for displaying the text.
   * option_value_path refers to the key which corresponds to the value of item.
   */
  @Method()
  async setFieldChoices(
    field: string,
    choices: Array<any>,
    fieldOptions?: any
  ): Promise<void> {
    this.formSchemaState = {
      ...this.formSchemaState,
      fields:
        this.formSchemaState?.fields?.map((f) => {
          if (f.name === field) {
            return {
              ...f,
              choices,
              field_options: fieldOptions ?? f.field_options,
            };
          }
          return f;
        }) ?? [],
    };

    this.touched = { ...this.touched, [field]: false };
    this.values = { ...this.values, [field]: undefined };
  }

  /**
   * Method to set hidden fields on the form dynamically.
   *
   * Note: You must always pass all the fields that you want to hide. Also, note that the validation for hidden fields will be skipped.
   *
   * param: hiddenFields - key value pair of [fieldName]: true | false
   * example: `setHiddenFields({ first_name: true, last_name: false })`
   */
  @Method()
  async setHiddenFields(hiddenFields: any = {}): Promise<void> {
    return this._handleFieldModifier('hidden', hiddenFields);
  }

  /**
   * Method to set disabled fields on the form dynamically.
   *
   * Note: You must always pass all the fields that you want to disable
   *
   * param: disabledFields - key value pair of [fieldName]: true | false
   * example: `setDisabledFields({ first_name: true, last_name: false })`
   */
  @Method()
  async setDisabledFields(disabledFields: any = {}): Promise<void> {
    return this._handleFieldModifier('editable', disabledFields);
  }

  private _handleFieldModifier(
    key: 'editable' | 'hidden',
    fieldsObj: any = {}
  ) {
    let errorsObj = { ...this.errors };
    let touchedObj = { ...this.touched };
    this.formSchemaState = {
      ...this.formSchemaState,
      fields:
        this.formSchemaState?.fields?.map((f: any) => {
          if (Object.prototype.hasOwnProperty.call(fieldsObj, f.name)) {
            // Whenever a hidden/disabled state of a field changes,
            // we will reset the error state and touched state of the field.
            errorsObj = { ...errorsObj, [f.name]: undefined };
            touchedObj = { ...this.touched, [f.name]: false };
            return {
              ...f,
              // inverting the value if key is editable
              [key]:
                key === 'editable'
                  ? !fieldsObj[f.name]
                  : Boolean(fieldsObj[f.name]),
            };
          }
          return f;
        }) ?? [],
    };

    this.errors = { ...errorsObj };
    this.touched = { ...touchedObj };
    // Skip disabled/hidden field from validation schema
    this.formValidationSchema =
      generateDynamicValidationSchema(
        this.formSchemaState,
        this.validationSchema
      ) || {};
  }

  /**
   * getValues
   * @returns An Object containing values and serializedValues.
   * serializedValues are those that contains the transformed values based on field type.
   * 1. For Number and Decimal: returns floating point number of value or undefined.
   * 2. For Date: returns value as ${year}-${month}-${date} or undefined.
   * 3. For Relationship : returns an array of values or value.
   */
  @Method()
  async getValues() {
    let serializedValues: FormValues = { ...this.values };

    if (this.formSchemaState && Object.keys(this.formSchemaState).length > 0) {
      serializedValues = serializeForm(serializedValues, this.fields);
    }

    return { values: this.values, serializedValues };
  }

  /**
   *
   * @param event : An event which takes place in the DOM
   *
   * Method to submit the form
   */
  @Method()
  async doSubmit(event?): Promise<FormSubmit> {
    return this.handleSubmit(event);
  }

  /**
   *
   * @param event - An event which takes place in the DOM
   *
   * Method to reset the form
   */
  @Method()
  async doReset(event?): Promise<void> {
    this.handleReset(event);
  }

  /**
   *
   * Method to filter the display of fields in the form based
   * on the passed text.
   *
   * @param text
   *
   */
  @Method()
  async setFieldSearchText(text: string) {
    this.fieldSearchText = text;
  }

  /**
   * Method to set required status on form fields
   *
   * param: requiredStatusObj - Object with key as form field name and value denoting if the field should be marked
   * as required or not
   * example: `{ first_name: true, last_name: false }`
   */
  @Method()
  async setFieldsRequiredStatus(
    requiredStatusObj: FormRequired<FormValues>
  ): Promise<void> {
    let errorsObj = { ...this.errors };
    this.formSchemaState = {
      ...this.formSchemaState,
      fields:
        this.formSchemaState?.fields?.map((f) => {
          if (Object.prototype.hasOwnProperty.call(requiredStatusObj, f.name)) {
            const isRequired = !!requiredStatusObj?.[f.name];
            if (!isRequired) errorsObj = { ...errorsObj, [f.name]: undefined };
            return {
              ...f,
              required: isRequired,
            };
          }
          return f;
        }) ?? [],
    };

    this.errors = { ...errorsObj };

    this.formValidationSchema =
      generateDynamicValidationSchema(
        this.formSchemaState,
        this.validationSchema
      ) || {};
  }

  renderSectionFields(field) {
    const utils: FormUtils = this.composedUtils();
    // Early return if no value for the field or no dependent choices
    const selectedChoiceHash = this.values[field.name];
    if (!selectedChoiceHash) return null;

    // Find the selected field and get dependent field IDs
    const dependendFieldIds = field.choices?.find(
      ({ id }) => id === selectedChoiceHash
    )?.dependent_ids?.field;
    if (!dependendFieldIds?.length) return null;

    // Map dependent field IDs to form controls
    return (
      <div class='nest_indent'>
        {dependendFieldIds.map((dependendFieldId) => {
          const fieldObj = field.fields?.find(
            ({ id }) => id === dependendFieldId
          );
          if (!fieldObj) return null;

          return (
            <fw-form-control
              key={fieldObj.name}
              name={fieldObj.name}
              type={fieldObj.type}
              label={fieldObj.label}
              required={fieldObj.required}
              hint={fieldObj.hint}
              placeholder={fieldObj.placeholder}
              hidden={fieldObj.hidden}
              error={this.errors[fieldObj.name]}
              touched={this.touched[fieldObj.name]}
              disabled={this.isDisabledField(fieldObj)}
              choices={fieldObj.choices}
              fieldProps={fieldObj}
              controlProps={utils}
            />
          );
        })}
      </div>
    );
  }

  render() {
    const utils: FormUtils = this.composedUtils();

    return (
      <form id={`form-${this.formId}`} {...utils.formProps}>
        {this.formSchemaState &&
        Object.keys(this.formSchemaState).length > 0 ? (
          this.formSchemaState?.fields
            ?.sort((a, b) => a.position - b.position)
            .map((field) => {
              return (
                this.shouldRenderFormControl(field) && (
                  <Fragment>
                    <fw-form-control
                      key={field.name}
                      name={field.name}
                      type={field.type}
                      label={field.label}
                      required={field.required}
                      hint={field.hint}
                      placeholder={field.placeholder}
                      hidden={field.hidden}
                      error={this.errors[field.name]}
                      touched={this.touched[field.name]}
                      disabled={this.isDisabledField(field)}
                      choices={field.choices}
                      fieldProps={field}
                      controlProps={utils}
                    ></fw-form-control>
                    {this.renderSectionFields(field)}
                  </Fragment>
                )
              );
            })
        ) : (
          <slot onSlotchange={() => this.handleSlotChange()}></slot>
        )}
      </form>
    );
  }
}
