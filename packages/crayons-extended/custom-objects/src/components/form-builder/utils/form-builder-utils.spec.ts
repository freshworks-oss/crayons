jest.mock('../../../global/Translation', () => ({
  TranslationController: {
    t: jest.fn(),
  },
}));

import {
  getFieldBasedOnLevel,
  getDependentLevels,
  updateFieldAttributes,
  hasStringDuplicates,
  updateLevelSelection,
  updateRequiredOnAllFields,
  getDefaultDependentLevels,
  deleteChoicesInFields,
  updateChoicesInFields,
  buildChoicesFromText,
  getParentId,
  getChildChoices,
  getMaximumLimitsConfig,
  mergeHostFieldLimits,
  buildAllowedFieldTypesConfig,
  buildVisibleFieldIndexMap,
  resolveDroppedIndex,
} from './form-builder-utils';

describe('getFieldBasedOnLevel', () => {
  const data = {
    fields: [
      {
        level: '1',
        name: 'One',
        fields: [
          {
            level: '2',
            name: 'Two',
            fields: [
              {
                level: '3',
                name: 'Three',
              },
            ],
          },
        ],
      },
    ],
  };

  it('Should return the level 1 field properties', () => {
    expect(getFieldBasedOnLevel(data, 1)).toMatchObject({
      level: '1',
      name: 'One',
    });
  });

  it('Should return the level 3 field properties', () => {
    expect(getFieldBasedOnLevel(data, 3)).toMatchObject({
      level: '3',
      name: 'Three',
    });
  });
});

describe('getDependentLevels', () => {
  it('returns an empty object if level is not provided', () => {
    expect(getDependentLevels({}, [], [], null)).toEqual({});
  });

  it('uses IDs from choices array if ids array is empty', () => {
    const levels = { level_1: '1' };
    const choices = [{ id: '2' }, { id: '3' }];
    const result = getDependentLevels(levels, choices, [], '2');
    expect(result['level_2']).toBe('2');
  });

  it('uses provided ids array', () => {
    const levels = { level_1: '1' };
    const ids = ['4', '5'];
    const result = getDependentLevels(levels, [], ids, '2');
    expect(result['level_2']).toBe('4');
  });

  it('returns original levels if selectedId is in choiceIds', () => {
    const levels = { level_1: '1' };
    const choices = [{ id: '1' }, { id: '2' }];
    const result = getDependentLevels(levels, choices, [], '1');
    expect(result).toEqual(levels);
  });

  it('returns modified levels if selectedId is not in choiceIds', () => {
    const levels = { level_1: '1' };
    const choices = [{ id: '2' }, { id: '3' }];
    const result = getDependentLevels(levels, choices, [], '1');
    expect(result).toEqual({ level_1: '2', ...levels });
  });
});

describe('updateFieldAttributes', () => {
  it('updates root level fields when level is not provided', () => {
    const data = { label: 'Old Label', name: 'Old Name' };
    const updatedData = updateFieldAttributes(data, null, {
      label: 'New Label',
      name: 'New Name',
    });
    expect(updatedData).toEqual({ label: 'New Label', name: 'New Name' });
  });

  it('updates dependent field attributes', () => {
    const data = {
      fields: [{ level: 1, label: 'Old Label', name: 'Old Name' }],
    };
    const updatedData = updateFieldAttributes(data, 1, {
      label: 'New Label',
      name: 'New Name',
    });
    expect(updatedData.fields[0]).toEqual({
      level: 1,
      label: 'New Label',
      name: 'New Name',
    });
  });

  it('updates internalName in the dependent field', () => {
    const data = { fields: [{ level: 1, internalName: 'Old Name' }] };
    const updatedData = updateFieldAttributes(data, 1, {
      internalName: 'New Internal Name',
    });
    expect(updatedData.fields[0].internalName).toBe('New Internal Name');
  });

  it('updates choices in the dependent field', () => {
    const data = { fields: [{ level: 1, choices: ['Choice 1'] }] };
    const updatedData = updateFieldAttributes(data, 1, {
      choices: ['Choice 2', 'Choice 3'],
    });
    expect(updatedData.fields[0].choices).toEqual(['Choice 2', 'Choice 3']);
  });

  it('updates type in the dependent field', () => {
    const data = { fields: [{ level: 1, type: 'Old Type' }] };
    const updatedData = updateFieldAttributes(data, 1, { type: 'New Type' });
    expect(updatedData.fields[0].type).toBe('New Type');
  });

  it('returns original data if no updates are provided', () => {
    const data = { label: 'Label', name: 'Name' };
    const updatedData = updateFieldAttributes(data, null, {});
    expect(updatedData).toEqual(data);
  });
});

