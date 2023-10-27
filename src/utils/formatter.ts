export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'SEK' }).format(value)
}