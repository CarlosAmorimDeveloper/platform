import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { createForm, getForm, updateForm } from './formsService';
import type { FormValues } from '../../domain/form';

jest.mock('firebase/firestore', () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  serverTimestamp: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('../firebase', () => ({
  db: { fake: 'db-instance' },
}));

const mockedAddDoc = addDoc as jest.Mock;
const mockedCollection = collection as jest.Mock;
const mockedDoc = doc as jest.Mock;
const mockedGetDoc = getDoc as jest.Mock;
const mockedServerTimestamp = serverTimestamp as jest.Mock;
const mockedUpdateDoc = updateDoc as jest.Mock;

const sampleValues: FormValues = {
  appointmentDate: '15/03/2026',
  lastAppointmentDate: '10/01/2026',
  overallMood: 'bem',
  overallSummary: 'Semana tranquila.',
  sleep: 'Dormindo bem.',
  energy: 'Disposição normal.',
  appetite: 'Apetite estável.',
  concentration: 'Concentração ok.',
  medications: [{ text: 'Sertralina 50mg 1x ao dia' }],
  medicationAdherence: 'Sim, todos os dias.',
  medicationEffects: 'Nenhum efeito colateral notado.',
  whatWentWell: 'Consegui manter a rotina de sono.',
  whatHasBeenHard: 'Ansiedade no trabalho.',
  context: 'Mudança de emprego.',
  questions: [{ text: 'Posso reduzir a dose?' }],
  todayFocus: 'Ajustar a medicação.',
  consultationNotes: '',
};

const sampleFirestoreData = {
  appointmentDate: '15/03/2026',
  lastAppointmentDate: '10/01/2026',
  overallMood: 'bem',
  overallSummary: 'Semana tranquila.',
  sleep: 'Dormindo bem.',
  energy: 'Disposição normal.',
  appetite: 'Apetite estável.',
  concentration: 'Concentração ok.',
  medications: ['Sertralina 50mg 1x ao dia'],
  medicationAdherence: 'Sim, todos os dias.',
  medicationEffects: 'Nenhum efeito colateral notado.',
  whatWentWell: 'Consegui manter a rotina de sono.',
  whatHasBeenHard: 'Ansiedade no trabalho.',
  context: 'Mudança de emprego.',
  questions: ['Posso reduzir a dose?'],
  todayFocus: 'Ajustar a medicação.',
  consultationNotes: '',
};

describe('formsService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createForm', () => {
    it('adds a document to the forms collection with userId, status and createdAt', async () => {
      mockedCollection.mockReturnValue({ ref: 'forms-collection' });
      mockedServerTimestamp.mockReturnValue('server-timestamp');
      mockedAddDoc.mockResolvedValue({ id: 'new-form-id' });

      await createForm('user-abc', sampleValues, 'draft');

      expect(mockedAddDoc).toHaveBeenCalledWith(
        { ref: 'forms-collection' },
        {
          userId: 'user-abc',
          status: 'draft',
          ...sampleFirestoreData,
          createdAt: 'server-timestamp',
        },
      );
    });

    it('flattens medications and questions from {text} objects to plain strings, dropping blank items', async () => {
      mockedCollection.mockReturnValue({});
      mockedServerTimestamp.mockReturnValue('server-timestamp');
      mockedAddDoc.mockResolvedValue({ id: 'new-form-id' });

      await createForm(
        'user-abc',
        {
          ...sampleValues,
          medications: [{ text: 'Remédio 1' }, { text: '  ' }, { text: 'Remédio 2' }],
          questions: [{ text: 'Pergunta 1' }, { text: '' }],
        },
        'submitted',
      );

      const [, payload] = mockedAddDoc.mock.calls[0];
      expect(payload.medications).toEqual(['Remédio 1', 'Remédio 2']);
      expect(payload.questions).toEqual(['Pergunta 1']);
    });

    it('returns the id of the newly created document', async () => {
      mockedCollection.mockReturnValue({});
      mockedServerTimestamp.mockReturnValue('server-timestamp');
      mockedAddDoc.mockResolvedValue({ id: 'new-form-id' });

      const id = await createForm('user-abc', sampleValues, 'draft');

      expect(id).toBe('new-form-id');
    });
  });

  describe('updateForm', () => {
    it('updates the document with the new values, status and an updatedAt timestamp', async () => {
      mockedDoc.mockReturnValue({ ref: 'form-doc' });
      mockedServerTimestamp.mockReturnValue('server-timestamp');
      mockedUpdateDoc.mockResolvedValue(undefined);

      await updateForm('form-1', sampleValues, 'submitted');

      expect(mockedUpdateDoc).toHaveBeenCalledWith(
        { ref: 'form-doc' },
        {
          status: 'submitted',
          ...sampleFirestoreData,
          updatedAt: 'server-timestamp',
        },
      );
    });

    it('does not include userId or createdAt in the update payload', async () => {
      mockedDoc.mockReturnValue({});
      mockedServerTimestamp.mockReturnValue('server-timestamp');
      mockedUpdateDoc.mockResolvedValue(undefined);

      await updateForm('form-1', sampleValues, 'draft');

      const [, payload] = mockedUpdateDoc.mock.calls[0];
      expect(payload).not.toHaveProperty('userId');
      expect(payload).not.toHaveProperty('createdAt');
    });
  });

  describe('getForm', () => {
    it('returns null when the document does not exist', async () => {
      mockedDoc.mockReturnValue({});
      mockedGetDoc.mockResolvedValue({ exists: () => false });

      const result = await getForm('missing-form');

      expect(result).toBeNull();
    });

    it('maps a Firestore document back into FormValues, wrapping lists in {text}', async () => {
      mockedDoc.mockReturnValue({});
      mockedGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => sampleFirestoreData,
      });

      const result = await getForm('form-1');

      expect(result).toEqual(sampleValues);
    });

    it('fills in safe defaults for missing fields', async () => {
      mockedDoc.mockReturnValue({});
      mockedGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({}),
      });

      const result = await getForm('form-1');

      expect(result).toEqual({
        appointmentDate: '',
        lastAppointmentDate: '',
        overallMood: null,
        overallSummary: '',
        sleep: '',
        energy: '',
        appetite: '',
        concentration: '',
        medications: [],
        medicationAdherence: '',
        medicationEffects: '',
        whatWentWell: '',
        whatHasBeenHard: '',
        context: '',
        questions: [],
        todayFocus: '',
        consultationNotes: '',
      });
    });
  });
});