describe('hasStringDuplicates', () => {
  const mockI18nText = (key) => `Localized message for ${key}`;

  it('returns an empty object when there are no duplicates', () => {
    const stringObj = { a: 'hello', b: 'world' };
    expect(hasStringDuplicates(stringObj, mockI18nText)).toEqual({});
  });

  it('identifies a single duplicate and returns the correct message', () => {
    const stringObj = { a: 'duplicate', b: 'duplicate' };
    expect(hasStringDuplicates(stringObj, mockI18nText)).toEqual({
      a: 'Localized message for errors.fieldNameExists',
      b: 'Localized message for errors.fieldNameExists',
    });
  });

  it('identifies multiple duplicates and returns correct messages', () => {
    const stringObj = {
      a: 'duplicate',
      b: 'duplicate',
      c: 'unique',
      d: 'duplicate',
    };
    expect(hasStringDuplicates(stringObj, mockI18nText)).toEqual({
      a: 'Localized message for errors.fieldNameExists',
      b: 'Localized message for errors.fieldNameExists',
      d: 'Localized message for errors.fieldNameExists',
    });
  });

  it('does not consider empty strings as duplicates', () => {
    const stringObj = { a: '', b: '', c: 'hello' };
    expect(hasStringDuplicates(stringObj, mockI18nText)).toEqual({});
  });

  it('considers only string values for duplicates', () => {
    const stringObj = { a: 123, b: '123', c: '123' };
    expect(hasStringDuplicates(stringObj, mockI18nText)).toEqual({
      b: 'Localized message for errors.fieldNameExists',
      c: 'Localized message for errors.fieldNameExists',
    });
  });
});

describe('updateLevelSelection', () => {
  it('does nothing if isDependentField is false', () => {
    const instance = {
      isDependentField: false,
      dependentLevels: { level_1: 'id1' },
    };
    const event = { detail: { level: 1, id: 'newId' } };
    expect(updateLevelSelection(instance, event)).toBeUndefined();
  });

  it('updates a single level', () => {
    const instance = {
      isDependentField: true,
      dependentLevels: { level_1: 'id1' },
    };
    const event = { detail: { level: 1, id: 'newId' } };
    expect(updateLevelSelection(instance, event)).toEqual({ level_1: 'newId' });
  });

  it('updates the selected level and removes higher levels', () => {
    const instance = {
      isDependentField: true,
      dependentLevels: { level_1: 'id1', level_2: 'id2', level_3: 'id3' },
    };
    const event = { detail: { level: 2, id: 'newId2' } };
    expect(updateLevelSelection(instance, event)).toEqual({
      level_1: 'id1',
      level_2: 'newId2',
    });
  });

  it('adds a new level if event level is higher', () => {
    const instance = {
      isDependentField: true,
      dependentLevels: { level_1: 'id1' },
    };
    const event = { detail: { level: 3, id: 'newId3' } };
    expect(updateLevelSelection(instance, event)).toEqual({
      level_1: 'id1',
      level_3: 'newId3',
    });
  });
});

