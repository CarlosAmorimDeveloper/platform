import { View, Text } from 'react-native';
import { Button, useTheme } from '@vuotto/mobile';
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
    <View style={[styles.commentCard, { backgroundColor: colors.surfaceCard }]}>
      <View style={styles.commentHeader}>
        <Text style={[styles.commentAuthor, { color: colors.textHeading }]}>
          {comment.authorName}
        </Text>
        <Text style={[styles.commentDate, { color: colors.textTertiary }]}>
          {formatDate(comment.createdAt)}
        </Text>
      </View>
      <Text style={[styles.commentText, { color: colors.textPrimary }]}>{comment.text}</Text>
      {canDelete && (
        <Button variant="ghost" size="sm" onPress={onDeletePress}>
          Apagar
        </Button>
      )}
    </View>
  );
}
