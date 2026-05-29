import { ALL_STATUSES, STATUS_COLORS, STATUS_LABELS } from './ticketStatus';

describe('ticketStatus', () => {
  beforeEach(() => jest.clearAllMocks());

  it('ALL_STATUSES contains exactly open, in_progress and done', () => {
    expect(ALL_STATUSES).toEqual(['open', 'in_progress', 'done']);
  });

  it('STATUS_LABELS has a label for every status', () => {
    ALL_STATUSES.forEach((status) => {
      expect(STATUS_LABELS[status]).toBeTruthy();
    });
  });

  it('STATUS_COLORS has a color for every status', () => {
    ALL_STATUSES.forEach((status) => {
      expect(STATUS_COLORS[status]).toBeTruthy();
    });
  });

  it('STATUS_LABELS values are non-empty strings', () => {
    Object.values(STATUS_LABELS).forEach((label) => {
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it('STATUS_COLORS values are non-empty strings', () => {
    Object.values(STATUS_COLORS).forEach((color) => {
      expect(typeof color).toBe('string');
      expect(color.length).toBeGreaterThan(0);
    });
  });
});
