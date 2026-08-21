import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ActivityIndicator } from 'react-native';
import { render, screen, fireEvent } from '../../test-utils';
import { useTicketList } from '../../hooks/useTicketList';
import type { Ticket } from '../../domain/ticket';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { TicketList } from './TicketList';

jest.mock('../../hooks/useTicketList');
jest.mock('../../services/firebase', () => ({ auth: {}, db: {} }));

const mockUseTicketList = useTicketList as jest.Mock;

type Props = NativeStackScreenProps<AppStackParamList, 'TicketList'>;

const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
} as unknown as Props['navigation'];

const mockRoute = {
  key: 'TicketList',
  name: 'TicketList',
  params: {},
} as Props['route'];

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

describe('TicketList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTicketList.mockReturnValue(mockTicketListReturn());
  });

  it('shows loading indicator while fetching', () => {
    mockUseTicketList.mockReturnValue(mockTicketListReturn({ loading: true }));

    render(<TicketList navigation={mockNavigation} route={mockRoute} />);

    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('renders list of ticket cards', () => {
    mockUseTicketList.mockReturnValue(
      mockTicketListReturn({
        tickets: [
          makeTicket({ id: 't1', title: 'Impressora não liga' }),
          makeTicket({ id: 't2', title: 'Wi-Fi instável' }),
        ],
      }),
    );

    render(<TicketList navigation={mockNavigation} route={mockRoute} />);

    expect(screen.getByText('Impressora não liga')).toBeTruthy();
    expect(screen.getByText('Wi-Fi instável')).toBeTruthy();
  });

  it('shows empty state when no tickets found', () => {
    mockUseTicketList.mockReturnValue(mockTicketListReturn({ tickets: [] }));

    render(<TicketList navigation={mockNavigation} route={mockRoute} />);

    expect(screen.getByText('Nenhum ticket encontrado.')).toBeTruthy();
  });

  it('navigates to TicketDetails on ticket card press', () => {
    mockUseTicketList.mockReturnValue(
      mockTicketListReturn({ tickets: [makeTicket({ id: 't1', title: 'Impressora não liga' })] }),
    );

    render(<TicketList navigation={mockNavigation} route={mockRoute} />);

    fireEvent.press(screen.getByText('Impressora não liga'));

    expect(mockNavigation.replace).toHaveBeenCalledWith('TicketDetails', { ticketId: 't1' });
  });
});
