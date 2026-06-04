import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Timestamp } from 'firebase/firestore';
import { fireEvent, render, screen } from '../../../../test-utils';
import type { Comment } from '../../../../domain/ticket';
import { CommentItem } from './CommentItem';

function makeTimestamp(date: Date): Timestamp {
  return { toDate: () => date } as unknown as Timestamp;
}

const mockComment: Comment = {
  id: 'c1',
  text: 'Test comment',
  authorId: 'u1',
  authorName: 'Alice',
  createdAt: makeTimestamp(new Date(2024, 0, 15, 14, 30)),
};

const onDeletePress = jest.fn();

describe('CommentItem', () => {
  beforeEach(async () => jest.clearAllMocks());

  it('renders author name', () => {
    render(<CommentItem comment={mockComment} canDelete={false} onDeletePress={onDeletePress} />);
    expect(screen.getByText('Alice')).toBeTruthy();
  });

  it('renders comment text', () => {
    render(<CommentItem comment={mockComment} canDelete={false} onDeletePress={onDeletePress} />);
    expect(screen.getByText('Test comment')).toBeTruthy();
  });

  it('renders formatted date', () => {
    render(<CommentItem comment={mockComment} canDelete={false} onDeletePress={onDeletePress} />);
    const dateEl = screen.getByText(/15/);
    expect(dateEl).toBeTruthy();
  });

  it('shows Apagar button when canDelete=true', () => {
    render(<CommentItem comment={mockComment} canDelete={true} onDeletePress={onDeletePress} />);
    expect(screen.getByText('Apagar')).toBeTruthy();
  });

  it('hides Apagar button when canDelete=false', () => {
    render(<CommentItem comment={mockComment} canDelete={false} onDeletePress={onDeletePress} />);
    expect(screen.queryByText('Apagar')).toBeNull();
  });

  it('calls onDeletePress when Apagar is pressed', () => {
    render(<CommentItem comment={mockComment} canDelete={true} onDeletePress={onDeletePress} />);
    fireEvent.press(screen.getByText('Apagar'));
    expect(onDeletePress).toHaveBeenCalledTimes(1);
  });
});
