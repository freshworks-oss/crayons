import { newE2EPage } from '@stencil/core/testing';

describe('fw-file-uploader', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<fw-file-uploader></fw-file-uploader>');
    const element = await page.find('fw-file-uploader');
    expect(element).toHaveClass('hydrated');
  });

  it('should open file uploader on dropzone click and move to files stage', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-file-uploader></fw-file-uploader>');
    const futureFileChooser = page.waitForFileChooser();
    // some button that triggers file selection
    const dropzone = await page.find('fw-file-uploader >>> .dropzone');
    dropzone.click();
    const fileChooser = await futureFileChooser;
    await fileChooser.accept([`${__dirname}/test.csv`]);
    await page.waitForChanges();
    const filesStage = await page.find('fw-file-uploader >>> .files');
    expect(filesStage).toBeTruthy();
  });

  it('should list files when successfully uploading file', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-file-uploader></fw-file-uploader>');
    const futureFileChooser = page.waitForFileChooser();
    // some button that triggers file selection
    const dropzone = await page.find('fw-file-uploader >>> .dropzone');
    dropzone.click();
    const fileChooser = await futureFileChooser;
    await fileChooser.accept([`${__dirname}/test.csv`]);
    await page.waitForChanges();
    const filesContent = await page.find(
      'fw-file-uploader >>> fw-file-uploader-file'
    );
    expect(filesContent).toBeTruthy();
  });

  it('should be able to get locally available files that are selected using getFiles', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-file-uploader></fw-file-uploader>');
    const futureFileChooser = page.waitForFileChooser();
    const dropzone = await page.find('fw-file-uploader >>> .dropzone');
    dropzone.click();
    const fileChooser = await futureFileChooser;
    await fileChooser.accept([`${__dirname}/test.csv`]);
    await page.waitForChanges();
    const fileUploader = await page.find('fw-file-uploader');
    const fileList = await fileUploader.callMethod('getFiles');
    expect(fileList[0]).toBeTruthy();
  });

  it('should be able to reset to default state when reset method is called', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-file-uploader></fw-file-uploader>');
    const futureFileChooser = page.waitForFileChooser();
    const dropzone = await page.find('fw-file-uploader >>> .dropzone');
    dropzone.click();
    const fileChooser = await futureFileChooser;
    await fileChooser.accept([`${__dirname}/test.csv`]);
    await page.waitForChanges();
    const fileUploader = await page.find('fw-file-uploader');
    await fileUploader.callMethod('reset');
    await page.waitForChanges();
    const dropzoneAfterReset = await page.find(
      'fw-file-uploader >>> .dropzone'
    );
    const fileList = await fileUploader.callMethod('getFiles');
    expect(fileList[0]).toBeFalsy();
    expect(dropzoneAfterReset).toBeTruthy();
  });

  it('should move back to dropzone when last file is removed from files stage', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-file-uploader></fw-file-uploader>');
    const futureFileChooser = page.waitForFileChooser();
    // some button that triggers file selection
    let dropzone = await page.find('fw-file-uploader >>> .dropzone');
    dropzone.click();
    const fileChooser = await futureFileChooser;
    await fileChooser.accept([`${__dirname}/test.csv`]);
    await page.waitForChanges();
    const fileUploaderShadow = await page.find(
      'fw-file-uploader >>> :first-child'
    );
    const remove = await fileUploaderShadow.find(
      'fw-file-uploader-file >>> .files-content-file-remove'
    );
    remove.click();
    await page.waitForChanges();
    dropzone = await page.find('fw-file-uploader >>> .dropzone');
    expect(dropzone).toBeTruthy();
  });

  it('should call filesuploaded event once the uploadFile method is called on the file uploader', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-file-uploader></fw-file-uploader>');
    const futureFileChooser = page.waitForFileChooser();
    // some button that triggers file selection
    const fileUploader = await page.find('fw-file-uploader');
    const dropzone = await page.find('fw-file-uploader >>> .dropzone');
    dropzone.click();
    const fileChooser = await futureFileChooser;
    await fileChooser.accept([`${__dirname}/test.csv`]);
    await page.waitForChanges();
    const filesUploadedEvent = await page.spyOnEvent('fwFilesUploaded');
    await fileUploader.callMethod('uploadFiles');
    await page.waitForChanges();
    expect(filesUploadedEvent).toHaveReceivedEventTimes(1);
  });

  // Test cases for titleIcon functionality
  it('displays title icon when titleIcon attribute is set', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-file-uploader title-icon="document"></fw-file-uploader>'
    );

    const iconElement = await page.find('fw-file-uploader >>> .icon fw-icon');
    expect(iconElement).toBeTruthy();

    const iconName = await iconElement.getProperty('name');
    expect(iconName).toBe('document');
  });

  it('hides title icon when titleIcon attribute is not provided', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-file-uploader></fw-file-uploader>');

    const iconElement = await page.find('fw-file-uploader >>> .icon');
    expect(iconElement).toBeFalsy();
  });

  it('verifies title icon has correct size property', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-file-uploader title-icon="folder"></fw-file-uploader>'
    );

    const iconElement = await page.find('fw-file-uploader >>> .icon fw-icon');
    const iconSize = await iconElement.getProperty('size');
    expect(iconSize).toBe(12);
  });

  it('updates title icon when property is modified', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-file-uploader title-icon="attachment"></fw-file-uploader>'
    );

    const fileUploader = await page.find('fw-file-uploader');
    await fileUploader.setProperty('titleIcon', 'files');
    await page.waitForChanges();

    const updatedIcon = await page.find('fw-file-uploader >>> .icon fw-icon');
    const updatedIconName = await updatedIcon.getProperty('name');
    expect(updatedIconName).toBe('files');
  });

  it('maintains title icon visibility across different uploader stages', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<fw-file-uploader title-icon="cloud-upload"></fw-file-uploader>'
    );

    const futureFileChooser = page.waitForFileChooser();
    const dropzone = await page.find('fw-file-uploader >>> .dropzone');
    dropzone.click();
    const fileChooser = await futureFileChooser;
    await fileChooser.accept([`${__dirname}/test.csv`]);
    await page.waitForChanges();

    const persistentIcon = await page.find(
      'fw-file-uploader >>> .icon fw-icon'
    );
    expect(persistentIcon).toBeTruthy();
    expect(await persistentIcon.getProperty('name')).toBe('cloud-upload');
  });

  // Test cases for file uploader icon in dropzone
  it('shows file uploader icon in the dropzone area', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-file-uploader></fw-file-uploader>');

    const uploaderIcon = await page.find(
      'fw-file-uploader >>> .dropzone fw-icon'
    );
    expect(uploaderIcon).toBeTruthy();
  });

  it('validates file uploader icon has correct name', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-file-uploader></fw-file-uploader>');

    const uploaderIconElement = await page.find(
      'fw-file-uploader >>> .dropzone fw-icon'
    );
    const iconName = await uploaderIconElement.getProperty('name');
    expect(iconName).toBe('upload-cloud');
  });

  it('validates file uploader icon size is set correctly', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-file-uploader></fw-file-uploader>');

    const uploaderIconElement = await page.find(
      'fw-file-uploader >>> .dropzone fw-icon'
    );
    const iconSize = await uploaderIconElement.getProperty('size');
    expect(iconSize).toBe(24);
  });

  it('verifies file uploader icon styling classes are applied', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-file-uploader></fw-file-uploader>');

    const uploaderIconElement = await page.find(
      'fw-file-uploader >>> .dropzone fw-icon'
    );
    const iconClass = await uploaderIconElement.getProperty('class');
    expect(iconClass).toContain('file-uploader-icon');
  });

  it('ensures file uploader icon disappears when files are uploaded', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-file-uploader></fw-file-uploader>');

    const futureFileChooser = page.waitForFileChooser();
    const dropzone = await page.find('fw-file-uploader >>> .dropzone');
    dropzone.click();
    const fileChooser = await futureFileChooser;
    await fileChooser.accept([`${__dirname}/test.csv`]);
    await page.waitForChanges();

    const dropzoneAfterUpload = await page.find(
      'fw-file-uploader >>> .dropzone'
    );
    expect(dropzoneAfterUpload).toBeFalsy();
  });

  it('ensures file uploader icon reappears when all files are removed', async () => {
    const page = await newE2EPage();
    await page.setContent('<fw-file-uploader></fw-file-uploader>');

    const futureFileChooser = page.waitForFileChooser();
    let dropzone = await page.find('fw-file-uploader >>> .dropzone');
    dropzone.click();
    const fileChooser = await futureFileChooser;
    await fileChooser.accept([`${__dirname}/test.csv`]);
    await page.waitForChanges();

    // Remove the uploaded file
    const fileUploaderShadow = await page.find(
      'fw-file-uploader >>> :first-child'
    );
    const remove = await fileUploaderShadow.find(
      'fw-file-uploader-file >>> .files-content-file-remove'
    );
    remove.click();
    await page.waitForChanges();

    // Check if dropzone and its icon are back
    dropzone = await page.find('fw-file-uploader >>> .dropzone');
    const uploaderIcon = await page.find(
      'fw-file-uploader >>> .dropzone fw-icon'
    );
    expect(dropzone).toBeTruthy();
    expect(uploaderIcon).toBeTruthy();
  });
});
