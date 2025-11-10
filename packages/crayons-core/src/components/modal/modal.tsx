import {
  Component,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  State,
  Watch,
  h,
} from '@stencil/core';
import { getFocusableChildren } from '../../utils';
import { TranslationController } from '../../global/Translation';
import { addRTL } from '../../utils';

@Component({
  tag: 'fw-modal',
  styleUrl: 'modal.scss',
  shadow: true,
})
export class Modal {
  /**
   * To get access to the host element
   */
  @Element() el: HTMLFwModalElement;

  /**
   * Modal title element
   */
  @State() modalTitle: HTMLFwModalTitleElement;

  /**
   * Modal footer element
   */
  @State() modalFooter: HTMLFwModalFooterElement;

  /**
   * Modal content element
   */
  @State() modalContent: HTMLFwModalContentElement;

  /**
   * Property to add or remove the top right close icon button
   */
  @Prop() hasCloseIconButton = true;

  /**
   * The title text to be displayed on the modal
   */
  @Prop() titleText: string;

  /**
   * The description text to be displayed on the modal
   */
  @Prop() description: string;

  /**
   * The icon to be displayed with the title
   */
  @Prop() icon = '';

  /**
   * The size of the icon to be displayed with the title
   */
  @Prop() iconSize = 16;

  /**
   * Size of the modal
   */
  @Prop() size: 'standard' | 'small' | 'large' = 'standard';

  /**
   * The text for the submit button
   */
  //@i18n({ keyName: 'modal.ok' })
  @Prop({ mutable: true })
  submitText = '';

  /**
   * The text for the cancel button
   */
  //@i18n({ keyName: 'modal.cancel' })
  @Prop({ mutable: true })
  cancelText = '';

  /**
   * Default state of submit button
   */
  @Prop() submitDisabled = false;

  /**
   * The color of submit button
   */
  @Prop() submitColor: 'primary' | 'secondary' | 'danger' | 'link' | 'text' =
    'primary';

  /**
   * Hide footer for the modal
   */
  @Prop() hideFooter = false;

  /**
   * Convert modal to slider
   */
  @Prop() slider = false;

  /**
   * Toggle the visibility of the modal
   */
  @Prop({ mutable: true, reflect: true }) isOpen = false;

  /**
   * Triggered when the default action button is clicked.
   */
  @Event({ eventName: 'fwSubmit' }) fwSubmit!: EventEmitter<void>;

  /**
   * Triggered when modal is opened.
   */
  @Event({ eventName: 'fwOpen' }) fwOpen!: EventEmitter<void>;

  /**
   * Triggered when modal is closed.
   */
  @Event({ eventName: 'fwClose' }) fwClose!: EventEmitter<void>;

  /**
   * private
   * Modal container ref
   */
  modalContainer: HTMLElement = null;

  /**
   * private
   * Handler to run on modal container opening
   */
  modalContainerHandler = null;

  /**
   * private
   * Modal first focus element
   */
  firstFocusableElement: HTMLElement = null;

  /**
   * private
   * Handler to first focusable element. Focuses last element on tab for focus locking.
   */
  firstFocusableElementHandler = null;

  /**
   * private
   * Modal last focus element
   */
  lastFocusableElement: HTMLElement = null;

  /**
   * private
   * Handler for last focusable element. Focus first element on shift+tab for focus locking.
   */
  lastFocusableElementHandler = null;

  /**
   * private
   * Modal element to focus on open
   */
  modalOpenFocusElement: HTMLElement = null;

  /**
   * private
   * flag to add events to elements only on initial modal load
   */
  accessibilityAdded = false;

  /**
   * private
   * escape key handler
   */
  escapeHandler = null;

  /**
   * private
   * styleVariation styles that vary in normal and slider variations
   */
  styleVariation = {
    closeColor: {
      modal: '#475867',
      slider: '#FFFFFF',
    },
    closeSize: {
      modal: 10,
      slider: 12,
    },
    closeName: {
      modal: 'cross',
      slider: 'cross-big',
    },
  };

  connectedCallback() {
    addRTL(this.el);
  }

