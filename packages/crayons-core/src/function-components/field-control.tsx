import { h, FunctionalComponent } from '@stencil/core';
import { PopoverPlacementType } from '../utils/types';

export interface FieldControlProps {
  /** The input id, used to map the input to the label */
  inputId: string;

  /** The label id, used to map the label to the input */
  labelId?: string;

  /** The label text (if the label slot isn't used) */
  label?: string;

  /** Whether or not a label slot has been provided. */
  hasLabelSlot?: boolean;

  /** The hint text id, used to map the input to the hint text */
  hintTextId?: string;

  /** The hint text (if the hint-text slot isn't used) */
  hintText?: string;

  /** Whether or not a hint text slot has been provided. */
  hasHintTextSlot?: boolean;

  /** The error text id, used to map the input to the error text */
  errorTextId?: string;

  /** The error text (if the error-text slot isn't used) */
  errorText?: string;

  /** Whether or not a error text slot has been provided. */
  hasErrorTextSlot?: boolean;

  /** The warning text id, used to map the input to the warning text */
  warningTextId?: string;

  /** The warning text (if the warning-text slot isn't used) */
  warningText?: string;

  /** Whether or not a warning text slot has been provided. */
  hasWarningTextSlot?: boolean;

  /** The optional tooltip's header. */
  tooltipHeader?: string;

  /** The optional tooltip's content to show on hover of the input field. */
  tooltipContent?: string;

  /** The tooltip placement type for the optional tooltip. */
  tooltipPlacement?: PopoverPlacementType;

  /** Whether or not the error text should be shown instead of the help text */
  state?: 'normal' | 'warning' | 'error';

  /** Whether or not to display a required indicator should be shown (asterisk) */
  required?: boolean;
}

const FieldControl: FunctionalComponent<FieldControlProps> = (
  props,
  children
) => {
  const hasLabel = !!props.label;
  const hasHintText = props.hintText ? true : props.hasHintTextSlot;
  const hasErrorText = props.errorText ? true : props.hasErrorTextSlot;
  const hasWarningText = props.warningText ? true : props.hasWarningTextSlot;
  const hasTooltip = !!props.tooltipContent;

  const showHintText = props.state === 'normal' ? true : false;
  const showErrorText = props.state === 'error' ? true : false;
  const showWarningText = props.state === 'warning' ? true : false;

  return (
    <div
      class={{
        'field-control': true,
      }}
    >
      {hasLabel && (
        <label
          id={props.labelId}
          class={{ 'field-control-label': true, 'required': props.required }}
          htmlFor={props.inputId}
          aria-hidden={hasLabel ? 'false' : 'true'}
        >
          {props.label}
        </label>
      )}

      {hasTooltip ? (
        <fw-tooltip
          placement={props.tooltipPlacement}
          content={props.tooltipContent}
          header={props.tooltipHeader || ''}
          hoist
        >
          {children}
        </fw-tooltip>
      ) : (
        children
      )}

      {showHintText && hasHintText && (
        <div
          id={props.hintTextId}
          class='field-control-hint-text'
          aria-hidden={hasHintText ? 'false' : 'true'}
        >
          <slot name='hint-text'>{props.hintText}</slot>
        </div>
      )}

      {showErrorText && hasErrorText && (
        <div
          id={props.errorTextId}
          class='field-control-error-text'
          part='fw-slot-error-text'
          aria-hidden={hasErrorText ? 'false' : 'true'}
        >
          <slot name='error-text'>{props.errorText}</slot>
        </div>
      )}

      {showWarningText && hasWarningText && (
        <div
          id={props.warningTextId}
          class='field-control-warning-text'
          aria-hidden={hasWarningText ? 'false' : 'true'}
        >
          <slot name='warning-text'>{props.warningText}</slot>
        </div>
      )}
    </div>
  );
};

export default FieldControl;
