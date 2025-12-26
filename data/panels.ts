export interface TicketPanel {
  id: string
  panelName: string
  title: string
  description: string
  type: string
  categories: string[]
  createdAt: string
  updatedAt: string
}

export const mockPanels: TicketPanel[] = [
  {
    id: 'panel-test2',
    panelName: 'test2',
    title: 'Test Panel 2',
    description: 'Simple description for test panel 2',
    type: 'SELECT_MENU',
    categories: ['🗑 Closed', '🐞 Bugs'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'panel-test',
    panelName: 'test',
    title: 'Test Panel',
    description: `### Main Features

This is a **long description** with multiple lines and markdown formatting.

---

- Feature 1: Support for emojis 🎉
- Feature 2: Markdown support
- Feature 3: Multi-line text

### Additional Info

More details here with **bold** and *italic* text.`,
    type: 'SELECT_MENU',
    categories: ['🗑 Closed', '🐞 Bugs', 'Support'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
]

