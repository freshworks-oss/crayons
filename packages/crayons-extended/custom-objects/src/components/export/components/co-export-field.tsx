import {
  Component,
  Prop,
  h,
  Element,
  Event,
  EventEmitter,
  State,
} from '@stencil/core';

@Component({
  tag: 'fw-co-export-field',
  styleUrl: 'co-export-field.scss',
  shadow: true,
})
export class CoExportField {
  @Element() host!: HTMLElement;

  private spanLabel: HTMLElement;

  private resizeObserver;

  @State() addTooltip = false;

  /**
   * The value to populate the details of the checkbox field
   */
  @Prop({ mutable: true }) value = null;
  /**
   * Triggered whenever the export button is selected
   */
  @Event() fwChange: EventEmitter;

  componentDidRender = () => {
    const elLabel = this.spanLabel;
    if (elLabel && !this.resizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        if (elLabel.offsetWidth > 0) {
          this.addTooltip =
            elLabel.offsetWidth < elLabel.scrollWidth ? true : false;
        }
      });
      this.resizeObserver.observe(elLabel);
    }
  };

  disconnectedCallback(): void {
    this.removeResizeObserver();
  }

  private removeResizeObserver = () => {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  };

  private fieldSelectionChangeHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    if (this.value) {
      this.fwChange.emit({
        checked: event.detail.meta.checked,
        value: this.value.id,
      });
    }
  };

  private renderLabel() {
    const strBaseClassName = 'fw-co-export-field';
    return (
      <span
        ref={(el) => (this.spanLabel = el)}
        class={`${strBaseClassName}-fw-checkbox-label`}
      >
        {this.value.label}
      </span>
    );
  }

  render() {
    if (!this.value) {
      return null;
    }
    const objField = this.value;
    const strBaseClassName = 'fw-co-export-field';
    const boolDisabled =
      Object.prototype.hasOwnProperty.call(objField, 'disabled') &&
      objField.disabled
        ? true
        : false;
    const boolSelected =
      Object.prototype.hasOwnProperty.call(objField, 'selected') &&
      objField.selected;
    const strInfo =
      (Object.prototype.hasOwnProperty.call(objField, 'info') &&
        objField.info) ||
      '';
    const boolShowInfo = strInfo && strInfo !== '' ? true : false;

    let strCheckboxClassName = `${strBaseClassName}-fw-checkbox`;
    if (boolShowInfo) {
      strCheckboxClassName += ` ${strBaseClassName}-fw-checkbox-with-info`;
    }
    const strCheckboxKey = `${objField.id}_${this.addTooltip}`;

    return (
      <div class={`${strBaseClassName}-checkbox-container`}>
        <fw-checkbox
          class={strCheckboxClassName}
          disabled={boolDisabled}
          checked={boolSelected}
          key={strCheckboxKey}
          onFwChange={this.fieldSelectionChangeHandler}
        >
          {this.addTooltip && (
            <fw-tooltip trigger='hover' content={objField.label} hoist>
              {this.renderLabel()}
            </fw-tooltip>
          )}
          {!this.addTooltip && this.renderLabel()}
        </fw-checkbox>
        {boolShowInfo && (
          <fw-tooltip trigger='hover' content={strInfo} hoist>
            <fw-icon
              class={`${strBaseClassName}-fw-icon`}
              size={12}
              name='info'
              color='#264966'
            />
          </fw-tooltip>
        )}
      </div>
    );
  }
}
