import { useState } from 'react';

interface UseCommentFormParams {
  addComment: (text: string) => Promise<void>;
}

interface UseCommentFormResult {
  commentText: string;
  setCommentText: (v: string) => void;
  sendingComment: boolean;
  handleAddComment: () => Promise<void>;
}

export function useCommentForm({ addComment }: UseCommentFormParams): UseCommentFormResult {
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  async function handleAddComment() {
    if (!commentText.trim()) return;
    setSendingComment(true);
    await addComment(commentText.trim());
    setSendingComment(false);
    setCommentText('');
  }

  return {
    commentText,
    setCommentText,
    sendingComment,
    handleAddComment,
  };
}
