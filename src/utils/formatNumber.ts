export function formatNumber(number: number | string) {
  // Convert to string to check for decimal point
  const numStr = number.toString();

  // If number contains decimal point, format to 2 decimals
  if (numStr.includes(".")) {
    return Number(number).toFixed(2);
  }

  // Return original number if no decimal point
  return numStr;
}
