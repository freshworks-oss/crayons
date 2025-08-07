/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-extra-boolean-cast*/
import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import presetSchema from '../assets/form-builder-preset.json';
import formMapper from '../assets/form-mapper.json';
import { TranslationController } from '../../../global/Translation';
import {
  buildChoicesFromText,
  checkIfCustomToggleField,
  deepCloneObject,
  deleteChoicesInFields,
  deriveInternalNameFromLabel,
  getChildChoices,
  getDependentLevels,
  getFieldBasedOnLevel,
  getMaxLimitProperty,
  getMaximumLimitsConfig,
  getModifiedEl,
  getNestedKeyValueFromObject,
  hasCustomProperty,
  hasPermission,
  hasStringDuplicates,
  i18nText,
  removeFirstOccurrence,
  removeIsNewFromField,
  updateChoicesInFields,
  updateFieldAttributes,
  updateLevelSelection,
  updateRequiredOnAllFields,
  validateLevels,
} from '../utils/form-builder-utils';

import { parseBoolean } from '../../../utils/utils';

@Component({
  tag: 'fw-field-editor',
  styleUrl: 'field-editor.scss',
  shadow: true,
})
export class FieldEditor {
  @Element() host!: HTMLElement;

  private KEY_INTERNAL_NAME = 'internalName';
  private modalConfirmDelete!: any;
  private divFieldBase: HTMLElement;
  private dictInteractiveElements;
  private isInternalNameEdited = false;
  private internalNamePrefix = '';
  private isNewField = false;
  private isSectionField = false;
  private editSectionField = false;
  private oldFormValues;
  private errorType;
  private isDependentField = false;
  private regexAlphaNumChars = /^[A-Z0-9_]*$/i;
  private textboxDependentValue = presetSchema.textboxDependentValue;
  private DEP_LABEL_KEY = 'name_level_';
  private DEP_NAME_KEY = `${this.KEY_INTERNAL_NAME}_level_`;

