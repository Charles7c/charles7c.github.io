/**
 * 格式化时间
 * @param date 待格式化时间
 * @returns 格式化后的时间(YYYY/MM/dd AM hh:mm)
 */
export function formatDate(date) {
  const formatDate = new Date(date)
  return formatDate.toLocaleString('zh', {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'})
}