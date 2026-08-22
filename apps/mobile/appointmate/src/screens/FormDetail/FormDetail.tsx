import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {
  AppBar,
  Button,
  Dialog,
  EmptyState,
  ErrorView,
  LoadingIndicator,
  LoadingView,
  useTheme,
  useToast,
} from '@vuotto/mobile';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { deleteForm, getFormRecord, type FormRecord } from '../../services/formsService';
import { mapFirestoreError } from '../../utils/firebaseErrors';
import { MOOD_OPTIONS } from '../../domain/form';
import { buildFormHtml } from '../../domain/pdf';
import { styles } from './FormDetail.styles';

type Props = NativeStackScreenProps<AppStackParamList, 'FormDetail'>;

function Field({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  if (!value.trim()) return null;
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.fieldValue, { color: colors.textHeading }]}>{value}</Text>
    </View>
  );
}

function ListField({ label, items }: { label: string; items: { text: string }[] }) {
  const { colors } = useTheme();
  const filled = items.filter((item) => item.text.trim());
  if (filled.length === 0) return null;
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      {filled.map((item, index) => (
        <Text
          key={`${index}-${item.text}`}
          style={[styles.listItem, { color: colors.textHeading }]}
        >
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
  const { colors } = useTheme();
  const toast = useToast();

  const [record, setRecord] = useState<FormRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getFormRecord(formId)
      .then((result) => {
        if (cancelled) return;
        setRecord(result);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMessage(mapFirestoreError(err, 'Não foi possível carregar o formulário.'));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [formId]);

  async function onExportPdf() {
    if (!record) return;
    setExporting(true);
    try {
      const html = buildFormHtml(record.values, {
        status: record.status,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      });
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
    } catch {
      toast.show({ tone: 'danger', title: 'Não foi possível exportar o PDF. Tente novamente.' });
    } finally {
      setExporting(false);
    }
  }

  async function onConfirmDelete() {
    setDeleting(true);
    try {
      await deleteForm(formId);
      setDeleteDialogVisible(false);
      navigation.goBack();
    } catch (err) {
      toast.show({
        tone: 'danger',
        title: mapFirestoreError(err, 'Não foi possível excluir o formulário. Tente novamente.'),
      });
      setDeleteDialogVisible(false);
    } finally {
      setDeleting(false);
    }
  }

  const appBar = (
    <AppBar
      title="Detalhes do formulário"
      onBackPress={() => navigation.goBack()}
      testID="form-detail-app-bar"
    />
  );

  if (loading) {
    return (
      <View style={styles.screen}>
        {appBar}
        <LoadingView testID="form-detail-loading" />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.screen}>
        {appBar}
        <ErrorView description={errorMessage} testID="form-detail-error" />
      </View>
    );
  }

  if (!record) {
    return (
      <View style={styles.screen}>
        {appBar}
        <EmptyState
          title="Formulário não encontrado"
          body="Este formulário pode ter sido removido."
          testID="form-detail-not-found"
        />
      </View>
    );
  }

  const { values } = record;
  const updatedAtLabel = formatDate(record.updatedAt) ?? formatDate(record.createdAt);
  const moodLabel = MOOD_OPTIONS.find((option) => option.value === values.overallMood)?.label;

  return (
    <View style={styles.screen}>
      {appBar}
      <ScrollView contentContainerStyle={styles.container}>
        {updatedAtLabel && (
          <Text
            style={[styles.updatedAt, { color: colors.textSecondary }]}
            testID="form-detail-updated-at"
          >
            Última atualização em {updatedAtLabel}
          </Text>
        )}

        {isRecordEmpty(record) ? (
          <EmptyState
            title="Nenhuma resposta registrada"
            body="Este formulário ainda não tem respostas preenchidas."
            testID="form-detail-empty-state"
          />
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>Cabeçalho</Text>
            <Field label="Data desta consulta" value={values.appointmentDate} />
            <Field label="Última consulta foi em" value={values.lastAppointmentDate} />

            <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>Panorama geral</Text>
            {moodLabel && (
              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                  Como você tem estado
                </Text>
                <Text
                  style={[styles.fieldValue, { color: colors.textHeading }]}
                  testID="form-detail-overall-mood"
                >
                  {moodLabel}
                </Text>
              </View>
            )}
            <Field label="Em poucas palavras" value={values.overallSummary} />

            <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>No dia a dia</Text>
            <Field label="Sono" value={values.sleep} />
            <Field label="Energia e disposição" value={values.energy} />
            <Field label="Apetite e alimentação" value={values.appetite} />
            <Field label="Concentração e memória" value={values.concentration} />

            <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>Medicação</Text>
            <ListField label="Medicamentos e doses" items={values.medications} />
            <Field
              label="Tenho conseguido tomar como combinado?"
              value={values.medicationAdherence}
            />
            <Field label="Efeitos que percebi (bons e ruins)" value={values.medicationEffects} />

            <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>
              O que foi bem ou melhorou
            </Text>
            <Field label="O que foi bem ou melhorou" value={values.whatWentWell} />

            <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>
              O que tem sido difícil
            </Text>
            <Field label="O que tem sido difícil" value={values.whatHasBeenHard} />

            <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>Contexto</Text>
            <Field label="Situações importantes desde a última consulta" value={values.context} />

            <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>
              Minhas perguntas
            </Text>
            <ListField label="Perguntas" items={values.questions} />

            <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>Foco do dia</Text>
            <Field label="O que quero desta consulta" value={values.todayFocus} />

            <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>
              Durante a consulta
            </Text>
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
        <Button
          variant="secondary"
          onPress={onExportPdf}
          disabled={exporting}
          testID="form-detail-export-pdf-button"
        >
          Exportar PDF
        </Button>
        <LoadingIndicator visible={exporting} testID="form-detail-exporting-indicator" />
        <Button
          variant="danger"
          onPress={() => setDeleteDialogVisible(true)}
          testID="form-detail-delete-button"
        >
          Excluir
        </Button>

        <Dialog
          open={deleteDialogVisible}
          onClose={() => setDeleteDialogVisible(false)}
          title="Excluir formulário"
          testID="form-detail-delete-dialog"
          footer={
            <>
              <Button
                variant="ghost"
                onPress={() => setDeleteDialogVisible(false)}
                testID="form-detail-delete-cancel-button"
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onPress={onConfirmDelete}
                disabled={deleting}
                testID="form-detail-delete-confirm-button"
              >
                Excluir
              </Button>
            </>
          }
        >
          <Text style={{ color: colors.textPrimary }}>
            Tem certeza que deseja excluir este formulário? Essa ação não pode ser desfeita.
          </Text>
        </Dialog>
      </ScrollView>
    </View>
  );
}
