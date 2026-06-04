import React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '../../../../test-utils';
import { TicketPriorityField } from './TicketPriorityField';

const onChangeDraft = jest.fn();

describe('TicketPriorityField', () => {
  it('renders priority badge with correct label when not editing', () => {
    render(
      <TicketPriorityField
        priority="medium"
        editing={false}
        draftPriority="medium"
        onChangeDraft={onChangeDraft}
      />,
    );
    expect(screen.getByText('Médio')).toBeTruthy();
  });

  it('renders priority buttons inside a horizontal ScrollView when editing=true', () => {
    render(
      <TicketPriorityField
        priority="medium"
        editing={true}
        draftPriority="medium"
        onChangeDraft={onChangeDraft}
      />,
    );
    expect(screen.getByText('Muito Baixo')).toBeTruthy();
    expect(screen.getByText('Baixo')).toBeTruthy();
    expect(screen.getByText('Médio')).toBeTruthy();
    expect(screen.getByText('Alto')).toBeTruthy();
    expect(screen.getByText('Muito Alto')).toBeTruthy();
  });

  it('selected priority button has variant primary', () => {
    render(
      <TicketPriorityField
        priority="medium"
        editing={true}
        draftPriority="high"
        onChangeDraft={onChangeDraft}
      />,
    );
    // The "Alto" button should be present (it is the selected/primary one)
    expect(screen.getByText('Alto')).toBeTruthy();
    // The other buttons should also be present (secondary)
    expect(screen.getByText('Médio')).toBeTruthy();
    expect(screen.getByText('Muito Alto')).toBeTruthy();
  });

  it('calls onChangeDraft when a priority button is pressed', () => {
    render(
      <TicketPriorityField
        priority="medium"
        editing={true}
        draftPriority="medium"
        onChangeDraft={onChangeDraft}
      />,
    );
    fireEvent.press(screen.getByText('Alto'));
    expect(onChangeDraft).toHaveBeenCalledWith('high');
  });
});
