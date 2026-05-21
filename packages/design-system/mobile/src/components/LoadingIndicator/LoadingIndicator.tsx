import React from 'react';
import { ActivityIndicator } from 'react-native-paper';

export interface LoadingIndicatorProps {
  visible?: boolean;
  testID?: string;
}

export function LoadingIndicator({ visible = true, testID }: LoadingIndicatorProps) {
  if (!visible) return null;
  return <ActivityIndicator animating size="large" testID={testID} />;
}
