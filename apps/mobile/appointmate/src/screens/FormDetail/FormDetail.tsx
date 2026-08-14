import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button, EmptyState, ErrorView, LoadingView } from '@ds/mobile';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { getFormRecord, type FormRecord } from '../../services/formsService';
import { MOOD_OPTIONS } from '../../domain/form';
import { styles } from './FormDetail.styles';

type Props = NativeStackScreenProps<AppStackParamList, 'FormDetail'>;

function Field({ label, value }: { label: string; value: string }) {
  if (!value.trim()) return null;
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

function ListField({ label, items }: { label: string; items: { text: string }[] }) {
  const filled = items.filter((item) => item.text.trim());
  if (filled.length === 0) return null;
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {filled.map((item, index) => (
        <Text key={`${index}-${item.text}`} style={styles.listItem}>
          • {item.text}
        </Text>
      ))}
    </View>
  );
}

function formatDate(date: Date | null) {
  if (!date) return null;
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isRecordEmpty(record: FormRecord) {
  const { values } = record;
  const hasText = [
    values.appointmentDate,
    values.lastAppointmentDate,
    values.overallSummary,
    values.sleep,
    values.energy,
    values.appetite,
    values.concentration,
    values.medicationAdherence,
    values.medicationEffects,
    values.whatWentWell,
    values.whatHasBeenHard,
    values.context,
    values.todayFocus,
    values.consultationNotes,
  ].some((text) => text.trim());
  const hasLists = [...values.medications, ...values.questions].some((item) => item.text.trim());
  return !hasText && !hasLists && !values.overallMood;
}

export function FormDetail({ navigation, route }: Props) {
  const { formId } = route.params;

  const [record, setRecord] = useState<FormRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getFormRecord(formId)
      .then((result) => {
        if (cancelled) return;
        setRecord(result);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setErrorMessage('Não foi possível carregar o formulário.');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [formId]);

  if (loading) {
    return <LoadingView testID="form-detail-loading" />;
  }

  if (errorMessage) {
    return <ErrorView description={errorMessage} testID="form-detail-error" />;
  }

  if (!record) {
    return (
      <EmptyState
        title="Formulário não encontrado"
        description="Este formulário pode ter sido removido."
        testID="form-detail-not-found"
      />
    );
  }

  const { values } = record;
  const updatedAtLabel = formatDate(record.updatedAt) ?? formatDate(record.createdAt);
  const moodLabel = MOOD_OPTIONS.find((option) => option.value === values.overallMood)?.label;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {updatedAtLabel && (
        <Text style={styles.updatedAt} testID="form-detail-updated-at">
          Última atualização em {updatedAtLabel}
        </Text>
      )}

      {isRecordEmpty(record) ? (
        <EmptyState
          title="Nenhuma resposta registrada"
          description="Este formulário ainda não tem respostas preenchidas."
          testID="form-detail-empty-state"
        />
      ) : (
        <>
          <Text style={styles.sectionTitle}>Cabeçalho</Text>
          <Field label="Data desta consulta" value={values.appointmentDate} />
          <Field label="Última consulta foi em" value={values.lastAppointmentDate} />

          <Text style={styles.sectionTitle}>Panorama geral</Text>
          {moodLabel && (
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Como você tem estado</Text>
              <Text style={styles.fieldValue} testID="form-detail-overall-mood">
                {moodLabel}
              </Text>
            </View>
          )}
          <Field label="Em poucas palavras" value={values.overallSummary} />

          <Text style={styles.sectionTitle}>No dia a dia</Text>
          <Field label="Sono" value={values.sleep} />
          <Field label="Energia e disposição" value={values.energy} />
          <Field label="Apetite e alimentação" value={values.appetite} />
          <Field label="Concentração e memória" value={values.concentration} />

          <Text style={styles.sectionTitle}>Medicação</Text>
          <ListField label="Medicamentos e doses" items={values.medications} />
          <Field
            label="Tenho conseguido tomar como combinado?"
            value={values.medicationAdherence}
          />
          <Field label="Efeitos que percebi (bons e ruins)" value={values.medicationEffects} />

          <Text style={styles.sectionTitle}>O que foi bem ou melhorou</Text>
          <Field label="O que foi bem ou melhorou" value={values.whatWentWell} />

          <Text style={styles.sectionTitle}>O que tem sido difícil</Text>
          <Field label="O que tem sido difícil" value={values.whatHasBeenHard} />

          <Text style={styles.sectionTitle}>Contexto</Text>
          <Field label="Situações importantes desde a última consulta" value={values.context} />

          <Text style={styles.sectionTitle}>Minhas perguntas</Text>
          <ListField label="Perguntas" items={values.questions} />

          <Text style={styles.sectionTitle}>Foco do dia</Text>
          <Field label="O que quero desta consulta" value={values.todayFocus} />

          <Text style={styles.sectionTitle}>Durante a consulta</Text>
          <Field label="Anotações e orientações" value={values.consultationNotes} />
        </>
      )}

      <Button
        style={styles.editButton}
        onPress={() => navigation.navigate('FormEntry', { formId })}
        testID="form-detail-edit-button"
      >
        Editar
      </Button>
    </ScrollView>
  );
}
