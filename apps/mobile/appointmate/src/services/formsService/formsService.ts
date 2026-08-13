import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { FormValues } from '../../domain/form';

function toFirestoreData(values: FormValues) {
  return {
    appointmentDate: values.appointmentDate,
    doctorName: values.doctorName,
    mood: values.mood,
    medications: values.medications,
    questions: values.questions.map((question) => question.text),
  };
}

export async function createForm(userId: string, values: FormValues): Promise<string> {
  const ref = await addDoc(collection(db, 'forms'), {
    userId,
    ...toFirestoreData(values),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateForm(formId: string, values: FormValues): Promise<void> {
  await updateDoc(doc(db, 'forms', formId), {
    ...toFirestoreData(values),
    updatedAt: serverTimestamp(),
  });
}

export async function getForm(formId: string): Promise<FormValues | null> {
  const snapshot = await getDoc(doc(db, 'forms', formId));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    appointmentDate: (data.appointmentDate ?? '') as string,
    doctorName: (data.doctorName ?? '') as string,
    mood: (data.mood ?? null) as FormValues['mood'],
    medications: (data.medications ?? []) as FormValues['medications'],
    questions: ((data.questions ?? []) as string[]).map((text) => ({ text })),
  };
}
