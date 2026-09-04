/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  Component,
  Event,
  Element,
  EventEmitter,
  Prop,
  h,
  Host,
  Fragment,
  State,
  Watch,
  Method,
} from '@stencil/core';
import {
  deepCloneObject,
  getFieldTypeCheckboxes,
  getMappedCustomFieldType,
  buildAllowedFieldTypesConfig,
  buildVisibleFieldIndexMap,
  getMaximumLimitsConfig,
  mergeHostFieldLimits,
  resolveDroppedIndex,
  hasCustomProperty,
  hasPermission,
  i18nText,
  isPrimaryFieldType,
  isUniqueField,
  getDefaultDependentLevels,
  checkAndAppendLevel3,
  getChoicesWithNoSectionCreated,
} from './utils/form-builder-utils';
import presetSchema from './assets/form-builder-preset.json';
import formMapper from './assets/form-mapper.json';
import { debounce } from '../../utils/utils';
import { TranslationController } from '../../global/Translation';
import { parseBoolean } from '../../utils/utils';

@Component({
  tag: 'fw-form-builder',
  styleUrl: 'form-builder.scss',
  shadow: true,
})
export class FormBuilder {
  @Element() host!: HTMLElement;

  private fieldEditorPanel!: any;
  private debouncedHandleInput: any;
  private modalCustomizeWidget!: any;
  private isWidgetValuesChanged = false;
  private filterByFieldTypeOptions = null;
  private allowedFieldTypes: string[] = [];
  private hostFieldLimits: Record<string, number> = {};
  private effectiveMaximumLimits = null;
  // Maps a rendered (DOM) child ordinal in the main fields drag container to
  // its real index inside arrFieldElements, since fields whose type is
  // excluded via isFieldTypeAllowed render as null and contribute no DOM
  // node. Rebuilt every render() alongside fieldElements; see
  // resolveDroppedIndex().
  private visibleFieldIndexMap: number[] = [];
  private resizeObserver;
  private FILTER_ALL_FIELDS = 'ALL_FIELDS';

  /**
   * The db type used to determine the json to be used for CUSTOM_OBJECTS or CONVERSATION_PROPERTIES
   */
  @Prop() productName: 'CUSTOM_OBJECTS' | 'CONVERSATION_PROPERTIES' =
    'CUSTOM_OBJECTS';
  /**
   * Theme configuration for the form builder UI
   */
  @Prop() theme: 'default' | 'dew-light-theme' | 'dew-dark-theme' = 'default';
  /**
   * Show explore plans button and disable features for free-plan users
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
  /**
   * Prop to store the expanded field index
   */
  @Prop({ mutable: true }) currentFieldIndex = {};
  /**
   * variable to store form values
   */
  @Prop({ mutable: true }) formValues = null;
  /**
   * object to store the lookup target entities
   */
  @Prop({ mutable: true }) lookupTargetObjects = null;
  /**
   * Additional props (e.g. search, debounceTimer) passed through to the target-object fw-select inside
   * fw-fb-field-lookup, for opting in to server-backed/async search on the target picker. Defaults to an
   * empty object, so existing consumers who don't set this see no behavior change.
   */
  @Prop({ mutable: true }) targetSelectProps = {};
  /**
   * flag to show lookupField for CONVERSATION_PROPERTIES or not
   */
  @Prop({ mutable: true }) showLookupField = true;
  /**
   * flag to show relationshipTypeSelect dropdown or not
   */
  @Prop({ mutable: true }) showRelationshipTypeSelect = true;
  /**
   * flag to show dependentField for CONVERSATION_PROPERTIES or not
   */
  @Prop({ mutable: true }) showDependentField = true;
  /**
   * Host-driven list of supported field types and optional per-type limits.
   * Governs what's visible/creatable in this builder session only: a type
   * left out is hidden from the left-nav, field editor, and
   * customize-widget modal, including any field of that type already
   * present in a loaded schema. Excluded fields' data is left untouched in
   * formValues.fields and will still be included on save - this prop is
   * not a data migration tool, so a host that needs to fully retire a type
   * must filter/migrate the underlying schema itself.
   */
  @Prop({ mutable: true }) supportedFieldTypes: Array<{
    type: string;
    limit?: number;
  }> = null;
  /**
   * flag to show dependentField resolve checkbox
   */
  @Prop({ mutable: true }) showDependentFieldResolveProp = true;
  /**
   * flag to support dependentFields & Multi select dropdown within sections
   */
  @Prop({ mutable: true }) supportDependentAndMSDDInSections = false;
  /**
   * link to show dependent field document
   */
  @Prop() dependentFieldLink = '';
  /**
   * variable to store customize widget fields
   */
  @Prop({ mutable: true }) customizeWidgetFields = null;
  /**
   * flag to notify if an api call is in progress
   */
  @Prop({ mutable: true }) isLoading = false;
  /**
   * flag to notify if an api call to save the widget is completed
   */
  @Prop({ mutable: true }) isSavingCustomizeWidget = false;
  /**
   * Show explore plans and disable features for user having free-plan
   */
  @Prop() userPlan: 'trial' | 'admin' = 'admin';
  /**
   * svg image to be shown for empty record
   */
  @Prop() emptySearchImage = null;
  /*
   * Beta flag to enable Dynamic sections
   */
  @Prop() dynamicSectionsBetaEnabled = false;
  /**
   * State to store the formValues as a state to transfer the field types
   */
  @State() localFormValues = null;
  /**
   * State to store the searched widget elements
   */
  @State() arrWidgetFields = null;
  /**
   * State to store the searched field elements
   */
  @State() arrSearchedFields = null;
  /**
   * State to store the filtered field elements
   */
  @State() arrFilteredByTypeFields = null;
  /**
   * State to check if the form is in searching mode
   */
  @State() searching = false;
  /**
   * State to show/hide the customize widget modal contents
   */
  @State() showCustomizeWidget = false;
  /**
   * variable to store the count of all the field types
   */
  @State() fieldTypesCount = null;
  /**
   * Flag to enable / disable the all the field type based on the limits
   */
  @State() enableFieldType = true;
  /**
   * Flag to enable / disable the the filterable option
   */
  @State() enableFilterable = true;
  /**
   * Flag to enable / disable the the unique option
   */
  @State() enableUnique = true;
  /**
   * selected filter option from the select component for filter by field type
   */
  @State() selectedFieldTypeFilterOption = this.FILTER_ALL_FIELDS;
  /**
   * State to re-render the drag container children after re render
   */
  @State() fieldRerenderCount = 0;
  /**
   * Flag to enable edit dynamic section
   */
  @State() isEditingDynamicSection = false;
  /**
   * Triggered on Add/Save field button click from the field list items
   */
  @Event() fwSaveField!: EventEmitter;
  /**
   * Triggered on Delete field button click from the field list items
   */
  @Event() fwDeleteField!: EventEmitter;
  /**
   * Triggered when a new field type is dropped / added inside the fields area
   */
  @Event() fwComposeNewField!: EventEmitter;
  /**
   * Triggered when the position of a field is changed using drag and drop
   */
  @Event() fwRepositionField!: EventEmitter;
  /**
   * Triggered when the field is expanded or collapsed
   */
  @Event() fwExpandField!: EventEmitter;
  /**
   * Triggered when the explore plans button is clicked for free plan users
   */
  @Event() fwExplorePlan!: EventEmitter;
  /**
   * Triggered on search
   */
  @Event() fwSearchField!: EventEmitter;
  /**
   * Triggered on saving the widget fields
   */
  @Event() fwSaveWidgetFields!: EventEmitter;

