import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fireEvent, render, screen, waitFor } from '../../test-utils';
import { getFormRecord } from '../../services/formsService';
import type { AppStackParamList } from '../../navigation/types';
import { FormDetail } from './FormDetail';

jest.mock('../../services/formsService', () => ({
  getFormRecord: jest.fn(),
}));

const mockedGetFormRecord = getFormRecord as jest.Mock;

type Props = NativeStackScreenProps<AppStackParamList, 'FormDetail'>;

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
} as unknown as Props['navigation'];

function makeRoute(formId: string): Props['route'] {
  return { key: 'FormDetail', name: 'FormDetail', params: { formId } } as unknown as Props['route'];
}

const ASYNC_TIMEOUT = { timeout: 15000 };

const filledRecord = {
  values: {
    appointmentDate: '20/04/2026',
    lastAppointmentDate: '10/01/2026',
    overallMood: 'estavel' as const,
    overallSummary: 'Semana estável.',
    sleep: 'Dormindo bem.',
    energy: 'Energia normal.',
    appetite: 'Apetite bom.',
    concentration: 'Concentração ok.',
    medications: [{ text: 'Losartana 25mg 1x ao dia' }],
    medicationAdherence: 'Sim, sempre.',
    medicationEffects: 'Nenhum efeito notado.',
    whatWentWell: 'Mantive a rotina de sono.',
    whatHasBeenHard: 'Ansiedade no trabalho.',
    context: 'Mudança de emprego.',
    questions: [{ text: 'Posso reduzir a dose?' }],
    todayFocus: 'Ajustar a medicação.',
    consultationNotes: '',
  },
  status: 'submitted' as const,
  createdAt: new Date('2026-01-05T10:00:00Z'),
  updatedAt: new Date('2026-04-15T10:00:00Z'),
};

const emptyRecord = {
  values: {
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
  },
  status: 'draft' as const,
  createdAt: new Date('2026-01-05T10:00:00Z'),
  updatedAt: null,
};

describe('FormDetail', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading state while the form is fetched', () => {
    mockedGetFormRecord.mockReturnValue(new Promise(() => {}));

    render(<FormDetail navigation={mockNavigation} route={makeRoute('form-1')} />);

    expect(screen.getByTestId('form-detail-loading')).toBeTruthy();
  });

  it('shows a not-found state when the form does not exist', async () => {
    mockedGetFormRecord.mockResolvedValue(null);

    render(<FormDetail navigation={mockNavigation} route={makeRoute('missing-form')} />);

    await waitFor(() => {
      expect(screen.getByTestId('form-detail-not-found')).toBeTruthy();
    }, ASYNC_TIMEOUT);
  }, 20000);

  it('shows an error message when loading fails', async () => {
    mockedGetFormRecord.mockRejectedValue(new Error('network error'));

    render(<FormDetail navigation={mockNavigation} route={makeRoute('form-1')} />);

    await waitFor(() => {
      expect(screen.getByTestId('form-detail-error')).toBeTruthy();
    }, ASYNC_TIMEOUT);
    expect(screen.getByText('Não foi possível carregar o formulário.')).toBeTruthy();
  }, 20000);

  it('renders the filled fields and hides empty ones', async () => {
    mockedGetFormRecord.mockResolvedValue(filledRecord);

    render(<FormDetail navigation={mockNavigation} route={makeRoute('form-1')} />);

    await waitFor(() => {
      expect(screen.getByText('20/04/2026')).toBeTruthy();
    }, ASYNC_TIMEOUT);
    expect(screen.getByText('10/01/2026')).toBeTruthy();
    expect(screen.getByTestId('form-detail-overall-mood').props.children).toBe('Estável');
    expect(screen.getByText('Losartana 25mg 1x ao dia', { exact: false })).toBeTruthy();
    expect(screen.getByText('Posso reduzir a dose?', { exact: false })).toBeTruthy();
    // consultationNotes is blank in the fixture — its label must not render.
    expect(screen.queryByText('Anotações e orientações')).toBeNull();
  }, 20000);

  it('shows the updated-at label derived from the loaded record', async () => {
    mockedGetFormRecord.mockResolvedValue(filledRecord);

    render(<FormDetail navigation={mockNavigation} route={makeRoute('form-1')} />);

    await waitFor(() => {
      const children = screen.getByTestId('form-detail-updated-at').props.children;
      const text = Array.isArray(children) ? children.join('') : children;
      expect(text).toEqual(expect.stringContaining('2026'));
    }, ASYNC_TIMEOUT);
  }, 20000);

  it('shows an empty state when the form has no answered fields', async () => {
    mockedGetFormRecord.mockResolvedValue(emptyRecord);

    render(<FormDetail navigation={mockNavigation} route={makeRoute('form-1')} />);

    await waitFor(() => {
      expect(screen.getByTestId('form-detail-empty-state')).toBeTruthy();
    }, ASYNC_TIMEOUT);
  }, 20000);

  it('navigates to FormEntry in edit mode when "Editar" is pressed', async () => {
    mockedGetFormRecord.mockResolvedValue(filledRecord);

    render(<FormDetail navigation={mockNavigation} route={makeRoute('form-1')} />);

    await waitFor(() => {
      expect(screen.getByTestId('form-detail-edit-button')).toBeTruthy();
    }, ASYNC_TIMEOUT);

    fireEvent.press(screen.getByTestId('form-detail-edit-button'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('FormEntry', { formId: 'form-1' });
  }, 20000);
});
