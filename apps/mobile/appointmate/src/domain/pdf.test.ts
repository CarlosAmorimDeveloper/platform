import { EMPTY_FORM_VALUES } from './form';
import { buildFormHtml } from './pdf';

const emptyMeta = { status: 'draft' as const, createdAt: null, updatedAt: null };

describe('buildFormHtml', () => {
  it('includes the filled fields', () => {
    const html = buildFormHtml(
      { ...EMPTY_FORM_VALUES, appointmentDate: '15/03/2026', whatWentWell: 'Dormi melhor.' },
      emptyMeta,
    );

    expect(html).toContain('15/03/2026');
    expect(html).toContain('Dormi melhor.');
    expect(html).toContain('O que foi bem ou melhorou');
  });

  it('omits sections whose fields are all empty', () => {
    const html = buildFormHtml({ ...EMPTY_FORM_VALUES, whatWentWell: 'Preenchido.' }, emptyMeta);

    expect(html).not.toContain('<h2>Contexto</h2>');
    expect(html).not.toContain('<h2>Foco do dia</h2>');
  });

  it('shows a placeholder message when nothing was answered', () => {
    const html = buildFormHtml(EMPTY_FORM_VALUES, emptyMeta);

    expect(html).toContain('Nenhuma resposta registrada.');
  });

  it('includes the mood label when overallMood is set', () => {
    const html = buildFormHtml({ ...EMPTY_FORM_VALUES, overallMood: 'bem' }, emptyMeta);

    expect(html).toContain('Como você tem estado');
    expect(html).toContain('Bem');
  });

  it('includes non-empty medication and question list items, skipping blank ones', () => {
    const html = buildFormHtml(
      {
        ...EMPTY_FORM_VALUES,
        medications: [{ text: 'Sertralina 50mg' }, { text: '  ' }],
        questions: [{ text: 'Posso reduzir a dose?' }],
      },
      emptyMeta,
    );

    expect(html).toContain('Sertralina 50mg');
    expect(html).toContain('Posso reduzir a dose?');
    expect((html.match(/<li>/g) ?? []).length).toBe(2);
  });

  it('shows the updated-at date, falling back to created-at', () => {
    const withUpdate = buildFormHtml(EMPTY_FORM_VALUES, {
      status: 'submitted',
      createdAt: new Date('2026-01-01T10:00:00Z'),
      updatedAt: new Date('2026-03-15T10:00:00Z'),
    });
    expect(withUpdate).toContain('2026');

    const withoutUpdate = buildFormHtml(EMPTY_FORM_VALUES, {
      status: 'draft',
      createdAt: new Date('2026-01-01T10:00:00Z'),
      updatedAt: null,
    });
    expect(withoutUpdate).toContain('2026');
  });

  it('escapes HTML-sensitive characters in free-text values', () => {
    const html = buildFormHtml(
      { ...EMPTY_FORM_VALUES, whatWentWell: '<script>alert(1)</script> & "quotes"' },
      emptyMeta,
    );

    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&amp;');
  });
});