  @State() dragErrorMessages = {}; // State to track errors for each section

  @Watch('searching')
  watchSearchHandler(): void {
    this.fwSearchField.emit({ searching: this.searching });
  }

  @Watch('isSavingCustomizeWidget')
  watchSaveCustomizeWidgetChangeHandler(): void {
    if (!this.isSavingCustomizeWidget) {
      this.closeWidgetDetailsHandler();
    }
  }

  @Watch('formValues')
  watchFormValuesChangeHandler(newValue: any): void {
    this.validateFormValues(newValue);
  }

  @Watch('productName')
  watchProductNameChangeHandler(): void {
    this.validateFormValues();
  }

  /**
   * Method to force render the drag container's children containing all the added fields
   */
  @Method()
  async forceRenderFields(): Promise<void> {
    this.fieldRerenderCount++;
  }

  componentWillLoad(): void {
    this.initializeSearchDebounce();
    this.initializeAllowedFieldTypes();
    this.validateFormValues();
  }

  @Watch('supportedFieldTypes')
  onSupportedFieldTypesChange(): void {
    this.initializeAllowedFieldTypes();
  }

  private initializeAllowedFieldTypes(): void {
    const { allowedFieldTypes, hostFieldLimits } = buildAllowedFieldTypesConfig(
      this.productName,
      this.supportedFieldTypes
    );
    this.allowedFieldTypes = allowedFieldTypes;
    this.hostFieldLimits = hostFieldLimits;
    this.effectiveMaximumLimits = mergeHostFieldLimits(
      getMaximumLimitsConfig(this.productName),
      this.hostFieldLimits
    );
  }

  private isFieldTypeAllowed(strFieldType: string): boolean {
    return this.allowedFieldTypes.includes(strFieldType);
  }

  private getEffectiveMaximumLimits() {
    return (
      this.effectiveMaximumLimits ??
      getMaximumLimitsConfig(this.productName)
    );
  }

  disconnectedCallback(): void {
    this.debouncedHandleInput = null;
    this.removeResizeObserver();
  }

  private validateFormValues(objFormValue = null) {
    this.fieldTypesCount = null;
    const objMaxLimitCount = { filterable: 0, unique: 0 };
    this.localFormValues = objFormValue
      ? deepCloneObject(objFormValue)
      : this.formValues
      ? deepCloneObject(this.formValues)
      : null;

    if (this.localFormValues) {
      const arrFields = this.localFormValues?.fields;
      const objMapper = formMapper[this.productName];
      const mappedFieldTypes = objMapper['reverseMappedFieldTypes'];
      const objProductConfig = objMapper.config;
      const boolSupportsDefaultField =
        objProductConfig?.showDefaultTag &&
        objProductConfig?.defaultTagKey &&
        objProductConfig.defaultTagKey !== ''
          ? true
          : false;
      const strDefaultFieldKey = boolSupportsDefaultField
        ? objProductConfig.defaultTagKey
        : '';

      // Maximum limits validation
      if (arrFields && arrFields.length > 0) {
        let intValidActiveFieldCount = 0;
        const intFieldCount = arrFields.length;

        for (let i1 = 0; i1 < intFieldCount; i1++) {
          // check for dependent field and change fields format
          if (arrFields[i1]?.field_options?.dependent === 'true') {
            const internalNamePrefix = objProductConfig.internalNamePrefix;
            arrFields[i1] = getDefaultDependentLevels(
              {
                type: '22',
                label: arrFields[i1].label,
                name: arrFields[i1].name,
                fields: [arrFields[i1]],
                field_options: arrFields[i1]?.field_options,
                custom: arrFields[i1]?.custom,
              },
              internalNamePrefix
            );
            arrFields[i1] = checkAndAppendLevel3(arrFields[i1]);
          }

          if (arrFields[i1].field_options?.has_sections) {
            for (let j1 = 0; j1 < arrFields[i1]?.fields.length; j1++) {
              if (
                arrFields[i1]?.fields[j1].field_options?.dependent === 'true'
              ) {
                const internalNamePrefix = objProductConfig.internalNamePrefix;
                arrFields[i1].fields[j1] = getDefaultDependentLevels(
                  {
                    type: '22',
                    label: arrFields[i1]?.fields[j1].label,
                    name: arrFields[i1]?.fields[j1].name,
                    fields: [arrFields[i1]?.fields[j1]],
                    field_options: arrFields[i1]?.fields[j1]?.field_options,
                    custom: arrFields[i1]?.fields[j1]?.custom,
                  },
                  internalNamePrefix
                );
                arrFields[i1].fields[j1] = checkAndAppendLevel3(
                  arrFields[i1].fields[j1]
                );
              }
            }
          }

          const objField = arrFields[i1];
          if (!objField) {
            continue;
          }

          if (mappedFieldTypes) {
            if (hasCustomProperty(mappedFieldTypes, objField.type)) {
              if (objField.field_options?.has_sections) {
                //Changes to handle the type for sections
                objField?.fields?.forEach((sectionField) => {
                  sectionField.type = mappedFieldTypes[sectionField.type];
                });
                objField.type = mappedFieldTypes[objField.type];
              } else {
                objField.type = mappedFieldTypes[objField.type];
              }
            } else {
              console.log(
                `${objField.type} is not added in the mapper - Unsupported field type`
              );
            }
          }

          const strFieldType = objField.type;
          if (!objField?.isNew) {
            if (
              strFieldType !== 'RELATIONSHIP' &&
              (objField?.filterable === true || objField?.filterable === 'true')
            ) {
              objMaxLimitCount.filterable++;
            }

            if (isUniqueField(objField)) {
              objMaxLimitCount.unique++;
            }

            if (!this.fieldTypesCount) {
              this.fieldTypesCount = {};
            }

            const strParsedFieldType =
              strFieldType === 'PRIMARY' ? 'TEXT' : strFieldType;
            if (!hasCustomProperty(this.fieldTypesCount, strParsedFieldType)) {
              this.fieldTypesCount[strParsedFieldType] = 0;
            }
            this.fieldTypesCount[strParsedFieldType]++;
          }

          if (!boolSupportsDefaultField) {
            intValidActiveFieldCount++;
          } else if (
            strDefaultFieldKey &&
            strDefaultFieldKey !== '' &&
            hasCustomProperty(objField, strDefaultFieldKey) &&
            objField[strDefaultFieldKey]
          ) {
            intValidActiveFieldCount++;
          }
        }

        const objMaxLimits = this.getEffectiveMaximumLimits();
        this.enableFieldType =
          intValidActiveFieldCount < objMaxLimits.fields.count;
        this.enableFilterable =
          objMaxLimitCount.filterable < objMaxLimits.filterable.count;
        this.enableUnique = objMaxLimitCount.unique < objMaxLimits.unique.count;
      } else {
        this.enableUnique = true;
        this.enableFilterable = true;
        this.enableFieldType = true;
        this.fieldTypesCount = null;
      }
    }
  }

  private getInterpolatedMaxLimitLabel = (strProperty) => {
    if (strProperty && strProperty !== '') {
      try {
        const objMaxLimit = this.getEffectiveMaximumLimits()?.[
          strProperty
        ];
        if (objMaxLimit) {
          return i18nText(objMaxLimit.message, { count: objMaxLimit.count });
        }
      } catch (error) {
        return '';
      }
    }
    return '';
  };

