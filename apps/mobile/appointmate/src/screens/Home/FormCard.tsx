import { Text, View } from 'react-native';
import { Card } from '@ds/mobile';
import type { FormSummary } from '../../services/formsService';
import { styles } from './Home.styles';

const STATUS_LABELS: Record<FormSummary['status'], string> = {
  draft: 'Rascunho',
  submitted: 'Salvo',
};

export function FormCard({ form, onPress }: { form: FormSummary; onPress: () => void }) {
  const isSubmitted = form.status === 'submitted';

  return (
    <Card onPress={onPress} style={styles.card} testID={`home-form-card-${form.id}`}>
      <View style={styles.cardHeader}>
        <View>
          <Text>Data da consulta:</Text>
          <Text style={styles.cardDate} numberOfLines={1}>
            {form.appointmentDate || 'Sem data'}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            isSubmitted ? styles.statusBadgeSubmitted : styles.statusBadgeDraft,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              isSubmitted ? styles.statusTextSubmitted : styles.statusTextDraft,
            ]}
          >
            {STATUS_LABELS[form.status]}
          </Text>
        </View>
      </View>
      {form.overallSummary ? (
        <Text style={styles.cardSummary} numberOfLines={2}>
          {form.overallSummary}
        </Text>
      ) : null}
    </Card>
  );
}
