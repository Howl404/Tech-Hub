import sortingOptions from '../sortingOptions';

describe('sortingOptions', () => {
  it('contains the correct number of options', () => {
    expect(sortingOptions.length).toBe(4);
  });

  it('contains the correct values and labels for each option', () => {
    const expectedResult = [
      { value: 'name.en asc', label: 'Name (Ascending)' },
      { value: 'name.en desc', label: 'Name (Descending)' },
      { value: 'price asc', label: 'Price (Ascending)' },
      { value: 'price desc', label: 'Price (Descending)' },
    ];

    expect(sortingOptions).toEqual(expectedResult);
  });

  it('each option has a value and a label property', () => {
    sortingOptions.forEach((option) => {
      expect(option).toHaveProperty('value');
      expect(option).toHaveProperty('label');
    });
  });
});
