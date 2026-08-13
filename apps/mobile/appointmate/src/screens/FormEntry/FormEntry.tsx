import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button, Chip, Input, LoadingIndicator, LoadingView, Snackbar, Textarea } from '@ds/mobile';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { createForm, getForm, updateForm } from '../../services/formsService';
import {
  EMPTY_FORM_VALUES,
  EMPTY_MEDICATION,
  EMPTY_QUESTION,
  MOOD_OPTIONS,
  type FormValues,
} from '../../domain/form';
import { styles } from './FormEntry.styles';

type Props = NativeStackScreenProps<AppStackParamList, 'FormEntry'>;

export function FormEntry({ navigation, route }: Props) {
  const formId = route.params?.formId;
  const { user } = useAuth();

  const [loadingForm, setLoadingForm] = useState(Boolean(formId));
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { control, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: EMPTY_FORM_VALUES,
  });
  const medicationsArray = useFieldArray({ control, name: 'medications' });
  const questionsArray = useFieldArray({ control, name: 'questions' });
  const mood = watch('mood');

  useEffect(() => {
    if (!formId) return;
    let cancelled = false;

    getForm(formId)
      .then((values) => {
        if (cancelled) return;
        if (values) reset(values);
        setLoadingForm(false);
      })
      .catch(() => {
        if (cancelled) return;
        setErrorMessage('Não foi possível carregar o formulário.');
        setLoadingForm(false);
      });

    return () => {
      cancelled = true;
    };
  }, [formId, reset]);

  async function onSubmit(values: FormValues) {
    if (!values.mood || !user) return;
    setSaving(true);
    try {
      if (formId) {
        await updateForm(formId, values);
      } else {
        await createForm(user.uid, values);
      }
      navigation.goBack();
    } catch {
      setErrorMessage('Não foi possível salvar o formulário. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  if (loadingForm) {
    return <LoadingView testID="form-entry-loading" />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Consulta</Text>
        <Controller
          control={control}
          name="appointmentDate"
          render={({ field }) => (
            <Input
              label="Data da consulta"
              placeholder="dd/mm/aaaa"
              value={field.value}
              onChangeText={field.onChange}
              testID="form-entry-appointment-date-input"
            />
          )}
        />
        <Controller
          control={control}
          name="doctorName"
          render={({ field }) => (
            <Input
              label="Médico(a) / especialidade"
              placeholder="Ex: Dra. Ana, Psiquiatria"
              value={field.value}
              onChangeText={field.onChange}
              testID="form-entry-doctor-name-input"
            />
          )}
        />

        <Text style={styles.sectionTitle}>Como você está se sentindo?</Text>
        <View style={styles.chipRow}>
          {MOOD_OPTIONS.map((option) => (
            <Controller
              key={option.value}
              control={control}
              name="mood"
              render={({ field }) => (
                <Chip
                  selected={field.value === option.value}
                  onPress={() => field.onChange(option.value)}
                  testID={`form-entry-mood-chip-${option.value}`}
                >
                  {option.label}
                </Chip>
              )}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Medicamentos em uso</Text>
        {medicationsArray.fields.map((field, index) => (
          <View key={field.id} style={styles.dynamicRow}>
            <Controller
              control={control}
              name={`medications.${index}.name`}
              render={({ field: f }) => (
                <Input
                  label="Nome"
                  value={f.value}
                  onChangeText={f.onChange}
                  testID={`form-entry-medication-${index}-name-input`}
                />
              )}
            />
            <Controller
              control={control}
              name={`medications.${index}.dosage`}
              render={({ field: f }) => (
                <Input
                  label="Dosagem"
                  value={f.value}
                  onChangeText={f.onChange}
                  testID={`form-entry-medication-${index}-dosage-input`}
                />
              )}
            />
            <Controller
              control={control}
              name={`medications.${index}.frequency`}
              render={({ field: f }) => (
                <Input
                  label="Frequência"
                  value={f.value}
                  onChangeText={f.onChange}
                  testID={`form-entry-medication-${index}-frequency-input`}
                />
              )}
            />
            <Button
              variant="ghost"
              onPress={() => medicationsArray.remove(index)}
              testID={`form-entry-remove-medication-${index}-button`}
            >
              Remover
            </Button>
          </View>
        ))}
        <Button
          variant="secondary"
          onPress={() => medicationsArray.append(EMPTY_MEDICATION)}
          testID="form-entry-add-medication-button"
        >
          Adicionar medicamento
        </Button>

        <Text style={styles.sectionTitle}>Perguntas para o médico</Text>
        {questionsArray.fields.map((field, index) => (
          <View key={field.id} style={styles.dynamicRow}>
            <Controller
              control={control}
              name={`questions.${index}.text`}
              render={({ field: f }) => (
                <Textarea
                  label="Pergunta"
                  value={f.value}
                  onChangeText={f.onChange}
                  testID={`form-entry-question-${index}-input`}
                />
              )}
            />
            <Button
              variant="ghost"
              onPress={() => questionsArray.remove(index)}
              testID={`form-entry-remove-question-${index}-button`}
            >
              Remover
            </Button>
          </View>
        ))}
        <Button
          variant="secondary"
          onPress={() => questionsArray.append(EMPTY_QUESTION)}
          testID="form-entry-add-question-button"
        >
          Adicionar pergunta
        </Button>

        <LoadingIndicator visible={saving} testID="form-entry-saving-indicator" />
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={!mood || saving}
          testID="form-entry-submit-button"
        >
          Salvar
        </Button>
      </ScrollView>
      <Snackbar
        visible={errorMessage !== null}
        onDismiss={() => setErrorMessage(null)}
        message={errorMessage ?? ''}
        position="top"
        variant="error"
        testID="form-entry-error-snackbar"
      />
    </KeyboardAvoidingView>
  );
}
