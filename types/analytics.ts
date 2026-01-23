export type DateRangePreset = '24h' | '7d' | '30d' | '90d' | 'custom'

export interface DateRange {
  from: string // ISO date string
  to: string // ISO date string
  preset?: DateRangePreset
}

export interface StatsOverview {
  totalMembers: number
  onlineMembers: number
  peakOnline: number
  totalMessages: number
  totalVoiceMinutes: number
  memberGrowth: number // Percentage change
}

export interface HistoryPoint {
  date: string // ISO Date
  members: number
  online: number
  messages: number
  voiceMinutes: number
  channelsCreated: number
}

export type HistoryMetric = 'members' | 'activity'

export interface HeatmapPoint {
  day: number // 0 (Sun) - 6 (Sat)
  hour: number // 0 - 23
  value: number // Intensity (0-100 or raw count)
}

export type LeaderboardSortBy = 'messages' | 'channels'

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatarUrl: string
  messageCount: number
  channelsCreated: number
}
