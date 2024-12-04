import { debounce, cloneNodeWithEvents } from './index';

//Global Variables
let dragElement;
const placeholders = [];
const DEFAULT_OPTIONS = {
  sortable: false,
  acceptFrom: '',
  placeholderClass: '',
  copy: true,
  addOnDrop: true,
};
export class Draggable {
  dragContainer: HTMLElement;
  options;
  childElements = [];
  acceptFrom = [];
  placeholder: HTMLElement;
  nextSibling: HTMLElement;
  previousContainer;
  cancelDebouncedDrag;
  dropped = false;

  debouncedSetElement = debounce(
    (childElements, draggingElement, y) => {
      if (this.cancelDebouncedDrag) {
        return;
      }

      const afterElement = this.getDragAfterElement(childElements, y);

      let newElement;
      // dragging inside the same container, so no need to add placeholder
      if (draggingElement.parentElement.id === this.dragContainer.id) {
        newElement = draggingElement;
      } else {
        this.placeholder ||= this.createPlaceholder(draggingElement);
        newElement = this.placeholder;
      }
      this.addElement(newElement, afterElement);
    },
    this,
    5
  );

  constructor(container, options) {
    this.dragContainer = container;
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.acceptFrom = this.options.acceptFrom
      ? this.options.acceptFrom.split(',')
      : [];
    this.options.sortable && this.acceptFrom.push(this.dragContainer.id);
    this.addListeners();
  }

  private onDragStart = (e) => {
    dragElement = e.target;
    this.dropped = false;
    this.cancelDebouncedDrag = false;

    // Set dragElementId for Firefox
    e.dataTransfer.setData('text/plain', dragElement.id);

    // Set all items inside the drag container except the current element
    this.childElements = Array.from(this.dragContainer.children);
    const draggingElementIndex = this.childElements.indexOf(dragElement);
    this.nextSibling = this.childElements[draggingElementIndex + 1];
    this.childElements.splice(draggingElementIndex, 1);
    e.stopPropagation();
  };

