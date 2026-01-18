export interface DiscordDMMessage {
  id: string
  author: 'user' | 'bot' | 'admin'
  authorName: string
  authorAvatar?: string
  content: string
  timestamp: string
  type: 'text' | 'system' | 'ticket_created' | 'ticket_closed'
  status?: 'sending' | 'sent' | 'delivered' | 'failed'
  errorCode?: string
}

export interface DiscordDMFlow {
  ticket1: {
    creation: DiscordDMMessage[]
    conversation: DiscordDMMessage[]
    closing: DiscordDMMessage[]
  }
  ticket2: {
    creation: DiscordDMMessage[]
  }
}

export const discordDMFlow: DiscordDMFlow = {
  ticket1: {
    creation: [
      {
        id: 'msg-1',
        author: 'user',
        authorName: 'nagibator2000',
        authorAvatar: undefined,
        content: "Hi, I can't login to my account",
        timestamp: '2024-01-18T10:00:00Z',
        type: 'text',
        status: 'delivered',
      },
      {
        id: 'msg-2',
        author: 'bot',
        authorName: 'NinjaSupport',
        authorAvatar: undefined,
        content: 'Ticket #DM-001 created',
        timestamp: '2024-01-18T10:00:01Z',
        type: 'ticket_created',
      },
      {
        id: 'msg-3',
        author: 'bot',
        authorName: 'NinjaSupport',
        authorAvatar: undefined,
        content: 'Hello! A support agent will be with you shortly.',
        timestamp: '2024-01-18T10:00:02Z',
        type: 'text',
        status: 'delivered',
      },
    ],
    conversation: [
      {
        id: 'msg-4',
        author: 'admin',
        authorName: 'Support Agent',
        authorAvatar: undefined,
        content: "Hi! Can you provide your username?",
        timestamp: '2024-01-18T10:05:00Z',
        type: 'text',
        status: 'delivered',
      },
      {
        id: 'msg-5',
        author: 'user',
        authorName: 'nagibator2000',
        authorAvatar: undefined,
        content: "Sure, it's @nagibator2000",
        timestamp: '2024-01-18T10:05:30Z',
        type: 'text',
        status: 'delivered',
      },
      {
        id: 'msg-6',
        author: 'admin',
        authorName: 'Support Agent',
        authorAvatar: undefined,
        content: "Thanks! I've reset your password. Check your email.",
        timestamp: '2024-01-18T10:06:00Z',
        type: 'text',
        status: 'delivered',
      },
      {
        id: 'msg-7',
        author: 'user',
        authorName: 'nagibator2000',
        authorAvatar: undefined,
        content: 'Great, it works now! Thank you!',
        timestamp: '2024-01-18T10:07:00Z',
        type: 'text',
        status: 'delivered',
      },
    ],
    closing: [
      {
        id: 'msg-8',
        author: 'bot',
        authorName: 'NinjaSupport',
        authorAvatar: undefined,
        content: 'Ticket #DM-001 has been resolved and closed.',
        timestamp: '2024-01-18T10:08:00Z',
        type: 'ticket_closed',
      },
    ],
  },
  ticket2: {
    creation: [
      {
        id: 'msg-9',
        author: 'user',
        authorName: 'nagibator2000',
        authorAvatar: undefined,
        content: 'I have a question about billing',
        timestamp: '2024-01-18T10:10:00Z',
        type: 'text',
        status: 'delivered',
      },
      {
        id: 'msg-10',
        author: 'bot',
        authorName: 'NinjaSupport',
        authorAvatar: undefined,
        content: 'Ticket #DM-002 created',
        timestamp: '2024-01-18T10:10:01Z',
        type: 'ticket_created',
      },
      {
        id: 'msg-11',
        author: 'bot',
        authorName: 'NinjaSupport',
        authorAvatar: undefined,
        content: 'Hello! A support agent will be with you shortly.',
        timestamp: '2024-01-18T10:10:02Z',
        type: 'text',
        status: 'delivered',
      },
    ],
  },
}