  // function to get the default field type schema based on the field type
  private getDefaultFieldTypeSchema = (fieldType) => {
    if (presetSchema) {
      try {
        const objDefaultField = presetSchema.fieldTypes[fieldType];

        if (objDefaultField) {
          const objNewField = deepCloneObject(objDefaultField);
          objNewField.checkboxes = getFieldTypeCheckboxes(
            this.productName,
            fieldType
          );
          return objNewField;
        } else {
          console.log(`${fieldType} - field type is not supported`);
        }
      } catch (error) {
        console.log(`${fieldType} - field type is not supported`);
      }
    }
    return null;
  };

  private removeFieldReorderClass = () => {
    try {
      if (this.fieldEditorPanel) {
        this.fieldEditorPanel.classList.remove(
          'form-builder-right-panel-list-container--reordering'
        );
      }
    } catch (error) {
      console.error('Could not remove dragged class');
    }
  };
  private reorderFieldProgressHandler = (event: CustomEvent) => {
    if (this.fieldEditorPanel) {
      const boolDragging = event.detail.value;
      if (boolDragging) {
        this.fieldEditorPanel.classList.add(
          'form-builder-right-panel-list-container--reordering'
        );
      } else {
        this.removeFieldReorderClass();
      }
    }
  };

  private expandFieldHandler = (event: CustomEvent) => {
    this.fwExpandField.emit({ ...event.detail });
  };

  private explorePlanHandler = (event: CustomEvent) => {
    this.fwExplorePlan.emit({ ...event.detail });
  };

  private saveFieldHandler = (event: CustomEvent) => {
    const objSaveField = { ...event.detail };
    const objSaveFieldDetails = objSaveField.value;
    objSaveFieldDetails.type = getMappedCustomFieldType(
      this.productName,
      objSaveFieldDetails.type
    );
    this.fwSaveField.emit(objSaveField);
  };

  private deleteFieldHandler = (event: CustomEvent) => {
    this.fwDeleteField.emit({ ...event.detail });
  };

