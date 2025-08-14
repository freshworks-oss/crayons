import {
  Component,
  h,
  Prop,
  Host,
  Element,
  Event,
  EventEmitter,
} from '@stencil/core';
import { handleKeyDown } from '../../../utils';
import {
  iconImageType,
  iconFileType,
  iconAddedLibrary,
  iconAddLibrary,
} from '../../../utils/assets';
import { TranslationController } from '../../../global/Translation';
import { KB_TO_BYTE } from '../../../constants';

@Component({
  tag: 'fw-file-2',
  styleUrl: 'file-2.scss',
  shadow: true,
})
export class File2 {
  @Element() host!: HTMLElement;

  private spanExtension: HTMLElement;
  private spanName: HTMLElement;
  private spanSize: HTMLElement;
  private resizeObserver;

  /**
   * Name of the attachment file to be displayed (including the file extension)
   */
  @Prop() label = '';
  /**
   * File type
   */
  @Prop() type: string | null = null;
  /**
   * Size of the attachment in bytes
   */
  @Prop() size = 0;
  /**
   * Boolean used to display size as passed or convert them to relatives like KB, MB etc...
   */
  @Prop() parseSize = true;
  /**
   * Set private mode for different styles
   */
  @Prop() isPrivateMode = false;
  /**
   * Error message text to display below the attachment
   */
  @Prop() errorMessage = '';
  /**
   * Boolean value to set if the attachment is added in library or not
   */
  @Prop({ mutable: true }) addedToLibrary = false;
  /**
   * State of the attachment for styling
   */
  @Prop({ mutable: true }) state: 'normal' | 'loading' | 'error' | 'failed' =
    'normal';
  /**
   * Index order of the attachment file starting from 0
   */
  @Prop() index = -1;
  /**
   * Value or id related to the attached file
   */
  @Prop() value;
  /**
   * To enable library adding related feature
   */
  @Prop() enableLibraryAdding = false;
  /**
   * Event triggered to delete the attachment file
   */
  @Event() fwDelete!: EventEmitter;
  /**
   * Event triggered to add / remove file from the library
   */
  @Event() fwModifyLibrary!: EventEmitter;
  /**
   * Event triggered to reupload
   */
  @Event() fwReupload!: EventEmitter;

