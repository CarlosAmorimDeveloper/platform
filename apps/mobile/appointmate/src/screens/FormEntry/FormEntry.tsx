import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useFieldArray, useForm, type Control } from 'react-hook-form';
import { AppBar, Button, Chip, Spinner, TextField, useTheme, useToast } from '@industry/mobile';
import { semanticColor } from '@industry/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { createForm, getForm, updateForm } from '../../services/formsService';
import { mapFirestoreError } from '../../utils/firebaseErrors';
import {
  EMPTY_FORM_VALUES,
  MOOD_OPTIONS,
  formatDateInput,
  isDateOnOrAfterToday,
  type FormStatus,
  type FormValues,
} from '../../domain/form';
import { LoadingView } from '../../components/LoadingView';
import { styles } from './FormEntry.styles';
import { DynamicListField } from './DynamicListField';
import { REQUIRED_MESSAGE } from './constants';

type Props = NativeStackScreenProps<AppStackParamList, 'FormEntry'>;

type TextareaFieldName =
  | 'overallSummary'
  | 'sleep'
  | 'energy'
  | 'appetite'
  | 'concentration'
  | 'medicationAdherence'
  | 'medicationEffects'
  | 'whatWentWell'
  | 'whatHasBeenHard'
  | 'context'
  | 'todayFocus'
  | 'consultationNotes';

function TextareaField({
  control,
  name,
  label,
  testID,
}: {
  control: Control<FormValues>;
  name: TextareaFieldName;
  label: string;
  testID: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: REQUIRED_MESSAGE }}
      render={({ field, fieldState }) => (
        <TextField
          label={label}
          error={fieldState.error?.message}
          multiline
          value={field.value}
          onChangeText={field.onChange}
          testID={testID}
        />
      )}
    />
  );
}

