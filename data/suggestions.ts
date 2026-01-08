export type SuggestionStatus = 'New' | 'Open' | 'Duplicate' | 'Planned' | 'In Progress' | 'Completed' | 'Rejected'

export interface Suggestion {
  id: string
  source: 'discord' | 'web'
  author: {
    username: string
    avatar_url: string
    isSystem?: boolean // Для системных авторов (официальные предложения)
  }
  content: {
    title: string
    description: string // Markdown text
    category: string // UI, Backend, Bug...
  }
  metrics: {
    score: number // upvotes - downvotes
    upvotes: number
    downvotes: number
  }
  lifecycle: {
    status: SuggestionStatus
    merged_into?: string // ID родителя, если статус Duplicate
  }
  created_at: string // ISO Date
  ai_summary?: string // Текст для AI блока
  type?: 'official_proposal' // Тип предложения (официальное)
  isPinned?: boolean // Флаг закрепления наверху списка
}

export const mockSuggestions: Suggestion[] = [
  {
    id: 'prop-001',
    type: 'official_proposal',
    source: 'web',
    author: {
      username: 'Ninja Product Team',
      avatar_url: '/assets/team-logo.png',
      isSystem: true,
    },
    content: {
      title: 'Community Vote: Dark Mode vs Light Mode Default',
      description: 'We are debating which theme should be default for new users. Please share your thoughts and vote below.',
      category: 'UX',
    },
    metrics: {
      score: 116,
      upvotes: 120,
      downvotes: 4,
    },
    lifecycle: {
      status: 'Open',
    },
    isPinned: true,
    created_at: '2024-01-23T10:00:00Z',
  },
  {
    id: 'sug_8821',
    source: 'discord',
    author: {
      username: 'john_doe',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    },
    content: {
      title: 'Добавить темную тему в админ-панель',
      description: 'Было бы здорово иметь возможность переключаться между светлой и темной темой в админ-панели. Это улучшит UX для тех, кто работает в темное время суток.',
      category: 'UI',
    },
    metrics: {
      score: 42,
      upvotes: 45,
      downvotes: 3,
    },
    lifecycle: {
      status: 'New',
    },
    created_at: '2024-01-20T10:30:00Z',
    ai_summary: 'Пользователь предлагает добавить темную тему в админ-панель. Предложение получило высокую поддержку сообщества (42 голоса). Это улучшение UX, которое может быть реализовано в ближайшем релизе.',
  },
  {
    id: 'sug_8822',
    source: 'discord',
    author: {
      username: 'jane_smith',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    },
    content: {
      title: 'Улучшить производительность API endpoints',
      description: 'Некоторые API endpoints работают медленно при больших объемах данных. Нужна оптимизация запросов и добавление кэширования.',
      category: 'Backend',
    },
    metrics: {
      score: 28,
      upvotes: 30,
      downvotes: 2,
    },
    lifecycle: {
      status: 'Open',
    },
    created_at: '2024-01-19T14:20:00Z',
    ai_summary: 'Предложение касается оптимизации производительности API. Это критически важная задача для масштабирования системы.',
  },
  {
    id: 'sug_8823',
    source: 'web',
    author: {
      username: 'bob_wilson',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    },
    content: {
      title: 'Исправить баг с отображением уведомлений',
      description: 'Уведомления иногда не отображаются корректно на мобильных устройствах. Проблема воспроизводится в Safari на iOS 17.',
      category: 'Bug',
    },
    metrics: {
      score: 15,
      upvotes: 18,
      downvotes: 3,
    },
    lifecycle: {
      status: 'In Progress',
    },
    created_at: '2024-01-18T09:15:00Z',
    ai_summary: 'Багрепорт о проблеме с уведомлениями на мобильных устройствах. Требует срочного исправления.',
  },
  {
    id: 'sug_8824',
    source: 'discord',
    author: {
      username: 'alice_brown',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    },
    content: {
      title: 'Добавить экспорт данных в CSV',
      description: 'Нужна возможность экспортировать отчеты и данные в CSV формат для дальнейшего анализа в Excel.',
      category: 'Feature',
    },
    metrics: {
      score: 35,
      upvotes: 38,
      downvotes: 3,
    },
    lifecycle: {
      status: 'Planned',
    },
    created_at: '2024-01-17T16:45:00Z',
    ai_summary: 'Запрос на добавление функции экспорта данных. Популярное предложение с хорошей поддержкой сообщества.',
  },
  {
    id: 'sug_8825',
    source: 'discord',
    author: {
      username: 'charlie_davis',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
    },
    content: {
      title: 'Улучшить систему поиска',
      description: 'Поиск работает не очень хорошо, особенно когда ищешь по частичному совпадению. Нужен более умный поиск с поддержкой опечаток.',
      category: 'UI',
    },
    metrics: {
      score: 52,
      upvotes: 55,
      downvotes: 3,
    },
    lifecycle: {
      status: 'Open',
    },
    created_at: '2024-01-16T11:20:00Z',
    ai_summary: 'Предложение по улучшению поиска получило очень высокую поддержку. Это важное улучшение UX.',
  },
  {
    id: 'sug_8826',
    source: 'web',
    author: {
      username: 'diana_miller',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana',
    },
    content: {
      title: 'Добавить интеграцию с Slack',
      description: 'Было бы удобно получать уведомления в Slack канал команды. Это улучшит коммуникацию и скорость реакции на проблемы.',
      category: 'Integration',
    },
    metrics: {
      score: 19,
      upvotes: 22,
      downvotes: 3,
    },
    lifecycle: {
      status: 'Completed',
    },
    created_at: '2024-01-15T08:30:00Z',
    ai_summary: 'Интеграция с Slack успешно реализована и протестирована. Функция работает стабильно.',
  },
  {
    id: 'sug_8827',
    source: 'discord',
    author: {
      username: 'eve_johnson',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve',
    },
    content: {
      title: 'Добавить темную тему в админ-панель',
      description: 'Хочу видеть темную тему в админке. Это уже было предложено ранее, но повторюсь - это очень важно!',
      category: 'UI',
    },
    metrics: {
      score: 5,
      upvotes: 8,
      downvotes: 3,
    },
    lifecycle: {
      status: 'Duplicate',
      merged_into: 'sug_8821',
    },
    created_at: '2024-01-14T15:10:00Z',
  },
  {
    id: 'sug_8828',
    source: 'web',
    author: {
      username: 'frank_lee',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank',
    },
    content: {
      title: 'Удалить старые неиспользуемые функции',
      description: 'В системе много старых функций, которые никто не использует. Нужно их удалить для упрощения интерфейса.',
      category: 'Refactoring',
    },
    metrics: {
      score: -5,
      upvotes: 3,
      downvotes: 8,
    },
    lifecycle: {
      status: 'Rejected',
    },
    created_at: '2024-01-13T12:00:00Z',
    ai_summary: 'Предложение получило негативную реакцию сообщества. Большинство пользователей против удаления функций.',
  },
  {
    id: 'sug_8829',
    source: 'discord',
    author: {
      username: 'grace_taylor',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace',
    },
    content: {
      title: 'Добавить поддержку множественных языков',
      description: 'Система должна поддерживать интернационализацию. Нужно добавить переводы на основные языки: английский, испанский, французский, немецкий.',
      category: 'Feature',
    },
    metrics: {
      score: 41,
      upvotes: 44,
      downvotes: 3,
    },
    lifecycle: {
      status: 'Planned',
    },
    created_at: '2024-01-12T10:15:00Z',
    ai_summary: 'Важное предложение по интернационализации. Высокий приоритет для глобального расширения продукта.',
  },
  {
    id: 'sug_8830',
    source: 'web',
    author: {
      username: 'henry_martinez',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=henry',
    },
    content: {
      title: 'Исправить проблему с загрузкой изображений',
      description: 'Иногда изображения не загружаются, особенно большие файлы. Нужна оптимизация процесса загрузки.',
      category: 'Bug',
    },
    metrics: {
      score: 22,
      upvotes: 25,
      downvotes: 3,
    },
    lifecycle: {
      status: 'In Progress',
    },
    created_at: '2024-01-11T14:30:00Z',
    ai_summary: 'Багрепорт о проблеме с загрузкой изображений. Работа над исправлением ведется.',
  },
  {
    id: 'sug_8831',
    source: 'discord',
    author: {
      username: 'iris_anderson',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=iris',
    },
    content: {
      title: 'Добавить систему рейтингов пользователей',
      description: 'Хорошо бы добавить систему рейтингов или бейджей для активных пользователей. Это мотивирует к участию в сообществе.',
      category: 'Feature',
    },
    metrics: {
      score: 18,
      upvotes: 21,
      downvotes: 3,
    },
    lifecycle: {
      status: 'Open',
    },
    created_at: '2024-01-10T09:45:00Z',
    ai_summary: 'Предложение по геймификации платформы. Может повысить активность пользователей.',
  },
  {
    id: 'sug_8832',
    source: 'web',
    author: {
      username: 'jack_thomas',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jack',
    },
    content: {
      title: 'Улучшить мобильную версию',
      description: 'Мобильная версия работает не очень хорошо. Нужна оптимизация для смартфонов и планшетов.',
      category: 'UI',
    },
    metrics: {
      score: 33,
      upvotes: 36,
      downvotes: 3,
    },
    lifecycle: {
      status: 'Completed',
    },
    created_at: '2024-01-09T13:20:00Z',
    ai_summary: 'Работа над улучшением мобильной версии завершена. Все основные проблемы исправлены.',
  },
  {
    id: 'sug_8833',
    source: 'discord',
    author: {
      username: 'kate_white',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kate',
    },
    content: {
      title: 'Добавить двухфакторную аутентификацию',
      description: 'Для повышения безопасности нужно добавить 2FA. Это стандарт для современных приложений.',
      category: 'Security',
    },
    metrics: {
      score: 47,
      upvotes: 50,
      downvotes: 3,
    },
    lifecycle: {
      status: 'Planned',
    },
    created_at: '2024-01-08T16:00:00Z',
    ai_summary: 'Критически важное предложение по безопасности. Высокий приоритет реализации.',
  },
  {
    id: 'sug_8834',
    source: 'web',
    author: {
      username: 'luke_harris',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luke',
    },
    content: {
      title: 'Исправить баг с кэшированием',
      description: 'Кэш иногда не обновляется после изменений. Это приводит к отображению устаревших данных.',
      category: 'Bug',
    },
    metrics: {
      score: 12,
      upvotes: 15,
      downvotes: 3,
    },
    lifecycle: {
      status: 'Rejected',
    },
    created_at: '2024-01-07T11:10:00Z',
    ai_summary: 'Проблема была признана неактуальной после обновления системы кэширования.',
  },
  {
    id: 'sug_new_demo',
    source: 'web',
    author: {
      username: 'demo_user',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    },
    content: {
      title: 'Add Dark Mode',
      description: 'Please add dark mode support to the application. This would be very helpful for users who work in low-light environments.',
      category: 'UI',
    },
    metrics: {
      score: 0,
      upvotes: 0,
      downvotes: 0,
    },
    lifecycle: {
      status: 'New',
    },
    created_at: '2024-01-21T12:00:00Z',
  },
  {
    id: 'sug_new_backend',
    source: 'discord',
    author: {
      username: 'dev_engineer',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev',
    },
    content: {
      title: 'Implement GraphQL API endpoint',
      description: 'We need a GraphQL endpoint for better data fetching flexibility. This will allow clients to request only the fields they need.',
      category: 'Backend',
    },
    metrics: {
      score: 0,
      upvotes: 0,
      downvotes: 0,
    },
    lifecycle: {
      status: 'New',
    },
    created_at: '2024-01-22T09:15:00Z',
  },
  {
    id: 'sug_new_bug',
    source: 'web',
    author: {
      username: 'qa_tester',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=qa',
    },
    content: {
      title: 'Fix memory leak in image processing',
      description: 'There is a memory leak when processing large images. The memory usage keeps growing and eventually crashes the application.',
      category: 'Bug',
    },
    metrics: {
      score: 0,
      upvotes: 0,
      downvotes: 0,
    },
    lifecycle: {
      status: 'New',
    },
    created_at: '2024-01-22T14:30:00Z',
  },
]

