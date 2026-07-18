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

module.exports = { generateId, calculateCommission, calculateFarmerPayout };
