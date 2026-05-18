import {
  Component,
  h,
  Listen,
  Prop,
  State,
  Watch,
  Event,
  EventEmitter,
} from '@stencil/core';

/**
 * Custom Objects fork of `fw-nested-node` — lives alongside `fw-co-nested-select`;
 * styles come from `co-nested-select.scss` (scoped per tag by Stencil).
 */
@Component({
  tag: 'fw-co-nested-node',
  styleUrl: 'co-nested-select.scss',
  shadow: true,
})
export class CoNestedNode {
  @State() selectedOption = null;

  @Prop() options = [];
  @Prop() level = 0;
  @Prop() name = '';
  @Prop() value = '';
  @Prop() label = '';
  /**
   * When set (host passes the id of the external field label), the root `fw-select`
   * uses `labelledBy` and omits its own `label` text to avoid duplicate visible labels.
   */
  @Prop() rootLabelledBy = '';
  @Prop() placeholder?: string | null;
  @Prop() optionValuePath = 'id';
  @Prop() optionLabelPath = 'value';
  @Prop() required = false;
  @Prop() state: 'normal' | 'warning' | 'error' = 'normal';
  @Prop() hintText = '';
  @Prop() warningText = '';
  @Prop() errorText = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mirrors core nested-node
  @Prop() selectProps?: any;

  @Event() fwPropertyChange: EventEmitter;

  @Watch('options')
  optionsChanged() {
    this.selectedOption = null;
  }

  @Listen('fwChange')
  changed(event) {
    if (!event.detail.level) {
      event.detail.level = this.level;
      if (event.detail.meta.selectedOptions[0]?.choices) {
        this.selectedOption = event.detail.meta.selectedOptions[0];
      } else {
        this.selectedOption = null;
      }
    }
  }

  componentWillLoad(): void {
    if (this.value && Array.isArray(this.options)) {
      this.selectedOption = this.options.find(
        (item) => item[this.optionValuePath] === this.value
      );

      if (this.selectedOption) {
        this.fwPropertyChange.emit({
          level: this.level,
          selectedOption: this.selectedOption,
          name: this.name,
          value: this.selectProps(this.selectedOption?.name),
        });
      }
    }
  }

  private getFirstlevelNestedSelect() {
    if (!this.selectedOption?.choices?.length) {
      return null;
    }

    const { value } = this.selectProps(this.selectedOption.name);
    return (
      <div class='nest_indent'>
        <fw-co-nested-node
          options={this.selectedOption.choices}
          name={this.selectedOption.name}
          label={this.selectedOption.label}
          placeholder={this.placeholder}
          value={value}
          level={this.level + 1}
          optionValuePath={this.optionValuePath}
          optionLabelPath={this.optionLabelPath}
          selectProps={this.selectProps}
          state={this.state}
          hintText={this.hintText}
          warningText={this.warningText}
          errorText={this.errorText}
          required={this.required}
        ></fw-co-nested-node>
      </div>
    );
  }

  private getNestedSelect() {
    if (!this.selectedOption?.choices?.length) {
      return null;
    }

    const { value } = this.selectProps(this.selectedOption.name);
    return (
      <fw-co-nested-node
        options={this.selectedOption.choices}
        name={this.selectedOption.name}
        label={this.selectedOption.label}
        placeholder={this.placeholder}
        value={value}
        level={this.level + 1}
        optionValuePath={this.optionValuePath}
        optionLabelPath={this.optionLabelPath}
        selectProps={this.selectProps}
        state={this.state}
        hintText={this.hintText}
        warningText={this.warningText}
        errorText={this.errorText}
        required={this.required}
      ></fw-co-nested-node>
    );
  }

  render() {
    const useExternalFieldLabel =
      this.level === 0 && !!this.rootLabelledBy?.trim();
    const selectLabel = useExternalFieldLabel ? '' : this.label;
    const selectLabelledBy = useExternalFieldLabel
      ? this.rootLabelledBy
      : undefined;

    return (
      <div class='nest'>
        <fw-select
          label={selectLabel}
          labelledBy={selectLabelledBy}
          placeholder={this.placeholder}
          options={this.options}
          name={this.name}
          value={this.value}
          optionValuePath={this.optionValuePath}
          optionLabelPath={this.optionLabelPath}
          state={this.state}
          hintText={this.hintText}
          warningText={this.warningText}
          errorText={this.errorText}
          required={this.required}
        ></fw-select>
        {this.level === 0
          ? this.getFirstlevelNestedSelect()
          : this.getNestedSelect()}
      </div>
    );
  }
}
