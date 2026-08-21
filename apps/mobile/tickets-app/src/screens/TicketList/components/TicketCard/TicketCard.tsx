import { Text } from 'react-native';
import type { Timestamp } from 'firebase/firestore';
import { Badge, Card, useTheme } from '@vuotto/mobile';
import { space } from '@vuotto/tokens';
import { formatDate } from '../../../../domain/ticket';
import type { TicketStatus } from '../../../../constants/ticketStatus';
import {
  PRIORITY_LABELS,
  PRIORITY_TONES,
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
  const { colors } = useTheme();
  return (
    <Card interactive onPress={onPress} padding="md" style={{ gap: space[1] }}>
      <Text style={[styles.title, { color: colors.textHeading }]}>{title}</Text>
      <Badge tone={PRIORITY_TONES[priority]}>{PRIORITY_LABELS[priority]}</Badge>
      <Text style={[styles.meta, { color: colors.textSecondary }]}>
        Criado por: {creatorName}
        {createdAt ? ` · ${formatDate(createdAt)}` : ''}
      </Text>
      {assigneeName ? (
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          Responsável: {assigneeName}
        </Text>
      ) : null}
    </Card>
  );
}
