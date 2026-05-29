import { ALL_PRIORITIES, PRIORITY_COLORS, PRIORITY_LABELS } from './ticketPriority';

describe('ticketPriority', () => {
  beforeEach(() => jest.clearAllMocks());

  it('ALL_PRIORITIES contains all 5 priority levels in order', () => {
    expect(ALL_PRIORITIES).toEqual(['very_low', 'low', 'medium', 'high', 'very_high']);
  });

  it('PRIORITY_LABELS has a label for every priority', () => {
    ALL_PRIORITIES.forEach((priority) => {
      expect(PRIORITY_LABELS[priority]).toBeTruthy();
    });
  });

  it('PRIORITY_COLORS has a color for every priority', () => {
    ALL_PRIORITIES.forEach((priority) => {
      expect(PRIORITY_COLORS[priority]).toBeTruthy();
    });
  });

  it('PRIORITY_LABELS values are non-empty strings', () => {
    Object.values(PRIORITY_LABELS).forEach((label) => {
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it('PRIORITY_COLORS values are non-empty strings', () => {
    Object.values(PRIORITY_COLORS).forEach((color) => {
      expect(typeof color).toBe('string');
      expect(color.length).toBeGreaterThan(0);
    });
  });
});
