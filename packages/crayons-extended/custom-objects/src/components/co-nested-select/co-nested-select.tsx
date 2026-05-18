import {
  Component,
  Prop,
  h,
  Host,
  Event,
  EventEmitter,
  Listen,
} from '@stencil/core';

/**
 * Custom Objects nested dependent field: forked tree (`fw-co-nested-node`) plus
 * panel layout when `label` is set (`field_options.dependent_select_tag` with `fw-form` /
 * `fw-form-control`). Selection / emit logic matches core `fw-nested-select`.
 */
@Component({
  tag: 'fw-co-nested-select',
  styleUrl: 'co-nested-select.scss',
  shadow: true,
})
export class CoNestedSelect {
  private selections = [];
  private selectedItems = {};

  @Prop() options = [];
  @Prop() name = '';
  @Prop() label = '';
  @Prop() value = '';
  @Prop() placeholder?: string | null;
  @Prop() optionValuePath = 'id';
  @Prop() optionLabelPath = 'value';
  @Prop() required = false;
  @Prop() state: 'normal' | 'warning' | 'error' = 'normal';
  @Prop() hintText = '';
  @Prop() warningText = '';
  @Prop() errorText = '';
  /** Initial values helper from `fw-form` / `controlProps.selectProps`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mirrors `fw-nested-select`
  @Prop() selectProps?: any;

  @Event() fwChange: EventEmitter;

  @Listen('fwChange')
  changed(event) {
    const { meta, level, name } = event.detail;

    if (!meta) {
      return;
    }

    this.selections[level] = meta.selectedOptions[0];
    this.selectedItems[name] = level;

    const itemsToRemove = this.selections.length - (level + 1);
    if (itemsToRemove > 0) {
      this.selections = this.selections.slice(0, level + 1);
    }

    this.triggerValueChange(name);
  }

  @Listen('fwPropertyChange')
  updateSelections(event) {
    const { selectedOption, level, name } = event.detail;
    this.selections[level] = selectedOption;
    this.selectedItems[name] = level;
  }

  /** Stable id for `aria-labelledby` on the root `fw-select` when `label` is set. */
  private get rootFieldLabelDomId(): string {
    return `fw-co-nested-select-label-${this.name || 'field'}`;
  }

  private triggerValueChange(nameToExclude) {
    const keys = Object.keys(this.selectedItems);

    keys.forEach((key) => {
      if (nameToExclude !== key) {
        const level = this.selectedItems[key];
        const value = this?.selections[level]?.[this.optionValuePath] || '';

        this.fwChange.emit({
          name: key,
          value,
        });
      }
    });
  }

  render(): Element {
    const hasFieldLabel = !!this.label?.trim();
    const rootLabelledBy = hasFieldLabel ? this.rootFieldLabelDomId : '';

    return (
      <Host>
        <div class='field-control'>
          {hasFieldLabel ? (
            <label
              id={this.rootFieldLabelDomId}
              class={{
                'field-control-label': true,
                'required': this.required,
              }}
            >
              {this.label}
            </label>
          ) : null}
          <div class='field-control-panel'>
            <fw-co-nested-node
              options={this.options}
              name={this.name}
              value={this.value}
              label={this.label}
              rootLabelledBy={rootLabelledBy}
              placeholder={this.placeholder}
              optionValuePath={this.optionValuePath}
              optionLabelPath={this.optionLabelPath}
              selectProps={this.selectProps}
              state={this.state}
              hintText={this.hintText}
              warningText={this.warningText}
              errorText={this.errorText}
              required={this.required}
            />
          </div>
        </div>
      </Host>
    );
  }
}
