export function truncate(text = "", maxChars = 40) {
  const str = String(text || "");
  if (str.length <= maxChars) return str;
  return `${str.slice(0, Math.max(0, maxChars - 1))}…`;
}

export const limits = {
  opportunityTitle: 42,
  opportunityDesc: 140,
  task: 40,
  role: 22,
};
