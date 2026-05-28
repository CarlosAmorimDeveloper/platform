import React from 'react';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';

export interface CardProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  onPress?: () => void;
  coverUri?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Card({ title, subtitle, children, onPress, coverUri, style, testID }: CardProps) {
  // react-native-paper's Animated style type is incompatible with StyleProp<ViewStyle>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paperStyle = style as any;
  return (
    <PaperCard onPress={onPress} style={paperStyle} testID={testID}>
      {coverUri && <PaperCard.Cover source={{ uri: coverUri }} />}
      {(title != null || subtitle != null) && (
        <PaperCard.Title title={title ?? ''} subtitle={subtitle} />
      )}
      {children != null && <PaperCard.Content>{children}</PaperCard.Content>}
    </PaperCard>
  );
}
