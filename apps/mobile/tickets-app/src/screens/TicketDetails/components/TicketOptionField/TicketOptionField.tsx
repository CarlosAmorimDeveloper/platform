import { View, Text, FlatList } from 'react-native';
import { Button } from '@ds/mobile';
import { sharedOptionFieldStyles as styles } from '../sharedOptionField.styles';

interface Props<T extends string> {
  value: T;
  editing: boolean;
  draft: T;
  onChangeDraft: (v: T) => void;
  options: readonly T[];
  labels: Record<T, string>;
  colors: Record<T, string>;
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
  colors,
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
    <View style={[styles.badge, { backgroundColor: colors[value] + '20' }]}>
      <Text style={[styles.badgeText, { color: colors[value] }]}>{labels[value]}</Text>
    </View>
  );
}
