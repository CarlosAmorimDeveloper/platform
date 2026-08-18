import React from 'react';
import type { ReactNode } from 'react';
import { Card as PaperCard } from 'react-native-paper';

export interface CardProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  onPress?: () => void;
  coverUri?: string;
  style?: React.ComponentProps<typeof PaperCard>['style'];
  testID?: string;
  accessibilityLabel?: string;
}

export function Card({
  title,
  subtitle,
  children,
  onPress,
  coverUri,
  style,
  testID,
  accessibilityLabel,
}: CardProps) {
  return (
    <PaperCard
      onPress={onPress}
      style={style}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      {coverUri && <PaperCard.Cover source={{ uri: coverUri }} />}
      {(title != null || subtitle != null) && (
        <PaperCard.Title title={title ?? ''} subtitle={subtitle} />
      )}
      {children != null && <PaperCard.Content>{children}</PaperCard.Content>}
    </PaperCard>
  );
}
