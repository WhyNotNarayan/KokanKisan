const { v4: uuidv4 } = require('uuid');

function generateId() {
  return uuidv4();
}

function calculateCommission(amount, rate = 0.07) {
  return Math.round(amount * rate);
}

function calculateFarmerPayout(amount, commission) {
  return amount - commission;
}

function normalizePhone(raw) {
  let digits = String(raw || '').replace(/\D/g, '');
  if (digits.length > 10) {
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
    else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  }
  return digits;
}

function isValidPhone(phone) {
  return /^\d{10}$/.test(phone);
}

module.exports = {
  generateId,
  calculateCommission,
  calculateFarmerPayout,
  normalizePhone,
  isValidPhone,
};
