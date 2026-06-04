import { View, Text, ScrollView } from 'react-native';
import { Button } from '@ds/mobile';
import {
  ALL_PRIORITIES,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  type TicketPriority,
} from '../../../../constants/ticketPriority';
import { styles } from './TicketPriorityField.styles';

interface Props {
  priority: TicketPriority;
  editing: boolean;
  draftPriority: TicketPriority;
  onChangeDraft: (p: TicketPriority) => void;
}

export function TicketPriorityField({ priority, editing, draftPriority, onChangeDraft }: Props) {
  if (editing) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.priorityScrollContent}
      >
        <View style={styles.statusRow}>
          {ALL_PRIORITIES.map((p) => (
            <Button
              key={p}
              variant={draftPriority === p ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => onChangeDraft(p)}
            >
              {PRIORITY_LABELS[p]}
            </Button>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={[styles.statusBadge, { backgroundColor: PRIORITY_COLORS[priority] + '20' }]}>
      <Text style={[styles.statusBadgeText, { color: PRIORITY_COLORS[priority] }]}>
        {PRIORITY_LABELS[priority]}
      </Text>
    </View>
  );
}
