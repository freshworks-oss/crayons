/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import isPlainObject from 'lodash/isPlainObject';
import clone from 'lodash/clone';
import toPath from 'lodash/toPath';
import * as Yup from 'yup';
import { FormValues } from './form-declaration';
import { TranslationController } from '../../global/Translation';

export const isSelectType = (type: string): boolean =>
  !!type && type === 'select';

export const getElementValue = (
  _type: string,
  event: any,
  result: any
): any => {
  let value: any = result && result.value;
  if (!result) {
    value = event && event.target && event.target.value;
  }
  return value;
};

/**
 * Recursively prepare values.
 */
export function prepareDataForValidation(values: [] | any) {
  const data: any = Array.isArray(values) ? [] : {};
  for (const k in values) {
    if (Object.prototype.hasOwnProperty.call(values, k)) {
      const key: any = String(k);
      if (Array.isArray(values[key]) === true) {
        data[key] = values[key].map((value: any) => {
          if (Array.isArray(value) === true || isPlainObject(value)) {
            return prepareDataForValidation(value);
          } else {
            return value !== '' ? value : undefined;
          }
        });
      } else if (isPlainObject(values[key])) {
        data[key] = prepareDataForValidation(values[key]);
      } else {
        data[key] = values[key] !== '' ? values[key] : undefined;
      }
    }
  }
  return data;
}

export function validateYupSchema(values: any, schema: any): Promise<any> {
  const validateData = prepareDataForValidation(values);
  return schema['validate'](validateData, {
    abortEarly: false,
  });
}

export function yupToFormErrors(yupError: any) {
  let errors = {};
  if (yupError.inner) {
    if (yupError.inner.length === 0) {
      return setIn(errors, yupError.path, yupError.message);
    }
    for (const err of yupError.inner) {
      if (!getIn(errors, err.path)) {
        errors = setIn(errors, err.path, err.message);
      }
    }
  }
  return errors || {};
}
/** @private is the given object an Object? */
export const isObject = (obj: any) => obj !== null && typeof obj === 'object';

/** @private is the given object an integer? */
export const isInteger = (obj: any): boolean =>
  String(Math.floor(Number(obj))) === obj;

/**
 * Deeply get a value from an object via its path.
 */
export function getIn(obj: any, key: string | string[], def?: any, p = 0) {
  const path = toPath(key);
  while (obj && p < path.length) {
    obj = obj[path[p++]];
  }
  return obj === undefined ? def : obj;
}
/** set values recursively on the object based on the given path */
export function setIn(obj: any, path: string, value: any): any {
  const res: any = clone(obj);
  let resVal: any = res;
  let i = 0;
  const pathArray = toPath(path);

  for (; i < pathArray.length - 1; i++) {
    const currentPath: string = pathArray[i];
    const currentObj: any = getIn(obj, pathArray.slice(0, i + 1));

    if (currentObj && (isObject(currentObj) || Array.isArray(currentObj))) {
      resVal = resVal[currentPath] = clone(currentObj);
    } else {
      const nextPath: string = pathArray[i + 1];
      resVal = resVal[currentPath] =
        isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
    }
  }

  // Return original object if new value is the same as current
  if ((i === 0 ? obj : resVal)[pathArray[i]] === value) {
    return obj;
  }

  if (value === undefined) {
    delete resVal[pathArray[i]];
  } else {
    resVal[pathArray[i]] = value;
  }

  // If the path array has a single element, the loop did not run.
  // Deleting on `resVal` had no effect in this scenario, so we delete on the result instead.
  if (i === 0 && value === undefined) {
    delete res[pathArray[i]];
  }

  return res;
}

/**
 * Recursively a set the same value for all keys and arrays nested object, cloning
 * @param object
 * @param value
 * @param visited
 * @param response
 */
export function setNestedObjectValues<T>(
  object: any,
  value: any,
  visited: any = new WeakMap(),
  response: any = {}
): T {
  for (const k of Object.keys(object)) {
    const val = object[k];
    if (isObject(val)) {
      if (!visited.get(val)) {
        visited.set(val, true);
        // In order to keep array values consistent for both dot path  and
        // bracket syntax, we need to check if this is an array so that
        // this will output  { friends: [true] } and not { friends: { "0": true } }
        response[k] = Array.isArray(val) ? [] : {};
        setNestedObjectValues(val, value, visited, response[k]);
      }
    } else {
      response[k] = value;
    }
  }

  return response;
}

function mergeSchema(first: any = {}, second: any = {}) {
  return first.concat(second);
}

