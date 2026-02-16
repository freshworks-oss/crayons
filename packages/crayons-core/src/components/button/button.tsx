import {
  Component,
  Element,
  Event,
  EventEmitter,
  Host,
  Prop,
  State,
  h,
  Method,
} from '@stencil/core';
import { throttle, hasSlot } from '../../utils';

@Component({
  tag: 'fw-button',
  styleUrl: 'button.scss',
  shadow: true,
})
export class Button {
  @Element() host: HTMLElement;

  private handleClickWithThrottle;
  private button: HTMLButtonElement;

  /**
   *  Button type based on which actions are performed when the button is clicked.
   */
  @Prop() type: 'button' | 'submit' = 'button';

  /**
   * Identifier of the theme based on which the button is styled.
   */
  @Prop() color: 'primary' | 'secondary' | 'danger' | 'link' | 'text' =
    'primary';

  /**
   * Size of the button.
   */
  @Prop() size: 'normal' | 'small' | 'icon' | 'icon-small' = 'normal';

  /**
   * Disables the button on the interface. Default value is false.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * Loading state for the button, Default value is false.
   */
  @Prop() loading = false;

  /**
   * Caret indicator for the button, Default value is false.
   */
  @Prop() showCaretIcon = false;

  /**
   *  Accepts the id of the fw-modal component to open it on click.
   */
  @Prop() modalTriggerId = '';

  /**
   * Accepts the id of the fw-file-uploader component to upload the file.
   */
  @Prop() fileUploaderId = '';

  /**
   * Sets the delay for throttle in milliseconds. Defaults to 200 milliseconds.
   */
  @Prop() throttleDelay = 200;

  /**
   * Triggered when the button is clicked.
   */
  @Event() fwClick!: EventEmitter<void>;

  /**
   * Triggered when the button comes into focus.
   */
  @Event() fwFocus!: EventEmitter<void>;

  /**
   * Triggered when the button loses focus.
   */
  @Event() fwBlur!: EventEmitter<void>;

  @State() private hasLabel = false;
  @State() private hasBeforeLabel = false;
  @State() private hasAfterLabel = false;

  @Method()
  async setFocus(): Promise<any> {
    this.button.focus();
  }

  private onFocus() {
    this.fwFocus.emit();
  }

  private onBlur() {
    this.fwBlur.emit();
  }

  connectedCallback() {
    this.handleClickWithThrottle = throttle(
      this.handleClick,
      this,
      this.throttleDelay
    );
  }

  private handlePreventDefault(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  private handleClick(event: Event) {
    if (this.modalTriggerId !== '') {
      this.modalTrigger();
    }
    if (this.fileUploaderId !== '') {
      this.fileSubmit();
    } else if (this.type === 'submit') {
      this.fakeSubmit(event);
    }

    this.fwClick.emit();
  }

  private async fileSubmit() {
    const fileUploader: any = document.querySelector(
      `fw-file-uploader#${this.fileUploaderId}`
    );
    fileUploader?.uploadFiles();
  }

  private async modalTrigger() {
    const modal: any = document.querySelector(
      `fw-modal#${this.modalTriggerId}`
    );
    modal?.open();
  }

  private async fakeSubmit(event: Event) {
    const form = this.host.closest('form');
    if (form) {
      event.preventDefault();
      const fakeSubmit = document.createElement('button');
      fakeSubmit.type = 'submit';
      fakeSubmit.style.display = 'none';
      form.appendChild(fakeSubmit);
      fakeSubmit.click();
      fakeSubmit.remove();
    }
  }

  componentWillLoad() {
    this.handleSlotChange();
  }

  private handleSlotChange() {
    this.hasLabel = hasSlot(this.host);
    this.hasBeforeLabel = hasSlot(this.host, 'before-label');
    this.hasAfterLabel = hasSlot(this.host, 'after-label');
  }

  render() {
    return (
      <Host
        onClick={(e) => {
          if (this.disabled) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
          }
        }}
      >
        <button
          type={this.type}
          class={`
            fw-btn fw-btn--${this.color.toLowerCase()}
            fw-btn--${this.size.toLowerCase()}
            ${this.loading ? 'fw-btn--loading' : ''}
            ${this.hasLabel ? 'fw-btn--has-label' : ''}
            ${this.hasBeforeLabel ? 'fw-btn--has-before' : ''}
            ${this.hasAfterLabel ? 'fw-btn--has-after' : ''}
            ${this.showCaretIcon ? 'fw-btn--caret' : ''}
          `}
          onClick={
            this.disabled || this.loading
              ? this.handlePreventDefault
              : this.handleClickWithThrottle
          }
          onFocus={() => this.onFocus()}
          onBlur={() => this.onBlur()}
          ref={(button) => (this.button = button)}
          aria-disabled={this.disabled}
          disabled={this.disabled}
        >
          <span class='fw-btn--before'>
            <slot
              onSlotchange={() => this.handleSlotChange()}
              name='before-label'
            ></slot>
          </span>
          <span class='fw-btn--label'>
            <slot onSlotchange={() => this.handleSlotChange()} />
          </span>
          <span class='fw-btn--after'>
            <slot
              onSlotchange={() => this.handleSlotChange()}
              name='after-label'
            ></slot>
          </span>
          {this.loading ? <fw-spinner class='fw-btn--loader'></fw-spinner> : ''}
          {this.showCaretIcon ? (
            <fw-icon name='chevron-down' library='system' />
          ) : (
            ''
          )}
        </button>
      </Host>
    );
  }
}
