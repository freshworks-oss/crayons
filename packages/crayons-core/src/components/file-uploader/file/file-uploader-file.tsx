import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { TranslationController } from '../../../global/Translation';

@Component({
  tag: 'fw-file-uploader-file',
  styleUrl: 'file-uploader-file.scss',
  shadow: true,
})
export class FileUploaderFile {
  /**
   * file Id
   */
  @Prop() fileId: number = null;

  /**
   * file name
   */
  @Prop() name = '';

  /**
   * removeFile - event that gets triggered on file removal
   */
  @Event() fwRemoveFile: EventEmitter;

  /**
   * private
   * remove
   */
  remove() {
    this.fwRemoveFile.emit({
      fileId: this.fileId,
    });
  }

  /**
   * render
   * @returns {JSX.Element}
   */
  render() {
    /* eslint-disable-next-line */
    return (
      <div class='files-content'>
        <div class='files-content-icon'>
          <fw-icon name='checkbox' size={14}></fw-icon>
        </div>
        <div class='files-content-file'>
          <span class='files-content-file-name'>{this.name}</span>
          <button
            class='files-content-file-remove'
            onClick={() => this.remove()}
          >
            {TranslationController.t('fileUploader.remove')}
          </button>
        </div>
      </div>
    );
  }
}