describe('updateRequiredOnAllFields', () => {
  it('updates the required attribute of a single field', () => {
    const data = { fields: [{ required: false }] };
    const updatedData = updateRequiredOnAllFields(data, true);
    expect(updatedData.fields[0].required).toBe(true);
  });

  it('updates the required attribute of nested fields', () => {
    const data = {
      fields: [
        {
          required: false,
          fields: [{ required: false }],
        },
      ],
    };
    const updatedData = updateRequiredOnAllFields(data, true);
    expect(updatedData.fields[0].required).toBe(true);
    expect(updatedData.fields[0].fields[0].required).toBe(true);
  });

  it('sets required to false when isRequired is false', () => {
    const data = { fields: [{ required: true }] };
    const updatedData = updateRequiredOnAllFields(data, false);
    expect(updatedData.fields[0].required).toBe(false);
  });
});

describe('getDefaultDependentLevels', () => {
  it('updates attributes of a single field', () => {
    const data = {
      fields: [{ name: 'internalNameField', label: 'Label', id: 'Id' }],
    };
    const updatedData = getDefaultDependentLevels(data, 'internalName');
    expect(updatedData.fields[0]).toEqual({
      name: 'Field',
      label: 'Label',
      id: 'Id',
    });
  });

  it('updates attributes of nested fields', () => {
    const data = {
      fields: [
        {
          name: 'internalNameField',
          label: 'Label',
          id: 'Id',
          fields: [{ name: 'internalNameSubField' }],
        },
      ],
    };
    const updatedData = getDefaultDependentLevels(data, 'internalName');
    expect(updatedData.fields[0].fields[0].name).toBe('SubField');
  });

  it('removes internalNamePrefix from field name', () => {
    const data = { fields: [{ name: 'internalNameField' }] };
    const updatedData = getDefaultDependentLevels(data, 'internalName');
    expect(updatedData.fields[0].name).toBe('Field');
  });

  it('sets default values for label and id', () => {
    const data = { fields: [{ name: 'Field' }] };
    const updatedData = getDefaultDependentLevels(data, '');
    expect(updatedData.fields[0].label).toBe('');
    expect(updatedData.fields[0].id).toBe('');
  });
});

describe('deleteChoicesInFields', () => {
  const instance = {
    fieldBuilderOptions: {
      fields: [
        {
          level: 1,
          choices: [
            {
              id: 'parentChoice',
              dependent_ids: { choice: ['choice1'] },
            },
            {
              id: 'parentChoice1',
              dependent_ids: { choice: [] },
            },
          ],
          fields: [
            {
              level: '2',
              choices: [
                {
                  id: 'currentChoice',
                  dependent_ids: { choice: ['choice1'] },
                },
                {
                  id: 'currentChoice1',
                  dependent_ids: { choice: [] },
                },
              ],
            },
          ],
        },
      ],
    },
  };

  const event = {
    detail: {
      level: 1,
      parentId: null,
      choice: { id: 'choice1', dependent_ids: { choice: [] } },
    },
  };

  it('deletes choice from parent field if parentId exists', () => {
    // Mock data setup
    event.detail.parentId = 'parentChoice';
    event.detail.level = 2;

    // Call the function
    const updatedField = deleteChoicesInFields(instance, event);
    expect(
      updatedField.fields[0].choices[0].dependent_ids.choice
    ).not.toContain('choice1');
  });

  it('deletes the specified choice in the current field', () => {
    // Mock data setup
    event.detail.parentId = null;
    event.detail.level = 1;
    instance.fieldBuilderOptions.fields = [
      {
        level: 1,
        choices: [
          {
            id: 'choice1',
            dependent_ids: { choice: [] },
          },
          {
            id: 'choice2',
            dependent_ids: { choice: [] },
          },
        ],
        fields: [],
      },
    ];

    // Call the function
    const updatedField = deleteChoicesInFields(instance, event);

    // Assertions
    expect(updatedField.fields[0].choices).toEqual(
      expect.arrayContaining([
        {
          dependent_ids: { choice: [] },
          id: 'choice2',
        },
      ])
    );
    expect(updatedField.fields[0].choices).not.toContainEqual({
      id: 'choice1',
    });
  });
});

