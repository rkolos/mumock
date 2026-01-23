export type ConnectionStatus = 'connected' | 'not_configured' | 'coming_soon'

export interface Integration {
  id: string
  name: string
  description: string
  logo: string
  isActive: boolean
  connectionStatus: ConnectionStatus
  configUrl: string
  isComingSoon?: boolean
  // Extended settings
  settings?: IntegrationSettings
  lastConnectedAt?: string
}

export interface IntegrationSettings {
  // Discord Bot
  discord_bot_token?: string
  discord_guild_id?: string
  discord_bot_name?: string
  discord_bot_id?: string
  
  // Discord Private Bot
  discord_private_bot_token?: string
  discord_private_target_guild?: string
  discord_private_bot_name?: string
  
  // Email
  email_address?: string
  imap_server?: string
  imap_port?: number
  imap_security?: 'ssl' | 'tls' | 'none'
  imap_username?: string
  imap_password?: string
  smtp_server?: string
  smtp_port?: number
  smtp_security?: 'ssl' | 'tls' | 'none'
  smtp_username?: string
  smtp_password?: string
  
  // Widget
  widget_id?: string
  widget_api_key?: string
  widget_embed_code?: string
  
  // Telegram
  telegram_bot_token?: string
  telegram_bot_username?: string
  telegram_bot_id?: string
  telegram_chat_id?: string // Chat ID for admin notifications
  
  // Default settings
  default_welcome_message?: string
  default_mention_role?: string
  default_onboarding_message?: string
  default_bot_name?: string
  default_send_as_bot?: boolean
  default_custom_signature?: string
  default_widget_color?: string
  default_widget_title?: string
  default_welcome_command?: string
  
  // Onboarding configuration (Discord)
  onboarding_text?: string
  menu_style?: 'BUTTONS' | 'SELECT'
  
  // Channel naming (Discord Server Bot only)
  channel_naming_template?: string
  
  // Post-Submission Flow (Discord)
  ticket_first_message?: string
  
  // Discord Stats Bot
  discord_stats_company_token?: string
  discord_stats_linked_servers?: string[] // массив guild_id
}

export const mockIntegrations: Integration[] = [
  {
    id: 'discord_bot',
    name: 'Discord Bot',
    description: 'Create tickets from server channels via bot commands and reactions.',
    logo: '/assets/logos/discord.svg',
    isActive: true,
    connectionStatus: 'connected',
    configUrl: '/integrations/discord',
    lastConnectedAt: '2024-01-15T10:30:00Z',
    settings: {
      discord_bot_token: '***',
      discord_guild_id: 'guild-123',
      discord_bot_name: 'NinjaSupport',
      discord_bot_id: '123456789012345678',
      default_welcome_message: 'Hello, {username}! A support agent will be with you shortly.',
    },
  },
  {
    id: 'discord_private_bot',
    name: 'Discord Private Bot',
    description: 'Receive tickets from Direct Messages via private bot conversations.',
    logo: '/assets/logos/discord.svg',
    isActive: true,
    connectionStatus: 'connected',
    configUrl: '/integrations/discord-private',
    lastConnectedAt: '2024-01-18T10:30:00Z',
    settings: {
      discord_private_bot_token: '***',
      discord_private_target_guild: 'Support Server Name',
      discord_private_bot_name: 'NinjaSupport#1234',
      default_onboarding_message: 'Please describe your issue...',
      default_bot_name: 'NinjaSupport#1234',
      default_send_as_bot: false,
      default_custom_signature: '— Support Team',
    },
  },
  {
    id: 'email_forwarding',
    name: 'Email Forwarding',
    description: 'Convert incoming emails to support tickets automatically.',
    logo: '/assets/logos/email.svg',
    isActive: true,
    connectionStatus: 'connected',
    configUrl: '/integrations/email',
    lastConnectedAt: '2024-01-20T10:30:00Z',
    settings: {
      email_address: 'support@example.com',
      imap_server: 'imap.example.com',
      imap_port: 993,
      imap_security: 'ssl',
      imap_username: 'support@example.com',
      imap_password: '***',
      smtp_server: 'smtp.example.com',
      smtp_port: 465,
      smtp_security: 'ssl',
      smtp_username: 'support@example.com',
      smtp_password: '***',
    },
  },
  {
    id: 'website_widget',
    name: 'Website Widget',
    description: 'Embed a support form on your website.',
    logo: '/assets/logos/browser.svg',
    isActive: false,
    connectionStatus: 'not_configured',
    configUrl: '/integrations/widget',
    settings: {
      widget_id: 'widget-123',
      widget_api_key: '***',
      widget_embed_code: '<script src="https://widget.example.com/embed.js" data-widget-id="widget-123"></script>',
      default_widget_color: '#000000',
      default_widget_title: 'Свяжитесь с нами',
    },
  },
  {
    id: 'telegram_bot',
    name: 'Telegram',
    description: 'Support customers via Telegram bot.',
    logo: '/assets/logos/telegram.svg',
    isActive: false,
    connectionStatus: 'coming_soon',
    configUrl: '/integrations/telegram',
    isComingSoon: true,
    settings: {
      telegram_bot_token: '',
      telegram_bot_username: '',
      default_welcome_command: '/start',
    },
  },
  {
    id: 'discord_stats_bot',
    name: 'Discord Server Stats',
    description: 'Live counters, welcome messages, and analytics tracking.',
    logo: '/assets/logos/discord.svg',
    isActive: false,
    connectionStatus: 'not_configured',
    configUrl: '/integrations/discord-stats',
    settings: {
      discord_stats_company_token: 'ninjatickets_v8a9s8d7f6e5c4b3a2',
      discord_stats_linked_servers: ['888777666', '777666555'],
    },
  },
]

// Helper functions
export function getIntegrationById(id: string): Integration | undefined {
  return mockIntegrations.find(integration => integration.id === id)
}

export function getCategoriesBySourceType(sourceType: string) {
  // This will be imported from categories.ts in actual implementation
  // For now, return empty array
  return []
}
