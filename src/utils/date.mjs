export function formatDate(date, format) {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  format = format || 'MM/DD/YYYY'
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const year = d.getFullYear()
  return format
    .replaceAll('YYYY', year)
    .replaceAll('MM', month)
    .replaceAll('DD', day)
}
