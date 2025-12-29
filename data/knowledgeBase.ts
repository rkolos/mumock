export type FileStatus = 'active' | 'indexing' | 'error'
export type IndexStatus = 'synced' | 'indexing' | 'error'
export type FileType = 'pdf' | 'docx' | 'md' | 'txt'

export interface KnowledgeFile {
  id: string
  name: string
  size: number // в байтах
  uploadDate: string
  status: FileStatus
  type: FileType
}

export interface KnowledgeTicket {
  id: string
  source_ticket_id: string
  source_ticket_display: string
  created_at: string
  content: string
}

export interface KnowledgeArticle {
  id: string
  title: string
  content: string
  created_at: string
  created_by: string
  type: 'manual' | 'ticket'
  // Для тикетов
  source_ticket_id?: string
  source_ticket_display?: string
}

export const mockKnowledgeFiles: KnowledgeFile[] = [
  {
    id: 'file_001',
    name: 'Refund_Policy.pdf',
    size: 245760, // 240 KB
    uploadDate: '2025-10-20T10:30:00Z',
    status: 'active',
    type: 'pdf',
  },
  {
    id: 'file_002',
    name: 'User_Guide.md',
    size: 153600, // 150 KB
    uploadDate: '2025-10-21T14:15:00Z',
    status: 'active',
    type: 'md',
  },
  {
    id: 'file_003',
    name: 'FAQ_Document.docx',
    size: 512000, // 500 KB
    uploadDate: '2025-10-22T09:00:00Z',
    status: 'indexing',
    type: 'docx',
  },
  {
    id: 'file_004',
    name: 'Terms_of_Service.txt',
    size: 81920, // 80 KB
    uploadDate: '2025-10-23T16:45:00Z',
    status: 'active',
    type: 'txt',
  },
  {
    id: 'file_005',
    name: 'Installation_Guide.pdf',
    size: 1024000, // 1 MB
    uploadDate: '2025-10-24T11:20:00Z',
    status: 'error',
    type: 'pdf',
  },
  {
    id: 'file_006',
    name: 'API_Reference.pdf',
    size: 2048000, // 2 MB
    uploadDate: '2025-10-25T08:15:00Z',
    status: 'active',
    type: 'pdf',
  },
  {
    id: 'file_007',
    name: 'Troubleshooting_Guide.md',
    size: 307200, // 300 KB
    uploadDate: '2025-10-26T12:30:00Z',
    status: 'active',
    type: 'md',
  },
  {
    id: 'file_008',
    name: 'Security_Best_Practices.docx',
    size: 614400, // 600 KB
    uploadDate: '2025-10-27T09:45:00Z',
    status: 'indexing',
    type: 'docx',
  },
  {
    id: 'file_009',
    name: 'Configuration_Examples.txt',
    size: 122880, // 120 KB
    uploadDate: '2025-10-28T14:20:00Z',
    status: 'active',
    type: 'txt',
  },
  {
    id: 'file_010',
    name: 'Migration_Guide.pdf',
    size: 1536000, // 1.5 MB
    uploadDate: '2025-10-29T10:00:00Z',
    status: 'active',
    type: 'pdf',
  },
  {
    id: 'file_011',
    name: 'Quick_Start_Guide.md',
    size: 204800, // 200 KB
    uploadDate: '2025-10-30T11:15:00Z',
    status: 'active',
    type: 'md',
  },
  {
    id: 'file_012',
    name: 'Integration_Documentation.docx',
    size: 819200, // 800 KB
    uploadDate: '2025-11-01T13:30:00Z',
    status: 'active',
    type: 'docx',
  },
  {
    id: 'file_013',
    name: 'Error_Codes_Reference.txt',
    size: 102400, // 100 KB
    uploadDate: '2025-11-02T08:45:00Z',
    status: 'error',
    type: 'txt',
  },
  {
    id: 'file_014',
    name: 'Changelog.pdf',
    size: 409600, // 400 KB
    uploadDate: '2025-11-03T15:20:00Z',
    status: 'active',
    type: 'pdf',
  },
  {
    id: 'file_015',
    name: 'Performance_Tuning.md',
    size: 256000, // 250 KB
    uploadDate: '2025-11-04T09:10:00Z',
    status: 'active',
    type: 'md',
  },
]

