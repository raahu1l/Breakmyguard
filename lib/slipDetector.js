// lib/slipDetector.js
export function detectSlip(reply) {
  return reply ? 'possible-slip' : null;
}
