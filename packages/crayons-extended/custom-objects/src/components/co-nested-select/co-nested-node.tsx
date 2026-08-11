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
import type {
  CoNestedFwSelectRef,
  CoNestedSelectPropsFn,
} from './co-nested-select-types';

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
  // Captured once when a child level is first revealed, rather than recomputed from `selectProps` on
  // every render - since all levels share the same field name, `selectProps` always reflects the field's
  // latest (possibly deeper-level) value, and re-deriving it here on every render would keep re-feeding
  // that value into an already-mounted child level, resetting whatever it had selected.
  private childSeedValue = '';
  private selectRef?: CoNestedFwSelectRef;

  @Prop() options = [];
  @Prop() level = 0;
  @Prop() name = '';
  @Prop() value = '';
  /** Root-to-leaf display value at every cascade depth, see `fw-co-nested-select`. */
  @Prop() valuePath?: string[];
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
  @Prop() selectProps?: CoNestedSelectPropsFn;

  @Event() fwPropertyChange: EventEmitter;

  @Watch('options')
  optionsChanged() {
    this.selectedOption = null;
    this.selectRef?.setSelectedValues('');
  }

  @Listen('fwChange')
  changed(event) {
    if (!event.detail.level) {
      event.detail.level = this.level;
      // A fresh, user-driven selection at this level always reveals its child blank - any value the
      // field currently holds belongs to a different (deeper) level, not this newly revealed one.
      this.childSeedValue = '';
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
        this.childSeedValue = this.valuePath?.[this.level + 1] ?? '';
        this.fwPropertyChange.emit({
          level: this.level,
          selectedOption: this.selectedOption,
          name: this.name,
          value: this.selectProps?.(this.selectedOption?.name),
        });
      }
    }
  }

  private getNestedSelect() {
    if (!this.selectedOption?.choices?.length) {
      return null;
    }

    // Every level shares the outer field's own name (not the per-level metadata name stamped by the
    // lookup choice tree), so each level's fwChange bubbles up under a name fw-form actually knows
    // about instead of polluting its values map with a key with no matching schema field.
    const nestedNode = (
      <fw-co-nested-node
        options={this.selectedOption.choices}
        name={this.name}
        label={this.selectedOption.label}
        placeholder={this.placeholder}
        value={this.childSeedValue}
        valuePath={this.valuePath}
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

    // The first level gets an extra indent wrapper; deeper levels nest without it.
    return this.level === 0 ? (
      <div class='nest_indent'>{nestedNode}</div>
    ) : (
      nestedNode
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
          ref={(select) => {
            this.selectRef = select as CoNestedFwSelectRef | undefined;
          }}
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
        {this.getNestedSelect()}
      </div>
    );
  }
}
