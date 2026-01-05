export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(value) || 0);

export const formatHours = (value = 0, suffix = "hrs") => `${Number(value || 0).toFixed(1)} ${suffix}`;

export const formatDate = (input) => {
  if (!input) return new Date().toLocaleDateString("en-AU");
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return String(input);
  return d.toLocaleDateString("en-AU");
};
