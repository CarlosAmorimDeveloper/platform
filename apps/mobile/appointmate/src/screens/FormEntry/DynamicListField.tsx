import { View } from 'react-native';
import { Controller, type Control, type UseFieldArrayReturn } from 'react-hook-form';
import { Button, IconButton, TextField } from '@industry/mobile';
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
  return (
    <>
      {fieldArray.fields.map((field, index) => (
        <View key={field.id} style={styles.dynamicRow}>
          <Controller
            control={control}
            name={`${name}.${index}.text`}
            rules={{ required: REQUIRED_MESSAGE }}
            render={({ field: f, fieldState }) => (
              <TextField
                style={styles.dynamicRowInput}
                label={itemLabel}
                error={fieldState.error?.message}
                value={f.value}
                onChangeText={f.onChange}
                testID={`form-entry-${testIdKind}-${index}-input`}
              />
            )}
          />
          <IconButton
            icon="Trash2"
            variant="danger"
            label="Remover"
            onPress={() => fieldArray.remove(index)}
            testID={`form-entry-remove-${testIdKind}-${index}-button`}
          />
        </View>
      ))}
      <Button
        variant="ghost"
        block
        onPress={() => fieldArray.append({ text: '' })}
        testID={`form-entry-add-${testIdKind}-button`}
      >
        {`+ ${addLabel}`}
      </Button>
    </>
  );
}