  private composeNewField = (
    strNewFieldType,
    objFieldData,
    intIndex = -1,
    sectionData?
  ) => {
    if (!this.isFieldTypeAllowed(strNewFieldType)) {
      return;
    }
    const fieldType = strNewFieldType;
    const objNewField = deepCloneObject(presetSchema.fieldTypes[fieldType]);
    const objMaxLimits = this.getEffectiveMaximumLimits();

    try {
      const arrFields = this.localFormValues?.fields;
      objNewField.checkboxes = getFieldTypeCheckboxes(
        this.productName,
        objNewField.type
      );
      // Condition to deselect the filter checkbox (selected by default), if maximum filters have been applied in the object
      if (
        objNewField.type !== 'RELATIONSHIP' &&
        objNewField.checkboxes &&
        objNewField.checkboxes.length > 0 &&
        objMaxLimits
      ) {
        const arrFilterableFields = arrFields.filter(
          (objField) =>
            objField?.filterable === true || objField?.filterable === 'true'
        );
        const numMaxFilterables = objMaxLimits.filterable.count;
        if (arrFilterableFields.length >= numMaxFilterables) {
          const arrCheckBoxes = objNewField.checkboxes;
          const intCheckboxesLength = arrCheckBoxes.length;
          for (let c1 = 0; c1 < intCheckboxesLength; c1++) {
            if (arrCheckBoxes[c1].key === 'filterable') {
              arrCheckBoxes[c1].selected = false;
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error occurred in composeNewField: ${error}`);
    }

    objNewField.type = getMappedCustomFieldType(
      this.productName,
      objNewField.type
    );
    this.fwComposeNewField.emit({
      maximumLimits: this.getEffectiveMaximumLimits(),
      fieldSchema: objNewField,
      value: { ...objFieldData },
      index: intIndex,
      sectionSource: sectionData,
    });
  };

  private onDragEnter = (event: CustomEvent, sectionName) => {
    //Show Error message when they drag into section container
    event.preventDefault();
    event.stopPropagation();
    const objDetail = event.detail,
      elField = objDetail.droppedElement;
    let elFieldType = elField.dataProvider.type;

    const existingCount = Array.from(
      objDetail.dragContainer?.children || []
    ).reduce<number>((count, child) => {
      const childDataProvider = (
        child as HTMLElement & {
          dataProvider?: { type?: string };
        }
      )?.dataProvider;
      if (childDataProvider?.type) {
        count = count + (childDataProvider?.type === 'DEPENDENT_FIELD' ? 3 : 1);
      }
      return count;
    }, 0);

    const isFieldInTheSameContainer =
      objDetail.dragContainer?.id === elField.parentElement?.id;

    // Adding the dragged field to the count
    const count = isFieldInTheSameContainer
      ? existingCount
      : existingCount +
        (elField.dataProvider?.type === 'DEPENDENT_FIELD' ? 3 : 1);

    const maxLimit = count > 15;

    if (maxLimit) {
      elFieldType = 'MAX_LIMIT';
    }
    if (elField.dataProvider.required) {
      elFieldType = 'REQUIRED';
    }
    if (!elField.dataProvider.custom && elField.dataProvider.label) {
      elFieldType =
        elFieldType === 'DEPENDENT_FIELD' ? 'DEPENDENT_FIELD' : 'DEFAULT';
    }

    this.dragErrorMessages = {
      [sectionName]: i18nText(`sections.errorMessages.${elFieldType}`),
    };
  };

  private hideErrorMessage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragErrorMessages = {};
  };

  private fieldTypeDropHandler = (
    event: CustomEvent,
    dataItem?,
    sectionName?,
    parentIndex?
  ) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.removeFieldReorderClass();
    const objDetail = event.detail;
    const elFieldType = objDetail.droppedElement;
    let intDroppedIndex = objDetail.droppedIndex;
    // Only the main fields list can have hidden (isFieldTypeAllowed-excluded)
    // entries interspersed, so only remap drops landing there - a section's
    // own drag container never renders excluded top-level field types.
    if (objDetail.dropToId?.includes('fieldsContainer')) {
      intDroppedIndex = resolveDroppedIndex(
        intDroppedIndex,
        this.visibleFieldIndexMap
      );
    }
    let sectionData = {
      data: dataItem,
      name: sectionName,
      targetIndex: parentIndex,
    };
    const sectionOut = objDetail.dragFromId.split('sectionIdentifier-'); //When it is moving from inside section to outside so it will have acceptfrom sectionIdentifier.
    if (sectionOut.length > 1 && sectionOut[1]) {
      sectionData = {
        data: {
          id:
            elFieldType.dataProvider.type === 'DEPENDENT_FIELD'
              ? elFieldType.dataProvider?.fields[0]?.parent_id
              : elFieldType.dataProvider?.parent_id,
          field_options: { has_sections: true },
        },
        name: sectionName,
        targetIndex: parentIndex,
      };
    }

    const isRepositionSection =
      objDetail.dragFromId.includes('sectionIdentifier-') &&
      objDetail.dropToId.includes('sectionIdentifier-'); //Allow to drop between the multiple sections

    const isSectionOutside =
      objDetail.dragFromId.includes('sectionIdentifier-') &&
      objDetail.dropToId.includes('fieldsContainer');
    // Determine if it's a reposition involving the Field container
    const isSectionInside =
      objDetail.dragFromId.includes('fieldsContainer') &&
      objDetail.dropToId.includes('sectionIdentifier-');

    // New field type element dropped inside the container
    if (
      objDetail.dragFromId !== objDetail.dropToId &&
      !(isSectionOutside || isSectionInside || isRepositionSection)
    ) {
      const boolCreationAllowed = hasPermission(
        this.role,
        this.permission,
        'CREATE'
      );
      if (!boolCreationAllowed) {
        return;
      }

      this.composeNewField(
        elFieldType.dataProvider.type,
        { ...elFieldType.dataProvider },
        intDroppedIndex,
        sectionData
      );
    } else {
      // Reposition inside the fields list
      if (elFieldType.index !== intDroppedIndex || isRepositionSection) {
        this.fwRepositionField.emit({
          sourceIndex: elFieldType.index,
          targetIndex: intDroppedIndex,
          sectionData,
          sourceFieldId:
            elFieldType.dataProvider.type === 'DEPENDENT_FIELD'
              ? elFieldType.dataProvider?.fields[0]?.id
              : elFieldType.dataProvider?.id,
          isRepositionSection,
        });
      }
    }
  };

  private removeResizeObserver = () => {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  };

  private addNewFieldTypeHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    const boolCreationAllowed = hasPermission(
      this.role,
      this.permission,
      'CREATE'
    );
    if (!boolCreationAllowed) {
      return;
    }

    // Observer added to scroll to the bottom on new field addition by click of the + button
    this.resizeObserver = new ResizeObserver(() => {
      this.removeResizeObserver();
      setTimeout(() => {
        this.fieldEditorPanel.scrollTop = this.fieldEditorPanel.scrollHeight;
      }, 100);
    });
    this.resizeObserver.observe(this.fieldEditorPanel);
    this.composeNewField(event.detail.value, { ...event.detail.data });
  };

  private initializeSearchDebounce = () => {
    if (!this.debouncedHandleInput) {
      this.debouncedHandleInput = debounce(this.searchChangeHandler, this);
    }
  };

  private searchChangeHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    const strInputText = event?.detail?.value?.trim() || '';
    const arrFieldElements = this.localFormValues?.fields || [];
    //function to clean up the Section field key
    const cleanupSearchFlags = (fields) => {
      fields.forEach((field) => {
        delete field.isSectionFieldMatch; // Remove the flag if it exists
        if (field?.fields?.length && field?.field_options?.has_sections) {
          cleanupSearchFlags(field.fields); // Recursively clean up nested fields
        }
      });
    };
    if (strInputText) {
      const strSearchableText = strInputText.toLowerCase();

      // Recursive function to search within fields and section fields
      const searchFields = (fields) => {
        return fields.reduce((results, field) => {
          // Check if the field label matches the search text
          if (field.label.toLowerCase().includes(strSearchableText)) {
            if (parseBoolean(field?.field_options?.is_section_field)) {
              field.isSectionFieldMatch = true;
            }
            results.push(field);
          }
          // If the field has section fields, search recursively within them
          if (field?.fields?.length && field?.field_options?.has_sections) {
            results.push(...searchFields(field.fields));
          }
          return results;
        }, []);
      };
      cleanupSearchFlags(arrFieldElements);
      const arrResults = searchFields(arrFieldElements); // Get all matching results including those in nested sections
      this.searching = true; // Set the searching flag to ensure the search results are displayed when the result is empty
      this.arrSearchedFields = arrResults.length
        ? deepCloneObject(arrResults)
        : null;
    } else {
      cleanupSearchFlags(arrFieldElements);
      this.searching = false;
      this.arrSearchedFields = null;
    }
  };

  private clearSearchHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.arrSearchedFields = null;
    this.searching = false;
  };

  private fieldTypeFilterChangeHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    const filteredFieldType = event.detail.value;

    if (
      filteredFieldType &&
      filteredFieldType !== '' &&
      filteredFieldType !== this.FILTER_ALL_FIELDS
    ) {
      this.arrSearchedFields = null;
      this.searching = false;

      const arrFieldElements =
        this.localFormValues && this.localFormValues.fields
          ? this.localFormValues.fields
          : [];

      if (arrFieldElements && arrFieldElements.length > 0) {
        const arrResults = arrFieldElements.filter(function (dataItem) {
          return dataItem.type.indexOf(filteredFieldType) !== -1;
        });
        this.arrFilteredByTypeFields = deepCloneObject(arrResults);
        this.selectedFieldTypeFilterOption = filteredFieldType;
        return;
      }
    }
    this.arrFilteredByTypeFields = null;
    this.selectedFieldTypeFilterOption = this.FILTER_ALL_FIELDS;
  };

  private openCustomizeWidgetModalHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();

    if (
      !this.localFormValues ||
      !this.localFormValues.fields ||
      this.localFormValues.fields.length <= 0
    ) {
      return;
    }

    const arrFields = this.localFormValues.fields;
    // const arrPrecedenceObjects = arrFields.filter((dataItem) => dataItem?.field_options?.precedence === '1');
    const arrPrecedenceObjects = this.customizeWidgetFields
      ? [...this.customizeWidgetFields]
      : [];

    let arrWidgetIds = [];
    if (arrPrecedenceObjects?.length > 1) {
      this.isWidgetValuesChanged = false;
      const intLength = arrPrecedenceObjects.length;
      for (let i1 = 0; i1 < intLength; i1++) {
        arrWidgetIds = [...arrWidgetIds, arrPrecedenceObjects[i1]];
      }
    } else {
      if (
        arrPrecedenceObjects &&
        arrPrecedenceObjects.length === 1 &&
        isPrimaryFieldType(arrPrecedenceObjects[0], this.productName)
      ) {
        arrWidgetIds = [...arrWidgetIds, arrPrecedenceObjects[0]];
      }

      const objMaxLimits = this.getEffectiveMaximumLimits();
      const intMaxWidgetFields = objMaxLimits?.widgets?.count || 0;
      const intFieldsLength = arrFields.length;
      for (let f1 = 0; f1 < intFieldsLength; f1++) {
        // Don't newly offer a type the host has excluded via
        // supportedFieldTypes as a widget candidate (mirrors the
        // field-editor/left-nav allowlist). Fields already saved as widget
        // fields via customizeWidgetFields (arrPrecedenceObjects, above)
        // are untouched - we only gate what gets freshly added here.
        const strWidgetFieldType = arrFields[f1]?.type;
        if (
          strWidgetFieldType !== 'PRIMARY' &&
          !this.isFieldTypeAllowed(strWidgetFieldType)
        ) {
          continue;
        }
        if (!arrWidgetIds.includes(arrFields[f1].id)) {
          arrWidgetIds = [...arrWidgetIds, arrFields[f1].id];
        }
        if (arrWidgetIds.length === intMaxWidgetFields) {
          break;
        }
      }
      this.isWidgetValuesChanged = true;
    }

    this.arrWidgetFields = [...arrWidgetIds];
    this.showCustomizeWidget = true;
    this.modalCustomizeWidget?.open();
  };

  private saveWidgetDetailsHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();

    if (this.isWidgetValuesChanged) {
      this.isSavingCustomizeWidget = true;
      this.fwSaveWidgetFields.emit([...this.arrWidgetFields]);
    }
  };

  private closeWidgetDetailsHandler = (event: CustomEvent = null) => {
    if (event) {
      event.stopImmediatePropagation();
      event.stopPropagation();
    }
    this.modalCustomizeWidget?.close();
    this.isWidgetValuesChanged = false;
    this.showCustomizeWidget = false;
    this.arrWidgetFields = null;
  };

  private widgetCheckHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    const boolChecked = event.detail.checked;

    if (this.arrWidgetFields) {
      // const strFieldName = event.detail.data.name;
      const strFieldID = event.detail.data.id;
      const objMaxLimits = this.getEffectiveMaximumLimits();
      const intMaxWidgetsCount = objMaxLimits?.widgets?.count || 0;

      if (boolChecked && this.arrWidgetFields.length < intMaxWidgetsCount) {
        this.isWidgetValuesChanged = true;
        this.arrWidgetFields = [...this.arrWidgetFields, strFieldID];
      } else if (this.arrWidgetFields.includes(strFieldID)) {
        this.isWidgetValuesChanged = true;
        const intIndex = this.arrWidgetFields.indexOf(strFieldID);
        this.arrWidgetFields = [
          ...this.arrWidgetFields.slice(0, intIndex),
          ...this.arrWidgetFields.slice(intIndex + 1),
        ];
      }
    }
  };

  private setEditDynamicSectionState(isEditingDynamicSection) {
    this.isEditingDynamicSection = isEditingDynamicSection;
  }

  private renderFieldTypesHeader(objProductPreset) {
    const strBaseClassName = 'form-builder';
    const objLabelsDb = objProductPreset.labels;

    const strProductHeader = hasCustomProperty(objLabelsDb, 'headerProduct')
      ? objLabelsDb.headerProduct
      : '';
    const strProductSubHeader = hasCustomProperty(
      objLabelsDb,
      'subHeaderProduct'
    )
      ? objLabelsDb.subHeaderProduct
      : '';

    const objSubHeaderLink = hasCustomProperty(
      objLabelsDb,
      'subHeaderProductLink'
    )
      ? objLabelsDb.subHeaderProductLink
      : null;
    const strSubHeaderLinkLabel = objSubHeaderLink
      ? i18nText(objSubHeaderLink.label)
      : '';
    const strSubHeaderLinkHref = objSubHeaderLink ? objSubHeaderLink.href : '';
    const boolShowSubHeaderLink =
      strSubHeaderLinkLabel && strSubHeaderLinkLabel !== '' ? true : false;

    const strFieldTypesHeader = hasCustomProperty(
      objLabelsDb,
      'fieldTypesHeader'
    )
      ? objLabelsDb.fieldTypesHeader
      : '';
    const strDragDrop = hasCustomProperty(objLabelsDb, 'dragDropFieldTypes')
      ? objLabelsDb.dragDropFieldTypes
      : '';

    const boolFieldsHeaderPresent =
      strFieldTypesHeader && strFieldTypesHeader !== '' ? true : false;
    const strDragClassName = boolFieldsHeaderPresent
      ? `${strBaseClassName}-left-panel-header-desc`
      : `${strBaseClassName}-left-panel-header-desc-wo-header`;

    return (
      <div class={`${strBaseClassName}-left-panel-header`}>
        {strProductHeader && strProductHeader !== '' && (
          <label class={`${strBaseClassName}-left-panel-product-header-label`}>
            {i18nText(strProductHeader)}
          </label>
        )}
        {strProductSubHeader && strProductSubHeader !== '' && (
          <span class={'form-builder-left-panel-sub-header-description'}>
            <label
              class={'form-builder-left-panel-sub-header-description-label'}
            >
              {i18nText(strProductSubHeader)}
            </label>
            {boolShowSubHeaderLink && (
              <a
                class={
                  'form-builder-left-panel-sub-header-description-link-anchor'
                }
                href={strSubHeaderLinkHref}
                target='_blank'
              >
                {strSubHeaderLinkLabel}
              </a>
            )}
          </span>
        )}
        {boolFieldsHeaderPresent && (
          <label class={`${strBaseClassName}-left-panel-header-label`}>
            {i18nText(strFieldTypesHeader)}
          </label>
        )}
        {strDragDrop && strDragDrop !== '' && (
          <label class={strDragClassName}>{i18nText(strDragDrop)}</label>
        )}
      </div>
    );
  }

  private renderDisableFieldCreateByRole(
    objProductPresetConfig,
    strBaseClassName
  ) {
    if (this.role === 'trial') {
      return (
        <div class={`${strBaseClassName}-left-panel-list-disabled-div`}>
          <fw-icon name='lock' size='30'></fw-icon>
          <label class={`${strBaseClassName}-left-panel-list-disabled-header`}>
            {i18nText(objProductPresetConfig?.freePlanFieldAddDisabledHeader)}
          </label>
          <label class={`${strBaseClassName}-left-panel-list-disabled-message`}>
            {i18nText(objProductPresetConfig?.freePlanFieldAddDisabledMessage)}
          </label>
          <fw-button
            color='primary'
            onFwClick={this.explorePlanHandler}
            class={`${strBaseClassName}-left-panel-list-disabled-button`}
          >
            {i18nText(objProductPresetConfig?.freePlanFieldAddDisabledButton)}
          </fw-button>
        </div>
      );
    }
  }

  private renderDisableFieldCreateByPermission(
    objProductPresetConfig,
    strBaseClassName
  ) {
    const boolCreationAllowed = hasPermission(
      this.role,
      this.permission,
      'CREATE'
    );
    if (!boolCreationAllowed && this.role !== 'trial') {
      return (
        <div class={`${strBaseClassName}-left-panel-list-disabled-div`}>
          <fw-icon name='lock' size='30'></fw-icon>
          <label class={`${strBaseClassName}-left-panel-list-disabled-header`}>
            {i18nText(
              objProductPresetConfig?.noCreatePermissionFieldAddDisabledHeader
            )}
          </label>
          <label class={`${strBaseClassName}-left-panel-list-disabled-message`}>
            {i18nText(
              objProductPresetConfig?.noCreatePermissionFieldAddDisabledMessage
            )}
          </label>
        </div>
      );
    }
  }

  private renderFieldTypeElement(
    key,
    presetFieldTypes,
    dbFieldConfig,
    intIndex
  ) {
    if (key === 'PRIMARY') {
      return null;
    }

    const dbFieldTypeData = dbFieldConfig?.fieldProps[key];
    const dataItem = presetFieldTypes[key];
    const strFieldType = dataItem.type;

    if (!this.isFieldTypeAllowed(strFieldType)) {
      return null;
    }

    let boolDisableFieldType = !this.enableFieldType;
    let strTooltipMessage = boolDisableFieldType
      ? this.getInterpolatedMaxLimitLabel('fields')
      : '';

    const objMaxLimits = this.getEffectiveMaximumLimits();
    if (
      !boolDisableFieldType &&
      hasCustomProperty(this.fieldTypesCount, strFieldType) &&
      this.fieldTypesCount[strFieldType] > 0 &&
      hasCustomProperty(objMaxLimits, strFieldType) &&
      this.fieldTypesCount[strFieldType] >= objMaxLimits[strFieldType].count
    ) {
      boolDisableFieldType = true;
      strTooltipMessage = boolDisableFieldType
        ? this.getInterpolatedMaxLimitLabel(strFieldType)
        : '';
    }

    const strDisplayLabel = hasCustomProperty(dbFieldTypeData, 'display_label')
      ? dbFieldTypeData.display_label
      : '';

    const strDescription = hasCustomProperty(dbFieldTypeData, 'description')
      ? i18nText(dbFieldTypeData.description)
      : '';
    const boolShowDescription =
      strDescription && strDescription !== '' ? true : false;

    const strHelpTooltip = hasCustomProperty(dbFieldTypeData, 'help')
      ? i18nText(dbFieldTypeData.help)
      : '';
    const boolShowHelpTooltip =
      strHelpTooltip && strHelpTooltip !== '' ? true : false;

    const objLink = hasCustomProperty(dbFieldTypeData, 'link')
      ? dbFieldTypeData.link
      : null;
    const strLinkLabel = objLink ? i18nText(objLink.label) : '';
    const strLinkHref = objLink ? objLink.href : '';
    const boolShowLink = strLinkLabel && strLinkLabel !== '' ? true : false;

    const boolShowBottomBorder = hasCustomProperty(
      dbFieldTypeData,
      'has_bottom_border'
    )
      ? dbFieldTypeData.has_bottom_border
      : false;

    return (
      <Fragment>
        <fw-field-type-menu-item
          index={intIndex}
          key={strFieldType}
          value={strFieldType}
          dataProvider={dataItem}
          tooltip={strTooltipMessage}
          disabled={boolDisableFieldType}
          label={strDisplayLabel}
          iconName={dataItem.icon.name}
          iconBackgroundColor={dataItem.icon.bg_color}
          theme={this.theme}
          onFwAddClick={this.addNewFieldTypeHandler}
        ></fw-field-type-menu-item>
        {boolShowDescription && (
          <span class={'field-type-menu-description'}>
            <label class={'field-type-menu-description-label'}>
              {strDescription}
            </label>
            {boolShowLink && (
              <a
                class={'field-type-menu-description-link-anchor'}
                href={strLinkHref}
                target='_blank'
              >
                {strLinkLabel}
              </a>
            )}
            {boolShowHelpTooltip && (
              <fw-tooltip
                placement='right'
                trigger='hover'
                content={strHelpTooltip}
              >
                <fw-icon
                  class={'field-type-menu-help-fw-icon'}
                  size={14}
                  name='help'
                  color='#12344d'
                />
              </fw-tooltip>
            )}
          </span>
        )}
        {boolShowBottomBorder && (
          <hr class={'field-type-menu-item-bottom-border'} />
        )}
      </Fragment>
    );
  }

  private renderSectionFields(
    dataItem,
    boolFieldEditingState,
    strEntityName,
    parentIndex
  ) {
    const boolEditAllowed = hasPermission(this.role, this.permission, 'EDIT');
    const boolDeleteAllowed = hasPermission(
      this.role,
      this.permission,
      'DELETE'
    );

    let modalConfirmDelete: any = null;

    const confirmDeleteSectionHandler = (objDetail) => {
      this.fwDeleteField.emit({ sectionDeletion: true, ...objDetail });
      modalConfirmDelete?.close();
    };

    const deleteSectionClickHandler = (event: CustomEvent) => {
      event.stopImmediatePropagation();
      event.stopPropagation();
      if (boolDeleteAllowed) {
        modalConfirmDelete?.open();
      }
    };

    return (
      <div>
        {dataItem.choices?.map((choice) => {
          const acceptFromSections = dataItem.choices
            .filter((c) => c.choice_options?.section_name) // Ensure section_name is defined
            .map((c) => `sectionIdentifier-${c.choice_options.section_name}`)
            .join(',');
          const sectionChoiceValue = choice?.value,
            sectionName = choice.choice_options?.section_name,
            isEmptySection =
              sectionName && !choice.dependent_ids?.field?.length;
          const fieldsContent = isEmptySection
            ? this.renderDragDropEmptyState(sectionName, boolFieldEditingState)
            : choice.dependent_ids?.field?.map((fieldId, index) => {
                const field = dataItem.fields.find(
                  (f) =>
                    (f.type === 'DEPENDENT_FIELD'
                      ? f?.fields[0]?.id
                        ? f?.fields[0]?.id
                        : f.id
                      : f.id) === fieldId
                );
                return field
                  ? this.renderFieldEditorElement(
                      field,
                      index,
                      boolFieldEditingState,
                      strEntityName,
                      sectionName,
                      parentIndex
                    )
                  : null;
              });
          const editSectionKey = `sectionEdit_${choice.id}`;
          this.isEditingDynamicSection =
            !!this.currentFieldIndex[editSectionKey];
          const choicesWithNoSectionCreated = getChoicesWithNoSectionCreated(
            dataItem.choices
          );
          choicesWithNoSectionCreated.push({
            text: choice.value,
            value: choice.value,
          });

          return (
            sectionName &&
            (this.isEditingDynamicSection ? (
              <fb-section-create
                index={parentIndex}
                isEditing={true}
                dataProvider={dataItem}
                onFwExpand={this.expandFieldHandler}
                onFwUpdate={this.saveFieldHandler}
                fieldChoices={choicesWithNoSectionCreated}
                selectedFieldValue={sectionChoiceValue}
                sectionName={sectionName}
                showCreateOrEditSectionPane={this.setEditDynamicSectionState}
              />
            ) : (
              <section key={choice.id} class={`fb-section`}>
                <header class={{ disabled: boolFieldEditingState }}>
                  <span class='fb-section-add'>
                    <span class='highlight'>
                      {TranslationController.t(
                        'formBuilder.sections.sectionHeadingName',
                        {
                          sectionName: sectionName,
                        }
                      )}
                    </span>
                    <span class='section-header-seperator'></span>
                    {TranslationController.t(
                      'formBuilder.sections.sectionHeadingLabel',
                      {
                        fieldLabel: dataItem?.label,
                      }
                    )}
                    <span class='highlight section-choice-label'>
                      {TranslationController.t(
                        'formBuilder.sections.sectionHeadingChoice',
                        {
                          sectionChoiceValue: sectionChoiceValue,
                        }
                      )}
                    </span>
                  </span>
                  <div class='section-edit-delete'>
                    <fw-tooltip
                      placement='bottom'
                      trigger='hover'
                      content={TranslationController.t(
                        'formBuilder.sections.editTooltipText'
                      )}
                    >
                      <fw-icon
                        name='edit'
                        class={{ disabled: !boolEditAllowed }}
                        size='16'
                        onClick={() => {
                          this.fwExpandField.emit({
                            expanded: true,
                            index: 'sectionEdit',
                            value: { id: `sectionEdit_${choice.id}` },
                          });
                        }}
                        color='#264966'
                      ></fw-icon>
                    </fw-tooltip>
                    <fw-tooltip
                      placement='bottom'
                      trigger='hover'
                      content={TranslationController.t(
                        'formBuilder.sections.deleteTooltipText'
                      )}
                    >
                      <fw-icon
                        name='delete'
                        class={{ disabled: !boolDeleteAllowed }}
                        size='16'
                        onClick={(e) => {
                          deleteSectionClickHandler(e);
                        }}
                        color='#264966'
                      ></fw-icon>
                    </fw-tooltip>
                  </div>
                </header>
                <div class='fb-section-content'>
                  <fw-drag-container
                    key={`field-drag-container-${this.fieldRerenderCount.toString()}`}
                    class={`form-builder-right-panel-field-editor-list`}
                    id={`sectionIdentifier-${sectionName}`}
                    acceptFrom={`fieldTypesList,fieldsContainer,${acceptFromSections}`}
                    addOnDrop={false}
                    sortable={true}
                    supportDependentAndMSDDInSections={
                      this.supportDependentAndMSDDInSections
                    }
                    onFwDrop={(e) =>
                      this.fieldTypeDropHandler(
                        e,
                        dataItem,
                        sectionName,
                        parentIndex
                      )
                    }
                    onFwDragEnter={(e) => this.onDragEnter(e, sectionName)}
                    onFwDragLeave={
                      this.hideErrorMessage // Hide error when drag leaves
                    }
                  >
                    {this.dragErrorMessages[sectionName] && (
                      <div class='error-message'>
                        <span>
                          <fw-icon
                            name='alert'
                            size='16'
                            slot='before-label'
                            color='#E43538'
                          ></fw-icon>
                          <span class='seperator'></span>
                          {this.dragErrorMessages[sectionName]}
                        </span>
                      </div>
                    )}
                    {fieldsContent}
                  </fw-drag-container>
                </div>
                <fw-modal
                  ref={(el) => (modalConfirmDelete = el)}
                  icon='delete'
                  submitColor='danger'
                  hasCloseIconButton={false}
                  titleText={i18nText('sections.deleteSection')}
                  submitText={i18nText('deleteFieldSubmit')}
                  onFwSubmit={() => {
                    confirmDeleteSectionHandler({
                      index: parentIndex,
                      id: choice.id,
                    });
                  }}
                >
                  <span class={'fb-section-delete-modal-content'}>
                    <fw-inline-message open type='warning'>
                      {i18nText('deleteFieldInlineMessage')}
                    </fw-inline-message>
                    {i18nText('sections.deleteSectionContent')}
                  </span>
                </fw-modal>
              </section>
            ))
          );
        })}
      </div>
    );
  }

  private renderDragDropEmptyState(sectionName, boolFieldEditingState) {
    return (
      <div
        class={{
          'empty-section': true,
          'disabled': boolFieldEditingState,
        }}
        id={sectionName}
      >
        {TranslationController.t('formBuilder.sections.emptySection')}
      </div>
    );
  }

  private renderFieldEditorElement(
    dataItem,
    intIndex,
    boolFieldEditingState,
    strEntityName,
    sectionName?,
    parentIndex?
  ) {
    if (!dataItem) {
      return null;
    }
    const strFieldType = dataItem.type;
    // PRIMARY is an implicit, non-addable field that every entity already
    // has - it should never be hidden by the addable-types allowlist, which
    // only governs what can be newly composed (mirrors the same carve-out
    // in renderFieldTypeElement's palette rendering).
    if (strFieldType !== 'PRIMARY' && !this.isFieldTypeAllowed(strFieldType)) {
      return null;
    }
    const objDefaultFieldTypeSchema =
      this.getDefaultFieldTypeSchema(strFieldType);
    if (!objDefaultFieldTypeSchema) {
      return null;
    }
    const isPrimaryField = isPrimaryFieldType(
      dataItem,
      this.productName,
      intIndex,
      !this.searching
    );

    const boolItemExpanded = sectionName
      ? this.currentFieldIndex[`${sectionName}-${dataItem.id}`] === intIndex
      : this.currentFieldIndex[dataItem.id] === intIndex;
    const strKey = `${dataItem.id}_${intIndex.toString()}`;

    return (
      <fb-field-drag-drop-item
        index={intIndex}
        keyProp={strKey}
        productName={this.productName}
        showRelationshipTypeSelect={this.showRelationshipTypeSelect}
        dataProvider={dataItem}
        entityName={strEntityName}
        expanded={boolItemExpanded}
        isPrimaryField={isPrimaryField}
        pinned={isPrimaryField ? 'top' : ''}
        disabled={boolFieldEditingState}
        disabledSort={this.searching}
        permission={this.permission}
        role={this.role}
        enableUnique={this.enableUnique}
        enableFilterable={this.enableFilterable}
        defaultFieldTypeSchema={objDefaultFieldTypeSchema}
        lookupTargetObjects={this.lookupTargetObjects}
        targetSelectProps={this.targetSelectProps}
        formValues={this.localFormValues}
        isLoading={this.isLoading}
        showDependentFieldResolveProp={this.showDependentFieldResolveProp}
        dependentFieldLink={this.dependentFieldLink}
        dynamicSectionsBetaEnabled={this.dynamicSectionsBetaEnabled}
        saveFieldHandler={this.saveFieldHandler}
        deleteFieldHandler={this.deleteFieldHandler}
        expandFieldHandler={this.expandFieldHandler}
        reorderFieldProgressHandler={this.reorderFieldProgressHandler}
        sectionName={sectionName}
        parentIndex={parentIndex}
        theme={this.theme}
      >
        <div slot='section'>
          {dataItem?.field_options?.has_sections &&
            this.renderSectionFields(
              dataItem,
              boolFieldEditingState,
              strEntityName,
              intIndex
            )}
        </div>
      </fb-field-drag-drop-item>
    );
  }

  private renderWidgetElement(dataItem, intIndex) {
    const strFieldType = dataItem?.type;
    // Same allowlist carve-out as renderFieldEditorElement: hide a field
    // whose type the host has excluded via supportedFieldTypes from the
    // customize-widget modal too, PRIMARY excepted since it's implicit.
    if (strFieldType !== 'PRIMARY' && !this.isFieldTypeAllowed(strFieldType)) {
      return null;
    }
    const objMaxLimits = this.getEffectiveMaximumLimits();
    const intMaxWidgetsCount = objMaxLimits?.widgets?.count || 0;

    const isPrimaryField = isPrimaryFieldType(
      dataItem,
      this.productName,
      intIndex
    );
    const boolItemSelected = !isPrimaryField
      ? this.arrWidgetFields?.includes(dataItem.id)
        ? true
        : false
      : true;
    const boolItemDisabled = isPrimaryField
      ? true
      : !boolItemSelected
      ? this.arrWidgetFields.length >= intMaxWidgetsCount
      : false;

    return (
      <fw-widget-customize-field-item
        index={intIndex}
        key={dataItem.id}
        label={dataItem.label}
        dataProvider={dataItem}
        isPrimaryField={isPrimaryField}
        pinned={isPrimaryField ? 'top' : ''}
        selected={boolItemSelected}
        disabled={boolItemDisabled}
        onFwCheck={this.widgetCheckHandler}
      ></fw-widget-customize-field-item>
    );
  }

  render() {
    const strBaseClassName = 'form-builder';
    const objFormValuesSchema = this.localFormValues;
    const objFieldTypes = presetSchema.fieldTypes;
    const objProductPreset = formMapper[this.productName];
    const objProductPresetConfig = objProductPreset?.config;
    const objLabelsDb = objProductPreset?.labels;
    const arrFieldOrder = [...(objProductPreset?.fieldOrder ?? [])].filter(
      (fieldType) => {
        if (!this.isFieldTypeAllowed(fieldType)) {
          return false;
        }
        if (fieldType === 'RELATIONSHIP' && !this.showLookupField) {
          return false;
        }
        if (fieldType === 'DEPENDENT_FIELD' && !this.showDependentField) {
          return false;
        }
        return true;
      }
    );
    const boolFieldEditingState = !!Object.keys(this.currentFieldIndex).length;
    const strEntityName = objFormValuesSchema ? objFormValuesSchema.name : '';
    const strFieldEditHeader = hasCustomProperty(objLabelsDb, 'fieldsHeader')
      ? objLabelsDb.fieldsHeader
      : '';

    const fieldTypeElements =
      arrFieldOrder && arrFieldOrder.length > 0
        ? arrFieldOrder.map((key, index) =>
            this.renderFieldTypeElement(
              key,
              objFieldTypes,
              objProductPreset,
              index
            )
          )
        : null;

    const boolFilterApplied =
      this.selectedFieldTypeFilterOption &&
      this.selectedFieldTypeFilterOption !== '' &&
      this.selectedFieldTypeFilterOption !== this.FILTER_ALL_FIELDS
        ? true
        : false;

    const arrFieldElements = boolFilterApplied
      ? this.arrFilteredByTypeFields
      : this.searching
      ? this.arrSearchedFields
      : objFormValuesSchema && objFormValuesSchema.fields
      ? objFormValuesSchema.fields
      : [];

    const fieldElements =
      arrFieldElements && arrFieldElements.length > 0
        ? arrFieldElements.map((dataItem, index) =>
            this.renderFieldEditorElement(
              dataItem,
              index,
              boolFieldEditingState,
              strEntityName
            )
          )
        : null;

    // fieldElements entries are null wherever isFieldTypeAllowed() excluded
    // the field (see renderFieldEditorElement), so they contribute no DOM
    // node under fw-drag-container. Use the actually-rendered count (not
    // the raw array length) to decide whether to show the "no results"
    // empty state, and rebuild the visible-ordinal -> real index map
    // consumed by resolveDroppedIndex() in fieldTypeDropHandler.
    const arrRenderedFieldElements = fieldElements
      ? fieldElements.filter((element) => element != null)
      : [];
    this.visibleFieldIndexMap = buildVisibleFieldIndexMap(
      arrFieldElements,
      (fieldType) => this.isFieldTypeAllowed(fieldType)
    );

    const boolShowEmptySearchResults =
      (this.searching && arrRenderedFieldElements.length === 0) ||
      (boolFilterApplied && arrRenderedFieldElements.length === 0);
    const boolHasCustomizeWidgetOption =
      objProductPresetConfig?.customizeWidget || false;
    const fieldWidgetElements =
      this.showCustomizeWidget &&
      arrFieldElements &&
      arrFieldElements.length > 0
        ? arrFieldElements.map((dataItem, index) =>
            this.renderWidgetElement(dataItem, index)
          )
        : null;

    const boolHasFilterByFieldTypes =
      objProductPresetConfig?.filterByType || false;
    if (
      !this.filterByFieldTypeOptions &&
      arrFieldOrder &&
      arrFieldOrder.length > 0
    ) {
      const dbFieldProps = objProductPreset?.fieldProps;
      const intFieldTypesLength = arrFieldOrder.length;

      this.filterByFieldTypeOptions = [
        {
          text: i18nText('filterOptionAllFields'),
          value: this.FILTER_ALL_FIELDS,
        },
      ];

      for (let f1 = 0; f1 < intFieldTypesLength; f1++) {
        this.filterByFieldTypeOptions.push({
          text: i18nText(dbFieldProps[arrFieldOrder[f1]].display_label),
          value: arrFieldOrder[f1],
        });
      }
    }

    const strRightPanelBaseClassName = `${strBaseClassName}-right-panel`;
    const strLeftPanelBaseClassName = `${strBaseClassName}-left-panel`;

    let strRightPanelHeaderClassName = `${strRightPanelBaseClassName}-header`;
    let strLeftPanelClassName = strLeftPanelBaseClassName;
    if (boolFieldEditingState || this.searching) {
      strLeftPanelClassName += ` ${strLeftPanelBaseClassName}--disabled`;
    }
    if (boolFieldEditingState) {
      strRightPanelHeaderClassName += ` ${strRightPanelBaseClassName}-header--disabled`;
    }

    return (
      <Host tabIndex='-1'>
        <div class={strBaseClassName}>
          <div class={strLeftPanelClassName}>
            {this.renderFieldTypesHeader(objProductPreset)}
            <div class={`${strBaseClassName}-left-panel-list-container`}>
              <fw-drag-container
                class={`${strBaseClassName}-left-panel-field-types-list`}
                id='fieldTypesList'
                addOnDrop={false}
                sortable={false}
              >
                {fieldTypeElements}
              </fw-drag-container>
              {this.renderDisableFieldCreateByRole(
                objProductPresetConfig,
                strBaseClassName
              )}
              {this.renderDisableFieldCreateByPermission(
                objProductPresetConfig,
                strBaseClassName
              )}
            </div>
          </div>
          <div class={strRightPanelBaseClassName}>
            <div class={strRightPanelHeaderClassName}>
              <div class={`${strBaseClassName}-right-panel-header-content`}>
                {!boolHasFilterByFieldTypes && (
                  <label class={`${strBaseClassName}-right-panel-header-label`}>
                    {i18nText(strFieldEditHeader)}
                  </label>
                )}
                {boolHasFilterByFieldTypes && (
                  <div
                    class={`${strBaseClassName}-right-panel-header-right-filter-by-div`}
                  >
                    <label
                      class={`${strBaseClassName}-right-panel-header-filter-label`}
                    >
                      {i18nText('filterFields')}
                    </label>
                    <fw-select
                      class={`${strBaseClassName}-filter-by-field-type-select`}
                      options={this.filterByFieldTypeOptions}
                      value={this.selectedFieldTypeFilterOption}
                      onFwChange={this.fieldTypeFilterChangeHandler}
                    ></fw-select>
                  </div>
                )}
                <div class={`${strBaseClassName}-right-panel-header-right-div`}>
                  {boolHasCustomizeWidgetOption && (
                    <fw-button
                      id='customizeWidgetFieldsBtn'
                      color='link'
                      disabled={this.searching}
                      onFwClick={this.openCustomizeWidgetModalHandler}
                    >
                      <fw-icon name='modify' slot='before-label'></fw-icon>
                      {i18nText('customizeWidget')}
                    </fw-button>
                  )}
                  <fw-input
                    clear-input
                    icon-left='search'
                    placeholder={i18nText('searchFields')}
                    onFwInput={this.debouncedHandleInput}
                    onFwInputClear={this.clearSearchHandler}
                    class={`${strBaseClassName}-right-panel-header-search-input`}
                  ></fw-input>
                </div>
              </div>
            </div>
            <div
              ref={(el) => (this.fieldEditorPanel = el)}
              class={`${strBaseClassName}-right-panel-list-container`}
            >
              {!boolShowEmptySearchResults && (
                <fw-drag-container
                  key={`field-drag-container-${this.fieldRerenderCount.toString()}`}
                  class={`${strBaseClassName}-right-panel-field-editor-list`}
                  id='fieldsContainer'
                  acceptFrom='fieldTypesList,sectionIdentifier-'
                  addOnDrop={false}
                  sortable={true}
                  onFwDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    this.fieldTypeDropHandler(e);
                  }}
                >
                  {fieldElements}
                </fw-drag-container>
              )}
              {boolShowEmptySearchResults && (
                <div class={`${strBaseClassName}-right-panel-empty-list-div`}>
                  <div
                    class={`${strBaseClassName}-right-panel-empty-list-content`}
                  >
                    <span
                      class={`${strBaseClassName}-right-panel-empty-list-image-span`}
                    >
                      <img
                        alt=''
                        src={this.emptySearchImage}
                        class={`${strBaseClassName}-right-panel-empty-list-image`}
                      />
                    </span>
                    <label
                      class={`${strBaseClassName}-right-panel-empty-search-message`}
                    >
                      {i18nText('noSearchItemsFound')}
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <fw-modal
          ref={(el) => (this.modalCustomizeWidget = el)}
          size='small'
          hasCloseIconButton={false}
        >
          <fw-modal-title>
            <span class='cusomize-widget-header'>
              <span class='cusomize-widget-title'>
                {i18nText('customizeWidgetModalHeader')}
              </span>
              <span class='cusomize-widget-description'>
                {i18nText('customizeWidgetModalHint')}
              </span>
            </span>
          </fw-modal-title>
          <fw-modal-content>
            {this.showCustomizeWidget && (
              <fw-drag-container
                class='cusomize-widget-list'
                id='customizeWidgetList'
                addOnDrop={false}
                sortable={false}
              >
                {fieldWidgetElements}
              </fw-drag-container>
            )}
          </fw-modal-content>
          <fw-modal-footer>
            <span class='cusomize-widget-modal-footer'>
              <fw-button
                color='secondary'
                onFwClick={this.closeWidgetDetailsHandler}
              >
                {i18nText('customizeWidgetModalCancelBtn')}
              </fw-button>
              <fw-button
                loading={this.isSavingCustomizeWidget}
                onFwClick={this.saveWidgetDetailsHandler}
              >
                {i18nText('customizeWidgetModalSaveBtn')}
              </fw-button>
            </span>
          </fw-modal-footer>
        </fw-modal>
      </Host>
    );
  }
}
