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
  doctorName: 'Dra. Ana (Psiquiatria)',
  mood: 'bem',
  medications: [{ name: 'Sertralina', dosage: '50mg', frequency: '1x ao dia' }],
  questions: [{ text: 'Posso reduzir a dose?' }],
};

describe('formsService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createForm', () => {
    it('adds a document to the forms collection with userId and createdAt', async () => {
      mockedCollection.mockReturnValue({ ref: 'forms-collection' });
      mockedServerTimestamp.mockReturnValue('server-timestamp');
      mockedAddDoc.mockResolvedValue({ id: 'new-form-id' });

      await createForm('user-abc', sampleValues);

      expect(mockedAddDoc).toHaveBeenCalledWith(
        { ref: 'forms-collection' },
        {
          userId: 'user-abc',
          appointmentDate: '15/03/2026',
          doctorName: 'Dra. Ana (Psiquiatria)',
          mood: 'bem',
          medications: [{ name: 'Sertralina', dosage: '50mg', frequency: '1x ao dia' }],
          questions: ['Posso reduzir a dose?'],
          createdAt: 'server-timestamp',
        },
      );
    });

    it('flattens the questions array from {text} objects to plain strings', async () => {
      mockedCollection.mockReturnValue({});
      mockedServerTimestamp.mockReturnValue('server-timestamp');
      mockedAddDoc.mockResolvedValue({ id: 'new-form-id' });

      await createForm('user-abc', {
        ...sampleValues,
        questions: [{ text: 'Pergunta 1' }, { text: 'Pergunta 2' }],
      });

      const [, payload] = mockedAddDoc.mock.calls[0];
      expect(payload.questions).toEqual(['Pergunta 1', 'Pergunta 2']);
    });

    it('returns the id of the newly created document', async () => {
      mockedCollection.mockReturnValue({});
      mockedServerTimestamp.mockReturnValue('server-timestamp');
      mockedAddDoc.mockResolvedValue({ id: 'new-form-id' });

      const id = await createForm('user-abc', sampleValues);

      expect(id).toBe('new-form-id');
    });
  });

  describe('updateForm', () => {
    it('updates the document with the new values and an updatedAt timestamp', async () => {
      mockedDoc.mockReturnValue({ ref: 'form-doc' });
      mockedServerTimestamp.mockReturnValue('server-timestamp');
      mockedUpdateDoc.mockResolvedValue(undefined);

      await updateForm('form-1', sampleValues);

      expect(mockedUpdateDoc).toHaveBeenCalledWith(
        { ref: 'form-doc' },
        {
          appointmentDate: '15/03/2026',
          doctorName: 'Dra. Ana (Psiquiatria)',
          mood: 'bem',
          medications: [{ name: 'Sertralina', dosage: '50mg', frequency: '1x ao dia' }],
          questions: ['Posso reduzir a dose?'],
          updatedAt: 'server-timestamp',
        },
      );
    });

    it('does not include userId or createdAt in the update payload', async () => {
      mockedDoc.mockReturnValue({});
      mockedServerTimestamp.mockReturnValue('server-timestamp');
      mockedUpdateDoc.mockResolvedValue(undefined);

      await updateForm('form-1', sampleValues);

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

    it('maps a Firestore document back into FormValues, wrapping questions in {text}', async () => {
      mockedDoc.mockReturnValue({});
      mockedGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          appointmentDate: '15/03/2026',
          doctorName: 'Dra. Ana (Psiquiatria)',
          mood: 'bem',
          medications: [{ name: 'Sertralina', dosage: '50mg', frequency: '1x ao dia' }],
          questions: ['Posso reduzir a dose?'],
        }),
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
        doctorName: '',
        mood: null,
        medications: [],
        questions: [],
      });
    });
  });
});