export function FormEntry({ navigation, route }: Props) {
  const formId = route.params?.formId;
  const { user } = useAuth();
  const { colors } = useTheme();
  const toast = useToast();

  const [loadingForm, setLoadingForm] = useState(Boolean(formId));
  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, reset, getValues } = useForm<FormValues>({
    defaultValues: EMPTY_FORM_VALUES,
  });
  const medicationsArray = useFieldArray({ control, name: 'medications' });
  const questionsArray = useFieldArray({ control, name: 'questions' });

  useEffect(() => {
    if (!formId) return;
    let cancelled = false;

    getForm(formId)
      .then((values) => {
        if (cancelled) return;
        if (values) reset(values);
        setLoadingForm(false);
      })
      .catch((err) => {
        if (cancelled) return;
        toast.show({
          tone: 'danger',
          title: mapFirestoreError(err, 'Não foi possível carregar o formulário.'),
        });
        setLoadingForm(false);
      });

    return () => {
      cancelled = true;
    };
  }, [formId, reset, toast]);

  const appBar = (
    <AppBar
      title={formId ? 'Editar formulário' : 'Novo formulário'}
      onBackPress={() => navigation.goBack()}
      testID="form-entry-app-bar"
    />
  );

  async function onSave(values: FormValues, status: FormStatus) {
    if (!user) return;
    setSaving(true);
    try {
      let savedFormId = formId;
      if (formId) {
        await updateForm(formId, values, status);
      } else {
        savedFormId = await createForm(user.uid, values, status);
      }
      // Always `replace` (not `goBack`) so FormDetail remounts and shows the
      // values just saved, instead of the stale data it fetched on its first mount.
      navigation.replace('FormDetail', { formId: savedFormId! });
    } catch (err) {
      toast.show({
        tone: 'danger',
        title: mapFirestoreError(err, 'Não foi possível salvar o formulário. Tente novamente.'),
      });
    } finally {
      setSaving(false);
    }
  }

  // Drafts intentionally skip validation — reads current values directly
  // instead of going through `handleSubmit`, which would enforce the
  // `required` rules meant only for "Enviar".
  function onSaveDraft() {
    onSave(getValues(), 'draft');
  }

  if (loadingForm) {
    return (
      <SafeAreaView edges={['top']} style={styles.screen}>
        {appBar}
        <LoadingView testID="form-entry-loading" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      {appBar}
      <KeyboardAvoidingView style={styles.keyboardView} behavior="padding">
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Cabeçalho</Text>
          <Controller
            control={control}
            name="appointmentDate"
            rules={{
              required: REQUIRED_MESSAGE,
              validate: (value) =>
                isDateOnOrAfterToday(value) || 'A data não pode ser anterior a hoje',
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Data desta consulta"
                error={fieldState.error?.message}
                placeholder="dd/mm/aaaa"
                value={field.value}
                onChangeText={(text) => field.onChange(formatDateInput(text))}
                testID="form-entry-appointment-date-input"
              />
            )}
          />
          <Controller
            control={control}
            name="lastAppointmentDate"
            rules={{ required: REQUIRED_MESSAGE }}
            render={({ field, fieldState }) => (
              <TextField
                label="Última consulta foi em"
                error={fieldState.error?.message}
                placeholder="dd/mm/aaaa"
                value={field.value}
                onChangeText={(text) => field.onChange(formatDateInput(text))}
                testID="form-entry-last-appointment-date-input"
              />
            )}
          />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Panorama geral</Text>
          <Controller
            control={control}
            name="overallMood"
            rules={{ required: REQUIRED_MESSAGE }}
            render={({ field, fieldState }) => (
              <>
                <View style={styles.chipRow}>
                  {MOOD_OPTIONS.map((option) => (
                    <Chip
                      key={option.value}
                      selected={field.value === option.value}
                      onPress={() => field.onChange(option.value)}
                      testID={`form-entry-overall-mood-chip-${option.value}`}
                    >
                      {option.label}
                    </Chip>
                  ))}
                </View>
                {fieldState.error && (
                  <Text
                    style={[styles.errorText, { color: semanticColor.danger }]}
                    testID="form-entry-overall-mood-error"
                  >
                    {fieldState.error.message}
                  </Text>
                )}
              </>
            )}
          />
          <TextareaField
            control={control}
            name="overallSummary"
            label="Em poucas palavras"
            testID="form-entry-overall-summary-input"
          />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>No dia a dia</Text>
          <TextareaField
            control={control}
            name="sleep"
            label="Sono"
            testID="form-entry-sleep-input"
          />
          <TextareaField
            control={control}
            name="energy"
            label="Energia e disposição"
            testID="form-entry-energy-input"
          />
          <TextareaField
            control={control}
            name="appetite"
            label="Apetite e alimentação"
            testID="form-entry-appetite-input"
          />
          <TextareaField
            control={control}
            name="concentration"
            label="Concentração e memória"
            testID="form-entry-concentration-input"
          />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Medicação</Text>
          <DynamicListField
            control={control}
            name="medications"
            fieldArray={medicationsArray}
            itemLabel="Medicamento e dose"
            addLabel="Adicionar medicamento"
            testIdKind="medication"
          />
          <TextareaField
            control={control}
            name="medicationAdherence"
            label="Tenho conseguido tomar como combinado?"
            testID="form-entry-medication-adherence-input"
          />
          <TextareaField
            control={control}
            name="medicationEffects"
            label="Efeitos que percebi (bons e ruins)"
            testID="form-entry-medication-effects-input"
          />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            O que foi bem ou melhorou
          </Text>
          <TextareaField
            control={control}
            name="whatWentWell"
            label="O que foi bem ou melhorou"
            testID="form-entry-what-went-well-input"
          />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>O que tem sido difícil</Text>
          <TextareaField
            control={control}
            name="whatHasBeenHard"
            label="O que tem sido difícil"
            testID="form-entry-what-has-been-hard-input"
          />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contexto</Text>
          <TextareaField
            control={control}
            name="context"
            label="Situações importantes desde a última consulta"
            testID="form-entry-context-input"
          />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Minhas perguntas</Text>
          <DynamicListField
            control={control}
            name="questions"
            fieldArray={questionsArray}
            itemLabel="Pergunta"
            addLabel="Adicionar pergunta"
            testIdKind="question"
          />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Foco do dia</Text>
          <TextareaField
            control={control}
            name="todayFocus"
            label="O que quero desta consulta"
            testID="form-entry-today-focus-input"
          />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Durante a consulta</Text>
          <TextareaField
            control={control}
            name="consultationNotes"
            label="Anotações e orientações"
            testID="form-entry-consultation-notes-input"
          />

          {saving ? <Spinner /> : null}
          <Button
            variant="secondary"
            onPress={onSaveDraft}
            disabled={saving}
            testID="form-entry-save-draft-button"
          >
            Salvar rascunho
          </Button>
          <Button
            onPress={handleSubmit((values) => onSave(values, 'submitted'))}
            disabled={saving}
            testID="form-entry-submit-button"
          >
            Enviar
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