  private onDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!this.canAcceptDragElement() || this.isDropNotAllowed()) {
      // Dispatch a custom event when drag enters the invalid field in container shows error message
      this.dragContainer.dispatchEvent(
        new CustomEvent('fwDragEnterBase', {
          cancelable: true,
          bubbles: false,
          detail: {
            droppedElement: dragElement,
            dragContainer: this.dragContainer, // Return the drop container ID
          },
        })
      );
      return;
    }
    const sortContainer = e
      .composedPath()
      .find((el) => el.id === this.dragContainer.id);
    if (sortContainer && sortContainer !== this.previousContainer) {
      this.childElements = Array.from(this.dragContainer.children);
      // the drag element have entered or re-entered current drag container
      this.cancelDebouncedDrag = false;
    }
    this.previousContainer = sortContainer;
  };

  private isDropNotAllowed() {
    const inValidTypesForSection = [
      'DEPENDENT_FIELD',
      'MULTI_SELECT',
      'RELATIONSHIP',
    ];
    const dragId = this.dragContainer.id;
    const isSection = dragId.includes('sectionIdentifier-');
    const isFieldTypeNotAllowed = inValidTypesForSection.includes(
      dragElement.dataProvider?.type
    );

    // Check if the DROPDOWN is default field
    const isDropdownDefaultField =
      dragElement.dataProvider?.type === 'DROPDOWN' &&
      !dragElement.dataProvider.custom;

    const isNewField =
      dragElement.dataProvider?.choices?.length > 0 &&
      dragElement.dataProvider?.choices[0]?.value === '';

    // Allow dropping if it's a new DROPDOWN field
    const isAllowedNewDropdown =
      dragElement.dataProvider?.type === 'DROPDOWN' && isNewField;

    // Check if the DROPDOWN has field_options with hasSections
    const hasSectionsInFieldOptions =
      dragElement.dataProvider?.type === 'DROPDOWN' &&
      dragElement.dataProvider?.field_options &&
      dragElement.dataProvider?.field_options.has_sections;

    // Check if the section already has the maximum number of fields
    const isSectionFieldLimitExceeded =
      this.dragContainer?.children?.length > 15;

    // Check if the dragElement is present and the field is required
    const isFieldRequired = dragElement?.dataProvider?.required;
    return (
      isSection &&
      (isFieldTypeNotAllowed ||
        isFieldRequired ||
        isSectionFieldLimitExceeded ||
        (isDropdownDefaultField && !isAllowedNewDropdown) ||
        hasSectionsInFieldOptions)
    );
  }

  private onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.canAcceptDragElement() || this.isDropNotAllowed) {
      // Dispatch a custom event when invalid field leaving the container so error message should be hide
      this.dragContainer.dispatchEvent(
        new CustomEvent('fwDragLeaveBase', {
          cancelable: true,
          bubbles: false,
          detail: {
            droppedElement: dragElement,
            dropToId: this.dragContainer.id, // Return the drop container ID
          },
        })
      );
      return;
    }
    const outTarget = e.fromElement || e.relatedTarget;
    if (!e.currentTarget.contains(outTarget)) {
      // Check whether the outTarget's host (in case of shadow dom) exists in currentTarget
      const parentHost = this.getMatchingHost(
        outTarget,
        this.dragContainer.children[0].tagName
      );
      if (!e.currentTarget.contains(parentHost)) {
        // the drag element have left the current container(this.host)
        this.previousContainer = undefined;
      }
    }
  };

  private onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.canAcceptDragElement() || this.isDropNotAllowed()) {
      // Dispatch a custom event when drop the invalid field so error message should be shown
      this.dragContainer.dispatchEvent(
        new CustomEvent('fwDragEnterBase', {
          cancelable: true,
          bubbles: false,
          detail: {
            droppedElement: dragElement,
            dragContainer: this.dragContainer, // Return the drop container ID
          },
        })
      );
      return;
    }
    this.debouncedSetElement(this.childElements, dragElement, e.clientY);
  };

  // Both dragend and drop need to used as the drop will be fired only on the container on which the drag is dropped
  // and no on the container where drag is originated.
  private onDragEnd = (e) => {
    if ((!this.dropped || placeholders.length > 0) && dragElement) {
      // The drag element is dropped outside the drag container
      this.addElement(dragElement, this.nextSibling);
      this.removePlaceholder();
    }
    this.resetData(e);
  };

  private onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.canAcceptDragElement() || this.isDropNotAllowed()) {
      // Dispatch a custom event when drop the invalid field so error message should be hide
      this.dragContainer.dispatchEvent(
        new CustomEvent('fwDragLeaveBase', {
          cancelable: true,
          bubbles: false,
          detail: {
            droppedElement: dragElement,
            dropToId: this.dragContainer.id, // Return the drop container ID
          },
        })
      );
      return;
    }
    this.dropped = true;
    const sortContainerId = dragElement.parentElement.id;
    const newElement = this.placeholder || dragElement;

    // Get all children except the empty section
    const relevantChildren = [...this.dragContainer.children].filter(
      (child) => !child.classList.contains('empty-section')
    );
    const droppedIndex = [...relevantChildren].indexOf(newElement);
    if (this.placeholder) {
      if (this.options.addOnDrop) {
        const clone = this.options.copy
          ? cloneNodeWithEvents(dragElement, true, true)
          : dragElement;
        this.placeholder.replaceWith(clone);
      } else {
        this.removePlaceholder();
      }
    }
    this.dragContainer.dispatchEvent(
      new CustomEvent('fwDropBase', {
        cancelable: true,
        bubbles: false,
        detail: {
          droppedElement: dragElement,
          droppedIndex,
          dragFromId: sortContainerId,
          dropToId: this.dragContainer.id,
        },
      })
    );
    this.resetData(e);
  };

  addListeners() {
    this.dragContainer.addEventListener('dragstart', this.onDragStart);
    this.dragContainer.addEventListener('dragend', this.onDragEnd);
    this.dragContainer.addEventListener('dragenter', this.onDragEnter);
    this.dragContainer.addEventListener('dragleave', this.onDragLeave);
    this.dragContainer.addEventListener('dragover', this.onDragOver);
    this.dragContainer.addEventListener('drop', this.onDrop);
  }

  removeListeners() {
    this.dragContainer.removeEventListener('dragstart', this.onDragStart);
    this.dragContainer.removeEventListener('dragend', this.onDragEnd);
    this.dragContainer.removeEventListener('dragenter', this.onDragEnter);
    this.dragContainer.removeEventListener('dragleave', this.onDragLeave);
    this.dragContainer.removeEventListener('dragover', this.onDragOver);
    this.dragContainer.removeEventListener('drop', this.onDrop);
  }

  getDragAfterElement(elements, y) {
    return elements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        // Subtracting mouse y position with the middle of the element
        // to check whether the dragging element is above an element
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  createPlaceholder(sourceElement) {
    const placeholderClass = this.options.placeholderClass;
    const containerTag = this.dragContainer.tagName;
    let placeholder;
    if (['UL', 'OL'].includes(containerTag)) {
      placeholder = document.createElement('li');
    } else if (['TABLE', 'TBODY'].includes(containerTag)) {
      placeholder = document.createElement('tr');
      // set colspan to always all rows, otherwise the item can only be dropped in first column
      placeholder.innerHTML = '<td colspan="100"></td>';
    } else {
      placeholder = document.createElement('div');
    }
    // set style for the placeholder
    if (typeof placeholderClass === 'string' && placeholderClass) {
      placeholder.classList.add(...placeholderClass.split(' '));
    } else {
      placeholder.style.height = this.getElementHeight(sourceElement) + 'px';
      placeholder.style.width = this.getElementWidth(sourceElement) + 'px';
    }
    placeholders.push(placeholder);
    return placeholder;
  }

  removePlaceholder() {
    placeholders.forEach((placeholder) => {
      placeholder.remove();
    });
    // TODO: better way of removing the this.placeholder
  }

  addElement(newElement, nextElement) {
    if (nextElement) {
      if (
        this.canInsertBefore(nextElement) &&
        !newElement?.isSameNode(nextElement)
      ) {
        this.dragContainer.insertBefore(newElement, nextElement);
      }
      return;
    }
    this.canAppendTo(this.dragContainer) &&
      this.dragContainer.appendChild(newElement);
  }

  canAcceptDragElement() {
    if (!dragElement) {
      return false;
    }
    const sortContainerId = dragElement.parentElement.id;
    return (
      this.acceptFrom.includes(sortContainerId) ||
      sortContainerId.includes('sectionIdentifier-') //When it is moving from section container to outside.
    );
  }

  canInsertBefore(element) {
    return element && element.pinned !== 'top';
  }

  canAppendTo(container) {
    return container.lastElementChild.pinned !== 'bottom';
  }

  getHost(element) {
    return element.getRootNode().host;
  }

  getMatchingHost(element, tagName) {
    let matchingElement = element;
    while (matchingElement) {
      matchingElement = this.getHost(matchingElement);
      if (matchingElement && matchingElement.tagName === tagName) {
        return matchingElement;
      }
    }
    return undefined;
  }

  resetData(e) {
    e.dataTransfer.clearData();
    this.previousContainer = undefined;
    dragElement = undefined;
    this.placeholder = undefined;
    this.cancelDebouncedDrag = true;
  }

  getElementHeight(element) {
    if (!(element instanceof HTMLElement)) {
      throw new Error('You must provide a valid dom element');
    }
    // get calculated style of element
    const style = window.getComputedStyle(element);
    // get only height if element has box-sizing: border-box specified
    if (style.getPropertyValue('box-sizing') === 'border-box') {
      return parseInt(style.getPropertyValue('height'), 10);
    }
    // pick applicable properties, convert to int and reduce by adding
    return ['height', 'padding-top', 'padding-bottom']
      .map(function (key) {
        const int = parseInt(style.getPropertyValue(key), 10);
        return isNaN(int) ? 0 : int;
      })
      .reduce(function (sum, value) {
        return sum + value;
      });
  }

  getElementWidth(element) {
    if (!(element instanceof HTMLElement)) {
      throw new Error('You must provide a valid dom element');
    }
    // get calculated style of element
    const style = window.getComputedStyle(element);
    // pick applicable properties, convert to int and reduce by adding
    return ['width', 'padding-left', 'padding-right']
      .map(function (key) {
        const int = parseInt(style.getPropertyValue(key), 10);
        return isNaN(int) ? 0 : int;
      })
      .reduce(function (sum, value) {
        return sum + value;
      });
  }

  destroy() {
    this.removeListeners();
  }
}
