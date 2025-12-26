export interface TicketStatus {
  id: string
  name: string
  color: string
  createdAt: string
  updatedAt: string
}

export const mockStatuses: TicketStatus[] = [
  {
    id: 'status-open',
    name: 'Open',
    color: '#10b981',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'status-in-progress',
    name: 'In Progress',
    color: '#3b82f6',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: 'status-resolved',
    name: 'Resolved',
    color: '#8b5cf6',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
  {
    id: 'status-closed',
    name: 'Closed',
    color: '#6b7280',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-17T16:45:00Z',
  },
]

