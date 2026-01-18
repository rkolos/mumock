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
  source?: 'discord' | 'discord_dm' | 'telegram' | 'whatsapp' | 'web' | 'email' | 'api'
  waitTimeHours?: number
  // Notification fields
  unread_messages_count?: number
  has_private_mention?: boolean
  // Smart Views fields
  mentions?: string[] // Email пользователей, упомянутых в тикете
  lastMessageAuthorId?: 'user' | 'admin' | 'system' // Автор последнего сообщения
  // Custom fields from widget
  custom_fields?: Array<{
    label: string
    value: string
    type: 'text' | 'email' | 'link'
    copyable?: boolean
    displayText?: string
  }>
  // User Dossier fields
  dossier_content?: string
  dossier_attachments?: Array<{
    name: string
    url: string
    type: 'image' | 'pdf' | 'other'
  }>
  // Discord Profile fields
  discordProfile?: {
    username: string
    discriminator: string
    avatarUrl?: string
    bannerColor?: string
    bannerUrl?: string
    status: 'online' | 'offline'
    badges?: Array<{ name: string; icon: string; color: string }>
    discordId: string
    registeredAt: string
    joinedAt: string
  }
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
    unread_messages_count: 3,
    has_private_mention: true,
    mentions: ['v.panov@dt.team'],
    lastMessageAuthorId: 'user',
    // Сценарий А: Заполненное досье
    dossier_content: `# Основная информация

- **VIP Клиент** (Tier 3)
- Предпочитает общение в Telegram

> ⚠ Внимание: Требует проверку IP при каждом выводе средств.

![Документ](https://placehold.co/600x400/E0E0E0/9E9E9E?text=Passport+Scan)

[Скачать договор.pdf](contract.pdf)`,
    dossier_attachments: [
      {
        name: 'contract.pdf',
        url: 'contract.pdf',
        type: 'pdf',
      },
      {
        name: 'passport_scan.jpg',
        url: 'https://placehold.co/600x400/E0E0E0/9E9E9E?text=Passport+Scan',
        type: 'image',
      },
    ],
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
    unread_messages_count: 1,
    lastMessageAuthorId: 'admin',
    // Сценарий Б: Пустое досье (для режима редактирования)
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
    has_private_mention: true,
    mentions: ['v.panov@dt.team'],
    lastMessageAuthorId: 'user',
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
    lastMessageAuthorId: 'admin',
  },
  {
    id: 'ticket-dm-001',
    username: 'nagibator2000',
    channel: 'Direct Message',
    category: 'General',
    assignedUsers: [],
    tags: ['question'],
    priority: 'medium',
    status: 'open',
    createdAt: '2024-01-18T10:00:00Z',
    aiTitle: "Can't login to my account",
    source: 'discord_dm',
    waitTimeHours: 0.17,
    unread_messages_count: 1,
    lastMessageAuthorId: 'user',
    discordProfile: {
      username: 'ninja_fan',
      discriminator: '1337',
      avatarUrl: '/assets/avatar_mock.png',
      bannerColor: '#7289da',
      status: 'online',
      badges: [
        { name: 'Staff', icon: 'shield_blue', color: '#5865F2' },
        { name: 'Bug Hunter', icon: 'bug_green', color: '#43B581' },
      ],
      discordId: '84738274837482',
      registeredAt: '10 Nov 2019',
      joinedAt: '15 Aug 2023',
    },
  },
]

