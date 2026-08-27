import { View } from 'react-native';
import { Controller, type Control, type UseFieldArrayReturn } from 'react-hook-form';
import { Button, Field, Input, useTheme } from '@vuotto/mobile';
import type { FormValues } from '../../domain/form';
import { REQUIRED_MESSAGE } from './constants';
import { styles } from './FormEntry.styles';

type ListFieldName = 'medications' | 'questions';

interface DynamicListFieldProps {
  control: Control<FormValues>;
  name: ListFieldName;
  fieldArray: UseFieldArrayReturn<FormValues, ListFieldName>;
  itemLabel: string;
  addLabel: string;
  testIdKind: 'medication' | 'question';
}

export function DynamicListField({
  control,
  name,
  fieldArray,
  itemLabel,
  addLabel,
  testIdKind,
}: DynamicListFieldProps) {
  const { colors } = useTheme();

  return (
    <>
      {fieldArray.fields.map((field, index) => (
        <View key={field.id} style={[styles.dynamicRow, { backgroundColor: colors.glass1 }]}>
          <Controller
            control={control}
            name={`${name}.${index}.text`}
            rules={{ required: REQUIRED_MESSAGE }}
            render={({ field: f, fieldState }) => (
              <Field label={itemLabel} error={fieldState.error?.message}>
                <Input
                  value={f.value}
                  onChangeText={f.onChange}
                  testID={`form-entry-${testIdKind}-${index}-input`}
                />
              </Field>
            )}
          />
          <Button
            variant="ghost"
            onPress={() => fieldArray.remove(index)}
            testID={`form-entry-remove-${testIdKind}-${index}-button`}
          >
            Remover
          </Button>
        </View>
      ))}
      <Button
        variant="secondary"
        onPress={() => fieldArray.append({ text: '' })}
        testID={`form-entry-add-${testIdKind}-button`}
      >
        {addLabel}
      </Button>
    </>
  );
}
