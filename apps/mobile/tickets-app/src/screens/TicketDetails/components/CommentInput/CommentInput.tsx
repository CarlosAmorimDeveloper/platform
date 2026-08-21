import { View } from 'react-native';
import { Button, Field, Input } from '@vuotto/mobile';
import { styles } from './CommentInput.styles';

interface Props {
  value: string;
  onChangeText: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  onFocus?: () => void;
}

export function CommentInput({ value, onChangeText, onSubmit, disabled, onFocus }: Props) {
  return (
    <View style={styles.wrapper}>
      <Field label="Novo comentário">
        <Input
          placeholder="Escreva um comentário..."
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          multiline
          numberOfLines={3}
        />
      </Field>
      <Button onPress={onSubmit} disabled={disabled}>
        Enviar
      </Button>
    </View>
  );
}
