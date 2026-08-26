import { parseDateInput } from './timeFilter';

export type Mood = 'muito_dificil' | 'dificil' | 'oscilando' | 'estavel' | 'bem';

export const MOOD_OPTIONS: { value: Mood; label: string }[] = [
  { value: 'muito_dificil', label: 'Muito difícil' },
  { value: 'dificil', label: 'Difícil' },
  { value: 'oscilando', label: 'Oscilando' },
  { value: 'estavel', label: 'Estável' },
  { value: 'bem', label: 'Bem' },
];

export type FormStatus = 'draft' | 'submitted';

export interface MedicationItem {
  text: string;
}

export interface QuestionItem {
  text: string;
}

export interface FormValues {
  // Cabeçalho
  appointmentDate: string;
  lastAppointmentDate: string;
  // Panorama geral
  overallMood: Mood | null;
  overallSummary: string;
  // No dia a dia
  sleep: string;
  energy: string;
  appetite: string;
  concentration: string;
  // Medicação
  medications: MedicationItem[];
  medicationAdherence: string;
  medicationEffects: string;
  // O que foi bem ou melhorou
  whatWentWell: string;
  // O que tem sido difícil
  whatHasBeenHard: string;
  // Contexto
  context: string;
  // Minhas perguntas
  questions: QuestionItem[];
  // Foco do dia
  todayFocus: string;
  // Durante a consulta
  consultationNotes: string;
}

export const EMPTY_MEDICATION: MedicationItem = { text: '' };
export const EMPTY_QUESTION: QuestionItem = { text: '' };

export const EMPTY_FORM_VALUES: FormValues = {
  appointmentDate: '',
  lastAppointmentDate: '',
  overallMood: null,
  overallSummary: '',
  sleep: '',
  energy: '',
  appetite: '',
  concentration: '',
  medications: [{ text: '' }],
  medicationAdherence: '',
  medicationEffects: '',
  whatWentWell: '',
  whatHasBeenHard: '',
  context: '',
  questions: [{ text: '' }],
  todayFocus: '',
  consultationNotes: '',
};

// Progressively formats free-typed digits into "dd/mm/aaaa" as the user
// types (and un-formats correctly on backspace, since it's re-derived from
// the digits present rather than tracked as separate state).
export function formatDateInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

// Used to validate "Data desta consulta" isn't retroactive — an incomplete
// or unparseable date passes here on purpose, since that's the `required`
// rule's concern, not this one's.
export function isDateOnOrAfterToday(text: string, now = new Date()): boolean {
  const date = parseDateInput(text);
  if (!date) return true;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return date.getTime() >= today.getTime();
}

export function formatDate(date: Date | null): string | null {
  if (!date) return null;
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isFormValuesEmpty(values: FormValues): boolean {
  const hasText = [
    values.appointmentDate,
    values.lastAppointmentDate,
    values.overallSummary,
    values.sleep,
    values.energy,
    values.appetite,
    values.concentration,
    values.medicationAdherence,
    values.medicationEffects,
    values.whatWentWell,
    values.whatHasBeenHard,
    values.context,
    values.todayFocus,
    values.consultationNotes,
  ].some((text) => text.trim());
  const hasLists = [...values.medications, ...values.questions].some((item) => item.text.trim());
  return !hasText && !hasLists && !values.overallMood;
}
