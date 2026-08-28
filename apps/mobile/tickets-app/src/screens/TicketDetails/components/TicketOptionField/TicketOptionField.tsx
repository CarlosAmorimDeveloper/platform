import { View, FlatList } from 'react-native';
import { Badge, Button, type BadgeTone } from '@industry/mobile';
import { sharedOptionFieldStyles as styles } from '../sharedOptionField.styles';

interface Props<T extends string> {
  value: T;
  editing: boolean;
  draft: T;
  onChangeDraft: (v: T) => void;
  options: readonly T[];
  labels: Record<T, string>;
  tones: Record<T, BadgeTone>;
}

const ListEdge = () => <View style={styles.listLeadingSpace} />;
const ListSeparator = () => <View style={styles.listSeparator} />;

export function TicketOptionField<T extends string>({
  value,
  editing,
  draft,
  onChangeDraft,
  options,
  labels,
  tones,
}: Props<T>) {
  if (editing) {
    return (
      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={ListEdge}
          ListFooterComponent={ListEdge}
          ItemSeparatorComponent={ListSeparator}
          data={options as T[]}
          renderItem={({ item }) => (
            <Button
              variant={draft === item ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => onChangeDraft(item)}
              style={styles.optionButton}
            >
              {labels[item]}
            </Button>
          )}
          keyExtractor={(item) => item}
        />
      </View>
    );
  }

  return (
    <View style={styles.badge}>
      <Badge tone={tones[value]}>{labels[value]}</Badge>
    </View>
  );
}
