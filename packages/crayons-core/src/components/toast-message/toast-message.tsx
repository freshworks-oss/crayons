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
import { handleKeyDown } from '../../utils';

/**
 * @parent toast
 */

@Component({
  tag: 'fw-toast-message',
  styleUrl: 'toast-message.scss',
  shadow: true,
})
export class ToastMessage {
  @Element() controllerEl: HTMLElement;
  /**
   * visibility prop of toast message
   */
  @Prop({ mutable: true, reflect: true }) open = false;

  /**
   * To indicate mouse hover on toast
   */
  @State() isMouseHovered: boolean;

  /**
   * To indicate toast close timeout
   */
  @State() isTimedOut = false;

  /**
   * stored setTimeOut id to close it
   */
  @State() timerId: any;

  /**
   * To add close animation class to toast
   */
  @State() fadeOut = false;

  /**
   * State icon size
   */
  @State() iconSize = 16;

  /**
   * Type of the toast - success,failure, warning, inprogress
   */
  @Prop() type: 'success' | 'error' | 'warning' | 'inprogress' = 'warning';

  /**
   * Time duration of the toast visibility
   */
  @Prop() timeout = 4000;

  /**
   * The content to be displayed in toast
   */
  @Prop() content: string;

  /**
   *  The Content of the action link
   */
  @Prop() actionLinkText = '';

  /**
   *  won't close automatically
   */
  @Prop() sticky = false;

  /**
   *  Pause the toast from hiding on mouse hover
   */
  @Prop() pauseOnHover: boolean;

  /**
   * Triggered when the action link clicked.
   */
  @Event() fwLinkClick: EventEmitter;

  /**
   * Triggered on closing the toast message.
   * This event gets used by the parent container to remove the toast message from itself
   */
  @Event() fwRemoveToast: EventEmitter;

  @Watch('open')
  openChanged(open: boolean): void {
    if (open) this.setUpToast();
  }

  async componentWillLoad(): Promise<void> {
    if (this.open) this.setUpToast();
  }

  async setUpToast(): Promise<void> {
    this.fadeOut = false;
    this.isTimedOut = false;
    this.timerId = setTimeout(async () => {
      if (!this.sticky) {
        if (!this.pauseOnHover || (this.pauseOnHover && !this.isMouseHovered)) {
          await this.closeToast();
        }
        this.isTimedOut = true;
      }
    }, this.timeout);
  }

  async mouseHover(value = false): Promise<void> {
    this.isMouseHovered = value;
    if (this.isTimedOut && !this.isMouseHovered) {
      await this.closeToast();
    }
  }

  closingAnimation(): Promise<void> {
    this.fadeOut = true;
    return new Promise<void>((resolve) =>
      setTimeout(() => {
        this.open = false;
        this.fwRemoveToast.emit(this.controllerEl);
        resolve();
      }, 500)
    );
  }

  async closeToast(): Promise<void> {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    await this.closingAnimation();
  }

  disconnectedCallback(): void {
    this.fwRemoveToast.emit(this.controllerEl);
    if (this.timerId) clearTimeout(this.timerId);
  }

  render(): JSX.Element {
    return (
      <Host
        onmouseover={() => this.mouseHover(true)}
        onmouseout={() => this.mouseHover(false)}
        aria-hidden={this.open ? 'false' : 'true'}
      >
        <div
          class={`toast ${this.type} ${this.open ? 'is-open' : ''} ${
            this.fadeOut ? 'fade-out' : ''
          }`}
          aria-hidden={this.open ? 'false' : 'true'}
        >
          <div class='toast-container'>
            {this.type === 'inprogress' ? (
              <fw-spinner class='icon'></fw-spinner>
            ) : (
              <fw-icon class='icon' size={this.iconSize} name={this.type} />
            )}

            <div class='content'>
              <slot />
              {this.content}

              {this.actionLinkText.length > 0 ? (
                <div
                  class='action-link'
                  role='button'
                  tabindex='0'
                  onClick={() => this.fwLinkClick.emit()}
                  onKeyDown={handleKeyDown(() => this.fwLinkClick.emit())}
                >
                  {this.actionLinkText}
                </div>
              ) : (
                ''
              )}
            </div>

            <fw-icon
              size={10}
              name='cross'
              class='remove'
              onClick={() => this.closeToast()}
              library='system'
            ></fw-icon>
          </div>
        </div>
      </Host>
    );
  }
}
