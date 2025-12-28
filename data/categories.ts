export type SourceType = 'discord' | 'web_widget' | 'telegram'

export interface IntegrationConfig {
  // Discord settings
  discord_guild_id?: string
  discord_channel_id?: string
  discord_category_id?: string
  welcome_message?: string
  mention_role?: string
  
  // Web Widget settings
  widget_color?: string
  widget_title?: string
  success_text?: string
  return_url?: string
  allow_guest_submission?: boolean
  
  // Telegram settings
  telegram_chat_id?: string
  welcome_command?: string
}

export interface Category {
  id: string
  name: string
  hasAccess: boolean
  createdAt: string
  organizationId: string
  source_type: SourceType
  assignedRoles: string[]
  formFields: FormField[]
  categoryName: string
  ticketNameTemplate: string
  maxOpenTicketsPerUser: number
  maxTickets: number
  priority?: 'low' | 'medium' | 'high'
  description?: string
  integration_config: IntegrationConfig
  // Legacy fields for backward compatibility
  discordCategoryId?: string
  discordCategory?: boolean
  ticketCreateMessage?: string
}

export interface FormField {
  id: string
  name: string
  technicalId: string
  required: boolean
  short: boolean
}

export const mockCategories: Category[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: '🐞 Bugs🐞',
    hasAccess: true,
    createdAt: '2024-01-15T10:30:00Z',
    organizationId: 'org-123',
    source_type: 'discord',
    assignedRoles: ['Admin'],
    formFields: [
      {
        id: 'field-1',
        name: 'name',
        technicalId: 'name',
        required: true,
        short: true,
      },
      {
        id: 'field-2',
        name: 'emails',
        technicalId: 'emails',
        required: true,
        short: false,
      },
    ],
    categoryName: '🐞 Bugs🐞',
    ticketNameTemplate: 'Bug-{num}',
    maxOpenTicketsPerUser: 100,
    maxTickets: 500,
    priority: 'high',
    description: 'Категория для багов и технических проблем',
    integration_config: {
      discord_guild_id: 'guild-123',
      discord_channel_id: 'channel-123',
      discord_category_id: 'discord-123',
      welcome_message: 'Hello, {username}! A support agent will be with you shortly.',
      mention_role: 'Support',
    },
    // Legacy fields
    discordCategoryId: 'discord-123',
    discordCategory: true,
    ticketCreateMessage: 'Hello, {username}! A support agent will be with you shortly.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: '🗑 Closed',
    hasAccess: false,
    createdAt: '2024-01-16T10:30:00Z',
    organizationId: 'org-123',
    source_type: 'web_widget',
    assignedRoles: [],
    formFields: [],
    categoryName: '🗑 Closed',
    ticketNameTemplate: 'Closed-{num}',
    maxOpenTicketsPerUser: 50,
    maxTickets: 200,
    priority: 'low',
    integration_config: {
      widget_color: '#FF0000',
      widget_title: 'Закрытые тикеты',
      success_text: 'Спасибо за обращение!',
      return_url: 'https://example.com',
      allow_guest_submission: true,
    },
    // Legacy fields
    discordCategory: false,
    ticketCreateMessage: 'Hello, {username}! A support agent will be with you shortly.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: '❓ General Question',
    hasAccess: true,
    createdAt: '2024-01-17T10:30:00Z',
    organizationId: 'org-123',
    source_type: 'discord',
    assignedRoles: ['Support', 'Moderator'],
    formFields: [
      {
        id: 'field-3',
        name: 'question',
        technicalId: 'question',
        required: false,
        short: false,
      },
    ],
    categoryName: '❓ General Question',
    ticketNameTemplate: 'Question-{num}',
    maxOpenTicketsPerUser: 75,
    maxTickets: 300,
    priority: 'medium',
    integration_config: {
      discord_guild_id: 'guild-456',
      discord_channel_id: 'channel-456',
      discord_category_id: 'discord-456',
      welcome_message: 'Hello, {username}! A support agent will be with you shortly.',
      mention_role: 'Moderator',
    },
    // Legacy fields
    discordCategoryId: 'discord-456',
    discordCategory: true,
    ticketCreateMessage: 'Hello, {username}! A support agent will be with you shortly.',
  },
]

