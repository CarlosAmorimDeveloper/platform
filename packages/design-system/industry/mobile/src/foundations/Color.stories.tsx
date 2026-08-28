import type { Meta, StoryObj } from '@storybook/react';
import { View, Text } from 'react-native';
import {
  color,
  neutral,
  accentRamp,
  lightColor,
  lightNeutral,
  lightAccentRamp,
} from '@industry/tokens';

const meta: Meta = {
  title: 'Foundations/Color',
};

export default meta;
type Story = StoryObj;

const ROLES = [
  { label: 'bg', value: color.bg },
  { label: 'surface', value: color.surface },
  { label: 'text', value: color.text },
  { label: 'accent', value: color.accent },
];

export const Roles: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {ROLES.map((role) => (
        <View key={role.label} style={{ flex: 1 }}>
          <View
            style={{
              height: 32,
              borderRadius: 2,
              borderWidth: 1,
              borderColor: color.divider,
              backgroundColor: role.value,
            }}
          />
          <Text style={{ fontSize: 10, opacity: 0.5, marginTop: 4, color: color.text }}>
            {role.label}
          </Text>
        </View>
      ))}
    </View>
  ),
};

function Ramp({ label, ramp }: { label: string; ramp: typeof neutral | typeof accentRamp }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8 }}>
      <Text style={{ width: 64, fontSize: 10, opacity: 0.45, color: color.text }}>{label}</Text>
      <View style={{ flexDirection: 'row', gap: 6, flex: 1 }}>
        {Object.entries(ramp).map(([step, hex]) => (
          <View key={step} style={{ flex: 1, height: 22, borderRadius: 2, backgroundColor: hex }} />
        ))}
      </View>
    </View>
  );
}

export const TonalRamps: Story = {
  render: () => (
    <View>
      <Ramp label="Neutral" ramp={neutral} />
      <Ramp label="Accent" ramp={accentRamp} />
    </View>
  ),
};

/**
 * Static preview of `lightColor`/`lightNeutral`/`lightAccentRamp` — the same
 * step names as above, resolved against `[data-theme='light']` instead.
 * `useTheme()` (from `@industry/mobile`'s `theme/` export) resolves the
 * right set at runtime; no shipped component consumes it yet — that's a
 * separate follow-up (see REB-87).
 */
export const LightTheme: Story = {
  render: () => (
    <View style={{ backgroundColor: lightColor.bg, padding: 12 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[
          { label: 'bg', value: lightColor.bg },
          { label: 'surface', value: lightColor.surface },
          { label: 'text', value: lightColor.text },
          { label: 'accent', value: lightColor.accent },
        ].map((role) => (
          <View key={role.label} style={{ flex: 1 }}>
            <View
              style={{
                height: 32,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: lightColor.divider,
                backgroundColor: role.value,
              }}
            />
            <Text style={{ fontSize: 10, opacity: 0.5, marginTop: 4, color: lightColor.text }}>
              {role.label}
            </Text>
          </View>
        ))}
      </View>
      <View style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8 }}>
          <Text style={{ width: 64, fontSize: 10, opacity: 0.45, color: lightColor.text }}>
            Neutral
          </Text>
          <View style={{ flexDirection: 'row', gap: 6, flex: 1 }}>
            {Object.entries(lightNeutral).map(([step, hex]) => (
              <View
                key={step}
                style={{ flex: 1, height: 22, borderRadius: 2, backgroundColor: hex }}
              />
            ))}
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8 }}>
          <Text style={{ width: 64, fontSize: 10, opacity: 0.45, color: lightColor.text }}>
            Accent
          </Text>
          <View style={{ flexDirection: 'row', gap: 6, flex: 1 }}>
            {Object.entries(lightAccentRamp).map(([step, hex]) => (
              <View
                key={step}
                style={{ flex: 1, height: 22, borderRadius: 2, backgroundColor: hex }}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  ),
};