function createYupSchema(schema: any, config: any) {
  const { type, required, name, hidden, editable } = config;
  let yupType;
  switch (type) {
    case 'TEXT':
    case 'PARAGRAPH':
    case 'DATE':
    case 'DATE_TIME':
    case 'TIME':
    case 'RADIO':
    case 'EMAIL':
    case 'TEL':
    case 'URL':
    case 'DROPDOWN':
      yupType = 'string';
      break;
    case 'MULTI_SELECT':
    case 'RELATIONSHIP':
    case 'AUTO_COMPLETE':
    case 'FILES':
      yupType = 'array';
      break;
    case 'NUMBER':
    case 'DECIMAL':
      yupType = 'number';
      break;
    case 'CHECKBOX':
      yupType = 'boolean';
      break;
    default:
      yupType = 'string';
  }
  if (!type || !editable || hidden) return schema;
  if (!Yup[yupType as keyof typeof Yup]) {
    return schema;
  }
  const yupMethod = yupType as keyof typeof Yup;
  let validator = Yup[yupMethod] as any;

  validator = validator().nullable();

  if (required) validator = validator['required']('form.required');
  else validator = validator['notRequired']();

  if (type === 'URL') validator = validator['url']('form.invalidUrl');

  if (type === 'EMAIL') validator = validator['email']('form.invalidEmail');

  if (type === 'NUMBER') validator = validator['integer']('form.invalidNumber');

  if (type === 'CHECKBOX' && required)
    validator = validator['oneOf']([true], `form.required`);

  if (
    (type === 'DROPDOWN' ||
      type === 'MULTI_SELECT' ||
      type === 'AUTO_COMPLETE' ||
      type === 'RELATIONSHIP') &&
    required
  )
    validator = validator.min(1, `form.required`);

  if (type === 'FILES' && required)
    validator = validator
      .transform((_value) => {
        return _value.filter(
          (file) =>
            !file.progress ||
            (file.progress &&
              file.progress !== -1 &&
              file.progress >= 0 &&
              file.progress < 100)
        );
      })
      .min(1, `form.required`);

  if (type === 'RELATIONSHIP' || type === 'AUTO_COMPLETE')
    validator = validator.transform((_value, originalVal) => {
      return Array.isArray(originalVal)
        ? originalVal
        : originalVal !== '' &&
          originalVal !== null &&
          originalVal !== undefined
        ? [originalVal]
        : [];
    });

  schema[name] = validator;
  return schema;
}

export const generateDynamicValidationSchema = (
  formSchema: any = {},
  validationSchema: any = {}
): any => {
  let dynamicValidationSchema = Yup.object();
  try {
    const yupSchema = formSchema?.fields?.reduce(createYupSchema, {});

    // form the implicit validation schema based on the fields in formSchema
    dynamicValidationSchema =
      (yupSchema && Yup.object().shape(yupSchema as any)) ?? Yup.object();

    const formValidationSchema = mergeSchema(
      dynamicValidationSchema || Yup.object(),
      validationSchema && Object.keys(validationSchema).length
        ? validationSchema
        : Yup.object()
    );
    return formValidationSchema;
  } catch (err) {
    console.error(
      'Error in merging validationSchema with implicit validation rules. Please check if you are using `0.32` version of `Yup` for `validationSchema` ',
      err.message
    );
    return dynamicValidationSchema;
  }
};

export const generateDynamicInitialValues = (
  formSchema: any,
  initialValues: FormValues = {}
): FormValues => {
  const getInitialValueFromType = (type) => {
    let initialValue;
    switch (type) {
      case 'CHECKBOX':
        initialValue = false;
        break;
      case 'FILES':
        initialValue = [];
        break;
      default:
        break;
    }
    return initialValue;
  };
  const dynamicInitialValues =
    formSchema?.fields?.reduce((acc: any, field: any) => {
      if (!field?.type) {
        return null;
      }
      return {
        ...acc,
        [field.name]: getInitialValueFromType(field.type),
      };
    }, {}) || {};
  const formInitialValues = { ...dynamicInitialValues, ...initialValues };
  return formInitialValues;
};

