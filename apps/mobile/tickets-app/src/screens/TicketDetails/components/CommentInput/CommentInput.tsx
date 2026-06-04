import { View } from 'react-native';
import { Input, Button } from '@ds/mobile';

interface Props {
  value: string;
  onChangeText: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export function CommentInput({ value, onChangeText, onSubmit, disabled }: Props) {
  return (
    <View>
      <Input
        label="Novo comentário"
        placeholder="Escreva um comentário..."
        value={value}
        onChangeText={onChangeText}
        multiline
        numberOfLines={3}
      />
      <Button onPress={onSubmit} disabled={disabled}>
        Enviar
      </Button>
    </View>
  );
}
