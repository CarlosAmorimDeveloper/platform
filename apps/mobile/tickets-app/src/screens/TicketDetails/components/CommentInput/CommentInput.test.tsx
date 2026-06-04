import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '../../../../test-utils';
import { CommentInput } from './CommentInput';

const onChangeText = jest.fn();
const onSubmit = jest.fn();

describe('CommentInput', () => {
  beforeEach(async () => jest.clearAllMocks());

  it('renders comment input and submit button', () => {
    render(
      <CommentInput value="" onChangeText={onChangeText} onSubmit={onSubmit} disabled={false} />,
    );
    expect(screen.getByText('Enviar')).toBeTruthy();
  });

  it('submit button is disabled when disabled=true', () => {
    render(
      <CommentInput value="" onChangeText={onChangeText} onSubmit={onSubmit} disabled={true} />,
    );
    fireEvent.press(screen.getByText('Enviar'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit when Enviar is pressed', () => {
    render(
      <CommentInput value="" onChangeText={onChangeText} onSubmit={onSubmit} disabled={false} />,
    );
    fireEvent.press(screen.getByText('Enviar'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls onChangeText when text changes', () => {
    render(
      <CommentInput value="" onChangeText={onChangeText} onSubmit={onSubmit} disabled={false} />,
    );
    fireEvent.changeText(screen.getByPlaceholderText('Escreva um comentário...'), 'Hello');
    expect(onChangeText).toHaveBeenCalledWith('Hello');
  });
});
