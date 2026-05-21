import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { PieChart as RNPieChart } from 'react-native-chart-kit';
import { colors, spacing } from '@ds/tokens';

export interface PieChartSlice {
  label: string;
  value: number;
  color: string;
}

export interface PieChartProps {
  slices: PieChartSlice[];
  testID?: string;
}

export function PieChart({ slices, testID }: PieChartProps) {
  const { width } = useWindowDimensions();
  const chartWidth = width - spacing[6] * 2;

  const data = slices.map((s) => ({
    name: s.label,
    count: s.value,
    color: s.color,
    legendFontColor: `${colors.neutral[700]}`,
    legendFontSize: 12,
  }));

  return (
    <Card testID={testID}>
      <Card.Content>
        <RNPieChart
          data={data}
          width={chartWidth}
          height={200}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
          hasLegend
          absolute={false}
          chartConfig={{
            color: () => `${colors.neutral[700]}`,
            labelColor: () => `${colors.neutral[700]}`,
          }}
        />
      </Card.Content>
    </Card>
  );
}
