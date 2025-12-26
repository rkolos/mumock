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
  },
]

