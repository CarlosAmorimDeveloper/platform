import {
  EMPTY_FORM_VALUES,
  EMPTY_MEDICATION,
  EMPTY_QUESTION,
  MOOD_OPTIONS,
  formatDate,
  formatDateInput,
  isDateOnOrAfterToday,
  isFormValuesEmpty,
} from './form';

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

  it('has exactly 1 blank medication row and 1 blank question row by default', () => {
    expect(EMPTY_FORM_VALUES.medications).toEqual([{ text: '' }]);
    expect(EMPTY_FORM_VALUES.questions).toEqual([{ text: '' }]);
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

describe('formatDateInput', () => {
  it('inserts slashes progressively as digits are typed', () => {
    expect(formatDateInput('1')).toBe('1');
    expect(formatDateInput('15')).toBe('15');
    expect(formatDateInput('150')).toBe('15/0');
    expect(formatDateInput('1503')).toBe('15/03');
    expect(formatDateInput('15032')).toBe('15/03/2');
    expect(formatDateInput('15032026')).toBe('15/03/2026');
  });

  it('strips non-digit characters before formatting', () => {
    expect(formatDateInput('15/03/2026')).toBe('15/03/2026');
    expect(formatDateInput('ab15cd03ef2026')).toBe('15/03/2026');
  });

  it('caps at 8 digits (ddmmaaaa), ignoring anything typed beyond that', () => {
    expect(formatDateInput('150320269999')).toBe('15/03/2026');
  });

  it('returns an empty string for empty input', () => {
    expect(formatDateInput('')).toBe('');
  });
});

describe('isDateOnOrAfterToday', () => {
  const now = new Date(2026, 2, 20); // 20/03/2026

  it('accepts today', () => {
    expect(isDateOnOrAfterToday('20/03/2026', now)).toBe(true);
  });

  it('accepts a future date', () => {
    expect(isDateOnOrAfterToday('21/03/2026', now)).toBe(true);
  });

  it('rejects a past date', () => {
    expect(isDateOnOrAfterToday('19/03/2026', now)).toBe(false);
  });

  it('does not flag an empty or incomplete date — that is the "required" rule\'s job', () => {
    expect(isDateOnOrAfterToday('', now)).toBe(true);
    expect(isDateOnOrAfterToday('15/03', now)).toBe(true);
  });
});

describe('formatDate', () => {
  it('returns null for a null date', () => {
    expect(formatDate(null)).toBeNull();
  });

  it('formats a date as dd/mm/aaaa, hh:mm in pt-BR', () => {
    const date = new Date(2026, 2, 15, 9, 5);
    expect(formatDate(date)).toBe('15/03/2026, 09:05');
  });
});

describe('isFormValuesEmpty', () => {
  it('is true for EMPTY_FORM_VALUES', () => {
    expect(isFormValuesEmpty(EMPTY_FORM_VALUES)).toBe(true);
  });

  it('is false when any text field is filled', () => {
    expect(isFormValuesEmpty({ ...EMPTY_FORM_VALUES, sleep: 'Dormi bem' })).toBe(false);
  });

  it('is false when a mood is selected, even with no text filled', () => {
    expect(isFormValuesEmpty({ ...EMPTY_FORM_VALUES, overallMood: 'bem' })).toBe(false);
  });

  it('is false when a medication or question row has text', () => {
    expect(isFormValuesEmpty({ ...EMPTY_FORM_VALUES, medications: [{ text: 'Sertralina' }] })).toBe(
      false,
    );
    expect(
      isFormValuesEmpty({ ...EMPTY_FORM_VALUES, questions: [{ text: 'Posso reduzir a dose?' }] }),
    ).toBe(false);
  });

  it('ignores whitespace-only text as still empty', () => {
    expect(isFormValuesEmpty({ ...EMPTY_FORM_VALUES, sleep: '   ' })).toBe(true);
  });
});
