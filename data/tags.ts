export interface TicketTag {
  id: string
  name: string
  color: string
  createdAt: string
  updatedAt: string
}

export const mockTags: TicketTag[] = [
  {
    id: 'tag-test',
    name: 'test',
    color: '#000000',
    createdAt: '2025-12-23T21:20:18Z',
    updatedAt: '2025-12-23T21:20:18Z',
  },
]

