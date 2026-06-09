import { View } from 'react-native';
import { Input, Button } from '@ds/mobile';
import { spacing } from '@ds/tokens';

interface Props {
  value: string;
  onChangeText: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  onFocus?: () => void;
}

export function CommentInput({ value, onChangeText, onSubmit, disabled, onFocus }: Props) {
  return (
    <View style={{ gap: spacing[3] }}>
      <Input
        label="Novo comentário"
        placeholder="Escreva um comentário..."
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        multiline
        numberOfLines={3}
      />
      <Button onPress={onSubmit} disabled={disabled}>
        Enviar
      </Button>
    </View>
  );
}