export const serializeForm = (
  values: FormValues = {},
  fields: any = {}
): FormValues => {
  let newValues = { ...values };

  newValues = Object.entries(newValues).reduce((acc, [key, val]) => {
    const type = fields[key]?.type;
    switch (type) {
      case 'NUMBER':
      case 'DECIMAL':
        const parsed = parseFloat(val);
        return { ...acc, [key]: isNaN(parsed) ? undefined : parsed };
      case 'DATE':
      case 'DATE_TIME':
        if (!val) return { ...acc, [key]: undefined };
        // if the value is of the ISO UTC time format, timezone offset need not be calculated
        // when datepicker is used in form component, the value will be passed to form in UTC ISO format, hence skipping.
        const utcTimeRegex =
          /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})/;
        // If ISO format, format it to display format and validate

        let date;

        if (utcTimeRegex.test(val)) {
          date = new Date(val);
        } else {
          date = new Date(handleUserTimeZoneOffset(val));
        }

        if (date.toString() === 'Invalid Date') {
          return { ...acc, [key]: undefined };
        }
        const year = date.getFullYear();
        let month: string | number = date.getMonth() + 1;
        let dt: string | number = date.getDate();

        /** prepend 0 if the date/month is less than 10 */
        dt = ('0' + dt).slice(-2);
        month = ('0' + month).slice(-2);

        return { ...acc, [key]: `${year}-${month}-${dt}` };
      case 'RELATIONSHIP':
      case 'AUTO_COMPLETE':
        if (Array.isArray(val) && typeof val[0] === 'object') {
          if (val.length > 1) {
            // multiselect
            return { ...acc, [key]: val?.map((v) => v.value) };
          }
          return { ...acc, [key]: val?.map((v) => v.value)[0] };
        }

        return { ...acc, [key]: val };
      case 'FILES':
        const data = new DataTransfer();
        val.forEach((uploaderFile) => {
          data.items.add(uploaderFile.file);
        });
        return { ...acc, [key]: data.files };
      default:
        return { ...acc, [key]: val };
    }
  }, {});

  return newValues;
};

export const translateErrors = async (errors = {}, fields) => {
  if (!errors) return {};

  return Object.keys(errors)?.reduce(
    (
      acc: {
        [key: string]: string;
      },
      key: string
    ) => {
      if (key && errors[key]) {
        return {
          ...acc,
          [key]: TranslationController.t(errors[key], {
            field: fields?.[key]?.label || fields?.[key]?.name || '',
          }),
        };
      }
      return { ...acc };
    },
    {}
  );
};

export const formServFieldTypes = {
  '1': { type: 'TEXT' },
  '2': { type: 'DROPDOWN' },
  '3': { type: 'EMAIL' },
  '4': { type: 'PHONE_NUMBER' },
  '5': { type: 'CHECKBOX' },
  '6': { type: 'PARAGRAPH' },
  '7': { type: 'DATE_TIME' },
  '8': { type: 'NUMBER' },
  '10': { type: 'URL' },
  '12': { type: 'RADIO' },
  '13': { type: 'DECIMAL' },
  '14': { type: 'SECTION' },
  '16': { type: 'AUTO_COMPLETE' },
  '17': { type: 'DATE' },
  '18': { type: 'MULTI_SELECT' },
  '20': { type: 'BIG_NUMBER' },
  '22': { type: 'DEPENDENT_FIELD' },
};

export const LEGO = 'LEGO';
export const FORMSERV = 'FORMSERV';
export const CUSTOM = 'CUSTOM';

const supportedMapperTypes = [LEGO, FORMSERV, CUSTOM];

export function getMappedSchema({
  type = LEGO,
  schema = { fields: [] },
  customTypeMapper = {},
} = {}) {
  if (!supportedMapperTypes.includes(type)) {
    console.error(
      `invalid mapperType: ${type} prop passed. It must be one of ${supportedMapperTypes}`
    );
    return { fields: [] };
  }
  if (type === LEGO) return schema;
  else {
    const mapperTypes =
      type === FORMSERV ? formServFieldTypes : customTypeMapper;
    if (type === CUSTOM && !customTypeMapper) {
      console.error(
        'invalid customTypeMapper prop passed. Please check the documentation for the correct format'
      );
      return { fields: [] };
    }
    const newFields =
      schema?.fields?.map((field) => {
        return {
          ...field,
          type: mapperTypes[field?.type]?.type,
        };
      }) ?? [];
    const newSchema = { ...schema, fields: newFields };
    return newSchema;
  }
}

export function getValueForField(values, field) {
  let value;
  const type = field?.type?.toUpperCase() ?? 'TEXT';
  switch (type) {
    case 'CHECKBOX':
      value = !!values[field.name];
      break;
    case 'MULTI_SELECT':
      value = values[field.name] ?? [];
      break;
    case 'DROPDOWN':
      value = values[field.name] ?? '';
      break;
    default:
      value = values[field.name];
  }
  return value;
}

const handleUserTimeZoneOffset = (date) => {
  return (
    new Date(date).valueOf() + new Date(date).getTimezoneOffset() * 60 * 1000
  );
};
