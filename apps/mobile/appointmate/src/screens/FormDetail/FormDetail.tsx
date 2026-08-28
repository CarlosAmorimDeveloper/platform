import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { AppBar, Button, EmptyState, Sheet, Spinner, useTheme, useToast } from '@industry/mobile';
import { alpha } from '@industry/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { deleteForm, getFormRecord, type FormRecord } from '../../services/formsService';
import { mapFirestoreError } from '../../utils/firebaseErrors';
import { MOOD_OPTIONS, formatDate, isFormValuesEmpty } from '../../domain/form';
import { buildFormHtml } from '../../domain/pdf';
import { LoadingView } from '../../components/LoadingView';
import { ErrorView } from '../../components/ErrorView';
import { styles } from './FormDetail.styles';

type Props = NativeStackScreenProps<AppStackParamList, 'FormDetail'>;

function Field({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  if (!value.trim()) return null;
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: alpha(colors.text, 70) }]}>{label}</Text>
      <Text style={[styles.fieldValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  const { colors } = useTheme();
  return <Text style={[styles.sectionTitle, { color: colors.text }]}>{children}</Text>;
}

function ListField({ label, items }: { label: string; items: { text: string }[] }) {
  const { colors } = useTheme();
  const filled = items.filter((item) => item.text.trim());
  if (filled.length === 0) return null;
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: alpha(colors.text, 70) }]}>{label}</Text>
      {filled.map((item, index) => (
        <Text key={`${index}-${item.text}`} style={[styles.listItem, { color: colors.text }]}>
          • {item.text}
        </Text>
      ))}
    </View>
  );
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
    setExporting(true);
    try {
      const html = buildFormHtml(record!.values, {
        status: record!.status,
        createdAt: record!.createdAt,
        updatedAt: record!.updatedAt,
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
      <SafeAreaView edges={['top']} style={styles.screen}>
        {appBar}
        <LoadingView testID="form-detail-loading" />
      </SafeAreaView>
    );
  }

  if (errorMessage) {
    return (
      <SafeAreaView edges={['top']} style={styles.screen}>
        {appBar}
        <ErrorView description={errorMessage} testID="form-detail-error" />
      </SafeAreaView>
    );
  }

  if (!record) {
    return (
      <SafeAreaView edges={['top']} style={styles.screen}>
        {appBar}
        <EmptyState
          title="Formulário não encontrado"
          body="Este formulário pode ter sido removido."
          testID="form-detail-not-found"
        />
      </SafeAreaView>
    );
  }

  const { values } = record;
  const updatedAtLabel = formatDate(record.updatedAt) ?? formatDate(record.createdAt);
  const moodLabel = MOOD_OPTIONS.find((option) => option.value === values.overallMood)?.label;

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      {appBar}
      <ScrollView contentContainerStyle={styles.container}>
        {updatedAtLabel && (
          <Text
            style={[styles.updatedAt, { color: alpha(colors.text, 70) }]}
            testID="form-detail-updated-at"
          >
            Última atualização em {updatedAtLabel}
          </Text>
        )}

        {isFormValuesEmpty(values) ? (
          <EmptyState
            title="Nenhuma resposta registrada"
            body="Este formulário ainda não tem respostas preenchidas."
            testID="form-detail-empty-state"
          />
        ) : (
          <>
            <SectionTitle>Cabeçalho</SectionTitle>
            <Field label="Data desta consulta" value={values.appointmentDate} />
            <Field label="Última consulta foi em" value={values.lastAppointmentDate} />

            <SectionTitle>Panorama geral</SectionTitle>
            {moodLabel && (
              <View style={styles.field}>
                <Text style={[styles.fieldLabel, { color: alpha(colors.text, 70) }]}>
                  Como você tem estado
                </Text>
                <Text
                  style={[styles.fieldValue, { color: colors.text }]}
                  testID="form-detail-overall-mood"
                >
                  {moodLabel}
                </Text>
              </View>
            )}
            <Field label="Em poucas palavras" value={values.overallSummary} />

            <SectionTitle>No dia a dia</SectionTitle>
            <Field label="Sono" value={values.sleep} />
            <Field label="Energia e disposição" value={values.energy} />
            <Field label="Apetite e alimentação" value={values.appetite} />
            <Field label="Concentração e memória" value={values.concentration} />

            <SectionTitle>Medicação</SectionTitle>
            <ListField label="Medicamentos e doses" items={values.medications} />
            <Field
              label="Tenho conseguido tomar como combinado?"
              value={values.medicationAdherence}
            />
            <Field label="Efeitos que percebi (bons e ruins)" value={values.medicationEffects} />

            <SectionTitle>O que foi bem ou melhorou</SectionTitle>
            <Field label="O que foi bem ou melhorou" value={values.whatWentWell} />

            <SectionTitle>O que tem sido difícil</SectionTitle>
            <Field label="O que tem sido difícil" value={values.whatHasBeenHard} />

            <SectionTitle>Contexto</SectionTitle>
            <Field label="Situações importantes desde a última consulta" value={values.context} />

            <SectionTitle>Minhas perguntas</SectionTitle>
            <ListField label="Perguntas" items={values.questions} />

            <SectionTitle>Foco do dia</SectionTitle>
            <Field label="O que quero desta consulta" value={values.todayFocus} />

            <SectionTitle>Durante a consulta</SectionTitle>
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
        {exporting ? <Spinner /> : null}
        <Button
          variant="danger"
          onPress={() => setDeleteDialogVisible(true)}
          testID="form-detail-delete-button"
        >
          Excluir
        </Button>

        <Sheet
          testID="form-detail-delete-dialog"
          open={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
          title="Excluir formulário"
          actions={
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
          <Text style={{ color: colors.text }}>
            Tem certeza que deseja excluir este formulário? Essa ação não pode ser desfeita.
          </Text>
        </Sheet>
      </ScrollView>
    </SafeAreaView>
  );
}
