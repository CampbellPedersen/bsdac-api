export const scrollSelectedRapIntoView = (
  selectedRef: {
    current: {
      scrollIntoView(options: { behavior: 'smooth', block: 'center' }): void
    } | null
  }
) => {
  selectedRef.current?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
};