describe('updateChoicesInFields', () => {
  const instance = {
    fieldBuilderOptions: {
      fields: [
        {
          level: '1',
          choices: [
            {
              id: 'parentChoice',
              dependent_ids: { choice: [], field: [] },
            },
          ],
          id: 'field1',
        },
      ],
    },
  };
  const event = {
    detail: { level: 1, parentId: null, value: [], choice: { id: 'choice1' } },
  };

  it('updates choices in the current field', () => {
    // Mock data setup
    instance.fieldBuilderOptions.fields = [
      { level: '1', choices: [], id: 'field1' },
    ];
    event.detail.value = [{ id: 'newChoice' }];

    // Call the function
    const updatedField = updateChoicesInFields(instance, event);

    // Assertions
    expect(updatedField.fields[0].choices).toEqual([{ id: 'newChoice' }]);
  });

  it('updates the parent field when parentId exists', () => {
    // Mock data setup
    event.detail.parentId = 'parentChoice';
    event.detail.level = 2;
    event.detail.value = [{ id: '1' }, { id: '2' }, { id: '3' }];
    instance.fieldBuilderOptions.fields = [
      {
        level: '1',
        choices: [
          {
            id: 'parentChoice',
            dependent_ids: { choice: [], field: [] },
          },
        ],
        id: 'field1',
        fields: [{ level: '2', choices: [], id: 'field2' }],
      },
    ];

    // Call the function
    const updatedField = updateChoicesInFields(instance, event);

    // Assertions for parent field update
    const parentChoice = updatedField.fields[0].choices[0];
    expect(parentChoice.dependent_ids.choice).toContain('choice1');
    expect(parentChoice.dependent_ids.field).toEqual(['field2']);
  });
});

describe('buildChoicesFromText', () => {
  const mockDataProvider = {
    fields: [
      {
        choices: [],
        fields: [
          {
            choices: [],
            fields: [{ choices: [] }],
          },
        ],
      },
    ],
  };
  const mockCreateUUID = jest.fn();
  let uuidCounter = 0;
  mockCreateUUID.mockImplementation(() => `uuid-${++uuidCounter}`);

  beforeEach(() => {
    uuidCounter = 0; // Reset UUID counter before each test
  });

  const text =
    'category 1\n\tsubcategory 1\n\t\titem 1\n\t\titem 2\n\tsubcategory 2\n\t\titem 3\n\tsubcategory 3\n\t\titem 4\ncategory 2\n\tsubcategory 4\n\t\titem 5\n';

  it('creates top-level categories correctly', () => {
    const result = buildChoicesFromText(text, mockDataProvider);
    expect(result.fields[0].choices).toHaveLength(2); // Two categories
    expect(result.fields[0].choices.map((choice) => choice.value)).toEqual([
      'category 1',
      'category 2',
    ]);
  });

  it('creates subcategories correctly', () => {
    const result = buildChoicesFromText(text, mockDataProvider);
    expect(result.fields[0].fields[0].choices).toHaveLength(4); // Four subcategories
    expect(
      result.fields[0].fields[0].choices.map((choice) => choice.value)
    ).toEqual([
      'subcategory 1',
      'subcategory 2',
      'subcategory 3',
      'subcategory 4',
    ]);
  });

  it('creates items correctly', () => {
    const result = buildChoicesFromText(text, mockDataProvider);
    expect(result.fields[0].fields[0].fields[0].choices).toHaveLength(5); // Five items
    expect(
      result.fields[0].fields[0].fields[0].choices.map((choice) => choice.value)
    ).toEqual(['item 1', 'item 2', 'item 3', 'item 4', 'item 5']);
  });
});

