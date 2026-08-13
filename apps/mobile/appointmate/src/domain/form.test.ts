import { EMPTY_FORM_VALUES, EMPTY_MEDICATION, EMPTY_QUESTION, MOOD_OPTIONS } from './form';

describe('MOOD_OPTIONS', () => {
  it('has exactly 5 options, one per point on the scale', () => {
    expect(MOOD_OPTIONS).toHaveLength(5);
  });

  it('has unique values', () => {
    const values = MOOD_OPTIONS.map((option) => option.value);
    expect(new Set(values).size).toBe(values.length);
  });

  it('includes the expected scale from muito_mal to muito_bem', () => {
    expect(MOOD_OPTIONS.map((option) => option.value)).toEqual([
      'muito_mal',
      'mal',
      'neutro',
      'bem',
      'muito_bem',
    ]);
  });
});

describe('EMPTY_FORM_VALUES', () => {
  it('has no mood selected and empty dynamic lists', () => {
    expect(EMPTY_FORM_VALUES.mood).toBeNull();
    expect(EMPTY_FORM_VALUES.medications).toEqual([]);
    expect(EMPTY_FORM_VALUES.questions).toEqual([]);
  });

  it('has empty text fields', () => {
    expect(EMPTY_FORM_VALUES.appointmentDate).toBe('');
    expect(EMPTY_FORM_VALUES.doctorName).toBe('');
  });
});

describe('EMPTY_MEDICATION / EMPTY_QUESTION', () => {
  it('provide blank rows for dynamic list fields', () => {
    expect(EMPTY_MEDICATION).toEqual({ name: '', dosage: '', frequency: '' });
    expect(EMPTY_QUESTION).toEqual({ text: '' });
  });
});