// Утилита для форматирования относительного времени
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInSeconds = Math.floor(diffInMs / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInWeeks = Math.floor(diffInDays / 7)
  const diffInMonths = Math.floor(diffInDays / 30)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`
  } else if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`
  } else {
    return `${Math.floor(diffInMonths / 12)}y ago`
  }
}

// Утилита для получения цвета статуса (Tailwind класс)
export function getStatusColor(status: SuggestionStatus): string {
  const colorMap: Record<SuggestionStatus, string> = {
    'New': 'bg-gray-400',
    'Open': 'bg-blue-500',
    'Duplicate': 'bg-amber-600',
    'Planned': 'bg-purple-500',
    'In Progress': 'bg-orange-500',
    'Completed': 'bg-green-500',
    'Rejected': 'bg-red-500',
  }
  return colorMap[status] || 'bg-gray-400'
}

// Утилита для получения цвета статуса для Discord (Hex)
export function getDiscordStatusColor(status: SuggestionStatus): string {
  const colorMap: Record<SuggestionStatus, string> = {
    'New': '#95a5a6',
    'Open': '#5865F2',
    'Duplicate': '#a0522d',
    'Planned': '#9b59b6',
    'In Progress': '#e67e22',
    'Completed': '#2ecc71',
    'Rejected': '#e74c3c',
  }
  return colorMap[status] || '#95a5a6'
}

