import {
  Component,
  Element,
  Prop,
  h,
  Host,
  EventEmitter,
  Event,
  State,
  Watch,
} from '@stencil/core';
import {
  deepCloneObject,
  hasCustomProperty,
  i18nText,
  isUniqueField,
} from '../utils/form-builder-utils';
import presetSchema from '../assets/form-builder-preset.json';

@Component({
  tag: 'fw-fb-field-lookup',
  styleUrl: 'fb-field-lookup.scss',
  shadow: true,
})
export class FbFieldDropdown {
  @Element() host!: HTMLElement;
  private i18RelationshipType;
  private targetObjectLabel = '';
  private isNativeTargetObject = false;

  /**
   * The db type used to determine the json to be used for CUSTOM_OBJECTS or CONVERSATION_PROPERTIES
   */
  @Prop() productName = 'CUSTOM_OBJECTS';
  /**
   * variable to store form values
   */
  @Prop({ mutable: true }) formValues = null;
  /**
   * source object value
   */
  @Prop({ mutable: true }) sourceObjectName = '';
  /**
   * flag to show relationshipTypeSelect dropdown or not
   */
  @Prop({ mutable: true }) showRelationshipTypeSelect = true;
  /**
   * array for target objects
   */
  @Prop({ mutable: true }) targetObjects = null;
  /**
   * variable to store the data  for all the choices
   */
  @Prop({ mutable: true }) dataResponse = null;
  /**
   * property to show the errors on click of the save/add button from the parent
   */
  @Prop({ mutable: true }) showErrors = false;
  /**
   * Additional props (e.g. search, debounceTimer, optionLabelPath) passed through to the target object
   * fw-select, so a consumer can opt in to server-backed/async search for the target picker. Defaults to
   * an empty object, so existing consumers who don't set this see no behavior change.
   */
  @Prop({ mutable: true }) targetSelectProps = {};
  /**
   * Disables all the options which can't be edited, reordered or deleted if set to true.
   */
  @Prop() disabled = false;
  /**
   * variable to store the selected relationship type
   */
  @State() selectedRelationshipValue = '';
  /**
   * variable to store the selected target object
   */
  @State() selectedTargetValue = '';
  /**
   * Triggered on data change for error handling on parent
   */
  @Event() fwChange!: EventEmitter;

  @Watch('formValues')
  watchValuesChangeHandler(): void {
    const arrRelationshipTypes = presetSchema.relationshipTypes;
    let relationshipValue = '';

    if (this.formValues && !this.isNewField()) {
      const relTargetId = hasCustomProperty(
        this.formValues,
        'related_entity_id'
      )
        ? this.formValues.related_entity_id
        : '';

      this.updateIsNativeObject(relTargetId);
      this.dataResponse.target = relTargetId;
      this.selectedTargetValue = relTargetId;

      const boolOneToOne = isUniqueField(this.formValues);
      const intLength = arrRelationshipTypes.length;

      for (let i1 = 0; i1 < intLength; i1++) {
        const strRelationshipTypeValue = arrRelationshipTypes[i1].value;
        if (boolOneToOne && strRelationshipTypeValue === 'one_to_one') {
          relationshipValue = strRelationshipTypeValue;
          break;
        } else if (strRelationshipTypeValue !== 'one_to_one') {
          relationshipValue = strRelationshipTypeValue;
        }
      }
      this.dataResponse.relationship = relationshipValue;
      this.selectedRelationshipValue = relationshipValue;
    } else if (this.formValues && arrRelationshipTypes) {
      relationshipValue = arrRelationshipTypes[0]?.value;
      this.dataResponse.relationship = relationshipValue;
      this.selectedRelationshipValue = relationshipValue;
    }
  }

  componentWillLoad(): void {
    if (!this.dataResponse) {
      this.dataResponse = { relationship: '', target: '' };
    }
    if (!this.i18RelationshipType) {
      this.i18RelationshipType = [];
      const arrRelationshipTypes = presetSchema.relationshipTypes;
      const intLength = arrRelationshipTypes.length;
      for (let i1 = 0; i1 < intLength; i1++) {
        this.i18RelationshipType = [
          ...this.i18RelationshipType,
          {
            ...arrRelationshipTypes[i1],
            text: i18nText(arrRelationshipTypes[i1].text),
            subText: i18nText(arrRelationshipTypes[i1].subText),
          },
        ];
      }
    }
    this.watchValuesChangeHandler();
  }

