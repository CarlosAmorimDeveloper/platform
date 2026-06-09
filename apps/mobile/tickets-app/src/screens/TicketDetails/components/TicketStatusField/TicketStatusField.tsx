import { View, Text, FlatList } from 'react-native';
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
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => <View style={styles.listLeadingSpace} />}
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        data={ALL_STATUSES}
        renderItem={({ item }) => (
          <Button
            key={item}
            variant={draftStatus === item ? 'primary' : 'secondary'}
            size="sm"
            onPress={() => onChangeDraft(item)}
          >
            {STATUS_LABELS[item]}
          </Button>
        )}
        keyExtractor={(item) => item}
      />
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