describe('getParentId', () => {
  const mockFindChoice = jest.fn();
  const mockPChoices = [{ id: 'choice1' }, { id: 'choice2' }];
  const dependentLevels = { level_1: 'choice1', level_2: 'choice2' };

  it('returns null when pLevel is not provided', () => {
    expect(getParentId(mockPChoices, null, dependentLevels)).toBeNull();
  });

  it('returns null when pChoices is not provided or empty', () => {
    expect(getParentId(null, 1, dependentLevels)).toBeNull();
    expect(getParentId([], 1, dependentLevels)).toBeNull();
  });

  it('returns the id of the found parent choice', () => {
    mockFindChoice.mockReturnValueOnce({ id: 'choice1' });
    expect(getParentId(mockPChoices, 1, dependentLevels)).toBe('choice1');
  });

  it('returns the id of the first choice when parent choice is not found', () => {
    mockFindChoice.mockReturnValueOnce(null);
    expect(getParentId(mockPChoices, 2, dependentLevels)).toBe('choice2');
  });
});

describe('getChildChoices', () => {
  const mockGetChoicesById = jest.fn();
  const mockGetParentId = jest.fn();
  const mockFindChoice = jest.fn();

  const field = { choices: ['choice1', 'choice2', 'choice3'] };
  const pChoices = [
    { id: 'parent1', dependent_ids: { choice: ['choice2', 'choice3'] } },
  ];
  const dependentLevels = { level_1: 'parent1' };

  it('returns default values when pLevel is not provided', () => {
    expect(getChildChoices(field, pChoices, null, dependentLevels)).toEqual({
      choices: field.choices,
      ids: [],
      pid: null,
    });
  });

  it('returns default values when pChoices is not provided or empty', () => {
    expect(getChildChoices(field, null, 1, dependentLevels)).toEqual({
      choices: field.choices,
      ids: [],
      pid: null,
    });
    expect(getChildChoices(field, [], 1, dependentLevels)).toEqual({
      choices: field.choices,
      ids: [],
      pid: null,
    });
  });

  it('returns the correct choices and ids when pId and pChoice are found', () => {
    mockGetParentId.mockReturnValueOnce('parent1');
    mockFindChoice.mockReturnValueOnce(pChoices[0]);
    mockGetChoicesById.mockReturnValueOnce(['choice2', 'choice3']);

    expect(getChildChoices(field, pChoices, 1, dependentLevels)).toEqual({
      ids: ['choice2', 'choice3'],
      choices: [],
      pId: 'parent1',
    });
  });
});
describe('getMaximumLimitsConfig', () => {
  it('returns maximum limits config for CUSTOM_OBJECTS', () => {
    const formMapper = {
      CUSTOM_OBJECTS: {
        maximumLimits: {
          DECIMAL: { count: 20, message: 'maximumLimits.fields' },
        },
      },
    };
    const result = getMaximumLimitsConfig();
    expect(result.DECIMAL.count).toEqual(
      formMapper.CUSTOM_OBJECTS.maximumLimits.DECIMAL.count
    );
  });

  it('returns maximum limits config for Internal Name', () => {
    const formMapper = {
      CUSTOM_OBJECTS: {
        maximumLimits: {
          maxInternalNameChars: {
            count: 50,
            message: 'maximumLimits.maxCharsWarning',
          },
        },
      },
    };
    const result = getMaximumLimitsConfig();
    expect(result.maxInternalNameChars.count).toEqual(
      formMapper.CUSTOM_OBJECTS.maximumLimits.maxInternalNameChars.count
    );
  });

  it('returns null when productName is not found in formMapper', () => {
    const result = getMaximumLimitsConfig('OTHER_PRODUCT');
    expect(result).toBeNull();
  });
});

describe('mergeHostFieldLimits', () => {
  it('overrides existing field type limit counts', () => {
    const baseLimits = {
      TEXT: { count: 80, message: 'maximumLimits.fields' },
    };
    const result = mergeHostFieldLimits(baseLimits, { TEXT: 5 });
    expect(result.TEXT.count).toBe(5);
    expect(result.TEXT.message).toBe('maximumLimits.fields');
  });

  it('adds limit entry for unknown field types', () => {
    const result = mergeHostFieldLimits({}, { DATE_TIME: 10 });
    expect(result.DATE_TIME.count).toBe(10);
  });
});

