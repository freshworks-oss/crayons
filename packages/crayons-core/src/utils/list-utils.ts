/* tslint:enable */

// function to parse string or array as input and return the array state value
export function validateAndParseInputSelectedValues(
  inputValue: string | string[]
): {
  isArray: boolean;
  strSelectedValues: string;
  arrSelectedValues: string[];
} {
  let arrParsedValues = [];
  let boolArrayInput = false;
  const strParsedValues = inputValue ? inputValue.toString() : '';

  if (inputValue) {
    boolArrayInput = Array.isArray(inputValue) ? true : false;
    if (boolArrayInput) {
      arrParsedValues = [...inputValue];
    } else {
      arrParsedValues =
        strParsedValues !== '' ? strParsedValues.split(',') : [];
    }
  }
  return {
    isArray: boolArrayInput,
    strSelectedValues: strParsedValues,
    arrSelectedValues: arrParsedValues,
  };
}

// function to return the selected values
export function updateSelectedValues(
  arrChildElements = null,
  intSelectedIndex = -1,
  boolSelected = true,
  boolMultipleSelection = false,
  arrSelectedValues = null
): Array<string> {
  // Check if the values passed for setting the selected index and child elements array are valid
  if (
    intSelectedIndex < 0 ||
    !arrChildElements ||
    arrChildElements.length <= 0 ||
    intSelectedIndex > arrChildElements.length - 1
  ) {
    return arrSelectedValues;
  }

  if (!arrSelectedValues) {
    arrSelectedValues = [];
  }

  const strValue = arrChildElements[intSelectedIndex].value;
  const isValueStored =
    arrSelectedValues.length > 0 ? arrSelectedValues.includes(strValue) : false;

  // if loop to deselect the child item provided multiple selection is allowed
  if (!boolSelected && boolMultipleSelection && isValueStored) {
    let intSelectedChildIndex = -1;
    const intLength = arrSelectedValues.length;
    for (let i1 = 0; i1 < intLength; i1++) {
      if (arrSelectedValues[i1] === strValue) {
        intSelectedChildIndex = i1;
        break;
      }
    }

    // remove the selected item from the selected items array
    arrSelectedValues = [
      ...arrSelectedValues.slice(0, intSelectedChildIndex),
      ...arrSelectedValues.slice(intSelectedChildIndex + 1),
    ];
  } else if (boolSelected && !isValueStored) {
    if (boolMultipleSelection) {
      arrSelectedValues = [...arrSelectedValues, strValue];
    } else {
      arrSelectedValues = [strValue];
    }
  }
  return arrSelectedValues;
}

// function to update the selected state of the child - for both multiple selection and radio group support - based on the passed values argument
export function updateChildSelectionState(
  arrChildElements = null,
  boolMultipleSelection = false,
  arrSelectedValues = null,
  boolSetCheckboxType = false
): number {
  if (!arrChildElements || arrChildElements.length === 0) {
    return -1;
  }

  let numSelectedIndex = -1;
  let boolFirstItemSetSelected = false;
  const intLength = arrChildElements.length;
  for (let i1 = 0; i1 < intLength; i1++) {
    const elChild = arrChildElements[i1];
    const strChildValue = elChild.value;

    elChild.index = i1;
    if (boolSetCheckboxType) {
      elChild.isCheckbox = boolMultipleSelection;
    }

    const boolItemSelected =
      arrSelectedValues && arrSelectedValues.includes(strChildValue)
        ? true
        : false;
    let boolApplySelection = boolItemSelected;
    if (!boolMultipleSelection) {
      if (!boolFirstItemSetSelected && boolItemSelected) {
        boolFirstItemSetSelected = true;
        boolApplySelection = true;
      } else {
        boolApplySelection = false;
      }
    }
    elChild.selected = boolApplySelection;

    if (boolApplySelection && numSelectedIndex === -1) {
      numSelectedIndex = i1;
      elChild.setAttribute('tabindex', '0');
    } else {
      elChild.setAttribute('tabindex', '-1');
    }
  }
  return numSelectedIndex;
}

// function to validate the arrow and select the susequent children based on key press
export function doKeyDownOperations(
  keyCode: string,
  arrChildElements = null,
  intCurrentIndex = 0,
  boolMultipleSelection = false
): { index: number; changeSelection: boolean; selected: boolean } {
  // check for the valid children
  if (!arrChildElements || arrChildElements.length === 0) {
    return { index: intCurrentIndex, changeSelection: false, selected: false };
  }

  if (intCurrentIndex < 0) {
    intCurrentIndex = 0;
  }

  switch (keyCode) {
    case 'ArrowDown':
    case 'ArrowRight':
      arrChildElements[intCurrentIndex].setAttribute('tabindex', '-1');
      // set currently selectedIndex using roving tabindex technique
      intCurrentIndex = ++intCurrentIndex % arrChildElements.length;
      arrChildElements[intCurrentIndex].setAttribute('tabindex', '0');
      arrChildElements[intCurrentIndex].setFocus();
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
      arrChildElements[intCurrentIndex].setAttribute('tabindex', '-1');
      intCurrentIndex =
        intCurrentIndex === 0 ? arrChildElements.length - 1 : --intCurrentIndex;
      arrChildElements[intCurrentIndex].setAttribute('tabindex', '0');
      arrChildElements[intCurrentIndex].setFocus();
      break;
    case 'Enter':
    case 'Space': {
      arrChildElements[intCurrentIndex].setFocus();
      const boolCurrentItemSelection =
        arrChildElements[intCurrentIndex].selected;

      // return if multiple selection in the group is not allowed and the item is already selected
      if (!boolMultipleSelection && boolCurrentItemSelection) {
        return;
      }
      const boolApplySelectState = boolMultipleSelection
        ? !boolCurrentItemSelection
        : true;

      return {
        index: intCurrentIndex,
        changeSelection: true,
        selected: boolApplySelectState,
      };
    }
  }

  return {
    index: intCurrentIndex,
    changeSelection: false,
    selected: false,
  };
}

export const parseBoolean = (value: any) => {
  if (typeof value === 'string') {
    return value === 'true';
  }
  return !!value;
};
