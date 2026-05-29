import React from 'react';
import { render, screen } from '../../test-utils';
import { LoadingIndicator } from './LoadingIndicator';

describe('LoadingIndicator', () => {
  it('renderiza quando visible=true', () => {
    render(<LoadingIndicator visible={true} testID="loading" />);
    expect(screen.getByTestId('loading')).toBeTruthy();
  });

  it('não renderiza quando visible=false', () => {
    render(<LoadingIndicator visible={false} testID="loading" />);
    expect(screen.queryByTestId('loading')).toBeNull();
  });

  it('é visível por padrão quando visible não é passado', () => {
    render(<LoadingIndicator testID="loading" />);
    expect(screen.getByTestId('loading')).toBeTruthy();
  });
});
