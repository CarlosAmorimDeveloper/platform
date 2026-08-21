import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ActivityIndicator } from 'react-native';
import { render, screen, fireEvent } from '../../test-utils';
import { useTicketList } from '../../hooks/useTicketList';
import { STATUS_LABELS } from '../../constants/ticketStatus';
import type { Ticket } from '../../domain/ticket';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { Dashboard } from './Dashboard';

jest.mock('../../hooks/useTicketList');
jest.mock('../../services/firebase', () => ({ auth: {}, db: {} }));

const mockUseTicketList = useTicketList as jest.Mock;

type Props = NativeStackScreenProps<AppStackParamList, 'Dashboard'>;

const mockNavigation = {
  navigate: jest.fn(),
} as unknown as Props['navigation'];

const mockRoute = { key: 'Dashboard', name: 'Dashboard', params: undefined } as Props['route'];

function makeTicket(overrides: Partial<Ticket> = {}): Ticket {
  return {
    id: 't1',
    title: 'Impressora não liga',
    description: '',
    status: 'open',
    priority: 'medium',
    creatorId: 'u1',
    creatorName: 'Alice',
    createdAt: null,
    assigneeId: null,
    assigneeName: null,
    ...overrides,
  };
}

function mockTicketListReturn(overrides: Partial<ReturnType<typeof useTicketList>> = {}) {
  return {
    tickets: [],
    loading: false,
    error: null,
    clearError: jest.fn(),
    ...overrides,
  };
}

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTicketList.mockReturnValue(mockTicketListReturn());
  });

  it('shows loading indicator while fetching tickets', () => {
    mockUseTicketList.mockReturnValue(mockTicketListReturn({ loading: true }));

    render(<Dashboard navigation={mockNavigation} route={mockRoute} />);

    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('renders pie chart when tickets exist', () => {
    mockUseTicketList.mockReturnValue(
      mockTicketListReturn({ tickets: [makeTicket({ id: 't1', status: 'open' })] }),
    );

    render(<Dashboard navigation={mockNavigation} route={mockRoute} />);

    expect(screen.getAllByText(STATUS_LABELS.open, { exact: false }).length).toBeGreaterThan(0);
  });

  it('renders recent tickets card with up to 3 tickets', () => {
    mockUseTicketList.mockReturnValue(
      mockTicketListReturn({
        tickets: [
          makeTicket({ id: 't1', title: 'Chamado 1' }),
          makeTicket({ id: 't2', title: 'Chamado 2' }),
          makeTicket({ id: 't3', title: 'Chamado 3' }),
          makeTicket({ id: 't4', title: 'Chamado 4' }),
        ],
      }),
    );

    render(<Dashboard navigation={mockNavigation} route={mockRoute} />);

    expect(screen.getByText('Chamado 1')).toBeTruthy();
    expect(screen.getByText('Chamado 2')).toBeTruthy();
    expect(screen.getByText('Chamado 3')).toBeTruthy();
    expect(screen.queryByText('Chamado 4')).toBeNull();
  });

  it('renders status stat cards for each status', () => {
    mockUseTicketList.mockReturnValue(
      mockTicketListReturn({
        tickets: [
          makeTicket({ id: 't1', status: 'open' }),
          makeTicket({ id: 't2', status: 'open' }),
          makeTicket({ id: 't3', status: 'in_progress' }),
          makeTicket({ id: 't4', status: 'done' }),
        ],
      }),
    );

    render(<Dashboard navigation={mockNavigation} route={mockRoute} />);

    expect(screen.getByText(`${STATUS_LABELS.open} 2`)).toBeTruthy();
    expect(screen.getByText(`${STATUS_LABELS.in_progress} 1`)).toBeTruthy();
    expect(screen.getByText(`${STATUS_LABELS.done} 1`)).toBeTruthy();
  });

  it('navigates to TicketList filtered by status on stat card press', () => {
    mockUseTicketList.mockReturnValue(
      mockTicketListReturn({ tickets: [makeTicket({ id: 't1', status: 'open' })] }),
    );

    render(<Dashboard navigation={mockNavigation} route={mockRoute} />);

    fireEvent.press(screen.getByText(`${STATUS_LABELS.open} 1`));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('TicketList', { status: 'open' });
  });

  it('navigates to NewTicket on FAB press', () => {
    mockUseTicketList.mockReturnValue(
      mockTicketListReturn({ tickets: [makeTicket({ id: 't1' })] }),
    );

    render(<Dashboard navigation={mockNavigation} route={mockRoute} />);

    fireEvent.press(screen.UNSAFE_getByProps({ accessibilityLabel: 'New ticket' }));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('NewTicket');
  });
});
