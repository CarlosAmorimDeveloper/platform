import { View, Text } from 'react-native';
import type { Timestamp } from 'firebase/firestore';
import { useTheme } from '@vuotto/mobile';
import { formatDate } from '../../../../domain/ticket';
import { styles } from './TicketMetaRow.styles';

interface Props {
  creatorName: string;
  createdAt: Timestamp | null;
  assigneeName: string | null;
  editing: boolean;
}

export function TicketMetaRow({ creatorName, createdAt, assigneeName, editing }: Props) {
  const { colors } = useTheme();
  const metaText = [styles.metaText, { color: colors.textSecondary }];
  return (
    <View style={styles.metaRow}>
      <Text style={metaText}>Criado por: {creatorName}</Text>
      {createdAt && <Text style={metaText}>Em: {formatDate(createdAt)}</Text>}
      {!editing && assigneeName && <Text style={metaText}>Responsável: {assigneeName}</Text>}
    </View>
  );
}