export const mockKnowledgeTickets: KnowledgeTicket[] = [
  {
    id: 'rag_doc_101',
    source_ticket_id: 'ticket-8841',
    source_ticket_display: 'Login Issue #8841',
    created_at: '2025-10-24',
    content: 'Пользователь столкнулся с ошибкой 403 при входе через Google OAuth. Причиной было расхождение времени на устройстве пользователя. Решение: попросить пользователя включить автосинхронизацию времени в настройках Windows. После этого токен стал валидным.',
  },
  {
    id: 'rag_doc_102',
    source_ticket_id: 'ticket-9920',
    source_ticket_display: 'Payment Fail #9920',
    created_at: '2025-10-25',
    content: 'Ошибка списания средств Stripe "insufficient_funds". Клиенту рекомендовано пополнить карту. Важно: система не делает повторных попыток списания автоматически, клиенту нужно инициировать оплату вручную.',
  },
  {
    id: 'rag_doc_103',
    source_ticket_id: 'ticket-7543',
    source_ticket_display: 'API Rate Limit #7543',
    created_at: '2025-10-26',
    content: 'Пользователь получал ошибку 429 (Too Many Requests) при работе с API. Причина: превышение лимита запросов (1000 запросов в час). Решение: использовать экспоненциальную задержку между запросами (exponential backoff) или увеличить интервал между запросами до 4 секунд.',
  },
  {
    id: 'rag_doc_104',
    source_ticket_id: 'ticket-8129',
    source_ticket_display: 'Email Not Sending #8129',
    created_at: '2025-10-27',
    content: 'Проблема с отправкой email через SMTP. Проверка показала, что SMTP сервер требует TLS 1.2 или выше. Решение: обновить конфигурацию SMTP с указанием явного использования TLS 1.2 в настройках соединения. Также проверить, что порт 587 используется вместо 25.',
  },
  {
    id: 'rag_doc_105',
    source_ticket_id: 'ticket-5234',
    source_ticket_display: 'Password Reset #5234',
    created_at: '2025-10-28',
    content: 'Пользователь не получал письмо для сброса пароля. Проверка показала, что письма попадали в спам. Решение: настроить SPF, DKIM и DMARC записи для домена. Также добавить инструкцию пользователю проверять папку "Спам".',
  },
  {
    id: 'rag_doc_106',
    source_ticket_id: 'ticket-6789',
    source_ticket_display: 'Session Timeout #6789',
    created_at: '2025-10-29',
    content: 'Сессии пользователей истекали слишком быстро (через 15 минут). Пользователи жаловались на постоянные перелогины. Решение: увеличить время жизни сессии до 24 часов для обычных пользователей и до 7 дней для пользователей с включенным "Запомнить меня".',
  },
  {
    id: 'rag_doc_107',
    source_ticket_id: 'ticket-3456',
    source_ticket_display: 'File Upload Error #3456',
    created_at: '2025-10-30',
    content: 'Загрузка файлов размером более 10MB завершалась ошибкой. Проверка показала, что лимит на стороне сервера был 10MB, а на стороне клиента - 5MB. Решение: увеличить лимит до 50MB на сервере и обновить валидацию на клиенте. Добавить прогресс-бар для больших файлов.',
  },
  {
    id: 'rag_doc_108',
    source_ticket_id: 'ticket-7890',
    source_ticket_display: 'Database Connection #7890',
    created_at: '2025-11-01',
    content: 'Периодически возникали ошибки подключения к базе данных. Логи показывали "too many connections". Решение: увеличить пул соединений с 10 до 50, добавить retry-логику с экспоненциальной задержкой, настроить connection timeout.',
  },
  {
    id: 'rag_doc_109',
    source_ticket_id: 'ticket-4567',
    source_ticket_display: 'Mobile App Crash #4567',
    created_at: '2025-11-02',
    content: 'Мобильное приложение падало при открытии галереи изображений. Ошибка возникала при обработке изображений с разрешением более 4000x4000. Решение: добавить ресайз изображений на клиенте перед загрузкой, ограничить максимальный размер до 2000x2000 пикселей.',
  },
  {
    id: 'rag_doc_110',
    source_ticket_id: 'ticket-2345',
    source_ticket_display: 'Webhook Delivery #2345',
    created_at: '2025-11-03',
    content: 'Webhook-уведомления не доставлялись получателям. Проверка показала, что сервер получателя возвращал 502 ошибку. Решение: добавить retry механизм с интервалами 1s, 5s, 30s, 5m, 30m. Сохранять failed webhooks в очередь для ручной обработки.',
  },
  {
    id: 'rag_doc_111',
    source_ticket_id: 'ticket-5678',
    source_ticket_display: 'Cache Invalidation #5678',
    created_at: '2025-11-04',
    content: 'Пользователи видели устаревшие данные после обновления информации. Проблема была в том, что кеш не инвалидировался при изменениях. Решение: внедрить тегирование кеша и инвалидацию по тегам. Добавить TTL для критичных данных (5 минут).',
  },
  {
    id: 'rag_doc_112',
    source_ticket_id: 'ticket-8901',
    source_ticket_display: 'SSL Certificate #8901',
    created_at: '2025-11-05',
    content: 'SSL сертификат истек, что привело к недоступности сайта. Решение: настроить автоматическое обновление сертификатов через Let\'s Encrypt с проверкой за 30 дней до истечения. Добавить мониторинг и алерты.',
  },
  {
    id: 'rag_doc_113',
    source_ticket_id: 'ticket-1234',
    source_ticket_display: 'Two Factor Auth #1234',
    created_at: '2025-11-06',
    content: '2FA коды не работали из-за рассинхронизации времени на сервере. Решение: настроить NTP синхронизацию времени на всех серверах, добавить tolerance window ±2 минуты для кодов. Использовать системное время вместо локального.',
  },
  {
    id: 'rag_doc_114',
    source_ticket_id: 'ticket-9012',
    source_ticket_display: 'Export CSV Error #9012',
    created_at: '2025-11-07',
    content: 'Экспорт больших CSV файлов (более 10000 строк) приводил к таймауту запроса. Решение: реализовать асинхронную генерацию через фоновые задачи, отправлять файл на email пользователя по готовности. Добавить прогресс-бар в UI.',
  },
  {
    id: 'rag_doc_115',
    source_ticket_id: 'ticket-3457',
    source_ticket_display: 'API Authentication #3457',
    created_at: '2025-11-08',
    content: 'API ключи истекали без уведомления пользователей, что приводило к неожиданным ошибкам. Решение: добавить поле "expires_at" для ключей, отправлять email уведомления за 7, 3 и 1 день до истечения. Разрешить создание ключей без срока действия.',
  },
]