describe('buildAllowedFieldTypesConfig', () => {
  it('returns allowed types and host limits from supportedFieldTypes prop', () => {
    const result = buildAllowedFieldTypesConfig('CUSTOM_OBJECTS', [
      { type: 'TEXT', limit: 5 },
      { type: 'DATE' },
    ]);
    expect(result.allowedFieldTypes).toEqual(['TEXT', 'DATE']);
    expect(result.hostFieldLimits).toEqual({ TEXT: 5 });
  });

  it('falls back to product fieldOrder when supportedFieldTypes prop is empty', () => {
    const result = buildAllowedFieldTypesConfig('CUSTOM_OBJECTS', null);
    expect(result.allowedFieldTypes).toEqual(
      expect.arrayContaining(['TEXT', 'DATE', 'MULTI_SELECT', 'DATE_TIME'])
    );
    expect(result.hostFieldLimits).toEqual({});
  });
});

describe('buildVisibleFieldIndexMap', () => {
  const isFieldTypeAllowed = (allowed: string[]) => (type: string) =>
    allowed.includes(type);

  it('maps every field 1:1 when nothing is excluded', () => {
    const fields = [
      { type: 'PRIMARY' },
      { type: 'TEXT' },
      { type: 'MULTI_SELECT' },
    ];
    const result = buildVisibleFieldIndexMap(
      fields,
      isFieldTypeAllowed(['TEXT', 'MULTI_SELECT'])
    );
    expect(result).toEqual([0, 1, 2]);
  });

  it('skips the real index of any excluded, non-PRIMARY field type', () => {
    // Mirrors a legacy schema with MULTI_SELECT sitting mid-list, which is
    // what P0-1 flagged: index 2 (MULTI_SELECT) must be absent from the
    // map, not just trimmed off the end.
    const fields = [
      { type: 'PRIMARY' },
      { type: 'TEXT' },
      { type: 'MULTI_SELECT' },
      { type: 'DATE' },
    ];
    const result = buildVisibleFieldIndexMap(
      fields,
      isFieldTypeAllowed(['TEXT', 'DATE'])
    );
    expect(result).toEqual([0, 1, 3]);
  });

  it('always keeps PRIMARY visible even if it is not in the allowlist', () => {
    const fields = [{ type: 'PRIMARY' }, { type: 'TEXT' }];
    const result = buildVisibleFieldIndexMap(fields, isFieldTypeAllowed([]));
    expect(result).toEqual([0]);
  });
});

describe('resolveDroppedIndex', () => {
  it('returns the DOM ordinal unchanged when there is no visible-index map', () => {
    expect(resolveDroppedIndex(2, [])).toBe(2);
    expect(resolveDroppedIndex(2, null)).toBe(2);
  });

  it('remaps an in-range DOM ordinal to the real array index, skipping a hidden mid-list field', () => {
    // arrFieldElements = [PRIMARY(0), TEXT(1), MULTI_SELECT(2, hidden), DATE(3)]
    // Rendered DOM children, in order, are indices [0, 1, 3].
    const arrVisibleFieldIndexMap = [0, 1, 3];

    // Dropping on the 3rd rendered child (DOM ordinal 2) must resolve to
    // the real array index 3 (DATE), not 2 (the hidden MULTI_SELECT).
    expect(resolveDroppedIndex(2, arrVisibleFieldIndexMap)).toBe(3);
    // Dropping on the 1st/2nd rendered child is unaffected, since no
    // hidden field precedes them.
    expect(resolveDroppedIndex(0, arrVisibleFieldIndexMap)).toBe(0);
    expect(resolveDroppedIndex(1, arrVisibleFieldIndexMap)).toBe(1);
  });

  it('places a drop after the last visible field right after its real index, not at the absolute array end', () => {
    // arrFieldElements = [TEXT(0), MULTI_SELECT(1, hidden)]; only TEXT
    // renders, so the only valid DOM ordinal is 0 (before TEXT) or 1
    // (after TEXT, i.e. past the last visible child).
    const arrVisibleFieldIndexMap = [0];
    expect(resolveDroppedIndex(1, arrVisibleFieldIndexMap)).toBe(1);
  });
});
