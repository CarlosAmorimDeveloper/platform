import { View, Text } from 'react-native';
import { Button } from '@ds/mobile';
import {
  ALL_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
  type TicketStatus,
} from '../../../../constants/ticketStatus';
import { styles } from './TicketStatusField.styles';

interface Props {
  status: TicketStatus;
  editing: boolean;
  draftStatus: TicketStatus;
  onChangeDraft: (s: TicketStatus) => void;
}

export function TicketStatusField({ status, editing, draftStatus, onChangeDraft }: Props) {
  if (editing) {
    return (
      <View style={styles.statusRow}>
        {ALL_STATUSES.map((s) => (
          <Button
            key={s}
            variant={draftStatus === s ? 'primary' : 'secondary'}
            size="sm"
            onPress={() => onChangeDraft(s)}
          >
            {STATUS_LABELS[s]}
          </Button>
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[status] + '20' }]}>
      <Text style={[styles.statusBadgeText, { color: STATUS_COLORS[status] }]}>
        {STATUS_LABELS[status]}
      </Text>
    </View>
  );
}