  private isNewField = () => {
    if (
      hasCustomProperty(this.formValues, 'isNew') &&
      this.formValues['isNew'] === true
    ) {
      return true;
    }
    return false;
  };

  private updateIsNativeObject = (objectId) => {
    if (this.targetObjects && objectId) {
      const objSelectedTargetEntity = this.targetObjects.filter(
        (el) => el.value === objectId
      )?.[0];
      this.targetObjectLabel = objSelectedTargetEntity?.text || '';
      this.isNativeTargetObject = objSelectedTargetEntity?.isNative || false;
    }
  };

  private relationshipChangeHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.dataResponse.relationship = event.detail.value;
    this.selectedRelationshipValue = event.detail.value;
    this.fwChange.emit({ value: deepCloneObject(this.dataResponse) });
  };

  private targetObjectChangeHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.updateIsNativeObject(event.detail.value);
    this.dataResponse.target = event.detail.value;
    this.selectedTargetValue = event.detail.value;
    this.fwChange.emit({ value: deepCloneObject(this.dataResponse) });
  };

  render() {
    const strBaseClassName = 'fb-field-lookup';
    const boolNewField = this.isNewField();
    const strTargetState =
      this.showErrors && !this.selectedTargetValue ? 'error' : 'normal';
    const strRelationshipState =
      this.showErrors && !this.selectedRelationshipValue ? 'error' : 'normal';

    let strDescription = '';
    if (
      this.selectedRelationshipValue &&
      this.selectedRelationshipValue !== '' &&
      this.targetObjectLabel &&
      this.targetObjectLabel !== ''
    ) {
      const objRelationshipDesc =
        presetSchema.relationshipDescriptionKeys[
          this.selectedRelationshipValue
        ];
      if (objRelationshipDesc) {
        const strDescKey = this.isNativeTargetObject
          ? objRelationshipDesc.native
          : objRelationshipDesc.co;

        strDescription = i18nText(strDescKey, {
          source: this.sourceObjectName,
          target: this.targetObjectLabel,
        });
      }
    }
    const boolShowDescription =
      strDescription && strDescription !== '' ? true : false;

    return (
      <Host tabIndex='-1'>
        <div class={`${strBaseClassName}-root`}>
          <label class={`${strBaseClassName}-header-label`}>
            {i18nText('lookupAssociationHeader')}
          </label>
          <div class={strBaseClassName}>
            <fw-input
              class={`${strBaseClassName}-input`}
              label={i18nText('lookupSourceObject')}
              value={this.sourceObjectName}
              disabled
            ></fw-input>
            {this.showRelationshipTypeSelect ? (
              <div class={`${strBaseClassName}-relationship-select-container`}>
                <fw-select
                  readonly={true}
                  required={true}
                  state={strRelationshipState}
                  class={`${strBaseClassName}-relationship-select`}
                  placeholder={i18nText('lookupRelationshipPlaceholder')}
                  label={i18nText('lookupRelationshipLabel')}
                  errorText={i18nText('errors.emptyRelationshipType')}
                  disabled={!boolNewField || this.disabled}
                  options={this.i18RelationshipType}
                  value={this.selectedRelationshipValue}
                  onFwChange={this.relationshipChangeHandler}
                ></fw-select>
              </div>
            ) : (
              <div></div>
            )}
            <div class={`${strBaseClassName}-target-select-container`}>
              <fw-select
                {...this.targetSelectProps}
                required={true}
                state={strTargetState}
                class={`${strBaseClassName}-target-select`}
                placeholder={i18nText('lookupTargetPlaceholder')}
                label={i18nText('lookupTargetLabel')}
                errorText={i18nText('errors.emptyTargetObject')}
                disabled={!boolNewField || this.disabled}
                value={this.selectedTargetValue}
                options={this.targetObjects}
                onFwChange={this.targetObjectChangeHandler}
              ></fw-select>
            </div>
          </div>
          {boolShowDescription && (
            <span
              class={`${strBaseClassName}-relationship-description`}
              innerHTML={strDescription}
            ></span>
          )}
        </div>
      </Host>
    );
  }
}
