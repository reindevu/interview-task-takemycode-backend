export const fractionalOrder = (
  prev: number | null,
  next: number | null
): number => {
  if (prev === null && next === null) return 1;
  if (prev === null) return next! / 2;
  if (next === null) return prev + 1;
  return (prev + next) / 2;
};
