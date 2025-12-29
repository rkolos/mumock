'use client'

import { useState, useRef } from 'react'
import {
  FileText,
  GraduationCap,
  Loader2,
  FolderOpen,
  Brain,
  Search,
  Trash2,
  Upload,
  ChevronDown,
  File,
  X,
  Plus,
  FileEdit,
  Ticket,
  Sparkles,
  FileQuestion,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react'
import Link from 'next/link'
import {
  mockKnowledgeFiles,
  mockKnowledgeTickets,
  KnowledgeFile,
  KnowledgeTicket,
  KnowledgeArticle,
  IndexStatus,
  FileStatus,
  FileType,
} from '../../data/knowledgeBase'

type TabType = 'files' | 'tickets' | 'simulator'

interface Snippet {
  source_type: 'file' | 'ticket'
  source_name: string
  source_id: string
  content: string
  score: number
}

interface QueryResult {
  answer: string
  snippets: Snippet[]
}

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState<TabType>('files')
  const [files, setFiles] = useState<KnowledgeFile[]>(mockKnowledgeFiles)
  
  // Преобразуем тикеты в единый формат статей
  const ticketArticles: KnowledgeArticle[] = mockKnowledgeTickets.map((ticket) => ({
    id: ticket.id,
    title: ticket.source_ticket_display,
    content: ticket.content,
    created_at: ticket.created_at,
    created_by: 'System',
    type: 'ticket' as const,
    source_ticket_id: ticket.source_ticket_id,
    source_ticket_display: ticket.source_ticket_display,
  }))
  
  // Примеры статей, созданных вручную через интерфейс
  const manualArticles: KnowledgeArticle[] = [
    {
      id: 'manual_001',
      title: 'How to configure SMTP settings',
      content: 'Для настройки SMTP необходимо выполнить следующие шаги:\n\n1. Перейдите в настройки системы\n2. Найдите раздел "Email Configuration"\n3. Введите данные SMTP сервера:\n   - Host: smtp.example.com\n   - Port: 587\n   - Username: your-email@example.com\n   - Password: your-password\n   - Enable TLS: Yes\n\n4. Сохраните настройки и протестируйте отправку тестового письма.\n\nВажно: Убедитесь, что порт 587 не заблокирован файрволом.',
      created_at: '2025-11-10T09:15:00Z',
      created_by: 'Admin',
      type: 'manual',
    },
    {
      id: 'manual_002',
      title: 'API Rate Limits and Best Practices',
      content: 'Наша система API имеет следующие лимиты:\n\n- Free tier: 100 запросов в час\n- Pro tier: 1000 запросов в час\n- Enterprise: безлимит\n\nРекомендации по работе с API:\n1. Используйте экспоненциальную задержку при получении ошибки 429\n2. Кэшируйте результаты запросов, когда это возможно\n3. Используйте webhooks вместо polling для получения обновлений\n4. Реализуйте retry логику с максимальным количеством попыток\n\nПример кода для обработки rate limit:\n```\nif (response.status === 429) {\n  const retryAfter = response.headers["Retry-After"] || 60;\n  await sleep(retryAfter * 1000);\n  return retryRequest();\n}\n```',
      created_at: '2025-11-11T14:30:00Z',
      created_by: 'Support Team',
      type: 'manual',
    },
    {
      id: 'manual_003',
      title: 'Two-Factor Authentication Setup Guide',
      content: 'Настройка двухфакторной аутентификации (2FA):\n\n1. Войдите в свой аккаунт\n2. Перейдите в "Security Settings"\n3. Нажмите "Enable 2FA"\n4. Отсканируйте QR-код приложением-аутентификатором (Google Authenticator, Authy)\n5. Введите код подтверждения из приложения\n6. Сохраните резервные коды в безопасном месте\n\nРекомендуемые приложения:\n- Google Authenticator\n- Microsoft Authenticator\n- Authy\n\nЕсли вы потеряли доступ к устройству с 2FA, используйте резервные коды или обратитесь в поддержку.',
      created_at: '2025-11-12T10:45:00Z',
      created_by: 'Admin',
      type: 'manual',
    },
    {
      id: 'manual_004',
      title: 'Database Backup and Recovery Procedures',
      content: 'Процедуры резервного копирования и восстановления базы данных:\n\nАвтоматические бэкапы:\n- Полные бэкапы: ежедневно в 02:00 UTC\n- Инкрементальные бэкапы: каждые 6 часов\n- Хранение: 30 дней для полных, 7 дней для инкрементальных\n\nРучное восстановление:\n1. Определите нужную точку восстановления\n2. Остановите приложение\n3. Восстановите базу данных из бэкапа\n4. Проверьте целостность данных\n5. Запустите приложение\n\nКоманда для восстановления:\n```\npg_restore -d database_name backup_file.dump\n```\n\nВажно: Всегда тестируйте восстановление на тестовой среде перед применением в продакшене.',
      created_at: '2025-11-13T16:20:00Z',
      created_by: 'DevOps Team',
      type: 'manual',
    },
    {
      id: 'manual_005',
      title: 'Webhook Configuration and Testing',
      content: 'Настройка webhook для получения уведомлений:\n\n1. Создайте endpoint на вашем сервере для приема webhook\n2. В настройках API создайте новый webhook:\n   - URL: https://your-domain.com/webhook\n   - Events: выберите события для подписки\n   - Secret: сгенерируйте секретный ключ\n\n3. Проверьте подпись запроса:\n```\nconst signature = crypto\n  .createHmac("sha256", secret)\n  .update(JSON.stringify(payload))\n  .digest("hex");\n```\n\n4. Всегда возвращайте 200 OK в течение 5 секунд\n5. Реализуйте идемпотентность для обработки дубликатов\n\nТестирование:\n- Используйте ngrok для локальной разработки\n- Проверяйте логи на наличие ошибок\n- Мониторьте время ответа',
      created_at: '2025-11-14T11:10:00Z',
      created_by: 'Developer',
      type: 'manual',
    },
  ]
  
  // Перемешиваем статьи так, чтобы несколько manual статей были на первой странице
  // Берем первые 3 manual статьи, затем все тикеты, затем остальные manual статьи
  const firstManualArticles = manualArticles.slice(0, 3)
  const remainingManualArticles = manualArticles.slice(3)
  const initialArticles: KnowledgeArticle[] = [
    ...firstManualArticles,
    ...ticketArticles,
    ...remainingManualArticles,
  ]
  
  const [articles, setArticles] = useState<KnowledgeArticle[]>(initialArticles)
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(new Set())
  const [newArticleTitle, setNewArticleTitle] = useState('')
  const [newArticleContent, setNewArticleContent] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [currentFilesPage, setCurrentFilesPage] = useState(1)
  const itemsPerPage = 10
  
  // Query Console state for simulator
  const [query, setQuery] = useState('')
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [expandedSnippets, setExpandedSnippets] = useState<Set<number>>(new Set([0])) // Первый элемент развернут по умолчанию
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  // Статистика
  const documentsCount = files.length
  const learnedCasesCount = articles.length
  const activeFilesCount = files.filter((f) => f.status === 'active').length
  const indexingFilesCount = files.filter((f) => f.status === 'indexing').length

  // Определение статуса индексации
  const getIndexStatus = (): { status: IndexStatus; label: string; icon: JSX.Element } => {
    if (indexingFilesCount > 0) {
      return {
        status: 'indexing',
        label: `Indexing... (${indexingFilesCount} items pending)`,
        icon: <span className="text-xl">🟡</span>,
      }
    }
    if (files.some((f) => f.status === 'error')) {
      return {
        status: 'error',
        label: 'Error (Check Logs)',
        icon: <span className="text-xl">🔴</span>,
      }
    }
    return {
      status: 'synced',
      label: 'Synced (Все данные векторизованы)',
      icon: <span className="text-xl">🟢</span>,
    }
  }

  const indexStatusInfo = getIndexStatus()

  // Форматирование размера файла
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Форматирование даты
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Получение иконки типа файла
  const getFileIcon = (type: FileType) => {
    return <File className="h-4 w-4" />
  }

  // Получение цвета статуса файла
  const getFileStatusBadge = (status: FileStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        )
      case 'indexing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
            Indexing
          </span>
        )
      case 'error':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
            Error
          </span>
        )
    }
  }

  // Удаление файла
  const handleDeleteFile = (fileId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот файл из базы знаний?')) {
      setFiles((prev) => {
        const newFiles = prev.filter((f) => f.id !== fileId)
        // Если текущая страница стала пустой, переходим на предыдущую
        const newTotalPages = Math.ceil(newFiles.length / itemsPerPage)
        if (currentFilesPage > newTotalPages && newTotalPages > 0) {
          setCurrentFilesPage(newTotalPages)
        }
        return newFiles
      })
    }
  }

  // Обработка загрузки файлов
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    handleFiles(selectedFiles as File[])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFiles = (selectedFiles: File[]) => {
    selectedFiles.forEach((file) => {
      const fileName = file.name
      const extension = fileName.split('.').pop()?.toLowerCase() || ''
      let fileType: FileType = 'txt'
      if (extension === 'pdf') fileType = 'pdf'
      else if (extension === 'docx') fileType = 'docx'
      else if (extension === 'md') fileType = 'md'
      else if (extension === 'txt') fileType = 'txt'

      const newFile: KnowledgeFile = {
        id: `file_${Date.now()}_${Math.random()}`,
        name: fileName,
        size: file.size,
        uploadDate: new Date().toISOString(),
        status: 'indexing',
        type: fileType,
      }
      setFiles((prev) => {
        const newFiles = [...prev, newFile]
        // Переходим на последнюю страницу, чтобы увидеть новый файл
        const newTotalPages = Math.ceil(newFiles.length / itemsPerPage)
        if (newTotalPages > currentFilesPage) {
          setCurrentFilesPage(newTotalPages)
        }
        return newFiles
      })
      
      // Симуляция завершения индексации через 3 секунды
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) => (f.id === newFile.id ? { ...f, status: 'active' } : f))
        )
      }, 3000)
    })
  }

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  // Форматирование относительной даты
  const formatRelativeDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      // Если дата только дата (без времени), добавляем время
      if (!dateString.includes('T') && !dateString.includes(' ')) {
        date.setHours(0, 0, 0, 0)
      }
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins} min ago`
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
      if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    } catch {
      return dateString
    }
  }


  // Получение сниппета текста
  const getSnippet = (text: string, maxLength: number = 120): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  // Переключение развертывания статьи
  const toggleArticleExpanded = (articleId: string) => {
    setExpandedArticles((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(articleId)) {
        newSet.delete(articleId)
      } else {
        newSet.add(articleId)
      }
      return newSet
    })
  }

  // Удаление статьи
  const handleDeleteArticle = (articleId: string) => {
    if (confirm('Вы уверены, что хотите удалить эту запись из базы знаний?')) {
      setArticles((prev) => {
        const newArticles = prev.filter((a) => a.id !== articleId)
        // Если текущая страница стала пустой, переходим на предыдущую
        const newTotalPages = Math.ceil(newArticles.length / itemsPerPage)
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages)
        }
        return newArticles
      })
      setExpandedArticles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(articleId)
        return newSet
      })
    }
  }

  // Создание новой статьи
  const handleCreateArticle = () => {
    if (!newArticleTitle.trim()) {
      alert('Пожалуйста, введите заголовок статьи')
      return
    }
    if (!newArticleContent.trim()) {
      alert('Пожалуйста, введите содержимое статьи')
      return
    }

    const newArticle: KnowledgeArticle = {
      id: `article_${Date.now()}_${Math.random()}`,
      title: newArticleTitle,
      content: newArticleContent,
      created_at: new Date().toISOString(),
      created_by: 'You',
      type: 'manual',
    }

    // Добавляем в начало списка (Optimistic UI)
    setArticles((prev) => [newArticle, ...prev])
    
    // Сбрасываем на первую страницу, чтобы увидеть новую статью
    setCurrentPage(1)
    
    // Очищаем форму, но не закрываем её
    setNewArticleTitle('')
    setNewArticleContent('')
    
    // Показываем уведомление
    alert('Article added')
  }

  // Отмена создания статьи
  const handleCancelCreate = () => {
    setNewArticleTitle('')
    setNewArticleContent('')
  }

  // Пагинация статей
  const totalPages = Math.ceil(articles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedArticles = articles.slice(startIndex, endIndex)

  // Пагинация файлов
  const totalFilesPages = Math.ceil(files.length / itemsPerPage)
  const filesStartIndex = (currentFilesPage - 1) * itemsPerPage
  const filesEndIndex = filesStartIndex + itemsPerPage
  const paginatedFiles = files.slice(filesStartIndex, filesEndIndex)

  // Генерация ответа в Query Console
  const handleGenerateAnswer = async () => {
    if (!query.trim()) return

    // Скрываем предыдущий результат
    setQueryResult(null)
    setIsGenerating(true)
    setExpandedSnippets(new Set([0])) // Сбрасываем состояние аккордеона, первый элемент развернут

    // Симуляция запроса к RAG-системе
    setTimeout(() => {
      const result: QueryResult = {
        answer: `Это пример ответа RAG-системы на вопрос: "${query}". В реальной системе здесь будет ответ, сгенерированный на основе загруженных данных и знаний из тикетов. Ответ может содержать несколько абзацев и подробную информацию из базы знаний.\n\nВ данном случае система использует информацию из загруженных документов и ранее решенных тикетов для формирования наиболее точного ответа.`,
        snippets: [
          {
            source_type: 'file',
            source_name: 'Refund_Policy.pdf',
            source_id: 'file_refund_policy_001',
            content: 'Согласно политике возврата средств, клиенты могут запросить возврат в течение 30 дней с момента покупки. Для оформления возврата необходимо заполнить форму на сайте или связаться с поддержкой. Обработка возврата занимает от 5 до 10 рабочих дней.',
            score: 0.87123456,
          },
          {
            source_type: 'ticket',
            source_name: 'Ticket #8841: Вопрос о возврате средств',
            source_id: '8841',
            content: 'Клиент обратился с вопросом о возврате средств за подписку. Было выяснено, что возврат возможен в течение 30 дней. Клиент получил инструкции по заполнению формы возврата.',
            score: 0.57176661,
          },
          {
            source_type: 'file',
            source_name: 'Terms_of_Service.pdf',
            source_id: 'file_terms_002',
            content: 'Условия возврата средств описаны в разделе 4.2 настоящего соглашения. Возврат производится на тот же способ оплаты, который использовался при покупке.',
            score: 0.42345678,
          },
        ],
      }
      setQueryResult(result)
      setIsGenerating(false)
    }, 1500)
  }

  // Переключение раскрытия сниппета
  const toggleSnippetExpanded = (index: number) => {
    setExpandedSnippets((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const tabs: { id: TabType; label: string; icon: JSX.Element }[] = [
    { id: 'files', label: 'Files Library', icon: <FolderOpen className="h-4 w-4" /> },
    { id: 'tickets', label: 'Solved Tickets', icon: <Brain className="h-4 w-4" /> },
    { id: 'simulator', label: 'AI Simulator', icon: <Search className="h-4 w-4" /> },
  ]

  return (
    <div className="p-6 bg-[#F5F7FB] min-h-screen">
      <div className="max-w-[1200px] mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-base font-bold text-gray-900">AI Knowledge Base</h1>
          <p className="text-sm text-gray-500 mt-1">Управление источниками данных RAG-системы</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Documents Card */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Documents</p>
                <p className="text-xl font-bold text-gray-900">{documentsCount} Files</p>
              </div>
            </div>
          </div>

          {/* Learned Cases Card */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Learned Cases</p>
                <p className="text-xl font-bold text-gray-900">{learnedCasesCount} Articles</p>
              </div>
            </div>
          </div>

          {/* Index Status Card */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9">
                {indexStatusInfo.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">Index Status</p>
                <p className="text-sm font-medium text-gray-900">{indexStatusInfo.label}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm mb-6">
          <div className="px-6 border-b border-[#e2e8f0]">
            <div className="flex items-end gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-gray-900 border-black'
                      : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Files Library Tab */}
            {activeTab === 'files' && (
              <div className="space-y-6">
                {/* Upload Zone */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.docx,.md,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Drag & drop PDF, DOCX, MD, TXT files here to train the AI
                    </p>
                    <p className="text-xs text-gray-500">или нажмите для выбора файлов</p>
                  </label>
                </div>

                {/* Files Table */}
                {files.length > 0 ? (
                  <>
                    <div className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-[#e2e8f0]">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                File Name
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Size
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-[#e2e8f0]">
                            {paginatedFiles.map((file) => (
                              <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    {getFileIcon(file.type)}
                                    <span className="font-medium text-gray-900">{file.name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {formatDate(file.uploadDate)}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {formatFileSize(file.size)}
                                </td>
                                <td className="px-4 py-3 text-sm">{getFileStatusBadge(file.status)}</td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleDeleteFile(file.id)}
                                      className="text-red-600 hover:text-red-700 transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        // Здесь можно добавить логику скачивания файла
                                        const link = document.createElement('a')
                                        link.href = `#` // В реальном приложении здесь будет URL файла
                                        link.download = file.name
                                        link.click()
                                      }}
                                      className="text-gray-600 hover:text-gray-900 transition-colors"
                                      title="Download"
                                    >
                                      <Download className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    {totalFilesPages > 1 && (
                      <div className="flex items-center justify-between px-4 py-3 border-t border-[#e2e8f0] bg-gray-50 mt-4 rounded-b-lg">
                    <div className="text-sm text-gray-600">
                      {filesStartIndex + 1}-{Math.min(filesEndIndex, files.length)} of {files.length}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentFilesPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentFilesPage === 1}
                        className="p-2 border border-[#e2e8f0] rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Previous page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalFilesPages }, (_, i) => i + 1).map((page) => {
                          if (
                            page === 1 ||
                            page === totalFilesPages ||
                            (page >= currentFilesPage - 1 && page <= currentFilesPage + 1)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentFilesPage(page)}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                  currentFilesPage === page
                                    ? 'bg-black text-white'
                                    : 'text-gray-700 hover:bg-gray-100 border border-[#e2e8f0]'
                                }`}
                              >
                                {page}
                              </button>
                            )
                          } else if (page === currentFilesPage - 2 || page === currentFilesPage + 2) {
                            return (
                              <span key={page} className="px-2 text-gray-500">
                                ...
                              </span>
                            )
                          }
                          return null
                        })}
                      </div>
                      <button
                        onClick={() => setCurrentFilesPage((prev) => Math.min(totalFilesPages, prev + 1))}
                        disabled={currentFilesPage === totalFilesPages}
                        className="p-2 border border-[#e2e8f0] rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Next page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-lg border border-[#e2e8f0] p-12 text-center">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Нет загруженных файлов
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Добавьте свой первый файл в базу знаний, используя форму загрузки выше
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Knowledge Articles Tab */}
            {activeTab === 'tickets' && (
              <div className="space-y-4">
                {/* Inline Create Form - Always Visible */}
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newArticleTitle}
                      onChange={(e) => setNewArticleTitle(e.target.value)}
                      placeholder="e.g. How to configure SMTP settings"
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={newArticleContent}
                      onChange={(e) => setNewArticleContent(e.target.value)}
                      placeholder="Enter the solution text here..."
                      rows={6}
                      className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={handleCancelCreate}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateArticle}
                      className="px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors"
                    >
                      Save to Knowledge Base
                    </button>
                  </div>
                </div>

                {/* Articles List */}
                {articles.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      {paginatedArticles.map((article) => {
                        const isExpanded = expandedArticles.has(article.id)

                        return (
                          <div
                            key={article.id}
                            className="bg-white border border-[#e2e8f0] rounded-lg overflow-hidden"
                          >
                            {/* Header */}
                            <div className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                              <button
                                onClick={() => toggleArticleExpanded(article.id)}
                                className="flex items-center gap-3 flex-1 min-w-0 text-left"
                              >
                                {/* Icon */}
                                <div className="flex-shrink-0">
                                  {article.type === 'manual' ? (
                                    <FileEdit className="h-5 w-5 text-gray-600" />
                                  ) : (
                                    <Ticket className="h-5 w-5 text-blue-600" />
                                  )}
                                </div>
                                {/* Title and Metadata */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    {article.type === 'ticket' && article.source_ticket_id ? (
                                      <Link
                                        href={`/tickets/${article.source_ticket_id.replace('ticket-', '')}`}
                                        target="_blank"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                      >
                                        #{article.source_ticket_id.replace('ticket-', '')}: {article.title.replace(/#\d+/, '').trim()}
                                      </Link>
                                    ) : (
                                      <span className="font-medium text-sm text-gray-900">
                                        {article.title}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500">
                                      {article.type === 'manual'
                                        ? `Manual Entry • Added by ${article.created_by}`
                                        : `Ticket Source • ${formatRelativeDate(article.created_at)}`}
                                    </span>
                                  </div>
                                </div>
                                <ChevronDown
                                  className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ${
                                    isExpanded ? 'transform rotate-180' : ''
                                  }`}
                                />
                              </button>
                              {/* Action Button */}
                              <div className="flex items-center gap-2 ml-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteArticle(article.id)
                                  }}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Delete Article"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                              <div className="px-4 py-4 border-t border-[#e2e8f0] bg-gray-50">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Knowledge Content
                                  </label>
                                  <div className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg bg-white font-mono text-sm whitespace-pre-wrap">
                                    {article.content}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between px-4 py-3 border-t border-[#e2e8f0] bg-gray-50 rounded-b-lg">
                        <div className="text-sm text-gray-600">
                          {startIndex + 1}-{Math.min(endIndex, articles.length)} of {articles.length}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2 border border-[#e2e8f0] rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Previous page"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                              if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                              ) {
                                return (
                                  <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                      currentPage === page
                                        ? 'bg-black text-white'
                                        : 'text-gray-700 hover:bg-gray-100 border border-[#e2e8f0]'
                                    }`}
                                  >
                                    {page}
                                  </button>
                                )
                              } else if (page === currentPage - 2 || page === currentPage + 2) {
                                return (
                                  <span key={page} className="px-2 text-gray-500">
                                    ...
                                  </span>
                                )
                              }
                              return null
                            })}
                          </div>
                          <button
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-[#e2e8f0] rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Next page"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-lg border border-[#e2e8f0] p-12 text-center">
                    <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Нет статей в базе знаний
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Добавьте свою первую статью в базу знаний, используя форму выше
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* AI Simulator Tab - Query Console */}
            {activeTab === 'simulator' && (
              <div className="flex flex-col items-center py-8">
                {/* Input Zone */}
                <div className="w-full max-w-[800px]">
                  <div className="text-sm text-gray-500 mb-2">Test Query</div>
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., How do I reset my 2FA?"
                    rows={3}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault()
                        handleGenerateAnswer()
                      }
                    }}
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleGenerateAnswer}
                      disabled={!query.trim() || isGenerating}
                      className="flex items-center gap-2 px-6 py-2 bg-black text-white hover:bg-gray-900 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate Answer
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Result Zone */}
                {isGenerating && (
                  <div className="w-full max-w-[800px] mt-12">
                    <div className="bg-white border border-[#e2e8f0] rounded-lg p-6">
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}

                {queryResult && !isGenerating && (
                  <div className="w-full max-w-[800px] mt-12">
                    <div className="bg-white border border-[#e2e8f0] rounded-lg overflow-hidden">
                      {/* Блок А: Ответ ИИ */}
                      <div className="bg-white px-6 py-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          AI Generated Response
                        </div>
                        <div className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                          {queryResult.answer}
                        </div>
                      </div>

                      {/* Разделитель */}
                      <div className="border-t border-[#e2e8f0]"></div>

                      {/* Блок Б: Использованный контекст */}
                      <div className="bg-gray-50 px-6 py-4">
                        <div className="text-xs font-semibold text-gray-700 mb-4">
                          Retrieved Context ({queryResult.snippets.length})
                        </div>
                        
                        {/* Список сниппетов (Accordion) */}
                        <div className="space-y-2">
                          {queryResult.snippets.map((snippet, index) => {
                            const isExpanded = expandedSnippets.has(index)
                            
                            return (
                              <div
                                key={index}
                                className="bg-white border border-[#e2e8f0] rounded-lg overflow-hidden"
                              >
                                {/* Заголовок элемента списка */}
                                <button
                                  onClick={() => toggleSnippetExpanded(index)}
                                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {/* Иконка типа источника */}
                                    <div className="flex-shrink-0">
                                      {snippet.source_type === 'file' ? (
                                        <FileText className="h-4 w-4 text-gray-600" />
                                      ) : (
                                        <Ticket className="h-4 w-4 text-blue-600" />
                                      )}
                                    </div>
                                    
                                    {/* Название источника */}
                                    <span className="font-medium text-sm text-gray-900 truncate">
                                      {snippet.source_name}
                                    </span>
                                  </div>
                                  
                                  {/* Показатель релевантности */}
                                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                    <span className="text-xs text-gray-500">Score:</span>
                                    <span className="text-xs text-gray-700 font-mono">
                                      {snippet.score}
                                    </span>
                                    <ChevronDown
                                      className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ${
                                        isExpanded ? 'transform rotate-180' : ''
                                      }`}
                                    />
                                  </div>
                                </button>

                                {/* Тело элемента списка (Expanded) */}
                                {isExpanded && (
                                  <div className="px-4 py-3 border-t border-[#e2e8f0] bg-gray-50">
                                    {/* Текст сниппета (стилизован как цитата) */}
                                    <div className="border-l-4 border-blue-500 pl-4 py-2 mb-3">
                                      <div className="text-sm text-gray-700 font-mono whitespace-pre-wrap leading-relaxed">
                                        {snippet.content}
                                      </div>
                                    </div>
                                    
                                    {/* Кнопка перехода */}
                                    <Link
                                      href={
                                        snippet.source_type === 'file'
                                          ? `#file-${snippet.source_id}`
                                          : `/tickets/${snippet.source_id}`
                                      }
                                      target="_blank"
                                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:underline"
                                    >
                                      Open Source
                                    </Link>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!queryResult && !isGenerating && (
                  <div className="w-full max-w-[800px] mt-12 text-center py-12">
                    <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <div className="text-gray-500 mt-4">
                      Enter a question above to test the RAG accuracy.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
