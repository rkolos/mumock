export type SourceType = 'discord' | 'discord_private_bot' | 'web_widget' | 'telegram'

export interface IntegrationConfig {
  // Discord settings
  discord_channel_id?: string
  discord_category_id?: string
  welcome_message?: string
  
  // Web Widget settings
  widget_color?: string
  widget_title?: string
  success_text?: string
  return_url?: string
  allow_guest_submission?: boolean
  
  // Telegram settings
  telegram_chat_id?: string
  welcome_command?: string
  
  // Discord Private Bot settings
  bot_name?: string
  target_guild?: string
  onboarding_message?: string
  send_as_bot?: boolean
  custom_signature?: string
  
  // Поля категории (уникальные для каждой интеграции)
  priority?: 'low' | 'medium' | 'high'
  
  // Формы (только для Discord и Web Widget)
  formFields?: FormField[]
  
  // Button configuration (Discord Onboarding)
  button_label?: string
  button_emoji?: string
  button_style?: 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER'
  
  // First message field (Discord Private Bot)
  first_message_field_id?: string // ID поля формы для вставки первого сообщения пользователя
}

export interface Category {
  id: string
  name: string
  hasAccess: boolean
  createdAt: string
  organizationId: string
  source_type: SourceType // основной/первичный source_type
  assignedRoles: string[]
  categoryName: string
  maxTickets: number
  description?: string
  ticketNameTemplate?: string // Глобальный шаблон имени тикета для категории (независимо от источника)
  mentionRole?: string // Глобальная роль для упоминания при создании тикета (независимо от источника)
  maxOpenTicketsPerUser?: number // Глобальный лимит открытых тикетов на пользователя (независимо от источника)
  integration_config: IntegrationConfig // основная конфигурация (для обратной совместимости)
  // Множественные конфигурации интеграций
  integration_configs?: Partial<Record<SourceType, IntegrationConfig>> // конфигурации для всех интеграций
  linked_integrations?: SourceType[] // массив привязанных интеграций
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
  // Extended fields for form builder
  label?: string // Display label (preferred over name)
  placeholder?: string // Placeholder text
  type?: 'short' | 'paragraph' // Field type (short = string, paragraph = textarea)
}

