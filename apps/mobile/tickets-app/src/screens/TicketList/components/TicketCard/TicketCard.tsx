import { Pressable, Text } from 'react-native';
import { Badge, Card, useTheme } from '@industry/mobile';
import { alpha, space } from '@industry/tokens';
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
  createdAt: Date | null;
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
    <Pressable onPress={onPress}>
      <Card style={{ gap: space[1] }}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Badge tone={PRIORITY_TONES[priority]}>{PRIORITY_LABELS[priority]}</Badge>
        <Text style={[styles.meta, { color: alpha(colors.text, 70) }]}>
          Criado por: {creatorName}
          {createdAt ? ` · ${formatDate(createdAt)}` : ''}
        </Text>
        {assigneeName ? (
          <Text style={[styles.meta, { color: alpha(colors.text, 70) }]}>
            Responsável: {assigneeName}
          </Text>
        ) : null}
      </Card>
    </Pressable>
  );
}
