import { View, Text } from 'react-native';
import { Button } from '@ds/mobile';
import { formatDate } from '../../../../domain/ticket';
import type { Comment } from '../../../../domain/ticket';
import { styles } from './CommentItem.styles';

interface Props {
  comment: Comment;
  canDelete: boolean;
  onDeletePress: () => void;
}

export function CommentItem({ comment, canDelete, onDeletePress }: Props) {
  return (
    <View style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentAuthor}>{comment.authorName}</Text>
        <Text style={styles.commentDate}>{formatDate(comment.createdAt)}</Text>
      </View>
      <Text style={styles.commentText}>{comment.text}</Text>
      {canDelete && (
        <Button variant="ghost" size="sm" onPress={onDeletePress}>
          Apagar
        </Button>
      )}
    </View>
  );
}