export const mockCategories: Category[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: '🐞 Bugs🐞',
    hasAccess: true,
    createdAt: '2024-01-15T10:30:00Z',
    organizationId: 'org-123',
    source_type: 'discord',
    linked_integrations: ['web_widget', 'telegram'],
    assignedRoles: ['Admin'],
    categoryName: '🐞 Bugs🐞',
    maxTickets: 500,
    description: 'Категория для багов и технических проблем',
    ticketNameTemplate: 'Bug-{num}',
    mentionRole: 'Support',
    maxOpenTicketsPerUser: 100,
    integration_config: {
      discord_channel_id: 'channel-123',
      discord_category_id: 'discord-123',
      welcome_message: 'Hello, {username}! A support agent will be with you shortly.',
      priority: 'high',
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
    categoryName: '🗑 Closed',
    maxTickets: 200,
    ticketNameTemplate: 'Closed-{num}',
    maxOpenTicketsPerUser: 50,
    integration_config: {
      widget_color: '#FF0000',
      widget_title: 'Закрытые тикеты',
      success_text: 'Спасибо за обращение!',
      return_url: 'https://example.com',
      allow_guest_submission: true,
      priority: 'low',
      formFields: [],
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
    linked_integrations: ['web_widget', 'discord_private_bot'],
    assignedRoles: ['Support', 'Moderator'],
    categoryName: '❓ General Question',
    maxTickets: 300,
    ticketNameTemplate: 'Question-{num}',
    mentionRole: 'Moderator',
    maxOpenTicketsPerUser: 75,
    integration_config: {
      discord_channel_id: 'channel-456',
      discord_category_id: 'discord-456',
      welcome_message: 'Hello, {username}! A support agent will be with you shortly.',
      priority: 'medium',
      formFields: [
        {
          id: 'field-3',
          name: 'question',
          technicalId: 'question',
          required: false,
          short: false,
        },
      ],
    },
    // Legacy fields
    discordCategoryId: 'discord-456',
    discordCategory: true,
    ticketCreateMessage: 'Hello, {username}! A support agent will be with you shortly.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Discord DM Support',
    hasAccess: true,
    createdAt: '2024-01-18T10:30:00Z',
    organizationId: 'org-123',
    source_type: 'discord_private_bot',
    linked_integrations: ['web_widget'],
    assignedRoles: ['Support', 'Admin'],
    categoryName: 'Discord DM Support',
    maxTickets: 200,
    description: 'Категория для поддержки через Discord Direct Messages',
    ticketNameTemplate: 'DM-{num}',
    maxOpenTicketsPerUser: 50,
    integration_config: {
      bot_name: 'NinjaSupport#1234',
      target_guild: 'Support Server Name',
      onboarding_message: 'Hello! Select this category if you have billing issues.',
      send_as_bot: false,
      custom_signature: '— Support Team',
      priority: 'medium',
      button_label: 'Общая поддержка',
      button_emoji: '💬',
      button_style: 'PRIMARY',
      formFields: [
        {
          id: 'field-dm-1',
          name: 'description',
          technicalId: 'description',
          required: true,
          short: false,
          label: 'Опишите вашу проблему',
          placeholder: 'Подробно опишите, с чем вы столкнулись...',
          type: 'paragraph',
        },
        {
          id: 'field-dm-2',
          name: 'contact_email',
          technicalId: 'contact_email',
          required: false,
          short: true,
          label: 'Email для связи',
          placeholder: 'your.email@example.com',
          type: 'short',
        },
      ],
      first_message_field_id: 'field-dm-1',
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: '🔧 Техническая поддержка',
    hasAccess: true,
    createdAt: '2024-01-19T10:30:00Z',
    organizationId: 'org-123',
    source_type: 'discord_private_bot',
    linked_integrations: ['discord', 'telegram'],
    assignedRoles: ['Support', 'Tech'],
    categoryName: '🔧 Техническая поддержка',
    maxTickets: 150,
    description: 'Технические проблемы и ошибки',
    ticketNameTemplate: 'TECH-{num}',
    maxOpenTicketsPerUser: 30,
    integration_config: {
      bot_name: 'NinjaSupport#1234',
      target_guild: 'Support Server Name',
      onboarding_message: 'Опишите техническую проблему, с которой вы столкнулись.',
      send_as_bot: true,
      priority: 'high',
      button_label: 'Техническая поддержка',
      button_emoji: '🔧',
      button_style: 'SECONDARY',
      formFields: [
        {
          id: 'field-tech-1',
          name: 'issue_description',
          technicalId: 'issue_description',
          required: true,
          short: false,
          label: 'Описание проблемы',
          placeholder: 'Подробно опишите проблему...',
          type: 'paragraph',
        },
        {
          id: 'field-tech-2',
          name: 'steps_to_reproduce',
          technicalId: 'steps_to_reproduce',
          required: false,
          short: false,
          label: 'Шаги для воспроизведения',
          placeholder: '1. Открыть...\n2. Нажать...\n3. Ошибка появляется...',
          type: 'paragraph',
        },
        {
          id: 'field-tech-3',
          name: 'error_message',
          technicalId: 'error_message',
          required: false,
          short: true,
          label: 'Текст ошибки (если есть)',
          placeholder: 'Error: ...',
          type: 'short',
        },
      ],
      first_message_field_id: 'field-tech-1',
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: '💳 Биллинг и оплата',
    hasAccess: true,
    createdAt: '2024-01-20T10:30:00Z',
    organizationId: 'org-123',
    source_type: 'discord_private_bot',
    assignedRoles: ['Support', 'Billing'],
    categoryName: '💳 Биллинг и оплата',
    maxTickets: 100,
    description: 'Вопросы по оплате и биллингу',
    ticketNameTemplate: 'BILL-{num}',
    maxOpenTicketsPerUser: 20,
    integration_config: {
      bot_name: 'NinjaSupport#1234',
      target_guild: 'Support Server Name',
      onboarding_message: 'Поможем решить вопросы с оплатой и подпиской.',
      send_as_bot: false,
      custom_signature: '— Billing Team',
      priority: 'medium',
      button_label: 'Биллинг',
      button_emoji: '💳',
      button_style: 'SUCCESS',
      formFields: [
        {
          id: 'field-bill-1',
          name: 'billing_issue',
          technicalId: 'billing_issue',
          required: true,
          short: false,
          label: 'Опишите проблему с оплатой',
          placeholder: 'Что именно произошло с оплатой или подпиской?',
          type: 'paragraph',
        },
        {
          id: 'field-bill-2',
          name: 'order_id',
          technicalId: 'order_id',
          required: false,
          short: true,
          label: 'Номер заказа/транзакции',
          placeholder: 'ORD-12345 или транзакция #...',
          type: 'short',
        },
        {
          id: 'field-bill-3',
          name: 'billing_email',
          technicalId: 'billing_email',
          required: true,
          short: true,
          label: 'Email, связанный с аккаунтом',
          placeholder: 'billing@example.com',
          type: 'short',
        },
      ],
      first_message_field_id: 'field-bill-1',
    },
  },
]

