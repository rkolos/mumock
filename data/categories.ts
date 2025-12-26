export interface Category {
  id: string
  name: string
  hasAccess: boolean
  createdAt: string
  organizationId: string
  discordCategoryId?: string
  assignedRoles: string[]
  discordCategory: boolean
  formFields: FormField[]
  categoryName: string
  ticketNameTemplate: string
  maxOpenTicketsPerUser: number
  maxTickets: number
  ticketCreateMessage: string
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
    discordCategoryId: 'discord-123',
    assignedRoles: ['Admin'],
    discordCategory: true,
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
    ticketCreateMessage: 'Hello, {username}! A support agent will be with you shortly.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: '🗑 Closed',
    hasAccess: false,
    createdAt: '2024-01-16T10:30:00Z',
    organizationId: 'org-123',
    assignedRoles: [],
    discordCategory: false,
    formFields: [],
    categoryName: '🗑 Closed',
    ticketNameTemplate: 'Closed-{num}',
    maxOpenTicketsPerUser: 50,
    maxTickets: 200,
    ticketCreateMessage: 'Hello, {username}! A support agent will be with you shortly.',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: '❓ General Question',
    hasAccess: true,
    createdAt: '2024-01-17T10:30:00Z',
    organizationId: 'org-123',
    discordCategoryId: 'discord-456',
    assignedRoles: ['Support', 'Moderator'],
    discordCategory: true,
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
    ticketCreateMessage: 'Hello, {username}! A support agent will be with you shortly.',
  },
]

