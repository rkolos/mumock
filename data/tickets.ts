export interface Ticket {
  id: string
  username: string
  channel: string
  category: string
  assignedUsers: string[]
  tags: string[]
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  createdAt: string
  // Dynamic fields based on category
  transactionId?: string
  environment?: string
  errorLogs?: string
  // AI and source fields
  aiTitle?: string
  source?: 'discord' | 'telegram' | 'whatsapp' | 'web'
  waitTimeHours?: number
  // Custom fields from widget
  custom_fields?: Array<{
    label: string
    value: string
    type: 'text' | 'email' | 'link'
    copyable?: boolean
    displayText?: string
  }>
}

export const mockTickets: Ticket[] = [
  {
    id: '1',
    username: 'john_doe',
    channel: '#support-general',
    category: 'Financial',
    assignedUsers: ['admin@example.com'],
    tags: ['payment', 'urgent'],
    priority: 'high',
    status: 'in-progress',
    createdAt: '2024-01-15T10:30:00Z',
    transactionId: 'TXN-12345',
    aiTitle: 'Ошибка при оплате через Stripe',
    source: 'discord',
    waitTimeHours: 2.25,
  },
  {
    id: '2',
    username: 'jane_smith',
    channel: '#support-technical',
    category: 'Technical',
    assignedUsers: ['tech@example.com'],
    tags: ['bug', 'frontend'],
    priority: 'medium',
    status: 'open',
    createdAt: '2024-01-16T14:20:00Z',
    environment: 'production',
    errorLogs: 'Error: Cannot read property of undefined',
    aiTitle: 'Login failed',
    source: 'web',
    waitTimeHours: 0.5,
    custom_fields: [
      {
        label: 'User Email',
        value: 'player123@gmail.com',
        type: 'email',
      },
      {
        label: 'Game ID',
        value: '8841-2294-11',
        type: 'text',
        copyable: true,
      },
      {
        label: 'Origin Page',
        value: 'https://myserver.com/shop/gold-coins',
        type: 'link',
      },
      {
        label: 'Admin Profile',
        value: 'https://admin.game.com/users/8841',
        type: 'link',
        displayText: 'Open Profile',
      },
    ],
  },
  {
    id: '3',
    username: 'bob_wilson',
    channel: '#support-general',
    category: 'General',
    assignedUsers: [],
    tags: ['question'],
    priority: 'low',
    status: 'open',
    createdAt: '2024-01-17T09:15:00Z',
    aiTitle: 'Не выдалась роль после буста',
    source: 'discord',
    waitTimeHours: 5.0,
  },
  {
    id: '4',
    username: 'alice_brown',
    channel: '#support-technical',
    category: 'Technical',
    assignedUsers: ['tech@example.com'],
    tags: ['api', 'critical'],
    priority: 'critical',
    status: 'in-progress',
    createdAt: '2024-01-17T16:45:00Z',
    environment: 'staging',
    errorLogs: 'API timeout after 30s',
    aiTitle: 'API timeout после 30 секунд',
    source: 'web',
    waitTimeHours: 1.2,
  },
]