  /**
   * lifecycle event, called once just after the component is first connected to the DOM
   */
  componentWillLoad() {
    if (!this.modalTitle) {
      this.modalTitle = this.el.querySelector('fw-modal-title');
    }
    if (!this.modalFooter) {
      this.modalFooter = this.el.querySelector('fw-modal-footer');
      if (this.modalFooter) {
        this.modalFooter.submit = this.submit.bind(this);
        this.modalFooter.close = this.close.bind(this);
      }
    }
    if (!this.modalContent) {
      this.modalContent = this.el.querySelector('fw-modal-content');
    }
    if (this.hideFooter && this.modalFooter) {
      this.modalFooter.style.display = 'none';
    }
    if (!this.modalContent && (this.modalTitle || this.modalFooter)) {
      /**
       * Error that occurs when fw-modal-header or fw-modal-footer is used without
       * fw-modal-content component. If this not handled, the content that goes inside
       * fw-modal-content would have fw-modal-header or fw-modal-footer.
       * This would lead to unexpected results such as header or footer having padding and scroll.
       */
      throw new Error(
        'Composition Error: fw-modal component must have fw-modal-content component when \
         either fw-modal-header or fw-modal-footer components are used for modal composition'
      );
    }
  }

  componentDidLoad() {
    if (this.isOpen && !this.accessibilityAdded) {
      document.body.style.overflow = 'hidden';
      this.addAccesibilityEvents();
    }
  }

  disconnectedCallback() {
    if (this.isOpen) {
      document.body.style.overflow = 'auto';
      this.removeAccesibilityEvents();
    }
  }

  @Watch('isOpen')
  visibilityChange(open: boolean) {
    if (!open) {
      document.body.style.overflow = 'auto';
      this.removeAccesibilityEvents();
      this.fwClose.emit();
    } else {
      document.body.style.overflow = 'hidden';
      this.addAccesibilityEvents();
      this.fwOpen.emit();
    }
  }

  @Watch('hideFooter')
  footerVisibilityChange(hideFooter: boolean) {
    if (this.modalFooter) {
      if (hideFooter) {
        this.modalFooter.style.display = 'none';
      } else {
        this.modalFooter.style.display = 'block';
      }
    }
  }

  /**
   * Method available from the component to perform close action on the modal
   * @returns promise that resolves to true
   */
  @Method()
  async close() {
    this.isOpen = false;
    return true;
  }

  /**
   * Method available from the component to perform open action on the modal
   * @returns promise that resolves to true
   */
  @Method()
  async open() {
    this.isOpen = true;
    return true;
  }

  /**
   * private submit
   */
  submit() {
    this.fwSubmit.emit();
  }

  /**
   * Adds accesibility related events to the component.
   * Major actions would be to focus-lock inside modal and to focus on close button when opening the component.
   */
  addAccesibilityEvents() {
    if (
      !this.accessibilityAdded ||
      !this.firstFocusableElement?.parentNode ||
      !this.modalOpenFocusElement?.parentNode ||
      !this.lastFocusableElement?.parentNode
    ) {
      this.modalContainerHandler &&
        this.modalContainer.removeEventListener(
          'animationend',
          this.modalContainerHandler
        );
      this.modalContainerHandler = (() => {
        this.firstFocusableElementHandler &&
          this.firstFocusableElement.removeEventListener(
            'keydown',
            this.firstFocusableElementHandler
          );
        this.lastFocusableElementHandler &&
          this.lastFocusableElement.removeEventListener(
            'keydown',
            this.lastFocusableElementHandler
          );
        /**
         * Focus trapping inside Modal. Below function gets all focusable elements from the modal.
         * These include elements inside shadow dom too.
         */
        const focusableElements = getFocusableChildren(this.el);
        if (focusableElements.length) {
          this.firstFocusableElement = focusableElements[0];
          this.lastFocusableElement =
            focusableElements[focusableElements.length - 1];
          this.modalOpenFocusElement =
            focusableElements.length > 1 &&
            this.firstFocusableElement.classList.contains('close-btn')
              ? focusableElements[1]
              : this.firstFocusableElement;

          this.lastFocusableElementHandler = ((e: any) => {
            if (!e.shiftKey && e.keyCode === 9) {
              e.preventDefault();
              this.focusElement(this.firstFocusableElement);
            }
          }).bind(this);
          this.firstFocusableElementHandler = ((e: any) => {
            if (e.shiftKey && e.keyCode === 9) {
              e.preventDefault();
              this.focusElement(this.lastFocusableElement);
            }
          }).bind(this);
          this.lastFocusableElement.addEventListener(
            'keydown',
            this.lastFocusableElementHandler
          );
          this.firstFocusableElement.addEventListener(
            'keydown',
            this.firstFocusableElementHandler
          );
        }

        if (this.isOpen && this.modalOpenFocusElement) {
          this.focusElement(this.modalOpenFocusElement);
        }
      }).bind(this);
      this.modalContainer &&
        this.modalContainer.addEventListener(
          'animationend',
          this.modalContainerHandler
        );
      this.accessibilityAdded = true;
    }
    this.escapeHandler = ((e: any) => {
      if (e.keyCode === 27) {
        this.isOpen = false;
      }
    }).bind(this);
    document.addEventListener('keydown', this.escapeHandler);
  }

