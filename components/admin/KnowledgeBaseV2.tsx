'use client'

import { useState } from 'react'
import {
  mockKnowledgeFiles,
  mockKnowledgeTickets,
  mockKnowledgeFolders,
  KnowledgeFile,
  KnowledgeTicket,
  KnowledgeArticle,
  KBFolder,
  FileType,
} from '../../data/knowledgeBase'
import { getArticlesInFolder, getFolderArticleCount, getSubfolders, getDirectSubfoldersCount, getDirectArticlesCount } from '../../utils/kbFolders'
import SourceSidebar, { SourceType } from './knowledge-base/SourceSidebar'
import AllContentView from './knowledge-base/AllContentView'
import FilesLibraryView from './knowledge-base/FilesLibraryView'
import TicketsView from './knowledge-base/TicketsView'
import ArticlesView from './knowledge-base/ArticlesView'
import ArticleEditor from './knowledge-base/ArticleEditor'
import AISimulatorView from './knowledge-base/AISimulatorView'
import FolderDialog from './knowledge-base/FolderDialog'
import DeleteFolderDialog from './knowledge-base/DeleteFolderDialog'

export default function KnowledgeBaseV2() {
  const [activeSource, setActiveSource] = useState<SourceType>('all')
  const [showSimulator, setShowSimulator] = useState(false)
  const [files, setFiles] = useState<KnowledgeFile[]>(mockKnowledgeFiles)
  const [tickets, setTickets] = useState<KnowledgeTicket[]>(mockKnowledgeTickets)
  const [folders, setFolders] = useState<KBFolder[]>(mockKnowledgeFolders)
  
  // Примеры статей, созданных вручную через интерфейс (без title, только body)
  const initialArticles: KnowledgeArticle[] = [
    {
      id: 'manual_001',
      body: '# How to configure SMTP settings\n\nДля настройки SMTP необходимо выполнить следующие шаги:\n\n1. Перейдите в настройки системы\n2. Найдите раздел "Email Configuration"\n3. Введите данные SMTP сервера:\n   - Host: smtp.example.com\n   - Port: 587\n   - Username: your-email@example.com\n   - Password: your-password\n   - Enable TLS: Yes\n\n4. Сохраните настройки и протестируйте отправку тестового письма.\n\nВажно: Убедитесь, что порт 587 не заблокирован файрволом.',
      created_at: '2025-11-10T09:15:00Z',
      created_by: 'Admin',
      type: 'manual',
      folder_id: 'folder_001', // General
    },
    {
      id: 'manual_002',
      body: '# API Rate Limits and Best Practices\n\nНаша система API имеет следующие лимиты:\n\n- Free tier: 100 запросов в час\n- Pro tier: 1000 запросов в час\n- Enterprise: безлимит\n\nРекомендации по работе с API:\n1. Используйте экспоненциальную задержку при получении ошибки 429\n2. Кэшируйте результаты запросов, когда это возможно\n3. Используйте webhooks вместо polling для получения обновлений\n4. Реализуйте retry логику с максимальным количеством попыток\n\nПример кода для обработки rate limit:\n```\nif (response.status === 429) {\n  const retryAfter = response.headers["Retry-After"] || 60;\n  await sleep(retryAfter * 1000);\n  return retryRequest();\n}\n```',
      created_at: '2025-11-11T14:30:00Z',
      created_by: 'Support Team',
      type: 'manual',
      folder_id: 'folder_003', // Engineering > API Docs
    },
    {
      id: 'manual_003',
      body: '# Two-Factor Authentication Setup Guide\n\nНастройка двухфакторной аутентификации (2FA):\n\n1. Войдите в свой аккаунт\n2. Перейдите в "Security Settings"\n3. Нажмите "Enable 2FA"\n4. Отсканируйте QR-код приложением-аутентификатором (Google Authenticator, Authy)\n5. Введите код подтверждения из приложения\n6. Сохраните резервные коды в безопасном месте\n\nРекомендуемые приложения:\n- Google Authenticator\n- Microsoft Authenticator\n- Authy\n\nЕсли вы потеряли доступ к устройству с 2FA, используйте резервные коды или обратитесь в поддержку.',
      created_at: '2025-11-12T10:45:00Z',
      created_by: 'Admin',
      type: 'manual',
      folder_id: null, // Uncategorized
    },
    {
      id: 'manual_004',
      body: '# Database Backup and Recovery Procedures\n\nПроцедуры резервного копирования и восстановления базы данных:\n\nАвтоматические бэкапы:\n- Полные бэкапы: ежедневно в 02:00 UTC\n- Инкрементальные бэкапы: каждые 6 часов\n- Хранение: 30 дней для полных, 7 дней для инкрементальных\n\nРучное восстановление:\n1. Определите нужную точку восстановления\n2. Остановите приложение\n3. Восстановите базу данных из бэкапа\n4. Проверьте целостность данных\n5. Запустите приложение\n\nКоманда для восстановления:\n```\npg_restore -d database_name backup_file.dump\n```\n\nВажно: Всегда тестируйте восстановление на тестовой среде перед применением в продакшене.',
      created_at: '2025-11-13T16:20:00Z',
      created_by: 'DevOps Team',
      type: 'manual',
      folder_id: 'folder_004', // Engineering > Servers
    },
    {
      id: 'manual_005',
      body: '# Webhook Configuration and Testing\n\nНастройка webhook для получения уведомлений:\n\n1. Создайте endpoint на вашем сервере для приема webhook\n2. В настройках API создайте новый webhook:\n   - URL: https://your-domain.com/webhook\n   - Events: выберите события для подписки\n   - Secret: сгенерируйте секретный ключ\n\n3. Проверьте подпись запроса:\n```\nconst signature = crypto\n  .createHmac("sha256", secret)\n  .update(JSON.stringify(payload))\n  .digest("hex");\n```\n\n4. Всегда возвращайте 200 OK в течение 5 секунд\n5. Реализуйте идемпотентность для обработки дубликатов\n\nТестирование:\n- Используйте ngrok для локальной разработки\n- Проверяйте логи на наличие ошибок\n- Мониторьте время ответа',
      created_at: '2025-11-14T11:10:00Z',
      created_by: 'Developer',
      type: 'manual',
      folder_id: 'folder_003', // Engineering > API Docs
    },
  ]

  const [articles, setArticles] = useState<KnowledgeArticle[]>(initialArticles)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [folderDialogOpen, setFolderDialogOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<KBFolder | null>(null)
  const [folderDialogParentId, setFolderDialogParentId] = useState<string | null>(null)
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false)
  const [deletingFolder, setDeletingFolder] = useState<KBFolder | null>(null)

  // Обработка загрузки файлов
  const handleFileUpload = (selectedFiles: File[]) => {
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
      setFiles((prev) => [...prev, newFile])

      // Симуляция завершения индексации через 3 секунды
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) => (f.id === newFile.id ? { ...f, status: 'active' } : f))
        )
      }, 3000)
    })
  }

  // Удаление файла
  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  // Удаление тикета
  const handleDeleteTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId))
  }

  // Обновление тикета
  const handleUpdateTicket = (updatedTicket: KnowledgeTicket) => {
    setTickets((prev) => prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)))
  }

  // Удаление статьи
  const handleDeleteArticle = (articleId: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== articleId))
  }

  // Обновление статьи
  const handleUpdateArticle = (updatedArticle: KnowledgeArticle) => {
    setArticles((prev) => prev.map((a) => (a.id === updatedArticle.id ? updatedArticle : a)))
  }

  // Создание новой статьи
  const handleNewArticle = () => {
    const newArticle: KnowledgeArticle = {
      id: `article_${Date.now()}_${Math.random()}`,
      body: '',
      created_at: new Date().toISOString(),
      created_by: 'You',
      type: 'manual',
      folder_id: selectedFolderId,
    }
    setEditingArticle(newArticle)
    setEditorOpen(true)
  }

  // Управление папками
  const handleCreateFolder = (parentId: string | null) => {
    setEditingFolder(null)
    setFolderDialogParentId(parentId)
    setFolderDialogOpen(true)
  }

  const handleEditFolder = (folder: KBFolder) => {
    setEditingFolder(folder)
    setFolderDialogParentId(null)
    setFolderDialogOpen(true)
  }

  const handleDeleteFolder = (folder: KBFolder) => {
    setDeletingFolder(folder)
    setDeleteFolderDialogOpen(true)
  }

  const handleSaveFolder = (folderData: { id?: string; name: string; parent_id: string | null }) => {
    if (folderData.id) {
      // Обновление существующей папки
      setFolders((prev) =>
        prev.map((f) => (f.id === folderData.id ? { ...f, name: folderData.name } : f))
      )
    } else {
      // Создание новой папки
      const newFolder: KBFolder = {
        id: `folder_${Date.now()}_${Math.random()}`,
        name: folderData.name,
        parent_id: folderData.parent_id,
      }
      setFolders((prev) => [...prev, newFolder])
    }
    setFolderDialogOpen(false)
    setEditingFolder(null)
    setFolderDialogParentId(null)
  }

  const handleDeleteFolderConfirm = (deleteArticles: boolean) => {
    if (!deletingFolder) return

    // Рекурсивная функция для получения всех подпапок
    const getAllSubfolderIds = (parentId: string): string[] => {
      const subfolderIds: string[] = []
      const directChildren = folders.filter((f) => f.parent_id === parentId)
      
      directChildren.forEach((child) => {
        subfolderIds.push(child.id)
        subfolderIds.push(...getAllSubfolderIds(child.id))
      })

      return subfolderIds
    }

    const allFolderIds = [deletingFolder.id, ...getAllSubfolderIds(deletingFolder.id)]

    if (deleteArticles) {
      // Удалить статьи
      setArticles((prev) => prev.filter((a) => !allFolderIds.includes(a.folder_id || '')))
    } else {
      // Переместить статьи в корень
      setArticles((prev) =>
        prev.map((a) => (allFolderIds.includes(a.folder_id || '') ? { ...a, folder_id: null } : a))
      )
    }

    // Удалить папки
    setFolders((prev) => prev.filter((f) => !allFolderIds.includes(f.id)))

    // Если удаляемая папка была выбрана, сбросить выбор
    if (selectedFolderId && allFolderIds.includes(selectedFolderId)) {
      setSelectedFolderId(null)
    }

    setDeleteFolderDialogOpen(false)
    setDeletingFolder(null)
  }

  // Перемещение статьи
  const handleMoveArticle = (articleId: string, folderId: string | null) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === articleId ? { ...a, folder_id: folderId } : a))
    )
  }

  // Перемещение папки
  const handleMoveFolder = (folderId: string, targetFolderId: string | null) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, parent_id: targetFolderId } : f))
    )
  }

  // Получение прямых подпапок текущей папки (без рекурсии) с метаданными
  const currentFolders = getSubfolders(selectedFolderId, folders)
    .map((folder) => {
      // Вычисление метаданных для каждой папки
      const foldersCount = getDirectSubfoldersCount(folder.id, folders)
      const articlesCount = getDirectArticlesCount(folder.id, articles)
      
      // Вычисление updated_at на основе последней даты обновления статей в папке
      const folderArticles = articles.filter((a) => a.folder_id === folder.id)
      const latestArticleDate = folderArticles.length > 0
        ? folderArticles.reduce((latest, article) => {
            const articleDate = new Date(article.created_at)
            return articleDate > latest ? articleDate : latest
          }, new Date(folderArticles[0].created_at))
        : null

      return {
        ...folder,
        items_count: {
          folders: foldersCount,
          articles: articlesCount,
        },
        updated_at: latestArticleDate ? latestArticleDate.toISOString() : undefined,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name)) // Сортировка по алфавиту

  // Получение прямых статей текущей папки (без рекурсии)
  const filteredArticles = selectedFolderId !== null
    ? articles.filter((a) => a.folder_id === selectedFolderId)
    : articles.filter((a) => a.folder_id === null)

  // Редактирование статьи
  const handleEditArticle = (article: KnowledgeArticle) => {
    setEditingArticle(article)
    setEditorOpen(true)
  }

  // Сохранение статьи
  const handleSaveArticle = (article: KnowledgeArticle) => {
    if (articles.some((a) => a.id === article.id)) {
      // Обновление существующей статьи
      setArticles((prev) => prev.map((a) => (a.id === article.id ? article : a)))
    } else {
      // Добавление новой статьи
      setArticles((prev) => [article, ...prev])
    }
  }

  // Закрытие редактора
  const handleCloseEditor = () => {
    setEditorOpen(false)
    setEditingArticle(null)
  }

  // Подсчет статистики
  const allContentCount = files.length + tickets.length + articles.length
  const filesCount = files.length
  const articlesCount = articles.length
  const ticketsCount = tickets.length

  // Обработчик клика на AI Simulator
  const handleSimulatorClick = () => {
    setShowSimulator(true)
  }

  // Рендеринг контента в зависимости от активного источника
  const renderContent = () => {
    if (showSimulator) {
      return <AISimulatorView onBack={() => setShowSimulator(false)} />
    }

    switch (activeSource) {
      case 'all':
        return (
          <AllContentView
            files={files}
            tickets={tickets}
            articles={articles}
            onDeleteFile={handleDeleteFile}
            onDeleteTicket={handleDeleteTicket}
            onDeleteArticle={handleDeleteArticle}
            onUpdateTicket={handleUpdateTicket}
            onUpdateArticle={handleUpdateArticle}
          />
        )
      case 'files':
        return (
          <FilesLibraryView
            files={files}
            onFileUpload={handleFileUpload}
            onFileDelete={handleDeleteFile}
          />
        )
      case 'tickets':
        return (
          <TicketsView tickets={tickets} onDeleteTicket={handleDeleteTicket} />
        )
      case 'articles':
        return (
          <ArticlesView
            articles={filteredArticles}
            allArticles={articles}
            folders={currentFolders}
            allFolders={folders}
            selectedFolderId={selectedFolderId}
            onNewArticle={handleNewArticle}
            onEditArticle={handleEditArticle}
            onDeleteArticle={handleDeleteArticle}
            onFolderSelect={setSelectedFolderId}
            onNewFolder={handleCreateFolder}
            onEditFolder={handleEditFolder}
            onDeleteFolder={handleDeleteFolder}
            onMoveArticle={handleMoveArticle}
            onMoveFolder={handleMoveFolder}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-full bg-white">
      {/* Left Sidebar */}
      <SourceSidebar
        activeSource={activeSource}
        onSourceChange={(source) => {
          setActiveSource(source)
          setShowSimulator(false)
        }}
        allContentCount={allContentCount}
        filesCount={filesCount}
        articlesCount={articlesCount}
        ticketsCount={ticketsCount}
        onSimulatorClick={handleSimulatorClick}
        isSimulatorActive={showSimulator}
      />

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">{renderContent()}</div>

      {/* Article Editor Drawer */}
      <ArticleEditor
        isOpen={editorOpen}
        article={editingArticle}
        onClose={handleCloseEditor}
        onSave={handleSaveArticle}
        onDelete={handleDeleteArticle}
      />

      {/* Folder Dialog */}
      <FolderDialog
        isOpen={folderDialogOpen}
        onClose={() => {
          setFolderDialogOpen(false)
          setEditingFolder(null)
          setFolderDialogParentId(null)
        }}
        onSave={handleSaveFolder}
        folder={editingFolder}
        parentId={folderDialogParentId}
      />

      {/* Delete Folder Dialog */}
      <DeleteFolderDialog
        isOpen={deleteFolderDialogOpen}
        onClose={() => {
          setDeleteFolderDialogOpen(false)
          setDeletingFolder(null)
        }}
        onConfirm={handleDeleteFolderConfirm}
        folder={deletingFolder}
        folders={folders}
        articleCount={deletingFolder ? getFolderArticleCount(deletingFolder.id, articles, folders) : 0}
      />
    </div>
  )
}

