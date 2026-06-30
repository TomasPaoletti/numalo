export function mapQuinielaToRaffleNumber(
  quinielaNumber: number,
  totalNumbers: number
): number {
  if (totalNumbers <= 100) {
    const lastTwo = quinielaNumber % 100;
    return lastTwo === 0 ? totalNumbers : lastTwo;
  }

  if (totalNumbers <= 1000) {
    const lastThree = quinielaNumber % 1000;
    return lastThree === 0 ? totalNumbers : lastThree;
  }

  return Math.min(quinielaNumber, totalNumbers);
}
