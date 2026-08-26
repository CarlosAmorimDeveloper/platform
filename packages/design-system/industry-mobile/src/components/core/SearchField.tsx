import { TextInput, View } from 'react-native';
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import { color, control, alpha } from '@industry/tokens';
import { Icon } from './Icon';

export interface SearchFieldProps extends Omit<TextInputProps, 'style'> {
  style?: StyleProp<ViewStyle>;
}

export function SearchField({ placeholder = 'Search', style, ...rest }: SearchFieldProps) {
  return (
    <View style={[{ position: 'relative', justifyContent: 'center' }, style]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={alpha(color.text, 38)}
        selectionColor={color.accent}
        style={{
          minHeight: control.height,
          paddingLeft: 40,
          paddingRight: 12,
          fontSize: 15,
          color: color.text,
          backgroundColor: color.surface,
          borderWidth: 1,
          borderColor: color.divider,
          borderRadius: 0,
        }}
        {...rest}
      />
      <View style={{ position: 'absolute', left: 12, opacity: 0.5 }} pointerEvents="none">
        <Icon name="Search" size="sm" color={color.text} />
      </View>
    </View>
  );
}
