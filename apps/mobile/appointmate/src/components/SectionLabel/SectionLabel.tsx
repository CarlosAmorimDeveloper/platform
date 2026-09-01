import { Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { accentRamp, color, space } from '@industry/tokens';

export interface SectionLabelProps {
  children: string;
  /** e.g. an item count, right-aligned next to the label. */
  trailing?: ReactNode;
  testID?: string;
}

/** Uppercase section heading with a hairline below, per the Industry "rótulo de seção" rule. */
export function SectionLabel({ children, trailing, testID }: SectionLabelProps) {
  return (
    <View style={{ gap: space[2] }} testID={testID}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 11,
            letterSpacing: 1.1,
            textTransform: 'uppercase',
            color: accentRamp['300'],
          }}
        >
          {children}
        </Text>
        {trailing}
      </View>
      <View style={{ height: 1, backgroundColor: color.divider }} />
    </View>
  );
}
