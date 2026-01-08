export interface SuggestionCategory {
  id: string
  label: string
  color: string
}

export interface NotificationTemplates {
  ticket_created: string
  ticket_approved: string
  ticket_rejected: string
}

export interface SuggestionsConfig {
  categories: SuggestionCategory[]
  notifications: NotificationTemplates
}

// Тип для забаненного пользователя
export interface BannedUser {
  id: string // User ID
  username: string
  avatar_url: string
  banned_at: string // ISO Date
}

// Дефолтные категории на основе существующих suggestions
export const defaultCategories: SuggestionCategory[] = [
  { id: 'cat_1', label: 'UI', color: '#3b82f6' },
  { id: 'cat_2', label: 'Backend', color: '#ef4444' },
  { id: 'cat_3', label: 'Bug', color: '#f59e0b' },
  { id: 'cat_4', label: 'Feature', color: '#10b981' },
  { id: 'cat_5', label: 'Integration', color: '#8b5cf6' },
  { id: 'cat_6', label: 'Security', color: '#f97316' },
  { id: 'cat_7', label: 'Refactoring', color: '#6366f1' },
]

// Дефолтные шаблоны уведомлений
export const defaultNotificationTemplates: NotificationTemplates = {
  ticket_created: 'Привет, {{user}}! Твоя идея №{{id}} принята в работу.',
  ticket_approved: 'Отличные новости! Идея {{title}} одобрена.',
  ticket_rejected: 'К сожалению, мы не будем это реализовывать.',
}

// Мок-конфигурация по умолчанию
export const defaultSuggestionsConfig: SuggestionsConfig = {
  categories: defaultCategories,
  notifications: defaultNotificationTemplates,
}

// Мок-данные для забаненных пользователей
export const mockBannedUsers: BannedUser[] = [
  {
    id: 'user_123',
    username: 'spam_bot_99',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=spam',
    banned_at: '2024-01-10T14:30:00Z',
  },
  {
    id: 'user_456',
    username: 'troll_master',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=troll',
    banned_at: '2024-01-15T09:20:00Z',
  },
]

