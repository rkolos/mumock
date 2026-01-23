import { StatsOverview, HistoryPoint, HeatmapPoint, LeaderboardEntry, DateRange, HistoryMetric, LeaderboardSortBy } from '../types/analytics'

// Mock данные для KPI Overview
export function getStatsOverview(guildId: string, period: DateRange): StatsOverview {
  // Генерируем реалистичные данные на основе периода
  const days = period.preset === '24h' ? 1 : period.preset === '7d' ? 7 : period.preset === '30d' ? 30 : 90
  
  const baseMembers = 5000 + Math.floor(Math.random() * 2000)
  const growth = (Math.random() * 10 - 2) // -2% to +8%
  
  return {
    totalMembers: baseMembers,
    onlineMembers: Math.floor(baseMembers * (0.1 + Math.random() * 0.1)),
    peakOnline: Math.floor(baseMembers * (0.15 + Math.random() * 0.1)),
    totalMessages: Math.floor(days * (1000 + Math.random() * 500)),
    totalVoiceMinutes: Math.floor(days * (5000 + Math.random() * 2000)),
    memberGrowth: parseFloat(growth.toFixed(1)),
  }
}

// Mock данные для истории (график роста)
export function getHistoryData(guildId: string, metric: HistoryMetric, period: DateRange): HistoryPoint[] {
  const days = period.preset === '24h' ? 1 : period.preset === '7d' ? 7 : period.preset === '30d' ? 30 : 90
  const points: HistoryPoint[] = []
  const baseMembers = 5000
  const baseOnline = 500
  
  const fromDate = new Date(period.from)
  
  // Базовое количество каналов (накапливается со временем)
  let totalChannels = 50 + Math.floor(Math.random() * 20) // Начальное количество каналов
  
  for (let i = 0; i < days; i++) {
    const date = new Date(fromDate)
    date.setDate(date.getDate() + i)
    
    // Симулируем небольшой рост/падение
    const variation = 1 + (Math.random() * 0.1 - 0.05)
    const members = Math.floor(baseMembers * variation)
    const online = Math.floor(baseOnline * variation)
    
    // Генерируем количество созданных каналов за день
    // В будние дни больше активности, в выходные меньше
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    
    let channelsCreated = 0
    if (isWeekend) {
      // Выходные: 0-2 канала
      channelsCreated = Math.random() < 0.3 ? Math.floor(Math.random() * 3) : 0
    } else {
      // Будние дни: 0-5 каналов, с большей вероятностью 1-3
      const rand = Math.random()
      if (rand < 0.4) {
        channelsCreated = 0 // 40% вероятность что каналы не создавались
      } else if (rand < 0.7) {
        channelsCreated = 1 // 30% вероятность 1 канал
      } else if (rand < 0.9) {
        channelsCreated = 2 // 20% вероятность 2 канала
      } else if (rand < 0.97) {
        channelsCreated = 3 // 7% вероятность 3 канала
      } else {
        channelsCreated = 4 + Math.floor(Math.random() * 2) // 3% вероятность 4-5 каналов
      }
    }
    
    // Иногда добавляем всплески активности (редко, но заметно)
    if (Math.random() < 0.05) { // 5% вероятность всплеска
      channelsCreated += Math.floor(2 + Math.random() * 3) // Дополнительно 2-4 канала
    }
    
    totalChannels += channelsCreated
    
    points.push({
      date: date.toISOString().split('T')[0],
      members,
      online,
      messages: Math.floor(800 + Math.random() * 400),
      voiceMinutes: Math.floor(4000 + Math.random() * 2000),
      channelsCreated,
    })
  }
  
  return points
}

// Mock данные для тепловой карты
export function getHeatmapData(guildId: string, period: DateRange): HeatmapPoint[] {
  const points: HeatmapPoint[] = []
  
  // Генерируем данные для каждого часа каждого дня недели
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      // Симулируем активность: пик в будние дни 14-18, низкая активность ночью
      let baseValue = 20
      
      if (day >= 1 && day <= 5) { // Пн-Пт
        if (hour >= 14 && hour <= 18) {
          baseValue = 80 + Math.random() * 20 // Пик активности
        } else if (hour >= 10 && hour <= 22) {
          baseValue = 40 + Math.random() * 30
        } else {
          baseValue = 10 + Math.random() * 20
        }
      } else { // Выходные
        if (hour >= 12 && hour <= 20) {
          baseValue = 50 + Math.random() * 30
        } else {
          baseValue = 15 + Math.random() * 25
        }
      }
      
      points.push({
        day,
        hour,
        value: Math.floor(baseValue),
      })
    }
  }
  
  return points
}

// Mock данные для лидерборда
export function getLeaderboardData(
  guildId: string,
  sortBy: LeaderboardSortBy,
  period: DateRange
): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = []
  const usernames = [
    'AlexTheGreat', 'MysticWarrior', 'TechGuru', 'CodeMaster', 'DesignPro',
    'DataWizard', 'CloudNinja', 'DevOpsKing', 'FrontendHero', 'BackendBoss',
    'FullStackDev', 'MobileExpert', 'AIGenius', 'BlockchainPro', 'SecurityGuard',
    'TestMaster', 'DeployGuru', 'ServerAdmin', 'NetworkPro', 'DatabaseGuru',
  ]
  
  for (let i = 0; i < 20; i++) {
    const baseMessages = sortBy === 'messages' 
      ? 1000 - i * 40 + Math.random() * 30
      : 500 + Math.random() * 300
    const baseChannels = sortBy === 'channels'
      ? 50 - i * 2 + Math.random() * 3
      : 20 + Math.random() * 15
    
    entries.push({
      rank: i + 1,
      userId: `user_${i + 1}`,
      username: usernames[i] || `User${i + 1}`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${usernames[i]}`,
      messageCount: Math.floor(baseMessages),
      channelsCreated: Math.floor(baseChannels),
    })
  }
  
  // Сортируем по выбранному критерию
  entries.sort((a, b) => {
    if (sortBy === 'messages') {
      return b.messageCount - a.messageCount
    } else {
      return b.channelsCreated - a.channelsCreated
    }
  })
  
  // Обновляем ранги после сортировки
  entries.forEach((entry, index) => {
    entry.rank = index + 1
  })
  
  return entries
}
