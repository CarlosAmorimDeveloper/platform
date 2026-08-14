import { View } from 'react-native';
import { Chip, Input } from '@ds/mobile';
import { TIME_FILTER_PRESETS, type TimeFilter } from '../../domain/timeFilter';
import { styles } from './Home.styles';

export function TimeFilterBar({
  filter,
  onChange,
}: {
  filter: TimeFilter;
  onChange: (filter: TimeFilter) => void;
}) {
  return (
    <View style={styles.filterContainer}>
      <View style={styles.chipRow}>
        {TIME_FILTER_PRESETS.map((preset) => (
          <Chip
            key={preset.value}
            selected={filter.preset === preset.value}
            onPress={() => onChange({ ...filter, preset: preset.value })}
            testID={`home-filter-chip-${preset.value}`}
          >
            {preset.label}
          </Chip>
        ))}
      </View>
      {filter.preset === 'personalizado' && (
        <View style={styles.customRangeRow}>
          <Input
            label="De"
            placeholder="dd/mm/aaaa"
            value={filter.customStart}
            onChangeText={(text) => onChange({ ...filter, customStart: text })}
            testID="home-filter-custom-start-input"
          />
          <Input
            label="Até"
            placeholder="dd/mm/aaaa"
            value={filter.customEnd}
            onChangeText={(text) => onChange({ ...filter, customEnd: text })}
            testID="home-filter-custom-end-input"
          />
        </View>
      )}
    </View>
  );
}
