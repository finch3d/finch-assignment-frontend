const formatter = new Intl.NumberFormat();

export function formatNumber(n) {
  return formatter.format(n);
}

export function formatArea(squareMm) {
  const squareM = squareMm / 1000000;
  return `${formatNumber(squareM)} m²`;
}
