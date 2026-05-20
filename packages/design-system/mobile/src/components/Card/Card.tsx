import React, { ReactNode } from 'react';
import { Card as PaperCard } from 'react-native-paper';

export interface CardProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  onPress?: () => void;
  coverUri?: string;
  testID?: string;
}

export function Card({ title, subtitle, children, onPress, coverUri, testID }: CardProps) {
  return (
    <PaperCard onPress={onPress} testID={testID}>
      {coverUri && <PaperCard.Cover source={{ uri: coverUri }} />}
      {(title != null || subtitle != null) && (
        <PaperCard.Title title={title ?? ''} subtitle={subtitle} />
      )}
      {children != null && <PaperCard.Content>{children}</PaperCard.Content>}
    </PaperCard>
  );
}
