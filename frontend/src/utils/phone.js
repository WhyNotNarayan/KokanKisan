export function normalizePhone(raw) {
  let digits = String(raw || '').replace(/\D/g, '');
  if (digits.length > 10) {
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
    else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
    else if (digits.length > 10) digits = digits.slice(0, 10);
  }
  return digits;
}

export function isValidPhone(phone) {
  return /^\d{10}$/.test(phone);
}
