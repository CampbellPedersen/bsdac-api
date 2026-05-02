import { scrollSelectedRapIntoView } from './selected-rap-scroll';

describe('selected-rap-scroll', () => {
  test('given selected rap element > should scroll it into view centered', () => {
    const scrollIntoView = jest.fn();

    scrollSelectedRapIntoView({
      current: { scrollIntoView },
    });

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
    });
  });

  test('given no selected rap element > should do nothing', () => {
    expect(() => scrollSelectedRapIntoView({ current: null })).not.toThrow();
  });
});
