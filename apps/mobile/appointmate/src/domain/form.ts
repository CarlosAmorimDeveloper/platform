export type Mood = 'muito_mal' | 'mal' | 'neutro' | 'bem' | 'muito_bem';

export const MOOD_OPTIONS: { value: Mood; label: string }[] = [
  { value: 'muito_mal', label: 'Muito mal' },
  { value: 'mal', label: 'Mal' },
  { value: 'neutro', label: 'Neutro' },
  { value: 'bem', label: 'Bem' },
  { value: 'muito_bem', label: 'Muito bem' },
];

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

export interface FormQuestion {
  text: string;
}

export interface FormValues {
  appointmentDate: string;
  doctorName: string;
  mood: Mood | null;
  medications: Medication[];
  questions: FormQuestion[];
}

export const EMPTY_FORM_VALUES: FormValues = {
  appointmentDate: '',
  doctorName: '',
  mood: null,
  medications: [],
  questions: [],
};

export const EMPTY_MEDICATION: Medication = { name: '', dosage: '', frequency: '' };

export const EMPTY_QUESTION: FormQuestion = { text: '' };
