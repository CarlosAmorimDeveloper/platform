import { Fragment } from 'react';
import { Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { accentRamp, alpha, color } from '@industry/tokens';

export interface Step {
  label?: ReactNode;
}

export interface StepperProps {
  steps?: (string | Step)[];
  /** Zero-based index of the current step. Earlier steps read as done. */
  current?: number;
  style?: StyleProp<ViewStyle>;
}

function resolveStep(step: string | Step): Step {
  return typeof step === 'string' ? { label: step } : step;
}

export function Stepper({ steps = [], current = 0, style }: StepperProps) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'flex-start' }, style]}>
      {steps.map((step, index) => {
        const { label } = resolveStep(step);
        const done = index < current;
        const isCurrent = index === current;

        return (
          <Fragment key={typeof label === 'string' ? label : index}>
            <View style={{ flex: 1, alignItems: 'center', gap: 8 }}>
              <View
                testID={`stepper-dot-${index}`}
                style={{
                  width: 28,
                  height: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: done ? color.accent : color.bg,
                  borderWidth: 1,
                  borderColor: done || isCurrent ? color.accent : color.dividerStrong,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: done ? color.bg : isCurrent ? accentRamp['200'] : alpha(color.text, 60),
                  }}
                >
                  {done ? '✓' : index + 1}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 13,
                  textAlign: 'center',
                  color: isCurrent
                    ? color.text
                    : done
                      ? alpha(color.text, 75)
                      : alpha(color.text, 55),
                }}
              >
                {label}
              </Text>
            </View>
            {index < steps.length - 1 ? (
              <View style={{ height: 1, flex: 1, marginTop: 13, backgroundColor: color.divider }} />
            ) : null}
          </Fragment>
        );
      })}
    </View>
  );
}
