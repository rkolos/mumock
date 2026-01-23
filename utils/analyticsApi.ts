import { DateRange, DateRangePreset } from '../types/analytics'

// Форматирование времени в голосе (секунды -> "12h 30m")
export function formatVoiceTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h`
  } else if (minutes > 0) {
    return `${minutes}m`
  } else {
    return '0m'
  }
}

// Получение preset для периода
export function getDateRangePreset(preset: DateRangePreset): DateRange {
  const now = new Date()
  const to = new Date(now)
  const from = new Date(now)
  
  switch (preset) {
    case '24h':
      from.setHours(from.getHours() - 24)
      break
    case '7d':
      from.setDate(from.getDate() - 7)
      break
    case '30d':
      from.setDate(from.getDate() - 30)
      break
    case '90d':
      from.setDate(from.getDate() - 90)
      break
    case 'custom':
      // Для custom нужно установить from/to вручную
      return { from: '', to: '', preset: 'custom' }
  }
  
  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
    preset,
  }
}

// Форматирование даты для отображения
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

// Форматирование даты и времени
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', { 
    day: 'numeric', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Получение названия дня недели
export function getDayName(dayIndex: number): string {
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  return days[dayIndex]
}

// Получение названия месяца
export function getMonthName(monthIndex: number): string {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]
  return months[monthIndex]
}
