import { View, Text } from 'react-native';
import type { Timestamp } from 'firebase/firestore';
import { formatDate } from '../../../../domain/ticket';
import { styles } from './TicketMetaRow.styles';

interface Props {
  creatorName: string;
  createdAt: Timestamp | null;
  assigneeName: string | null;
  editing: boolean;
}

export function TicketMetaRow({ creatorName, createdAt, assigneeName, editing }: Props) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaText}>Criado por: {creatorName}</Text>
      {createdAt && <Text style={styles.metaText}>Em: {formatDate(createdAt)}</Text>}
      {!editing && assigneeName && <Text style={styles.metaText}>Responsável: {assigneeName}</Text>}
    </View>
  );
}