  /**
   * The db type used to determine the json to be used for CUSTOM_OBJECTS or CONVERSATION_PROPERTIES
   */
  @Prop() productName = 'CUSTOM_OBJECTS';
  /**
   * Pinned position of the drag item, other drag item cannot be placed above or below it.
   */
  @Prop() pinned: 'top' | 'bottom' | '';
  /**
   * flag to notify if an api call is in progress
   */
  @Prop({ mutable: true }) isLoading = false;
  /**
   * Disables the component on the interface. If the attribute’s value is undefined, the value is set to false.
   */
  @Prop({ mutable: true, reflect: true }) disabled = false;
  /**
   * Property to determine expanded state or collapsed
   */
  @Prop({ mutable: true }) expanded = false;
  /**
   * data source used to set and edit the field values
   */
  @Prop({ mutable: true }) dataProvider = null;
  /**
   * variable to store form values
   */
  @Prop({ mutable: true }) formValues = null;
  /**
   * flag to show relationshipTypeSelect dropdown or not
   */
  @Prop({ mutable: true }) showRelationshipTypeSelect = true;
  /**
   * object to store the lookup target entities
   */
  @Prop({ mutable: true }) lookupTargetObjects = false;
  /**
   * flag to show dependentField resolve checkbox
   */
  @Prop({ mutable: true }) showDependentFieldResolveProp = false;
  /**
   * link to show dependent field document
   */
  @Prop() dependentFieldLink = '';
  /**
   * Disable the repositioning option
   */
  @Prop() disabledSort = false;
  /**
   * defines the name of the entity to be used in Lookup field
   */
  @Prop() entityName = '';
  /**
   * defines the parent index of the field
   */
  @Prop() parentIndex;
  /**
   * stores the section name for this field
   */
  @Prop() sectionName;
  /**
   * stores the default field type schema for this editor type
   */
  @Prop() defaultFieldTypeSchema;
  /**
   * defines if the field is primary
   */
  @Prop() isPrimaryField = false;
  /**
   * Flag to enable / disable the the filterable option
   */
  @Prop() enableFilterable = true;
  /**
   * Flag to enable / disable the the unique option
   */
  @Prop() enableUnique = true;
  /**
   * index attached inside the parent group component
   */
  @Prop() index = -1;
  /**
   * Name of the component, saved as part of the form data.
   */
  @Prop() name = '';
  /**
   * Disable features for the users with free trial plan
   */
  @Prop() role: 'trial' | 'admin' = 'admin';
  /**
   * Permission object to restrict features based on permissions
   * "view" needs to be set to true for the rest of the permissions to be applicable
   * By default, all the permissions are set to true to give access to all the features
   * Example permission object : { view: true, create: true, edit: true, delete: true }
   */
  @Prop() permission: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  } = { view: true, create: true, edit: true, delete: true };
  /*
   * Beta flag to enable Dynamic sections
   */
  @Prop() dynamicSectionsBetaEnabled = false;
  /*
   * Function to set section expand state
   */
  @Prop() setSectionsExpandState;
  /*
   * Function to expand create section pane
   */
  @Prop() setSectionCreationExpandState;
  /*
   * Sections expand state
   */
  @Prop() sectionsExpanded = false;
  /*
   * Flag to Show sections
   */
  @Prop() showSections = false;
  /*
   * Flag to hide add section button and show tooltip
   */
  @Prop() sectionCreatedForAllChoices = false;
  /**
   * Flag to detect default fields
   */
  @Prop() isDefaultNonCustomField = false;
  /*
   * Create dynamic section
   */
  @Prop() createDynamicSection = false;
  /**
   * State to check if the values have been changed and enable the save button
   */
  @State() isValuesChanged = false;
  /**
   * State to serialize the field builder options
   */
  @State() fieldBuilderOptions = null;
  /**
   * State to show the error messages
   */
  @State() showErrors = false;
  /**
   * State to show duplicate error for dependent labels
   */
  @State() duplicateError = false;
  /**
   * State to show the errors for dependent levels
   */
  @State() dependentErrors = {};
  /**
   * State to show the warning for dependent levels
   */
  @State() dependentWarning = {};
  /**
   * State to show form error text for the field validations
   */
  @State() formErrorMessage = '';
  /**
   * State to show label input error message
   */
  @State() labelErrorMessage = '';
  /**
   * State to show label input warning message
   */
  @State() labelWarningMessage = '';
  /**
   * State to show internal name input error message
   */
  @State() internalNameErrorMessage = '';
  /**
   * State to show internal name input warning message
   */
  @State() internalNameWarningMessage = '';
  /**
   * flag to show spinner on delete button
   */
  @State() isDeleting = false;
  /**
   * To store dependentLevels selected state on click
   */
  @State() dependentLevels = {};
  /**
   * Flag to toggle dependent field initial textbox
   */
  @State() showDependentFieldTextbox = false;
  /**
   * Triggered when the field is expanded or collapsed
   */
  @Event() fwExpand!: EventEmitter;
  /**
   * Triggered when the field details need to be saved on the server
   */
  @Event() fwUpdate!: EventEmitter;
  /**
   * Triggered when the field has to be deleted on the server
   */
  @Event() fwDelete!: EventEmitter;
  /**
   * Triggered when the field is reordered for drag start and drag stop
   */
  @Event() fwReorder!: EventEmitter;

  @Watch('enableUnique')
  watchEnableUniqueChangeHandler(): void {
    this.setCheckboxesAvailability(this.fieldBuilderOptions);
  }

  @Watch('enableFilterable')
  watchEnableFilterableChangeHandler(): void {
    this.setCheckboxesAvailability(this.fieldBuilderOptions);
  }

  @Watch('dataProvider')
  watchDataproviderChangeHandler(): void {
    this.isDeleting = false;
    this.isValuesChanged = false;
    this.isInternalNameEdited = false;
    this.oldFormValues = this.dataProvider
      ? deepCloneObject(this.dataProvider)
      : null;

    if (this.dataProvider) {
      const objDP = this.dataProvider;
      this.isNewField =
        hasCustomProperty(objDP, 'isNew') && objDP['isNew'] === true
          ? true
          : false;
      this.isSectionField =
        hasCustomProperty(objDP, 'isSection') && objDP?.isSection === true
          ? true
          : false;
      this.editSectionField = parseBoolean(
        objDP.field_options?.is_section_field
      );
      // Currently supports dropdown format
      this.isDependentField = objDP.type === 'DEPENDENT_FIELD';

      if (this.isNewField) {
        this.isInternalNameEdited = false;
        this.showDependentFieldTextbox = this.isDependentField;
        this.setCheckboxesAvailability(deepCloneObject(this.dataProvider));
      } else {
        this.isInternalNameEdited = true;
        let objDefaultFieldTypeSchema = deepCloneObject(
          this.defaultFieldTypeSchema
        );

        this.showDependentFieldTextbox = false;

        objDefaultFieldTypeSchema.choices =
          hasCustomProperty(this.dataProvider, 'choices') &&
          this.dataProvider.choices.length > 0
            ? deepCloneObject(this.dataProvider.choices)
            : [];

        objDefaultFieldTypeSchema.label = this.dataProvider.label || '';
        objDefaultFieldTypeSchema.name =
          removeFirstOccurrence(
            this.dataProvider.name,
            this.internalNamePrefix
          ) || '';

        if (this.isDependentField) {
          objDefaultFieldTypeSchema = {
            ...objDefaultFieldTypeSchema,
            fields: deepCloneObject(this.dataProvider.fields),
          };
        }

        this.setCheckboxesAvailability(objDefaultFieldTypeSchema);
      }
    } else {
      this.isNewField = false;
      this.fieldBuilderOptions = null;
    }
  }

  componentWillLoad(): void {
    const objProductPreset = formMapper[this.productName];
    const objProductConfig = objProductPreset.config;
    this.internalNamePrefix = objProductConfig.internalNamePrefix;

    this.watchDataproviderChangeHandler();
    this.dictInteractiveElements = {};
  }

  private getInterpolatedMaxLimitLabel = (strProperty) => {
    if (strProperty && strProperty !== '') {
      try {
        const objMaxLimitField = getMaxLimitProperty(
          this.productName,
          strProperty
        );
        if (objMaxLimitField) {
          return i18nText(objMaxLimitField.message, {
            count: objMaxLimitField.count,
          });
        }
      } catch (error) {
        return '';
      }
    }
    return '';
  };

  /**
   * validate limitations and enable/disable the checkbox controls
   */
  private setCheckboxesAvailability = (objFieldData) => {
    if (presetSchema && objFieldData && this.defaultFieldTypeSchema) {
      const boolNewField = this.isNewField;
      const objPayload = this.isDependentField
        ? this.dataProvider.fields[0]
        : this.dataProvider;
      const objCheckboxValidation =
        presetSchema.fieldEditorValidations.checkboxDetails;

      let boolRequiredSelected = false;
      let boolUniqueSelected = false;

      const objKeyMappers = objCheckboxValidation.keyMapper;
      const objEnableKeyChecker = this.isPrimaryField
        ? objCheckboxValidation.existingPrimaryFieldEnabledCheckboxes
        : objCheckboxValidation.existingFieldEnabledCheckboxes;

      const objFieldTypeSchema = deepCloneObject(this.defaultFieldTypeSchema);
      const arrCheckBoxes = boolNewField
        ? objFieldData.checkboxes
        : objFieldTypeSchema.checkboxes;
      const intCheckboxesLength = arrCheckBoxes?.length;
      let intFilterableIndex = -1;

      for (let i1 = 0; i1 < intCheckboxesLength; i1++) {
        const objCheckItem = arrCheckBoxes[i1];
        const strCheckKey = objCheckItem.key;

        let boolKeySelected = false;
        if (boolNewField) {
          boolKeySelected = objCheckItem.selected;
        } else {
          // get payload key references from presets and retreive the values from the payload
          const strMappedPayloadKey = objKeyMappers[strCheckKey];
          if (hasCustomProperty(objPayload, strMappedPayloadKey)) {
            const keyFormValue = objPayload[strMappedPayloadKey];
            boolKeySelected =
              keyFormValue === 'true' || keyFormValue === true ? true : false;
          } else {
            const nestedValue = getNestedKeyValueFromObject(
              objPayload,
              strMappedPayloadKey
            );
            if (nestedValue) {
              boolKeySelected =
                nestedValue === 'true' || nestedValue === true ? true : false;
            }
          }
          objCheckItem.selected = boolKeySelected;
          objCheckItem.enabled = objEnableKeyChecker?.[strCheckKey];
        }

        if (strCheckKey === 'unique') {
          boolUniqueSelected = boolKeySelected;
        } else if (strCheckKey === 'required') {
          boolRequiredSelected = boolKeySelected;
        }

        if (objCheckItem.enabled) {
          // Check for the maximum limits
          if (strCheckKey === 'filterable' && !this.enableFilterable) {
            objCheckItem.enabled = false;
            objCheckItem.disabledMessage =
              this.getInterpolatedMaxLimitLabel('filterable');
          } else if (strCheckKey === 'unique' && !this.enableUnique) {
            objCheckItem.enabled = false;
            objCheckItem.disabledMessage =
              this.getInterpolatedMaxLimitLabel('unique');
          }
        } else if (strCheckKey === 'filterable') {
          intFilterableIndex = i1;
        }
      }

      // condition to disable the filterable field if unique is checked
      if (
        intFilterableIndex > -1 &&
        boolUniqueSelected &&
        arrCheckBoxes[intFilterableIndex].enabled
      ) {
        arrCheckBoxes[intFilterableIndex].enabled = false;
        arrCheckBoxes[intFilterableIndex].selected = true;
        arrCheckBoxes[intFilterableIndex].disabledMessage = '';
      }

      this.fieldBuilderOptions = {
        ...objFieldData,
        checkboxes: deepCloneObject(arrCheckBoxes),
        unique: boolUniqueSelected,
        required: boolRequiredSelected,
      };
    }
  };

  /**
   * function called on reorder button mousedown to enable the parent as draggable
   */
  private startParentDragging = () => {
    if (this.expanded) {
      return;
    }
    this.enableParentDrag(true);
  };

  /**
   * function to disable the parent as draggable
   */
  private stopParentDragging = () => {
    this.enableParentDrag(false);
  };

  /**
   * function to enable/disable the draggable property for the base div
   */
  private enableParentDrag = (value: boolean) => {
    if (this.divFieldBase) {
      this.fwReorder.emit({ value: value });
      if (value) {
        this.divFieldBase.setAttribute('draggable', 'true');
      } else {
        this.divFieldBase.removeAttribute('draggable');
      }
    }
  };

  /**
   * function to validate the label input error values
   */
  private validateLabelErrors = (strInputValue) => {
    if (!strInputValue) {
      this.labelErrorMessage = i18nText('errors.emptyFieldName');
      return false;
    } else {
      try {
        const strNewFieldLabel = strInputValue.toLowerCase();
        const initialFields = this.formValues.fields;
        const collectedFields = initialFields.reduce(
          (acc, field) => {
            acc.topLevelFields.push(field); // Add each field to the main array
            // Collect section fields separately if has_sections is true
            if (
              field?.field_options?.has_sections &&
              Array.isArray(field.fields)
            ) {
              acc.sectionFields.push(...field.fields);
            }
            return acc;
          },
          { topLevelFields: [], sectionFields: [] }
        );

        // Merge all fields at the end
        const convFields = [
          ...collectedFields.topLevelFields,
          ...collectedFields.sectionFields,
        ];

        if (
          convFields &&
          convFields.length > 0 &&
          convFields.some(
            (e) =>
              this.dataProvider.id !== e.id &&
              !e?.isNew &&
              e.label.toLowerCase() === strNewFieldLabel
          )
        ) {
          this.labelErrorMessage = i18nText('errors.fieldNameExists');
          return false;
        }
      } catch (error) {
        console.error(`Error occured in validateLabelErrors: ${error}`);
      }
    }
    this.labelErrorMessage = '';
    return true;
  };

  /** validate same label or internal name error */
  private validateDuplicateErrors = (prefix) => {
    const attributesToValidate = {};

    Object.keys(this.dictInteractiveElements)
      .filter((ele) => ele.includes(prefix))
      .forEach((ele) => {
        attributesToValidate[ele] = this.dictInteractiveElements[ele].value;
      });

    this.dependentErrors = hasStringDuplicates(attributesToValidate, i18nText);

    return !!Object.keys(this.dependentErrors).length;
  };

  /**
   * function to validate the internal name input error values
   */
  private validateInternalNameErrors = (strInputValue) => {
    if (!strInputValue) {
      this.internalNameErrorMessage = i18nText('errors.emptyFieldName');
      return false;
    } else {
      try {
        const strNewFieldName =
          this.internalNamePrefix + strInputValue.toLowerCase();
        const arrFields = this.formValues.fields;

        if (
          arrFields &&
          arrFields.length > 0 &&
          arrFields.some(
            (e, fieldIndex) =>
              this.index !== fieldIndex &&
              !e?.isNew &&
              e.name.toLowerCase() === strNewFieldName
          )
        ) {
          this.internalNameErrorMessage = i18nText('errors.fieldNameExists');
          return false;
        } else {
          if (!this.regexAlphaNumChars.test(strInputValue)) {
            this.internalNameErrorMessage = i18nText(
              'errors.useOnlyEnglishChars'
            );
            return false;
          }
        }
      } catch (error) {
        console.error(`Error occured in validateInternalNameErrors: ${error}`);
      }
    }
    this.internalNameErrorMessage = '';
    return true;
  };

  private validateString(strInput, isInternalName = false) {
    if (!strInput) {
      return i18nText('errors.emptyFieldName');
    }

    if (isInternalName && !this.regexAlphaNumChars.test(strInput)) {
      return i18nText('errors.useOnlyEnglishChars');
    }

    return '';
  }

  /**
   * function to check the dropdown error values
   */
  private validateDropdownErrors = (
    arrDropdownValues,
    emptyCheck = false,
    level = 0
  ) => {
    if (level > 2 && this.isDependentField) {
      const levelToDelete = validateLevels(
        this.dictInteractiveElements,
        this.fieldBuilderOptions,
        {
          CHOICES: 'choices_level_',
          NAME: this.DEP_NAME_KEY,
          LABEL: this.DEP_LABEL_KEY,
        }
      );

      if (levelToDelete !== 0) {
        return true;
      }
    }

    if (!arrDropdownValues || arrDropdownValues.length < 1) {
      this.formErrorMessage = i18nText('errors.minimum');
      return false;
    }
    if (emptyCheck) {
      // Find the indices of empty strings in the array
      const hasEmptyValue =
        arrDropdownValues
          .map((item, index) =>
            item.value === '' || item.error === i18nText('errors.duplicate')
              ? index
              : null
          )
          .filter((index) => index !== null).length > 0;

      if (hasEmptyValue) {
        return false;
      }
    }
    if (this.errorType && this.errorType !== '') {
      if (this.errorType === i18nText('errors.deleteDropDownChoice')) {
        this.formErrorMessage = this.errorType;
        return true;
      }
      if (
        this.isDependentField &&
        this.errorType === i18nText('errors.minimum')
      ) {
        this.formErrorMessage = this.errorType;
        return false;
      }
      this.formErrorMessage = '';
      return false;
    }
    this.formErrorMessage = '';
    return true;
  };

  /**
   * function to check the dropdown error values
   */
  private validateLookupErrors = (objLookupValues) => {
    if (
      objLookupValues &&
      hasCustomProperty(objLookupValues, 'relationship') &&
      hasCustomProperty(objLookupValues, 'target') &&
      objLookupValues.relationship !== '' &&
      objLookupValues.target > 0
    ) {
      return true;
    }
    this.formErrorMessage = '';
    return false;
  };

  private addFieldHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    let boolValidForm = true;
    let level = null;
    let objValues = {
      type: this.dataProvider.type,
      newSectionData: this.dataProvider,
      isPrimaryField: this.isPrimaryField,
      sectionDetails: {
        parentIndex: this.parentIndex,
        sectionName: this.sectionName,
      },
    };

    if (this.isDependentField) {
      // Validate name
      if (this.validateDuplicateErrors(this.DEP_LABEL_KEY)) {
        this.duplicateError = true;
        this.showErrors = true;
        return;
      }

      // Validate levels and update dictInteractive
      const elements = getModifiedEl(
        this.dictInteractiveElements,
        deepCloneObject(this.fieldBuilderOptions),
        {
          CHOICES: 'choices_level_',
          NAME: this.DEP_NAME_KEY,
          LABEL: this.DEP_LABEL_KEY,
        }
      );

      objValues['fields'] = elements.fieldEl;
      this.dictInteractiveElements = elements.dictEl;
    }

    // this.showErrors = false;
    for (const key in this.dictInteractiveElements) {
      const elInteractive = this.dictInteractiveElements[key];
      const strTagName = elInteractive.tagName.toLowerCase();

      switch (strTagName) {
        case 'fw-input':
          // eslint-disable-next-line no-case-declarations
          const strInputValue = elInteractive.value;
          if (key === 'name') {
            boolValidForm = this.validateLabelErrors(strInputValue);
            if (boolValidForm) {
              this.showErrors = false;
              this.labelErrorMessage = '';
              objValues[key] = strInputValue || '';
            } else {
              this.showErrors = true;
              return;
            }
          } else if (key === this.KEY_INTERNAL_NAME) {
            if (this.isNewField) {
              boolValidForm = this.validateInternalNameErrors(strInputValue);
              if (boolValidForm) {
                this.showErrors = false;
                this.internalNameErrorMessage = '';
                objValues[key] =
                  `${this.internalNamePrefix}${strInputValue}` || '';
              } else {
                this.showErrors = true;
                return;
              }
            }
          } else if (key.includes(this.DEP_LABEL_KEY)) {
            level = removeFirstOccurrence(key, this.DEP_LABEL_KEY);
            boolValidForm = this.validateString(strInputValue);
            if (!boolValidForm) {
              this.showErrors = false;
              delete this.dependentErrors[key];
              objValues = updateFieldAttributes(objValues, level, {
                name: strInputValue,
              });
            } else {
              this.dependentErrors[key] = boolValidForm;
              this.showErrors = true;
              return;
            }
          } else if (key.includes(this.DEP_NAME_KEY)) {
            level = removeFirstOccurrence(key, this.DEP_NAME_KEY);
            boolValidForm = this.validateString(strInputValue, true);
            if (!boolValidForm) {
              this.showErrors = false;
              delete this.dependentErrors[key];
              objValues = updateFieldAttributes(objValues, level, {
                internalName:
                  `${this.internalNamePrefix}${strInputValue}` || '',
              });
            } else {
              this.dependentErrors[key] = boolValidForm;
              this.showErrors = true;
              return;
            }
          }
          break;
        case 'fw-checkbox':
          if (this.isDependentField) {
            objValues = updateRequiredOnAllFields(
              objValues,
              elInteractive?.checked || false
            );
          } else {
            objValues[key] = elInteractive.checked || false;
          }
          break;
        case 'fw-fb-field-dropdown': {
          if (this.isDependentField) {
            level = removeFirstOccurrence(key, 'choices_level_');
            const arrDropdownValues =
              deepCloneObject(elInteractive.dataProvider) || [];
            boolValidForm = this.validateDropdownErrors(
              arrDropdownValues,
              true,
              level
            );

            if (boolValidForm) {
              this.showErrors = false;
              objValues = updateFieldAttributes(objValues, level, {
                choices: arrDropdownValues,
                type: 2,
              });
            } else {
              elInteractive.validateErrors();
              this.showErrors = true;
              return;
            }
          } else {
            const arrDropdownValues =
              deepCloneObject(elInteractive.dataProvider) || [];
            boolValidForm = this.validateDropdownErrors(arrDropdownValues);
            if (boolValidForm) {
              this.showErrors = false;
              objValues[key] = arrDropdownValues || [];
            } else {
              elInteractive.validateErrors();
              this.showErrors = true;
              return;
            }
          }
          break;
        }
        case 'fw-fb-field-lookup': {
          const objLookupValues =
            deepCloneObject(elInteractive.dataResponse) || null;
          boolValidForm = this.validateLookupErrors(objLookupValues);
          if (boolValidForm) {
            this.showErrors = false;
            objValues[key] = objLookupValues;
          } else {
            this.showErrors = true;
            return;
          }
          break;
        }
        default:
          break;
      }
    }

    // Used to track multiple labels and names
    if (Object.keys(this.dependentErrors).length !== 0) {
      return;
    }

    if (this.isDependentField) {
      objValues = removeIsNewFromField(objValues);
    }

    if (checkIfCustomToggleField(this.productName, this.dataProvider.name)) {
      objValues['choices'] = [...this.dataProvider.choices];
    }

    if (boolValidForm) {
      if (!this.isNewField) {
        objValues[this.KEY_INTERNAL_NAME] = this.dataProvider.name;
      }

      this.internalNameWarningMessage = '';
      this.internalNameErrorMessage = '';
      this.labelWarningMessage = '';
      this.labelErrorMessage = '';
      this.formErrorMessage = '';
      this.showErrors = false;

      this.fwUpdate.emit({
        index: this.index,
        isNew: this.isNewField,
        value: { ...objValues },
      });
    }
  };

  private cancelFieldHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();

    if (this.expanded) {
      this.dictInteractiveElements = {};
      this.expanded = false;
      this.internalNameErrorMessage = '';
      this.labelWarningMessage = '';
      this.labelErrorMessage = '';
      this.formErrorMessage = '';
      this.showErrors = false;

      if (this.isValuesChanged) {
        this.dataProvider = this.oldFormValues
          ? deepCloneObject(this.oldFormValues)
          : null;
      }

      this.fwExpand.emit({
        expanded: false,
        index: this.index,
        isNew: this.isNewField,
        value: this.dataProvider,
      });
    }
  };

  private expandHandler = (event: MouseEvent) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (event.detail && event.detail > 1) {
      return;
    }

    if (!this.expanded) {
      this.dictInteractiveElements = {};
      this.setSectionsExpandState(false);
      this.setSectionCreationExpandState(false);
      this.expanded = true;

      this.fwExpand.emit({
        expanded: true,
        index: this.index,
        isNew: this.isNewField,
        value: { ...this.dataProvider },
      });
    }
  };

  private deleteFieldClickHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    const boolDeleteAllowed = hasPermission(
      this.role,
      this.permission,
      'DELETE'
    );
    if (boolDeleteAllowed) {
      this.modalConfirmDelete?.open();
    }
  };

  private confirmDeleteFieldHandler = () => {
    this.isDeleting = true;
    this.fwDelete.emit({
      index: this.index,
      position: this.oldFormValues?.position,
    });
    this.modalConfirmDelete?.close();
  };

  private dropdownChangeHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.isValuesChanged = true;

    const strType = event.detail.type;
    switch (strType) {
      case 'DELETE':
        this.errorType = event.detail.errorType;
        this.validateDropdownErrors(
          event.detail.value,
          false,
          event.detail.level
        );
        if (this.isDependentField) {
          this.fieldBuilderOptions = deleteChoicesInFields(this, event);
          delete this.dependentLevels[`level_${event.detail.level}`];
        }
        break;
      case 'VALUE_CHANGE':
        this.errorType = event.detail.errorType;
        this.validateDropdownErrors(
          event.detail.value,
          false,
          event.detail.level
        );
        if (this.isDependentField) {
          this.fieldBuilderOptions = updateChoicesInFields(this, event);
        }
        break;
      case 'ADD':
      case 'REPOSITION':
        this.errorType = event.detail.errorType;
        if (this.isDependentField) {
          this.fieldBuilderOptions = updateChoicesInFields(this, event);
        }
        break;
      case 'SELECT':
        this.dependentLevels = updateLevelSelection(this, event);
        break;
      case 'VALIDATE_DROPDOWN':
        this.validateDropdownErrors(
          event.detail.value,
          false,
          event.detail.level
        );
        break;
      default:
        break;
    }
  };

  private statusToggleHandler = (event: CustomEvent) => {
    this.isValuesChanged = true;
    const objPayload = this.dataProvider;
    const id = (event.target as HTMLInputElement).id;
    const choice = objPayload.choices.find((item) => item.id === id);
    const name = (event.target as HTMLInputElement).name;
    if (name === 'resolution_timer') {
      choice.choice_options.resolution_timer = event.detail.checked;
    } else if (name === 'pause_resolution_sla_timer') {
      choice.choice_options.pause_resolution_sla_timer = event.detail.checked;
    }
  };

  private lookupChangeHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.isValuesChanged = true;
    this.validateLookupErrors(event.detail.value);
  };

  private checkboxSelectionChangeHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.isValuesChanged = true;

    // condition to disable the filterable field if unique is checked
    if (
      !this.isPrimaryField &&
      event.detail.value === 'unique' &&
      this.enableFilterable
    ) {
      const boolUniqueChecked = event.detail.meta.checked;
      try {
        const arrCheckBoxes = this.fieldBuilderOptions.checkboxes;
        const intCheckboxesLength = arrCheckBoxes.length;
        for (let i1 = 0; i1 < intCheckboxesLength; i1++) {
          const objFilterable = arrCheckBoxes[i1];
          if (objFilterable.key === 'filterable') {
            objFilterable.selected = boolUniqueChecked;
            objFilterable.enabled = !boolUniqueChecked;
            objFilterable.disabledMessage = ''; //!objFilterable.enabled ? '' : '';

            this.fieldBuilderOptions = {
              ...this.fieldBuilderOptions,
              checkboxes: arrCheckBoxes,
            };
            break;
          }
        }
      } catch (error) {
        console.error(
          `Error occured in checkboxSelectionChangeHandler: ${error}`
        );
      }
    }
  };

  private handleDependentField = (event: KeyboardEvent) => {
    const value = event.target['value'];

    if (event.key === 'Tab') {
      event.preventDefault();
      const start = event.target['selectionStart'];
      const end = event.target['selectionEnd'];

      // Set textarea value to: text before caret + tab + text after caret
      event.target['value'] =
        value.substring(0, start) + '\t' + value.substring(end);

      // Put caret at right position again
      event.target['selectionStart'] = start + 1;
      event.target['selectionEnd'] = start + 1;
    } else {
      this.textboxDependentValue = value;
    }
  };

  private switchToDropdownView = () => {
    this.fieldBuilderOptions = buildChoicesFromText(
      this.textboxDependentValue,
      this.fieldBuilderOptions
    );
    this.showDependentFieldTextbox = false;
  };

  private performLabelChange = (event: CustomEvent, isBlur = false, level) => {
    if (event) {
      event.stopImmediatePropagation();
      event.stopPropagation();
    }

    if (!isBlur) {
      this.isValuesChanged = true;
    }

    const field = this.isDependentField
      ? getFieldBasedOnLevel(this.fieldBuilderOptions, level)
      : {};
    const dictElName = `${this.DEP_LABEL_KEY}${level}`;

    const strInputValue = !isBlur
      ? event?.detail?.value || ''
      : event?.target?.['value']?.trim() || '';
    const isValidValue = strInputValue && strInputValue !== '';

    let strInternalName = '';
    let boolInternalNameUpdated = false;
    const objMaxLimitFieldInternalName = getMaxLimitProperty(
      this.productName,
      'maxInternalNameChars'
    );
    if (
      ((!this.isInternalNameEdited && this.isNewField) || field.isNew) &&
      objMaxLimitFieldInternalName
    ) {
      const derivedInternalName = deriveInternalNameFromLabel(strInputValue);
      strInternalName =
        strInputValue.length <= objMaxLimitFieldInternalName.count
          ? derivedInternalName
          : derivedInternalName.slice(0, objMaxLimitFieldInternalName.count);
      boolInternalNameUpdated = true;
    }

    if (isValidValue) {
      if (this.duplicateError) {
        this.validateDuplicateErrors(this.DEP_LABEL_KEY);
      } else {
        delete this.dependentErrors[dictElName];
      }

      const objMaxLimitField = getMaxLimitProperty(
        this.productName,
        'maxLabelChars'
      );
      if (objMaxLimitField && strInputValue.length >= objMaxLimitField.count) {
        this.labelWarningMessage = i18nText(objMaxLimitField.message, {
          count: objMaxLimitField.count,
        });
      } else {
        this.labelWarningMessage = '';
      }
    } else {
      this.labelWarningMessage = '';
    }

    const attr = { label: strInputValue };

    if (boolInternalNameUpdated) {
      const objMaxLimitFieldName = getMaxLimitProperty(
        this.productName,
        'maxInternalNameChars'
      );
      if (
        this.internalNameWarningMessage === '' &&
        objMaxLimitFieldName &&
        strInternalName.length >= objMaxLimitFieldName.count
      ) {
        this.internalNameWarningMessage = i18nText(
          objMaxLimitFieldName.message,
          {
            count: objMaxLimitFieldName.count,
          }
        );
      } else if (strInternalName.length < objMaxLimitFieldName.count) {
        this.internalNameWarningMessage = '';
      }

      if (!this.isInternalNameEdited || field.isNew) {
        attr['name'] = strInternalName;
      }
    }

    if (this.isDependentField) {
      this.dependentWarning[dictElName] = this.labelWarningMessage;
      this.dependentWarning[`${this.DEP_NAME_KEY}${level}`] =
        this.internalNameWarningMessage;
    }

    this.fieldBuilderOptions = updateFieldAttributes(
      this.fieldBuilderOptions,
      level,
      attr
    );

    if (this.showErrors && this.isDependentField) {
      this.validateString(strInputValue);
    } else {
      this.validateLabelErrors(strInputValue);
    }
  };

  private labelInputHandler = (event: CustomEvent, level) => {
    this.performLabelChange(event, false, level);
  };

  private labelBlurHandler = (event: CustomEvent, level) => {
    this.performLabelChange(event, true, level);
  };

  private performInternalNameChange = (
    event: CustomEvent,
    isBlur = false,
    level
  ) => {
    if (event) {
      event.stopImmediatePropagation();
      event.stopPropagation();
    }

    const dictElName = `${this.DEP_NAME_KEY}${level}`;
    let strInputValue = !isBlur
      ? event?.detail?.value || ''
      : event?.target?.['value']?.trim() || '';
    const isValidValue = strInputValue && strInputValue !== '';

    if (!isBlur) {
      this.isValuesChanged = true;
      if (isValidValue) {
        strInputValue = strInputValue.trim();
      }
    }
    if (!this.isInternalNameEdited && isValidValue) {
      this.isInternalNameEdited = true;
    }

    if (isValidValue) {
      delete this.dependentErrors[dictElName];
      const objMaxLimitField = getMaxLimitProperty(
        this.productName,
        'maxInternalNameChars'
      );
      if (objMaxLimitField && strInputValue.length >= objMaxLimitField.count) {
        this.internalNameWarningMessage = i18nText(objMaxLimitField.message, {
          count: objMaxLimitField.count,
        });
      } else {
        this.internalNameWarningMessage = '';
      }
    } else {
      this.internalNameWarningMessage = '';
    }

    if (this.isDependentField) {
      this.dependentWarning[dictElName] = this.internalNameWarningMessage;
    }

    this.fieldBuilderOptions = updateFieldAttributes(
      this.fieldBuilderOptions,
      level,
      { name: strInputValue }
    );

    if (this.showErrors && this.isDependentField) {
      this.validateString(strInputValue, true);
    } else {
      this.validateInternalNameErrors(strInputValue);
    }
  };

  private internalNameInputHandler = (event: CustomEvent, level) => {
    this.performInternalNameChange(event, false, level);
  };

  private internalNameBlurHandler = (event: CustomEvent, level) => {
    this.performInternalNameChange(event, true, level);
  };

  private renderFwLabel(dataItem) {
    if (!dataItem.selected || dataItem.key === 'required') {
      return null;
    }
    const strBaseClassName = 'fw-field-editor';
    const strKey = dataItem.key;
    const strLabel = hasCustomProperty(dataItem, 'tag')
      ? i18nText(dataItem.tag)
      : strKey;
    return (
      <fw-label
        key={strKey}
        value={strLabel}
        color='grey'
        class={`${strBaseClassName}-content-fw-label`}
      />
    );
  }

  private renderCheckboxField(dataCheckbox) {
    const boolEditCheckboxAllowed =
      this.isNewField ||
      this.isSectionField ||
      hasPermission(this.role, this.permission, 'EDIT', true);
    const sectionEditMode = this.isSectionField
      ? this.isSectionField
      : this.editSectionField ?? false; //When it is inside section required field should be disabled.
    const boolDisableCheckbox =
      !boolEditCheckboxAllowed || !dataCheckbox.enabled || sectionEditMode;
    const strBaseClassName = 'fw-field-editor';
    const strKey = dataCheckbox.key;

    let strLimitMessage = '';
    let boolShowInfo = false;

    if (
      hasCustomProperty(dataCheckbox, 'disabledMessage') &&
      dataCheckbox.disabledMessage !== ''
    ) {
      boolShowInfo = true;
      strLimitMessage = dataCheckbox.disabledMessage;
    } else if (
      hasCustomProperty(dataCheckbox, 'info') &&
      dataCheckbox.info !== ''
    ) {
      boolShowInfo = true;
      strLimitMessage = i18nText(dataCheckbox.info);
    }

    return (
      <div class={`${strBaseClassName}-content-checkbox-container`}>
        <fw-checkbox
          class={`${strBaseClassName}-content-fw-checkbox`}
          ref={(el) => (this.dictInteractiveElements[strKey] = el)}
          key={strKey}
          value={strKey}
          disabled={boolDisableCheckbox}
          checked={dataCheckbox.selected}
          onFwChange={this.checkboxSelectionChangeHandler}
        >
          {i18nText(dataCheckbox.display_label)}
        </fw-checkbox>
        {boolShowInfo && (
          <fw-tooltip
            placement='right'
            trigger='hover'
            content={strLimitMessage}
          >
            <fw-icon
              class={`${strBaseClassName}-content-fw-icon`}
              size={14}
              name='info'
              color='#264966'
            />
          </fw-tooltip>
        )}
      </div>
    );
  }

  private renderDropdown(
    boolDisableDropdowns,
    fieldBuilderOptions = null,
    choiceIds = [],
    parentId = null
  ) {
    // Dependent Level checks
    const level = fieldBuilderOptions?.field_options?.level;
    const dictElName = this.isDependentField
      ? `choices_level_${level}`
      : 'choices';
    const dropdownChoices =
      fieldBuilderOptions?.choices || this.fieldBuilderOptions.choices;
    const selectedLevels = getDependentLevels(
      this.dependentLevels,
      dropdownChoices,
      choiceIds,
      level
    );

    const showAddChoice = parentId
      ? !!choiceIds.length
      : !!dropdownChoices.length;

    return (
      <fw-fb-field-dropdown
        ref={(el) => (this.dictInteractiveElements[dictElName] = el)}
        dataProvider={dropdownChoices}
        productName={this.productName}
        showErrors={this.showErrors}
        disabled={boolDisableDropdowns}
        isDependentField={this.isDependentField}
        enableBulkChoices={this.isDependentField}
        dependentLevels={selectedLevels}
        level={level}
        parentId={parentId}
        choiceIds={choiceIds}
        enableKeyPress={showAddChoice}
        onFwChange={this.dropdownChangeHandler}
      ></fw-fb-field-dropdown>
    );
  }

  private renderStatusToggle(objFormValue) {
    const strBaseClassName = 'fw-field-editor';
    const choices = objFormValue?.choices;
    const isSlaEnabled =
      objFormValue?.field_options?.slaTimerEnabled &&
      (choices[1]?.choice_options?.pause_resolution_sla_timer !== undefined ||
        choices[2].choice_options?.pause_resolution_sla_timer !== undefined);
    const slaClassName = `${isSlaEnabled ? 'sla' : ''}`;

    const renderToggle = (id, name, checked) => (
      <span>
        <fw-toggle
          id={id}
          name={name}
          size='medium'
          checked={checked}
          onFwChange={this.statusToggleHandler}
        ></fw-toggle>
      </span>
    );
    return (
      <div class={`${strBaseClassName}-status-toggle`}>
        <div
          class={`${strBaseClassName}-status-toggle-item header  ${slaClassName}`}
        >
          <span>{i18nText('fieldLabel')}</span>
          <span>{i18nText('ertText')}</span>
          {isSlaEnabled && <span>{i18nText('pstText')}</span>}
        </div>
        {choices.map((dataItem) => {
          return (
            <div
              class={`${strBaseClassName}-status-toggle-item ${slaClassName}`}
              key={dataItem.id}
            >
              <span>
                <div class={`${strBaseClassName}-input-container`}>
                  <fw-input
                    class={`${strBaseClassName}-content-required-input`}
                    value={dataItem.value}
                    disabled='true'
                  ></fw-input>
                </div>
              </span>
              {dataItem?.choice_options?.resolution_timer !== undefined &&
                renderToggle(
                  dataItem.id,
                  'resolution_timer',
                  dataItem.choice_options.resolution_timer
                )}
              {isSlaEnabled &&
                dataItem?.choice_options?.pause_resolution_sla_timer !==
                  undefined &&
                renderToggle(
                  dataItem.id,
                  'pause_resolution_sla_timer',
                  dataItem.choice_options.pause_resolution_sla_timer
                )}
            </div>
          );
        })}
      </div>
    );
  }

  private renderLookup(boolDisableLookup) {
    const objFormValue = this.dataProvider;

    return (
      <fw-fb-field-lookup
        ref={(el) => (this.dictInteractiveElements['relationship'] = el)}
        targetObjects={this.lookupTargetObjects}
        sourceObjectName={this.entityName}
        showErrors={this.showErrors}
        disabled={boolDisableLookup}
        onFwChange={this.lookupChangeHandler}
        formValues={objFormValue}
        productName={this.productName}
        showRelationshipTypeSelect={this.showRelationshipTypeSelect}
      ></fw-fb-field-lookup>
    );
  }

  private renderInternalName(
    objProductConfig,
    objMaxLimits,
    boolEditAllowed,
    fieldBuilderOptions
  ) {
    const boolSupportInternalName = objProductConfig.editInternalName;
    if (!boolSupportInternalName || !this.expanded) {
      return null;
    }
    const strBaseClassName = 'fw-field-editor';
    const objFieldBuilder = fieldBuilderOptions;
    const strInputInternalName = hasCustomProperty(objFieldBuilder, 'name')
      ? objFieldBuilder.name
      : '';

    // Dependent Level checks
    const level = fieldBuilderOptions?.field_options?.level;
    const dictElName = this.isDependentField
      ? `${this.DEP_NAME_KEY}${level}`
      : this.KEY_INTERNAL_NAME;
    const internalNameErrorMessage = this.isDependentField
      ? this.dependentErrors[dictElName]
      : this.internalNameErrorMessage;

    const internalNameWarningMessage = this.isDependentField
      ? this.dependentWarning[dictElName]
      : this.internalNameWarningMessage;

    const boolShowNameError =
      this.showErrors &&
      internalNameErrorMessage &&
      internalNameErrorMessage !== ''
        ? true
        : false;
    const strInputError = boolShowNameError ? internalNameErrorMessage : '';

    const boolShowNameWarning =
      !boolShowNameError &&
      internalNameWarningMessage &&
      internalNameWarningMessage !== ''
        ? true
        : false;
    const strInputWarning = boolShowNameWarning
      ? internalNameWarningMessage
      : '';
    const numNameMaxChars = objMaxLimits?.['maxInternalNameChars']?.count || 50;

    return (
      <div class={`${strBaseClassName}-internal-name-base`}>
        <label
          class={`${strBaseClassName}-internal-name-header-label required`}
        >
          {i18nText('internalName')}
        </label>
        <div class={`${strBaseClassName}-internal-name-container`}>
          {!this.isDefaultNonCustomField && (
            <label class={`${strBaseClassName}-internal-name-prefix`}>
              {this.internalNamePrefix}
            </label>
          )}
          <fw-input
            ref={(el) => (this.dictInteractiveElements[dictElName] = el)}
            class={`${strBaseClassName}-content-required-internal-name-input`}
            placeholder={i18nText('fieldNamePlaceholder')}
            required={true}
            maxlength={numNameMaxChars}
            value={strInputInternalName}
            errorText={strInputError}
            warningText={strInputWarning}
            disabled={
              !this.isNewField || !boolEditAllowed || this.isDependentField
            }
            state={
              boolShowNameError
                ? 'error'
                : boolShowNameWarning
                ? 'warning'
                : 'normal'
            }
            onFwBlur={(el) => this.internalNameBlurHandler(el, level)}
            onFwInput={(el) => this.internalNameInputHandler(el, level)}
          ></fw-input>
        </div>
      </div>
    );
  }

  private renderLabel(objMaxLimits, boolEditAllowed, fieldBuilderOptions) {
    const objFieldBuilder = fieldBuilderOptions;
    const strBaseClassName = 'fw-field-editor';
    const strInputLabel = hasCustomProperty(objFieldBuilder, 'label')
      ? objFieldBuilder.label
      : '';
    const boolDIsableInputLabel =
      this.isDefaultNonCustomField || !boolEditAllowed;

    const strInputHint = this.isPrimaryField
      ? i18nText('primaryFieldNameHint')
      : '';
    // Dependent Level checks
    const level = fieldBuilderOptions?.field_options?.level;
    const dictElName = this.isDependentField
      ? `${this.DEP_LABEL_KEY}${level}`
      : 'name';
    const labelErrorMessage = this.isDependentField
      ? this.dependentErrors[dictElName]
      : this.labelErrorMessage;

    const labelWarningMessage = this.isDependentField
      ? this.dependentWarning[dictElName]
      : this.labelWarningMessage;

    const boolShowLabelError =
      this.showErrors && labelErrorMessage && labelErrorMessage !== ''
        ? true
        : false;

    const boolShowLabelWarning =
      !boolShowLabelError && labelWarningMessage && labelWarningMessage !== ''
        ? true
        : false;

    const strInputWarning = boolShowLabelWarning ? labelWarningMessage : '';
    const strInputError = boolShowLabelError ? labelErrorMessage : '';
    const numLabelMaxChars = objMaxLimits?.['maxLabelChars']?.count || 255;
    const fieldLabel = this.isDependentField
      ? i18nText('labelForLevel', { level })
      : i18nText('fieldLabel');

    return (
      <fw-input
        ref={(el) => (this.dictInteractiveElements[dictElName] = el)}
        class={`${strBaseClassName}-content-required-input`}
        placeholder={i18nText('fieldLabelPlaceholder')}
        label={fieldLabel}
        required={true}
        maxlength={numLabelMaxChars}
        value={strInputLabel}
        hintText={strInputHint}
        errorText={strInputError}
        warningText={strInputWarning}
        state={
          boolShowLabelError
            ? 'error'
            : boolShowLabelWarning
            ? 'warning'
            : 'normal'
        }
        disabled={boolDIsableInputLabel}
        onFwBlur={(el) => this.labelBlurHandler(el, level)}
        onFwInput={(el) => this.labelInputHandler(el, level)}
        onFwFocus={(el) => this.labelBlurHandler(el, level)}
      ></fw-input>
    );
  }

  private renderFieldContent(objProductConfig, boolEditAllowed) {
    const strBaseClassName = 'fw-field-editor';
    const renderLabelAndName = [];
    const renderFields = [];
    const objFieldBuilder = this.fieldBuilderOptions;
    const boolDisableDropdowns =
      this.isDefaultNonCustomField || !boolEditAllowed;

    const arrCheckboxes = hasCustomProperty(objFieldBuilder, 'checkboxes')
      ? objFieldBuilder.checkboxes
      : null;

    const checkboxItems =
      arrCheckboxes && arrCheckboxes.length > 0
        ? arrCheckboxes.map((dataItem) => this.renderCheckboxField(dataItem))
        : null;

    const levels = this.dependentLevels;
    /** Recursive content */
    const recurseFieldContent = (data, pChoices, pLevel) => {
      // Renders Label input and Internal name input
      const fieldLabelAndName = this.renderLabelAndInternalName(
        objProductConfig,
        boolEditAllowed,
        data
      );

      // Adds into renderLabelAndName array
      renderLabelAndName.push(fieldLabelAndName);

      const { ids, choices, pId } = getChildChoices(
        data,
        pChoices,
        pLevel,
        levels
      );

      if (!this.showDependentFieldTextbox) {
        const fieldDropdown = this.renderDropdown(
          boolDisableDropdowns,
          data,
          ids,
          pId
        );

        renderFields.push(fieldDropdown);
      }

      if (data?.fields?.length > 0) {
        const field = data.fields[0];
        const level = data.field_options.level;

        recurseFieldContent(field, choices, level);
      }
    };

    recurseFieldContent(this.fieldBuilderOptions.fields[0], [], null);

    return (
      <div class={`${strBaseClassName}-content`}>
        <div class={`${strBaseClassName}-content-required`}>
          {this.showDependentFieldResolveProp && (
            <div class={`${strBaseClassName}-content-checkboxes`}>
              <label
                class={`${strBaseClassName}-content-checkboxes-header-label`}
              >
                {i18nText('behaviour')}
              </label>
              {checkboxItems}
            </div>
          )}
          <div>
            <label class={`${strBaseClassName}-content-label`}>
              {i18nText('labels')}
            </label>
            <div class='flex flex-space-between'>
              {renderLabelAndName.map((field) => field)}
            </div>
          </div>
          <div>
            <label class={`${strBaseClassName}-content-label`}>
              {i18nText('dropdownChoices')}
            </label>
            {this.showDependentFieldTextbox ? (
              <div>
                <label class={`${strBaseClassName}-content-dependent-label`}>
                  {i18nText('dependentDropdownMessage')}&nbsp;
                  {this.dependentFieldLink && (
                    <a
                      href={this.dependentFieldLink}
                      target='_blank'
                      rel='noopener noreferrer'
                      class={`${strBaseClassName}-link`}
                    >
                      {i18nText('moreOnDependentFields')}
                    </a>
                  )}
                </label>
                <span class={`${strBaseClassName}-textbox`}>
                  <textarea
                    rows={8}
                    value={this.textboxDependentValue}
                    onKeyDown={this.handleDependentField}
                    onChange={this.handleDependentField}
                  ></textarea>
                </span>
                <fw-button
                  size='small'
                  color='secondary'
                  onFwClick={this.switchToDropdownView}
                >
                  {i18nText('addChoices')}
                </fw-button>
              </div>
            ) : (
              <div class='flex flex-space-between'>
                {renderFields.map((field) => field)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  private renderLabelAndInternalName(
    objProductConfig,
    boolEditAllowed,
    fieldBuilderOptions
  ) {
    const objMaxLimits = getMaximumLimitsConfig(this.productName);
    const boolSupportInternalName = objProductConfig.editInternalName;
    const strBaseClassName = 'fw-field-editor';

    return (
      <div class={`${strBaseClassName}-content-label-interalName`}>
        {this.renderLabel(objMaxLimits, boolEditAllowed, fieldBuilderOptions)}
        {boolSupportInternalName &&
          this.renderInternalName(
            objProductConfig,
            objMaxLimits,
            boolEditAllowed,
            fieldBuilderOptions
          )}
      </div>
    );
  }

  private renderContent(objProductConfig, boolEditAllowed) {
    if (!this.expanded) {
      return null;
    }
    const objFormValue = this.dataProvider;
    const objMaxLimits = getMaximumLimitsConfig(this.productName);
    const boolSupportInternalName = objProductConfig.editInternalName;
    const strBaseClassName = 'fw-field-editor';
    const objFieldBuilder = this.fieldBuilderOptions;

    /** Adding extra check for status type */
    const isStatusType = checkIfCustomToggleField(
      this.productName,
      objFormValue.name
    );

    const boolDisableDropdowns =
      this.isDefaultNonCustomField || !boolEditAllowed;

    const strFieldType = hasCustomProperty(objFieldBuilder, 'type')
      ? objFieldBuilder.type
      : '';

    const isDropdownType =
      strFieldType === 'DROPDOWN' || strFieldType === 'MULTI_SELECT'
        ? true
        : false;

    let boolIgnoreDropdownChoices = false;
    if (
      hasCustomProperty(objProductConfig, 'dropdownFieldWithoutChoicesKey') &&
      objProductConfig.dropdownFieldWithoutChoicesKey !== ''
    ) {
      const ignoreChoicesValue = getNestedKeyValueFromObject(
        objFormValue,
        objProductConfig.dropdownFieldWithoutChoicesKey
      );
      if (ignoreChoicesValue || ignoreChoicesValue === 'true') {
        boolIgnoreDropdownChoices = true;
      }
    }

    const arrCheckboxes = hasCustomProperty(objFieldBuilder, 'checkboxes')
      ? objFieldBuilder.checkboxes
      : null;

    const checkboxItems =
      arrCheckboxes && arrCheckboxes.length > 0
        ? arrCheckboxes.map((dataItem) => this.renderCheckboxField(dataItem))
        : null;

    const isLookupType = strFieldType === 'RELATIONSHIP';
    const elementRelationship = isLookupType
      ? this.renderLookup(boolDisableDropdowns)
      : null;

    const elementStatusToggle = isStatusType
      ? this.renderStatusToggle(objFormValue)
      : null;

    const elementDropdown =
      isDropdownType && !boolIgnoreDropdownChoices
        ? this.renderDropdown(boolDisableDropdowns)
        : null;

    return (
      <div class={`${strBaseClassName}-content`}>
        <div class={`${strBaseClassName}-content-required`}>
          <div class={`${strBaseClassName}-content-checkboxes`}>
            <label
              class={`${strBaseClassName}-content-checkboxes-header-label`}
            >
              {i18nText('behaviour')}
            </label>
            {checkboxItems}
          </div>
          {isLookupType && (
            <div class={`${strBaseClassName}-content-lookup`}>
              {elementRelationship}
            </div>
          )}
          {this.renderLabel(
            objMaxLimits,
            boolEditAllowed,
            this.fieldBuilderOptions
          )}
          {boolSupportInternalName &&
            this.renderInternalName(
              objProductConfig,
              objMaxLimits,
              boolEditAllowed,
              this.fieldBuilderOptions
            )}
          {elementStatusToggle}
          {isDropdownType && (
            <div class={`${strBaseClassName}-content-dropdown`}>
              {elementDropdown}
            </div>
          )}
        </div>
      </div>
    );
  }

  render() {
    if (!this.dataProvider || !this.fieldBuilderOptions) {
      return null;
    }

    const objProductPreset = formMapper[this.productName];
    const objProductLabels = objProductPreset.labels;
    const objProductConfig = objProductPreset.config;

    const objFieldBuilder = this.fieldBuilderOptions;
    const objFormValue = this.dataProvider;
    const boolNewField = this.isNewField;
    const strFieldType = objFieldBuilder.type;
    const boolEnableSaveBtn =
      (boolNewField || this.isValuesChanged) && !this.showDependentFieldTextbox
        ? true
        : false;
    const boolShowFieldValidationError =
      this.formErrorMessage && this.formErrorMessage !== '' ? true : false;
    const boolRequiredField =
      !boolNewField && hasCustomProperty(objFieldBuilder, 'required')
        ? objFieldBuilder.required
        : false;

    const boolEditAllowed =
      this.isNewField || hasPermission(this.role, this.permission, 'EDIT');
    const boolDeleteAllowed = hasPermission(
        this.role,
        this.permission,
        'DELETE'
      ),
      boolCreateAllowed = hasPermission(this.role, this.permission, 'CREATE');
    const boolDisableDelete = !boolDeleteAllowed;

    const boolShowDeleteModalInlineMsg =
      objProductConfig?.showDeleteModalInlineMessage;
    const strDeleteModalTitleText =
      objProductConfig?.showFieldLabelInDeleteModalTitle
        ? i18nText(objProductLabels.deleteFieldModalHeader, {
            label: objFormValue?.label,
          })
        : i18nText(objProductLabels.deleteFieldModalHeader);
    const strDeleteModalMessage = i18nText(
      objProductLabels.deleteFieldModalMessage
    );
    const strDeleteModalInlineMessage = boolShowDeleteModalInlineMsg
      ? i18nText('deleteFieldInlineMessage')
      : '';

    let strHeaderLabel = '';
    if (boolNewField) {
      const dbFieldTypeData = objProductPreset?.fieldProps[strFieldType];
      const strFieldTypeHeaderLabel = hasCustomProperty(
        dbFieldTypeData,
        'display_label'
      )
        ? dbFieldTypeData.display_label
        : '';

      strHeaderLabel = this.isPrimaryField
        ? i18nText('primaryFieldHeader')
        : strFieldTypeHeaderLabel && strFieldTypeHeaderLabel !== ''
        ? i18nText(strFieldTypeHeaderLabel)
        : '';
    } else {
      strHeaderLabel = objFormValue.label;
    }
    const boolShowCancelBtn =
      !this.isPrimaryField || (this.isPrimaryField && !boolNewField)
        ? true
        : false;
    const strSaveBtnLabel = boolNewField
      ? i18nText('addFieldBtn')
      : i18nText('saveFieldBtn');

    const arrCheckboxes = hasCustomProperty(objFieldBuilder, 'checkboxes')
      ? objFieldBuilder.checkboxes
      : null;
    let fwLabelItems =
      !this.expanded && arrCheckboxes && arrCheckboxes.length > 0
        ? arrCheckboxes.map((dataItem) => this.renderFwLabel(dataItem))
        : null;
    if (!this.expanded) {
      if (this.isPrimaryField) {
        const elPrimaryTag = this.renderFwLabel({
          key: 'primary',
          selected: true,
          tag: 'primaryFieldTag',
        });
        if (!fwLabelItems) {
          fwLabelItems = [elPrimaryTag];
        } else {
          fwLabelItems.unshift(elPrimaryTag);
        }
      } else if (strFieldType === 'RELATIONSHIP') {
        const boolUniqueField = hasCustomProperty(objFieldBuilder, 'unique')
          ? objFieldBuilder.unique
          : false;
        if (boolUniqueField) {
          const elLookupUniqueTag = this.renderFwLabel({
            key: 'unique',
            selected: true,
            tag: 'lookupUniqueTag',
          });
          if (!fwLabelItems) {
            fwLabelItems = [elLookupUniqueTag];
          } else {
            fwLabelItems.push(elLookupUniqueTag);
          }
        }
      } else if (this.isDefaultNonCustomField) {
        const elDefaultCustomTag = this.renderFwLabel({
          key: 'customDefault',
          selected: true,
          tag: objProductConfig.defaultTagLabel,
        });
        if (!fwLabelItems) {
          fwLabelItems = [elDefaultCustomTag];
        } else {
          fwLabelItems.push(elDefaultCustomTag);
        }
      } else if (
        this.dataProvider.isSectionFieldMatch &&
        parseBoolean(this.dataProvider?.field_options?.is_section_field) &&
        this.disabledSort
      ) {
        const elDefaultCustomTag = this.renderFwLabel({
          key: 'sectionField',
          selected: true,
          tag: 'sectionFieldTag',
        });
        if (!fwLabelItems) {
          fwLabelItems = [elDefaultCustomTag];
        } else {
          fwLabelItems.push(elDefaultCustomTag);
        }
      }
    }

    const strBaseClassName = 'fw-field-editor';
    let strComponentClassName = strBaseClassName;
    if (boolRequiredField) {
      strComponentClassName += ` ${strBaseClassName}--required`;
    }
    if (this.isPrimaryField) {
      strComponentClassName += ` ${strBaseClassName}--primary`;
    }
    if (this.expanded) {
      strComponentClassName += ` ${strBaseClassName}--expanded`;
    } else if (this.disabled) {
      strComponentClassName += ` ${strBaseClassName}--disabled`;
    } else if (this.isDeleting) {
      strComponentClassName += ` ${strBaseClassName}--deleting`;
    } else if (this.disabledSort) {
      strComponentClassName += ` ${strBaseClassName}--disabled-sort`;
    }

    let strFooterClassName = `${strBaseClassName}-footer`;
    if (boolShowFieldValidationError) {
      strFooterClassName += ` ${strBaseClassName}-footer-with-error`;
    }

    const fieldIcon = this.isDependentField
      ? presetSchema.fieldTypes.DEPENDENT_FIELD.icon
      : objFieldBuilder.icon;

    const contentElements = this.isDependentField
      ? this.renderFieldContent(objProductConfig, boolEditAllowed)
      : this.renderContent(objProductConfig, boolEditAllowed);

    const disableAddSectionBtn =
      !boolCreateAllowed ||
      this.expanded ||
      this.createDynamicSection ||
      this.sectionCreatedForAllChoices;

    const showDeleteBtn =
      !this.expanded &&
      !this.isPrimaryField &&
      !this.isDeleting &&
      !this.isDefaultNonCustomField &&
      !this.editSectionField;

    return (
      <Host tabIndex='-1'>
        <div
          class={strComponentClassName}
          ref={(el) => (this.divFieldBase = el)}
          onDragEnd={this.stopParentDragging}
          onDrop={this.stopParentDragging}
        >
          <div class={`${strBaseClassName}-header`}>
            <div
              role='none'
              class={`${strBaseClassName}-drag-container`}
              onMouseDown={this.startParentDragging}
            >
              <fw-icon size={14} name='drag' color='#CFD7DF' />
            </div>
            <div
              class={`${strBaseClassName}-header-content`}
              onClick={this.expandHandler}
            >
              <span
                class={`${strBaseClassName}-icon-container`}
                style={{ backgroundColor: fieldIcon.bg_color }}
              >
                <fw-icon size={14} name={fieldIcon.name} color='#475867' />
              </span>
              <label class={`${strBaseClassName}-label`}>
                {strHeaderLabel}
              </label>
              {!this.expanded && (
                <div class={`${strBaseClassName}-key-fw-labels`}>
                  {fwLabelItems}
                </div>
              )}
            </div>
            {this.showSections && (
              <fw-tooltip
                placement={this.sectionCreatedForAllChoices ? 'bottom' : 'left'}
                trigger='hover'
                content={
                  this.sectionCreatedForAllChoices
                    ? TranslationController.t(
                        'formBuilder.sections.sectionCreatedForAllChoices'
                      )
                    : TranslationController.t(
                        'formBuilder.sections.addTooltipDescription'
                      )
                }
                header={
                  this.sectionCreatedForAllChoices
                    ? ''
                    : TranslationController.t(
                        'formBuilder.sections.addTooltipTitle'
                      )
                }
              >
                <fw-button
                  color='text'
                  class='fw-field-editor-add-section-btn'
                  disabled={disableAddSectionBtn}
                  onFwClick={() => {
                    this.setSectionsExpandState(true);
                    this.setSectionCreationExpandState(true);
                  }}
                >
                  <fw-icon
                    name='square-plus'
                    slot='before-label'
                    size='16'
                    library='system'
                  ></fw-icon>
                  <span class={`${strBaseClassName}-add-section-text`}>
                    {TranslationController.t('formBuilder.sections.add')}
                  </span>
                </fw-button>
              </fw-tooltip>
            )}
            {showDeleteBtn && (
              <fw-button
                part='delete-field-btn'
                size='icon'
                color='secondary'
                disabled={boolDisableDelete}
                class={`${strBaseClassName}-delete-button`}
                onFwClick={this.deleteFieldClickHandler}
              >
                <fw-icon name='delete'></fw-icon>
              </fw-button>
            )}
            {/* {!this.expanded && this.isDefaultNonCustomField && (
              <span class={`${strBaseClassName}-lock-container`}>
                <fw-icon name='lock'></fw-icon>
              </span>
            )} */}
            {!this.expanded && !this.isPrimaryField && this.isDeleting && (
              <fw-spinner
                class={`${strBaseClassName}-deleting-state`}
                size='medium'
                color='#d72d30'
              ></fw-spinner>
            )}
          </div>
          {this.expanded && (
            <div class={`${strBaseClassName}-body`}>
              {contentElements}
              <div class={strFooterClassName}>
                {boolShowFieldValidationError && (
                  <span
                    class={`${strBaseClassName}-footer-field-error-container`}
                  >
                    <fw-icon size={12} name='warning' color='#d72d30' />
                    <label class={`${strBaseClassName}-footer-field-error-msg`}>
                      {this.formErrorMessage}
                    </label>
                  </span>
                )}
                <span class={`${strBaseClassName}-footer-buttons-container`}>
                  {boolShowCancelBtn && (
                    <fw-button
                      id='clearFieldBtn'
                      color='secondary'
                      onFwClick={this.cancelFieldHandler}
                    >
                      {i18nText('cancelFieldBtn')}
                    </fw-button>
                  )}
                  <fw-button
                    id='submitFieldBtn'
                    color='primary'
                    loading={this.isLoading}
                    disabled={!boolEnableSaveBtn}
                    onFwClick={this.addFieldHandler}
                  >
                    {strSaveBtnLabel}
                  </fw-button>
                </span>
              </div>
            </div>
          )}
        </div>
        <fw-modal
          ref={(el) => (this.modalConfirmDelete = el)}
          icon='delete'
          submitColor='danger'
          hasCloseIconButton={false}
          titleText={strDeleteModalTitleText}
          submitText={i18nText('deleteFieldSubmit')}
          onFwSubmit={this.confirmDeleteFieldHandler}
        >
          <span class={'fw-field-editor-delete-modal-content'}>
            {boolShowDeleteModalInlineMsg && (
              <fw-inline-message open type='warning'>
                {strDeleteModalInlineMessage}
              </fw-inline-message>
            )}
            {strDeleteModalMessage}
          </span>
        </fw-modal>
      </Host>
    );
  }
}