  componentDidRender(): void {
    const elSize = this.spanSize;
    if (elSize && !this.resizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        const sizeW = elSize.clientWidth;
        const extensionW = this.spanExtension.clientWidth;
        if (sizeW > 0 || extensionW > 0) {
          this.spanName.style.maxWidth = `calc(100% - ${sizeW}px - 4px - ${extensionW})`;
        }
      });
      this.resizeObserver.observe(elSize);
    }
  }

  disconnectedCallback(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  private modifyLibraryHandler = async (event) => {
    if (event) {
      event.stopImmediatePropagation();
      event.stopPropagation();
    }
    this.fwModifyLibrary.emit({
      index: this.index,
      value: this.value,
      state: this.state,
      type: this.addedToLibrary ? 'REMOVE_FROM_LIBRARY' : 'ADD_TO_LIBRARY',
    });
  };

  private deleteHandler = async (event) => {
    if (event) {
      event.stopImmediatePropagation();
      event.stopPropagation();
    }
    this.fwDelete.emit({
      index: this.index,
      value: this.value,
      state: this.state,
    });
  };

  private reUploadHandler = async (event) => {
    if (event) {
      event.stopImmediatePropagation();
      event.stopPropagation();
    }
    this.fwReupload.emit({
      index: this.index,
      value: this.value,
      state: this.state,
    });
  };

  private getFileSize() {
    const bytes = this.size;
    if (bytes === 0) {
      return ' (0 B)';
    }

    const k = KB_TO_BYTE;
    const dm = 2;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return ` (${
      parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    })`;
  }

  private getFilenameAndExtension() {
    if (!this.label || this.label === '') {
      return ['', ''];
    }
    const numLastIndex = this.label.lastIndexOf('.');
    if (numLastIndex > -1) {
      const strFileExtension = this.label.substring(numLastIndex + 1);

      return [
        this.label.substring(0, numLastIndex),
        strFileExtension && strFileExtension !== ''
          ? `.${strFileExtension}`
          : '',
      ];
    } else {
      return [this.label, ''];
    }
  }

  render() {
    const strClassName = 'fw-attachment';
    const boolErrorState = this.state === 'error';
    const boolFailedState = this.state === 'failed';
    const boolLoadingState = this.state === 'loading';
    const boolNormalState = this.state === 'normal';

    let strBaseClassName = strClassName;
    if (!boolNormalState) {
      strBaseClassName += ` ${strClassName}--${this.state}-state`;
    } else if (this.isPrivateMode) {
      strBaseClassName += ` ${strClassName}--private-mode`;
    }

    const strSize = this.parseSize ? this.getFileSize() : this.size;

    const arrFilebreak = this.getFilenameAndExtension();
    const strFileName =
      arrFilebreak && arrFilebreak.length > 0 ? arrFilebreak[0] : '';
    const strFileExtension =
      arrFilebreak && arrFilebreak.length > 1 ? arrFilebreak[1] : '';
    return (
      <Host>
        <div class={strBaseClassName}>
          <div class={`${strClassName}-content`}>
            <div class={`${strClassName}-content-left-panel`}>
              <span
                class={`${strClassName}-content-icon${
                  boolErrorState || boolFailedState ? ' error' : ''
                }`}
              >
                <fw-icon
                  dataSvg={
                    this.type?.startsWith('image/') === true
                      ? iconImageType
                      : iconFileType
                  }
                ></fw-icon>
              </span>
              <span
                class={`${strClassName}-content-name`}
                ref={(el) => (this.spanName = el)}
              >
                {strFileName}
              </span>
              <span
                class={`${strClassName}-content-file-extension`}
                ref={(el) => (this.spanExtension = el)}
              >
                {strFileExtension}
              </span>
              <span
                class={`${strClassName}-content-size`}
                ref={(el) => (this.spanSize = el)}
              >
                {strSize}
              </span>
            </div>
            <div class={`${strClassName}-content-right-panel`}>
              {this.enableLibraryAdding && boolNormalState && (
                <fw-tooltip
                  trigger='hover'
                  content={
                    this.addedToLibrary
                      ? TranslationController.t(
                          'fileUploader.removeFromLibrary'
                        )
                      : TranslationController.t('fileUploader.saveInLibrary')
                  }
                  hoist
                >
                  <div
                    id={
                      this.addedToLibrary
                        ? 'removeFromLibraryBtn'
                        : 'addToLibraryBtn'
                    }
                    class={`${strClassName}-content-add-library-btn`}
                    role='button'
                    tabindex='-1'
                    onClick={this.modifyLibraryHandler}
                    onKeyDown={handleKeyDown(this.modifyLibraryHandler)}
                  >
                    <fw-icon
                      id={
                        this.addedToLibrary
                          ? 'removeFromLibraryBtnIcon'
                          : 'addToLibraryBtnIcon'
                      }
                      class={`${strClassName}-content-add-library-btn-icon`}
                      dataSvg={
                        this.addedToLibrary ? iconAddedLibrary : iconAddLibrary
                      }
                      color={this.addedToLibrary ? '#2C5CC5' : '#475867'}
                    ></fw-icon>
                  </div>
                </fw-tooltip>
              )}
              {!boolLoadingState && (
                <div
                  class={`${strClassName}-content-delete-btn`}
                  role='button'
                  tabindex='0'
                  onClick={this.deleteHandler}
                  onKeyDown={handleKeyDown(this.deleteHandler)}
                >
                  <fw-icon
                    class={`${strClassName}-content-delete-btn-icon`}
                    name='cross'
                    size={6}
                    library='system'
                  ></fw-icon>
                </div>
              )}
              {boolLoadingState && (
                <fw-spinner
                  size='large'
                  class={`${strClassName}-content-spinner`}
                ></fw-spinner>
              )}
            </div>
          </div>
          {(boolErrorState || boolFailedState) && (
            <div class={`${strClassName}-content-error`}>
              <span class={`${strClassName}-content-error-icon`}>
                <fw-icon name='error' size={12}></fw-icon>
              </span>
              <span class={`${strClassName}-content-error-message`}>
                {this.errorMessage}
              </span>
              {(boolErrorState || boolFailedState) && (
                <button
                  class={`${strClassName}-content-reupload-btn`}
                  onClick={this.reUploadHandler}
                >
                  {TranslationController.t('fileUploader2.retry')}
                </button>
              )}
            </div>
          )}
        </div>
      </Host>
    );
  }
}
