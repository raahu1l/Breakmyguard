// lib/sessionCodename.js

const PREFIXES = [
  'OPERATOR',
  'AGENT',
  'NODE',
  'UNIT',
  'PROCESS',
  'VECTOR',
];

function randomHex(len = 3) {
  return Math.random()
    .toString(16)
    .slice(2, 2 + len)
    .toUpperCase();
}

export function getSessionCodename() {
  if (typeof window === 'undefined') return null;

  let code = sessionStorage.getItem('sessionCodename');
  if (code) return code;

  const prefix =
    PREFIXES[Math.floor(Math.random() * PREFIXES.length)];

  code = `${prefix}-${randomHex(3)}${randomHex(2)}`;

  sessionStorage.setItem('sessionCodename', code);
  return code;
}
