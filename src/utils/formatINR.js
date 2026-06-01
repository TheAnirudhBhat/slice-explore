// Indian-grouping ₹ formatter (e.g. 100000 → "1,00,000"). Accepts a number or
// string and preserves a trailing decimal part (keypad input like "1234.5").
// Was duplicated verbatim across payments/Valentino, Activity list, and TxnDetail.

export default function formatINR(amount) {
  if (amount == null || amount === '') return '0';
  const [intPart, decPart] = String(amount).split('.');
  const lastThree = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  const grouped = rest
    ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
    : lastThree;
  return decPart !== undefined ? `${grouped}.${decPart}` : grouped;
}
