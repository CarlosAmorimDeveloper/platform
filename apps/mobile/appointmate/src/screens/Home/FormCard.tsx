import { Text, View } from 'react-native';
import { Card } from '@ds/mobile';
import type { FormSummary } from '../../services/formsService';
import { styles } from './Home.styles';

const STATUS_LABELS: Record<FormSummary['status'], string> = {
  draft: 'Rascunho',
  submitted: 'Enviado',
};

export function FormCard({ form, onPress }: { form: FormSummary; onPress: () => void }) {
  return (
    <Card onPress={onPress} style={styles.card} testID={`home-form-card-${form.id}`}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardDate}>{form.appointmentDate || 'Sem data'}</Text>
        <Text style={styles.cardStatus}>{STATUS_LABELS[form.status]}</Text>
      </View>
      {form.overallSummary ? (
        <Text style={styles.cardSummary} numberOfLines={2}>
          {form.overallSummary}
        </Text>
      ) : null}
    </Card>
  );
}
