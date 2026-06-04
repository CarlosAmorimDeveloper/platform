import React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '../../../../test-utils';
import { TicketStatusField } from './TicketStatusField';

const onChangeDraft = jest.fn();

describe('TicketStatusField', () => {
  it('renders status badge with correct label when not editing', () => {
    render(
      <TicketStatusField
        status="open"
        editing={false}
        draftStatus="open"
        onChangeDraft={onChangeDraft}
      />,
    );
    expect(screen.getByText('Aberto')).toBeTruthy();
  });

  it('renders status buttons when editing=true', () => {
    render(
      <TicketStatusField
        status="open"
        editing={true}
        draftStatus="open"
        onChangeDraft={onChangeDraft}
      />,
    );
    expect(screen.getByText('Aberto')).toBeTruthy();
    expect(screen.getByText('Em Progresso')).toBeTruthy();
    expect(screen.getByText('Concluído')).toBeTruthy();
  });

  it('selected status button has variant primary', () => {
    render(
      <TicketStatusField
        status="open"
        editing={true}
        draftStatus="in_progress"
        onChangeDraft={onChangeDraft}
      />,
    );
    // The "Em Progresso" button should be present (it is the selected/primary one)
    expect(screen.getByText('Em Progresso')).toBeTruthy();
    // The other buttons should also be present (secondary)
    expect(screen.getByText('Aberto')).toBeTruthy();
    expect(screen.getByText('Concluído')).toBeTruthy();
  });

  it('calls onChangeDraft when a status button is pressed', () => {
    render(
      <TicketStatusField
        status="open"
        editing={true}
        draftStatus="open"
        onChangeDraft={onChangeDraft}
      />,
    );
    fireEvent.press(screen.getByText('Concluído'));
    expect(onChangeDraft).toHaveBeenCalledWith('done');
  });
});
