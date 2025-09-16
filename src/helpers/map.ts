export function map(
  n: number,
  fromStart: number,
  fromEnd: number,
  toStart: number,
  toEnd: number
) {
  return (
    toStart + ((n - fromStart) / (fromEnd - fromStart)) * (toEnd - toStart)
  );
}
