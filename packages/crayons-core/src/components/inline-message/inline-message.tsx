import {
  Component,
  Prop,
  h,
  Host,
  Watch,
  Element,
  Method,
  EventEmitter,
  Event,
} from '@stencil/core';

const iconMap = {
  error: 'alert',
  warning: 'info',
  info: 'info',
  success: 'success',
};

@Component({
  tag: 'fw-inline-message',
  styleUrl: 'inline-message.scss',
  shadow: true,
})
export class InlineMessage {
  @Element() host!: HTMLElement;

  private autoHideTimeout;

  /**
   * Makes the inline message closable.
   */
  @Prop() closable = true;

  /**
   * The type of inline message to be displayed. Defaults to info.
   */
  @Prop() type: 'success' | 'warning' | 'info' | 'error' = 'info';

  /**
   * The duration in milliseconds for which inline message will be shown.
   */
  @Prop() duration = Infinity;

  /**
   * Indicates whether the inline message is open or not.
   */
  @Prop({ mutable: true, reflect: true }) open = true;

  /**
   * Triggered when inline message is shown.
   */
  @Event() fwShow!: EventEmitter;

  /**
   * Triggered when inline message is hidden.
   */
  @Event() fwHide!: EventEmitter;

  startAutoHide() {
    clearTimeout(this.autoHideTimeout);
    if (this.open && this.duration < Infinity) {
      this.autoHideTimeout = setTimeout(() => this.hide(), this.duration);
    }
  }

  @Watch('open')
  handleOpen() {
    if (this.open) {
      this.host.style.display = 'flex';

      this.fwShow.emit();

      if (this.duration < Infinity) {
        this.startAutoHide();
      }
    } else {
      clearTimeout(this.autoHideTimeout);

      this.host.style.display = 'none';

      this.fwHide.emit();
    }
  }

  @Watch('duration')
  handleDurationChange() {
    this.startAutoHide();
  }

  @Method()
  async show() {
    if (this.open) {
      return;
    }
    this.open = true;
  }

  @Method()
  async hide() {
    if (!this.open) {
      return;
    }
    this.open = false;
  }

  connectedCallback() {
    this.host.style.display = this.open ? 'flex' : 'none';
  }

  disconnectedCallback() {
    clearTimeout(this.autoHideTimeout);
  }

  handleKeyUp(e) {
    if (e.code === 'Enter') {
      e.preventDefault();
      this.hide();
    }
  }

  handleClose() {
    this.hide();
  }

  render() {
    return (
      <Host role='alert' aria-hidden={this.open ? 'false' : 'true'}>
        <div class={'alert ' + 'alert--' + this.type}>
          <span class='alert__icon'>
            <fw-icon size={16} name={iconMap[this.type]}></fw-icon>
          </span>
          <span class='alert__message'>
            <slot />
          </span>
          {this.closable && (
            <span
              class='alert__close'
              role='button'
              tabindex='0'
              onKeyUp={(e) => this.handleKeyUp(e)}
              onClick={() => this.handleClose()}
            >
              <fw-icon name='cross' size={8} library='system'></fw-icon>
            </span>
          )}
        </div>
      </Host>
    );
  }
}
