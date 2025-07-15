import { Draggable } from './draggable';

describe('Draggable - isDropNotAllowed', () => {
  let container;
  let draggableInstance;
  let mockDragElement;
  let dragStartEvent;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);

    draggableInstance = new Draggable(container, {
      sortable: false,
      supportDependentAndMSDDInSections: false,
    });

    mockDragElement = document.createElement('div');
    mockDragElement.id = 'drag-item';
    mockDragElement['dataProvider'] = { type: 'DEPENDENT_FIELD' };
    container.appendChild(mockDragElement);

    dragStartEvent = new Event('dragstart', {
      bubbles: true,
      cancelable: true,
    }) as DragEvent;

    Object.defineProperty(dragStartEvent, 'dataTransfer', {
      value: {
        setData: jest.fn(),
        getData: jest.fn(),
      },
    });

    mockDragElement.dispatchEvent(dragStartEvent);
  });

  afterEach(() => {
    document.body.removeChild(container);
    draggableInstance.destroy();
  });

  it('should return true when dropping a dependent field in a section with supportDependentAndMSDDInSections as false', () => {
    container.id = 'sectionIdentifier-test';
    expect(draggableInstance.isDropNotAllowed()).toBe(true);
  });

  it('should return false when dropping a valid new DROPDOWN field', () => {
    container.id = 'sectionIdentifier-test';
    mockDragElement['dataProvider'] = {
      type: 'DROPDOWN',
      choices: [{ value: '' }],
      custom: true,
      field_options: {
        has_sections: false,
      },
    };

    expect(draggableInstance['isDropNotAllowed']()).toBe(false);
  });

  it('should return false when there are 12 fields and a dependent field is added and supportDependentAndMSDDInSections is true', () => {
    draggableInstance.supportDependentAndMSDDInSections = true;
    container.id = 'sectionIdentifier-test';
    for (let i = 0; i < 12; i++) {
      const child = document.createElement('div');
      child['dataProvider'] = { type: 'TEXT_FIELD' };
      container.appendChild(child);
    }

    const parentElement = document.createElement('div');
    container.removeChild(mockDragElement);
    parentElement.appendChild(mockDragElement);

    expect(draggableInstance['isDropNotAllowed']()).toBe(false);
  });

  it('should return false when reordering a dependent field within a section with 15 fields count', () => {
    draggableInstance.supportDependentAndMSDDInSections = true;
    container.id = 'sectionIdentifier-test';
    for (let i = 0; i < 12; i++) {
      const child = document.createElement('div');
      child['dataProvider'] = { type: 'TEXT_FIELD' };
      container.appendChild(child);
    }

    expect(draggableInstance['isDropNotAllowed']()).toBe(false);
  });

  it('should return true when there are 13 fields and adding a dependent field', () => {
    draggableInstance.supportDependentAndMSDDInSections = true;
    container.id = 'sectionIdentifier-test';
    for (let i = 0; i < 13; i++) {
      const child = document.createElement('div');
      child['dataProvider'] = { type: 'TEXT_FIELD' };
      container.appendChild(child);
    }

    const parentElement = document.createElement('div');
    container.removeChild(mockDragElement);
    parentElement.appendChild(mockDragElement);

    expect(draggableInstance['isDropNotAllowed']()).toBe(true);
  });

  it('should return false when there are 14 fields and adding a TEXT_FIELD', () => {
    container.id = 'sectionIdentifier-test';
    for (let i = 0; i < 14; i++) {
      const child = document.createElement('div');
      child['dataProvider'] = { type: 'TEXT_FIELD' };
      container.appendChild(child);
    }
    const parentElement = document.createElement('div');
    container.removeChild(mockDragElement);
    parentElement.appendChild(mockDragElement);
    mockDragElement['dataProvider'] = {
      type: 'TEXT_FIELD',
    };

    expect(draggableInstance['isDropNotAllowed']()).toBe(false);
  });

  it('should return true when dropping a required field', () => {
    container.id = 'sectionIdentifier-test';
    mockDragElement['dataProvider'] = { required: true };

    const parentElement = document.createElement('div');
    container.removeChild(mockDragElement);
    parentElement.appendChild(mockDragElement);

    expect(draggableInstance['isDropNotAllowed']()).toBe(true);
  });

  it('should return false when dropping a valid field in a non-section container', () => {
    container.id = 'nonSectionContainer';

    expect(draggableInstance['isDropNotAllowed']()).toBe(false);
  });
});
