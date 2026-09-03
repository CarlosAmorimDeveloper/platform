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
  appointmentDate: string;
  lastAppointmentDate: string;
  overallMood: Mood | null;
  overallSummary: string;
  sleep: string;
  energy: string;
  appetite: string;
  concentration: string;
  medications: MedicationItem[];
  medicationAdherence: string;
  medicationEffects: string;
  whatWentWell: string;
  whatHasBeenHard: string;
  context: string;
  questions: QuestionItem[];
  todayFocus: string;
  consultationNotes: string;
}

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

export function formatDateInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

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

export function formatDateLong(text: string): string | null {
  const date = parseDateInput(text);
  if (!date) return null;
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

const MONTH_ABBREVIATIONS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

export function formatDateTimeShort(date: Date | null): string | null {
  if (!date) return null;
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTH_ABBREVIATIONS[date.getMonth()];
  const timePart = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${day} ${month} ${date.getFullYear()} · ${timePart}`;
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
