import { View, Text, FlatList } from 'react-native';
import { Button } from '@ds/mobile';
import {
  ALL_PRIORITIES,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  type TicketPriority,
} from '../../../../constants/ticketPriority';
import { styles } from './TicketPriorityField.styles';
import { spacing } from '@ds/tokens';

interface Props {
  priority: TicketPriority;
  editing: boolean;
  draftPriority: TicketPriority;
  onChangeDraft: (p: TicketPriority) => void;
}

export function TicketPriorityField({ priority, editing, draftPriority, onChangeDraft }: Props) {
  if (editing) {
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => <View style={{ width: spacing[4] }} />}
        ItemSeparatorComponent={() => <View style={{ width: spacing[2] }} />}
        data={ALL_PRIORITIES}
        renderItem={({ item }) => (
          <Button
            key={item}
            variant={draftPriority === item ? 'primary' : 'secondary'}
            size="sm"
            onPress={() => onChangeDraft(item)}
          >
            {PRIORITY_LABELS[item]}
          </Button>
        )}
        keyExtractor={(item) => item}
      />
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
