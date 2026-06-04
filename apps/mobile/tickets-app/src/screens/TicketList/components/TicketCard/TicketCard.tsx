import { View, Text } from 'react-native';
import type { Timestamp } from 'firebase/firestore';
import { Card } from '@ds/mobile';
import { formatDate } from '../../../../domain/ticket';
import type { TicketStatus } from '../../../../constants/ticketStatus';
import {
  PRIORITY_COLORS,
  PRIORITY_LABELS,
  type TicketPriority,
} from '../../../../constants/ticketPriority';
import { styles } from './TicketCard.styles';

interface Props {
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  creatorName: string;
  createdAt: Timestamp | null;
  assigneeName?: string | null;
  onPress: () => void;
}

export function TicketCard({
  title,
  status: _status,
  priority,
  creatorName,
  createdAt,
  assigneeName,
  onPress,
}: Props) {
  return (
    <Card title={title} onPress={onPress}>
      <View style={[styles.badge, { backgroundColor: PRIORITY_COLORS[priority] + '20' }]}>
        <Text style={[styles.badgeText, { color: PRIORITY_COLORS[priority] }]}>
          {PRIORITY_LABELS[priority]}
        </Text>
      </View>
      <Text style={styles.meta}>
        Criado por: {creatorName}
        {createdAt ? ` · ${formatDate(createdAt)}` : ''}
      </Text>
      {assigneeName ? <Text style={styles.meta}>Responsável: {assigneeName}</Text> : null}
    </Card>
  );
}
