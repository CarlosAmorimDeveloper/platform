import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { FormStatus, FormValues } from '../../domain/form';

function toStringList(items: { text: string }[]) {
  return items.map((item) => item.text.trim()).filter((text) => text.length > 0);
}

function toFirestoreData(values: FormValues) {
  return {
    appointmentDate: values.appointmentDate,
    lastAppointmentDate: values.lastAppointmentDate,
    overallMood: values.overallMood,
    overallSummary: values.overallSummary,
    sleep: values.sleep,
    energy: values.energy,
    appetite: values.appetite,
    concentration: values.concentration,
    medications: toStringList(values.medications),
    medicationAdherence: values.medicationAdherence,
    medicationEffects: values.medicationEffects,
    whatWentWell: values.whatWentWell,
    whatHasBeenHard: values.whatHasBeenHard,
    context: values.context,
    questions: toStringList(values.questions),
    todayFocus: values.todayFocus,
    consultationNotes: values.consultationNotes,
  };
}

export async function createForm(
  userId: string,
  values: FormValues,
  status: FormStatus,
): Promise<string> {
  const ref = await addDoc(collection(db, 'forms'), {
    userId,
    status,
    ...toFirestoreData(values),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateForm(
  formId: string,
  values: FormValues,
  status: FormStatus,
): Promise<void> {
  await updateDoc(doc(db, 'forms', formId), {
    status,
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
    lastAppointmentDate: (data.lastAppointmentDate ?? '') as string,
    overallMood: (data.overallMood ?? null) as FormValues['overallMood'],
    overallSummary: (data.overallSummary ?? '') as string,
    sleep: (data.sleep ?? '') as string,
    energy: (data.energy ?? '') as string,
    appetite: (data.appetite ?? '') as string,
    concentration: (data.concentration ?? '') as string,
    medications: ((data.medications ?? []) as string[]).map((text) => ({ text })),
    medicationAdherence: (data.medicationAdherence ?? '') as string,
    medicationEffects: (data.medicationEffects ?? '') as string,
    whatWentWell: (data.whatWentWell ?? '') as string,
    whatHasBeenHard: (data.whatHasBeenHard ?? '') as string,
    context: (data.context ?? '') as string,
    questions: ((data.questions ?? []) as string[]).map((text) => ({ text })),
    todayFocus: (data.todayFocus ?? '') as string,
    consultationNotes: (data.consultationNotes ?? '') as string,
  };
}
