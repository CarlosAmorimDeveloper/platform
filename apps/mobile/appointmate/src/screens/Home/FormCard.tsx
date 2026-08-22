import { Text, View } from 'react-native';
import { Badge, Card, useTheme } from '@vuotto/mobile';
import type { FormSummary } from '../../services/formsService';
import { styles } from './Home.styles';

const STATUS_LABELS: Record<FormSummary['status'], string> = {
  draft: 'Rascunho',
  submitted: 'Salvo',
};

export function FormCard({ form, onPress }: { form: FormSummary; onPress: () => void }) {
  const { colors } = useTheme();
  const isSubmitted = form.status === 'submitted';
  const dateLabel = form.appointmentDate || 'sem data';
  const accessibilityLabel = `Formulário de consulta em ${dateLabel}, ${STATUS_LABELS[form.status].toLowerCase()}`;

  return (
    <Card
      interactive
      onPress={onPress}
      style={styles.card}
      testID={`home-form-card-${form.id}`}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={{ color: colors.textSecondary }}>Data da consulta:</Text>
          <Text style={[styles.cardDate, { color: colors.textHeading }]} numberOfLines={1}>
            {form.appointmentDate || 'Sem data'}
          </Text>
        </View>

        <Badge tone={isSubmitted ? 'success' : 'neutral'}>{STATUS_LABELS[form.status]}</Badge>
      </View>
      {form.overallSummary ? (
        <Text style={[styles.cardSummary, { color: colors.textSecondary }]} numberOfLines={2}>
          {form.overallSummary}
        </Text>
      ) : null}
    </Card>
  );
}
