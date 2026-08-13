import { EMPTY_FORM_VALUES, EMPTY_MEDICATION, EMPTY_QUESTION, MOOD_OPTIONS } from './form';

describe('MOOD_OPTIONS', () => {
  it('has exactly 5 options, one por seção do panorama geral', () => {
    expect(MOOD_OPTIONS).toHaveLength(5);
  });

  it('has unique values', () => {
    const values = MOOD_OPTIONS.map((option) => option.value);
    expect(new Set(values).size).toBe(values.length);
  });

  it('includes the expected scale from muito_dificil to bem', () => {
    expect(MOOD_OPTIONS.map((option) => option.value)).toEqual([
      'muito_dificil',
      'dificil',
      'oscilando',
      'estavel',
      'bem',
    ]);
  });
});

describe('EMPTY_FORM_VALUES', () => {
  it('has no mood selected', () => {
    expect(EMPTY_FORM_VALUES.overallMood).toBeNull();
  });

  it('has 2 blank medication rows and 3 blank question rows by default', () => {
    expect(EMPTY_FORM_VALUES.medications).toEqual([{ text: '' }, { text: '' }]);
    expect(EMPTY_FORM_VALUES.questions).toEqual([{ text: '' }, { text: '' }, { text: '' }]);
  });

  it('has empty text fields for every section', () => {
    expect(EMPTY_FORM_VALUES.appointmentDate).toBe('');
    expect(EMPTY_FORM_VALUES.lastAppointmentDate).toBe('');
    expect(EMPTY_FORM_VALUES.overallSummary).toBe('');
    expect(EMPTY_FORM_VALUES.sleep).toBe('');
    expect(EMPTY_FORM_VALUES.energy).toBe('');
    expect(EMPTY_FORM_VALUES.appetite).toBe('');
    expect(EMPTY_FORM_VALUES.concentration).toBe('');
    expect(EMPTY_FORM_VALUES.medicationAdherence).toBe('');
    expect(EMPTY_FORM_VALUES.medicationEffects).toBe('');
    expect(EMPTY_FORM_VALUES.whatWentWell).toBe('');
    expect(EMPTY_FORM_VALUES.whatHasBeenHard).toBe('');
    expect(EMPTY_FORM_VALUES.context).toBe('');
    expect(EMPTY_FORM_VALUES.todayFocus).toBe('');
    expect(EMPTY_FORM_VALUES.consultationNotes).toBe('');
  });
});

describe('EMPTY_MEDICATION / EMPTY_QUESTION', () => {
  it('provide blank rows for dynamic list fields', () => {
    expect(EMPTY_MEDICATION).toEqual({ text: '' });
    expect(EMPTY_QUESTION).toEqual({ text: '' });
  });
});
