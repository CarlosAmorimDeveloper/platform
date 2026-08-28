import { Pressable, Text, View } from 'react-native';
import { Badge, Card, useTheme } from '@industry/mobile';
import { alpha } from '@industry/tokens';
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
    <Pressable
      onPress={onPress}
      testID={`home-form-card-${form.id}`}
      accessibilityLabel={accessibilityLabel}
    >
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={{ color: alpha(colors.text, 70) }}>Data da consulta:</Text>
            <Text style={[styles.cardDate, { color: colors.text }]} numberOfLines={1}>
              {form.appointmentDate || 'Sem data'}
            </Text>
          </View>

          <Badge tone={isSubmitted ? 'success' : 'neutral'}>{STATUS_LABELS[form.status]}</Badge>
        </View>
        {form.overallSummary ? (
          <Text style={[styles.cardSummary, { color: alpha(colors.text, 70) }]} numberOfLines={2}>
            {form.overallSummary}
          </Text>
        ) : null}
      </Card>
    </Pressable>
  );
}
