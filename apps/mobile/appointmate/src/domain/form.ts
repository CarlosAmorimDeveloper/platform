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
