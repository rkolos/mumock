export type CounterType = 'MEMBERS' | 'ONLINE' | 'ROLE_COUNT' | 'GOAL'
export type GuildStatus = 'active' | 'kicked'

export interface Counter {
  id: string
  type: CounterType
  channel_id: string
  channel_name?: string
  template: string
  settings?: {
    role_id?: string  // для ROLE_COUNT
    role_name?: string
    target?: number   // для GOAL
  }
}

export interface GuildPlanLimits {
  max_counters: number
  analytics_enabled: boolean
  update_freq: number  // в минутах
  module_welcome?: boolean
  module_analytics?: boolean
  module_leaderboard?: boolean
}

export interface GuildConfig {
  guild_id: string
  name: string
  icon?: string
  plan_limits: GuildPlanLimits
  active_counters: Counter[]
  status: GuildStatus
  welcome_config?: {
    enabled: boolean
    channel_id?: string
    channel_name?: string
    message?: string
    embed?: {
      title?: string
      description?: string
      image_url?: string
    }
  }
  goodbye_config?: {
    enabled: boolean
    channel_id?: string
    channel_name?: string
    message?: string
    embed?: {
      title?: string
      description?: string
      image_url?: string
    }
  }
}

// Mock данные для разработки
export const mockGuilds: GuildConfig[] = [
  {
    guild_id: '888777666',
    name: 'Super Community',
    icon: 'https://cdn.discordapp.com/icons/888777666/abc123.png',
    plan_limits: {
      max_counters: 5,
      analytics_enabled: true,
      update_freq: 6,
      module_welcome: true,
      module_analytics: true,
      module_leaderboard: true,
    },
    active_counters: [
      {
        id: 'c1',
        type: 'MEMBERS',
        channel_id: '999000111',
        channel_name: 'members',
        template: '👥 Members: {count}',
      },
      {
        id: 'c2',
        type: 'GOAL',
        channel_id: '999000222',
        channel_name: 'goal',
        template: '🎯 Goal: {count}/{target}',
        settings: {
          target: 5000,
        },
      },
      {
        id: 'c3',
        type: 'ONLINE',
        channel_id: '999000333',
        channel_name: 'online',
        template: '🔴 Online: {count}',
      },
    ],
    status: 'active',
    welcome_config: {
      enabled: true,
      channel_id: '999000444',
      channel_name: 'welcome',
      message: 'Добро пожаловать, {user}!',
      embed: {
        title: 'Добро пожаловать на {server}!',
        description: 'Теперь у нас {member_count} участников',
      },
    },
  },
  {
    guild_id: '777666555',
    name: 'My Gaming Community',
    icon: 'https://cdn.discordapp.com/icons/777666555/def456.png',
    plan_limits: {
      max_counters: 10,
      analytics_enabled: false,
      update_freq: 10,
      module_welcome: true,
      module_analytics: false,
      module_leaderboard: false,
    },
    active_counters: [
      {
        id: 'c4',
        type: 'ROLE_COUNT',
        channel_id: '888111222',
        channel_name: 'vip-members',
        template: '⭐ VIP: {count}',
        settings: {
          role_id: 'role123',
          role_name: 'VIP',
        },
      },
    ],
    status: 'active',
  },
  {
    guild_id: '666555444',
    name: 'Test Server',
    plan_limits: {
      max_counters: 3,
      analytics_enabled: true,
      update_freq: 15,
      module_welcome: false,
      module_analytics: true,
      module_leaderboard: true,
    },
    active_counters: [],
    status: 'kicked',
  },
  {
    guild_id: '555444333',
    name: 'New Gaming Hub',
    icon: 'https://cdn.discordapp.com/icons/555444333/xyz789.png',
    plan_limits: {
      max_counters: 8,
      analytics_enabled: true,
      update_freq: 5,
      module_welcome: true,
      module_analytics: true,
      module_leaderboard: true,
    },
    active_counters: [],
    status: 'active',
  },
]

// Helper функции
export function getGuildById(guildId: string): GuildConfig | undefined {
  return mockGuilds.find((guild) => guild.guild_id === guildId)
}

export function getCounterTypeLabel(type: CounterType): string {
  switch (type) {
    case 'MEMBERS':
      return 'Total Members'
    case 'ONLINE':
      return 'Online Members'
    case 'ROLE_COUNT':
      return 'Role Count'
    case 'GOAL':
      return 'Goal'
    default:
      return type
  }
}

export function getCounterTypeIcon(type: CounterType): string {
  switch (type) {
    case 'MEMBERS':
      return '👥'
    case 'ONLINE':
      return '🔴'
    case 'ROLE_COUNT':
      return '⭐'
    case 'GOAL':
      return '🎯'
    default:
      return '📊'
  }
}