  /**
   * Removes accesibility related events bound to the document.
   */
  removeAccesibilityEvents() {
    if (this.escapeHandler) {
      document.removeEventListener('keydown', this.escapeHandler);
      this.escapeHandler = null;
    }
  }

  /**
   * @param element element to focus on
   */
  focusElement(element) {
    try {
      if (element.setFocus) {
        element.setFocus();
      } else {
        element.focus();
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Renders Icon in Modal header.
   * @returns {JSX.Element}
   */
  renderIcon(): JSX.Element {
    return <fw-icon class='icon' name={this.icon} size={16}></fw-icon>;
  }

  /**
   * Renders title text and description in modal header.
   * @returns {JSX.Element}
   */
  renderTitle(): JSX.Element {
    return (
      <fw-modal-title
        icon={this.icon}
        icon-size={this.iconSize}
        titleText={this.titleText}
        description={this.description}
      ></fw-modal-title>
    );
  }

  /**
   * renders the slot content in the modal.
   * @returns {JSX.Element}
   */
  renderContent(): JSX.Element {
    return (
      <fw-modal-content>
        <slot></slot>
      </fw-modal-content>
    );
  }

  /**
   * renders the default footer in the modal
   * @returns {JSX.Element}
   */
  renderFooter(): JSX.Element {
    return (
      <fw-modal-footer
        submitText={this.submitText || TranslationController.t('modal.ok')}
        cancelText={this.cancelText || TranslationController.t('modal.cancel')}
        submitDisabled={this.submitDisabled}
        submitColor={this.submitColor}
        submit={this.submit.bind(this)}
        close={this.close.bind(this)}
        style={{ display: this.hideFooter ? 'none' : 'block' }}
      ></fw-modal-footer>
    );
  }

  /**
   * renders either default modal content based on attributes or renders the modal child components like
   * modal-title, modal-content and modal-footer components.
   * @returns {JSX.Element}
   */
  render(): JSX.Element {
    const variation = this.styleVariation;
    return (
      <div
        class={{
          'modal-overlay': true,
          'visible': this.isOpen,
          'slider': this.slider,
        }}
      >
        <div
          class={{ modal: true, [this.size]: true }}
          aria-modal='true'
          ref={(el) => (this.modalContainer = el)}
        >
          {this.hasCloseIconButton && (
            <button
              class={`close-btn ${
                this.slider === true ? ' slider-mode' : 'modal-mode'
              }`}
              onClick={() => this.close()}
            >
              <fw-icon
                name={
                  this.slider
                    ? variation.closeName.slider
                    : variation.closeName.modal
                }
                library='system'
                size={
                  this.slider
                    ? variation.closeSize.slider
                    : variation.closeSize.modal
                }
              />
            </button>
          )}
          <div class='modal-container'>
            {this.modalTitle ? '' : this.titleText ? this.renderTitle() : ''}
            {this.modalContent ? <slot></slot> : this.renderContent()}
            {this.modalFooter ? '' : this.renderFooter()}
          </div>
        </div>
      </div>
    );
  }
}
