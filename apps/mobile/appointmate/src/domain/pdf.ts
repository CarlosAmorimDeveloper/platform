import { MOOD_OPTIONS, formatDate, type FormStatus, type FormValues } from './form';

export interface FormMeta {
  status: FormStatus;
  createdAt: Date | null;
  updatedAt: Date | null;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fieldHtml(label: string, value: string): string {
  if (!value.trim()) return '';
  return `<div class="field"><div class="label">${escapeHtml(label)}</div><div class="value">${escapeHtml(value)}</div></div>`;
}

function listHtml(label: string, items: { text: string }[]): string {
  const filled = items.filter((item) => item.text.trim());
  if (filled.length === 0) return '';
  const rows = filled.map((item) => `<li>${escapeHtml(item.text)}</li>`).join('');
  return `<div class="field"><div class="label">${escapeHtml(label)}</div><ul>${rows}</ul></div>`;
}

export function buildFormHtml(values: FormValues, meta: FormMeta): string {
  const moodLabel = MOOD_OPTIONS.find((option) => option.value === values.overallMood)?.label;
  const moodHtml = moodLabel
    ? `<div class="field"><div class="label">Como você tem estado</div><div class="value">${escapeHtml(moodLabel)}</div></div>`
    : '';
  const updatedAtLabel = formatDate(meta.updatedAt) ?? formatDate(meta.createdAt);

  const sections = [
    {
      title: 'Cabeçalho',
      body:
        fieldHtml('Data desta consulta', values.appointmentDate) +
        fieldHtml('Última consulta foi em', values.lastAppointmentDate),
    },
    {
      title: 'Panorama geral',
      body: moodHtml + fieldHtml('Em poucas palavras', values.overallSummary),
    },
    {
      title: 'No dia a dia',
      body:
        fieldHtml('Sono', values.sleep) +
        fieldHtml('Energia e disposição', values.energy) +
        fieldHtml('Apetite e alimentação', values.appetite) +
        fieldHtml('Concentração e memória', values.concentration),
    },
    {
      title: 'Medicação',
      body:
        listHtml('Medicamentos e doses', values.medications) +
        fieldHtml('Tenho conseguido tomar como combinado?', values.medicationAdherence) +
        fieldHtml('Efeitos que percebi (bons e ruins)', values.medicationEffects),
    },
    {
      title: 'O que foi bem ou melhorou',
      body: fieldHtml('O que foi bem ou melhorou', values.whatWentWell),
    },
    {
      title: 'O que tem sido difícil',
      body: fieldHtml('O que tem sido difícil', values.whatHasBeenHard),
    },
    {
      title: 'Contexto',
      body: fieldHtml('Situações importantes desde a última consulta', values.context),
    },
    { title: 'Minhas perguntas', body: listHtml('Perguntas', values.questions) },
    { title: 'Foco do dia', body: fieldHtml('O que quero desta consulta', values.todayFocus) },
    {
      title: 'Durante a consulta',
      body: fieldHtml('Anotações e orientações', values.consultationNotes),
    },
  ].filter((section) => section.body.trim().length > 0);

  const sectionsHtml = sections
    .map((section) => `<section><h2>${escapeHtml(section.title)}</h2>${section.body}</section>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<style>
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #111827; padding: 24px; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  .meta { font-size: 12px; color: #6b7280; margin-bottom: 24px; }
  h2 { font-size: 16px; margin-top: 20px; margin-bottom: 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
  .field { margin-bottom: 10px; }
  .label { font-size: 12px; font-weight: 600; color: #4b5563; }
  .value { font-size: 14px; white-space: pre-wrap; }
  ul { margin: 4px 0; padding-left: 18px; }
  li { font-size: 14px; }
</style>
</head>
<body>
  <h1>Preparação para o retorno</h1>
  <div class="meta">${updatedAtLabel ? `Última atualização em ${escapeHtml(updatedAtLabel)}` : ''}</div>
  ${sectionsHtml || '<p>Nenhuma resposta registrada.</p>'}
</body>
</html>`;
}
