import { View, Text } from 'react-native';
import { Button, useTheme } from '@industry/mobile';
import { alpha } from '@industry/tokens';
import { formatDate } from '../../../../domain/ticket';
import type { Comment } from '../../../../domain/ticket';
import { styles } from './CommentItem.styles';

interface Props {
  comment: Comment;
  canDelete: boolean;
  onDeletePress: () => void;
}

export function CommentItem({ comment, canDelete, onDeletePress }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.commentCard, { backgroundColor: colors.surface }]}>
      <View style={styles.commentHeader}>
        <Text style={[styles.commentAuthor, { color: colors.text }]}>{comment.authorName}</Text>
        <Text style={[styles.commentDate, { color: alpha(colors.text, 50) }]}>
          {formatDate(comment.createdAt)}
        </Text>
      </View>
      <Text style={[styles.commentText, { color: alpha(colors.text, 70) }]}>{comment.text}</Text>
      {canDelete && (
        <Button variant="ghost" size="sm" onPress={onDeletePress}>
          Apagar
        </Button>
      )}
    </View>
  );
}
