'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Settings, Trash2, Plus, RotateCcw, Loader2, Search } from 'lucide-react'
import { useSuggestions } from '../../contexts/SuggestionsContext'
import { useWidget } from '../../contexts/WidgetContext'
import {
  SuggestionsConfig,
  SuggestionCategory,
  defaultSuggestionsConfig,
  BannedUser,
} from '../../data/suggestionsConfig'
import { mockSuggestions } from '../../data/suggestions'
import { fetchBannedUsers, unbanUser } from '../../utils/suggestionsSettingsApi'

interface SuggestionsSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

type ActiveTab = 'categories' | 'notifications' | 'banned'

export default function SuggestionsSettingsModal({
  isOpen,
  onClose,
}: SuggestionsSettingsModalProps) {
  const { loadSettings, saveSettings, settings } = useSuggestions()
  const { showToast } = useWidget()
  const [activeTab, setActiveTab] = useState<ActiveTab>('categories')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [localConfig, setLocalConfig] = useState<SuggestionsConfig | null>(null)
  const [originalConfig, setOriginalConfig] = useState<SuggestionsConfig | null>(null)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6')
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  // Состояние для вкладки Banned Users
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([])
  const [bannedUsersLoading, setBannedUsersLoading] = useState(false)
  const [bannedSearchQuery, setBannedSearchQuery] = useState('')
  const [unbanningUserId, setUnbanningUserId] = useState<string | null>(null)
  const [lastLoadedSearch, setLastLoadedSearch] = useState<string>('')

  // Загрузка настроек при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      loadSettings()
        .catch((error) => {
          console.error('Failed to load settings:', error)
        })
    } else {
      // Сброс состояния при закрытии
      setLocalConfig(null)
      setOriginalConfig(null)
      setShowAddCategory(false)
      setNewCategoryName('')
      setNewCategoryColor('#3b82f6')
      setShowUnsavedDialog(false)
      setIsLoading(false)
      // Сброс состояния банов
      setBannedUsers([])
      setBannedSearchQuery('')
      setUnbanningUserId(null)
      setBannedUsersLoading(false)
      setLastLoadedSearch('')
    }
  }, [isOpen, loadSettings])

  // Инициализация локального конфига из settings при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      if (settings) {
        if (!localConfig || JSON.stringify(localConfig) !== JSON.stringify(settings)) {
          setLocalConfig({ ...settings })
          setOriginalConfig({ ...settings })
        }
        setIsLoading(false)
      } else {
        // Если settings еще не загружены, используем дефолтные
        const defaultConfig = defaultSuggestionsConfig
        if (!localConfig) {
          setLocalConfig({ ...defaultConfig })
          setOriginalConfig({ ...defaultConfig })
        }
      }
    }
  }, [isOpen, settings])

  // Lazy loading банов при переключении на вкладку
  useEffect(() => {
    if (isOpen && activeTab === 'banned') {
      // Загружаем только если поисковый запрос изменился или данные еще не загружались
      if (bannedSearchQuery !== lastLoadedSearch || bannedUsers.length === 0) {
        setBannedUsersLoading(true)
        fetchBannedUsers(bannedSearchQuery || undefined)
          .then((users) => {
            setBannedUsers(users)
            setLastLoadedSearch(bannedSearchQuery)
          })
          .catch((error) => {
            console.error('Failed to load banned users:', error)
            showToast('Ошибка при загрузке списка забаненных пользователей', 'error')
          })
          .finally(() => {
            setBannedUsersLoading(false)
          })
      }
    }
  }, [isOpen, activeTab])

  // Загрузка банов при изменении поискового запроса (debounced)
  useEffect(() => {
    if (isOpen && activeTab === 'banned' && bannedSearchQuery !== lastLoadedSearch) {
      const timeoutId = setTimeout(() => {
        setBannedUsersLoading(true)
        fetchBannedUsers(bannedSearchQuery || undefined)
          .then((users) => {
            setBannedUsers(users)
            setLastLoadedSearch(bannedSearchQuery)
          })
          .catch((error) => {
            console.error('Failed to load banned users:', error)
          })
          .finally(() => {
            setBannedUsersLoading(false)
          })
      }, 300) // Debounce для поиска

      return () => clearTimeout(timeoutId)
    }
  }, [bannedSearchQuery, activeTab, isOpen])

  // Проверка наличия несохраненных изменений
  const hasUnsavedChanges = useCallback(() => {
    if (!localConfig || !originalConfig) return false
    return JSON.stringify(localConfig) !== JSON.stringify(originalConfig)
  }, [localConfig, originalConfig])

  // Обработка закрытия с проверкой несохраненных изменений
  const handleClose = useCallback(() => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true)
    } else {
      onClose()
    }
  }, [hasUnsavedChanges, onClose])

  // Подтверждение закрытия с потерей данных
  const handleConfirmClose = () => {
    setShowUnsavedDialog(false)
    onClose()
  }

  // Отмена закрытия
  const handleCancelClose = () => {
    setShowUnsavedDialog(false)
  }

  // Сохранение настроек
  const handleSave = async () => {
    if (!localConfig) return

    // Валидация
    for (const category of localConfig.categories) {
      if (category.label.length === 0) {
        showToast('Название категории не может быть пустым', 'error')
        return
      }
      if (category.label.length > 30) {
        showToast(`Название категории "${category.label}" превышает лимит в 30 символов`, 'error')
        return
      }
    }

    for (const [key, template] of Object.entries(localConfig.notifications)) {
      if (template.length > 500) {
        showToast(`Шаблон уведомления "${key}" превышает лимит в 500 символов`, 'error')
        return
      }
    }

    setIsSaving(true)
    try {
      await saveSettings(localConfig)
      setOriginalConfig({ ...localConfig })
      showToast('Настройки успешно сохранены', 'success')
      onClose()
    } catch (error) {
      console.error('Failed to save settings:', error)
      showToast('Ошибка при сохранении настроек', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // Проверка наличия тикетов в категории
  const hasTicketsInCategory = (categoryLabel: string): boolean => {
    return mockSuggestions.some((s) => s.content.category === categoryLabel)
  }

  // Добавление категории
  const handleAddCategory = () => {
    if (!localConfig || !newCategoryName.trim()) return

    if (newCategoryName.trim().length > 30) {
      showToast('Название категории не может превышать 30 символов', 'error')
      return
    }

    // Проверка на дубликаты
    if (localConfig.categories.some((c) => c.label === newCategoryName.trim())) {
      showToast('Категория с таким названием уже существует', 'error')
      return
    }

    const newCategory: SuggestionCategory = {
      id: `cat_${Date.now()}`,
      label: newCategoryName.trim(),
      color: newCategoryColor,
    }

    setLocalConfig({
      ...localConfig,
      categories: [...localConfig.categories, newCategory],
    })
    setNewCategoryName('')
    setNewCategoryColor('#3b82f6')
    setShowAddCategory(false)
  }

  // Удаление категории
  const handleDeleteCategory = (categoryId: string) => {
    if (!localConfig) return

    const category = localConfig.categories.find((c) => c.id === categoryId)
    if (!category) return

    if (hasTicketsInCategory(category.label)) {
      showToast(
        `Невозможно удалить категорию "${category.label}": в ней есть тикеты`,
        'error'
      )
      return
    }

    setLocalConfig({
      ...localConfig,
      categories: localConfig.categories.filter((c) => c.id !== categoryId),
    })
  }

  // Изменение категории
  const handleCategoryChange = (categoryId: string, updates: Partial<SuggestionCategory>) => {
    if (!localConfig) return

    setLocalConfig({
      ...localConfig,
      categories: localConfig.categories.map((c) =>
        c.id === categoryId ? { ...c, ...updates } : c
      ),
    })
  }

  // Изменение шаблона уведомления
  const handleNotificationChange = (
    event: keyof typeof defaultSuggestionsConfig.notifications,
    value: string
  ) => {
    if (!localConfig) return

    if (value.length > 500) {
      showToast('Шаблон уведомления не может превышать 500 символов', 'error')
      return
    }

    setLocalConfig({
      ...localConfig,
      notifications: {
        ...localConfig.notifications,
        [event]: value,
      },
    })
  }

  // Сброс шаблона к дефолтному
  const handleResetTemplate = (event: keyof typeof defaultSuggestionsConfig.notifications) => {
    if (!localConfig) return

    setLocalConfig({
      ...localConfig,
      notifications: {
        ...localConfig.notifications,
        [event]: defaultSuggestionsConfig.notifications[event],
      },
    })
  }

  // Разбан пользователя
  const handleUnban = async (userId: string, username: string) => {
    setUnbanningUserId(userId)
    try {
      await unbanUser(userId)
      setBannedUsers((prev) => prev.filter((user) => user.id !== userId))
      showToast(`User @${username} has been unbanned`, 'success')
    } catch (error) {
      console.error('Failed to unban user:', error)
      showToast('Ошибка при разбане пользователя', 'error')
    } finally {
      setUnbanningUserId(null)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Suggestions Settings</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-[#e2e8f0]">
          <div className="flex items-end gap-1">
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'categories'
                  ? 'text-gray-900 border-black'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'notifications'
                  ? 'text-gray-900 border-black'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('banned')}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'banned'
                  ? 'text-gray-900 border-black'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Banned Users
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ) : activeTab === 'categories' ? (
            <CategoriesTab
              categories={localConfig?.categories || []}
              onCategoryChange={handleCategoryChange}
              onDeleteCategory={handleDeleteCategory}
              onAddCategory={handleAddCategory}
              showAddCategory={showAddCategory}
              setShowAddCategory={setShowAddCategory}
              newCategoryName={newCategoryName}
              setNewCategoryName={setNewCategoryName}
              newCategoryColor={newCategoryColor}
              setNewCategoryColor={setNewCategoryColor}
              hasTicketsInCategory={hasTicketsInCategory}
            />
          ) : activeTab === 'notifications' ? (
            <NotificationsTab
              notifications={localConfig?.notifications || defaultSuggestionsConfig.notifications}
              onNotificationChange={handleNotificationChange}
              onResetTemplate={handleResetTemplate}
            />
          ) : (
            <BannedUsersTab
              bannedUsers={bannedUsers}
              isLoading={bannedUsersLoading}
              searchQuery={bannedSearchQuery}
              onSearchChange={setBannedSearchQuery}
              onUnban={handleUnban}
              unbanningUserId={unbanningUserId}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading || !hasUnsavedChanges()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Dialog для подтверждения закрытия с несохраненными изменениями */}
      {showUnsavedDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[#e2e8f0]">
              <h3 className="text-lg font-semibold text-gray-900">Несохраненные изменения</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600">
                У вас есть несохраненные изменения. Точно выйти?
              </p>
            </div>
            <div className="px-6 py-4 border-t border-[#e2e8f0] flex items-center justify-end gap-3">
              <button
                onClick={handleCancelClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmClose}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Компонент раздела Categories
interface CategoriesTabProps {
  categories: SuggestionCategory[]
  onCategoryChange: (categoryId: string, updates: Partial<SuggestionCategory>) => void
  onDeleteCategory: (categoryId: string) => void
  onAddCategory: () => void
  showAddCategory: boolean
  setShowAddCategory: (show: boolean) => void
  newCategoryName: string
  setNewCategoryName: (name: string) => void
  newCategoryColor: string
  setNewCategoryColor: (color: string) => void
  hasTicketsInCategory: (label: string) => boolean
}

function CategoriesTab({
  categories,
  onCategoryChange,
  onDeleteCategory,
  onAddCategory,
  showAddCategory,
  setShowAddCategory,
  newCategoryName,
  setNewCategoryName,
  newCategoryColor,
  setNewCategoryColor,
  hasTicketsInCategory,
}: CategoriesTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Categories</h3>
        {!showAddCategory && (
          <button
            onClick={() => setShowAddCategory(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        )}
      </div>

      {/* Форма добавления категории */}
      {showAddCategory && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              maxLength={30}
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newCategoryName.trim()) {
                  onAddCategory()
                } else if (e.key === 'Escape') {
                  setShowAddCategory(false)
                  setNewCategoryName('')
                }
              }}
            />
            <p className="mt-1 text-xs text-gray-500">{newCategoryName.length}/30 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-[#e2e8f0] rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#3b82f6"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onAddCategory}
              disabled={!newCategoryName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddCategory(false)
                setNewCategoryName('')
                setNewCategoryColor('#3b82f6')
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Список категорий */}
      <div className="space-y-2">
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No categories yet</p>
        ) : (
          categories.map((category) => {
            const canDelete = !hasTicketsInCategory(category.label)
            return (
              <div
                key={category.id}
                className="flex items-center gap-3 p-3 bg-white border border-[#e2e8f0] rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <input
                  type="text"
                  value={category.label}
                  onChange={(e) => {
                    if (e.target.value.length <= 30) {
                      onCategoryChange(category.id, { label: e.target.value })
                    }
                  }}
                  className="flex-1 px-2 py-1 text-sm border border-transparent rounded hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={30}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={category.color}
                    onChange={(e) => onCategoryChange(category.id, { color: e.target.value })}
                    className="h-8 w-16 rounded border border-gray-300 cursor-pointer"
                  />
                  <button
                    onClick={() => onDeleteCategory(category.id)}
                    disabled={!canDelete}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                      canDelete
                        ? 'Delete category'
                        : 'Cannot delete: category has tickets'
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// Компонент раздела Notifications
interface NotificationsTabProps {
  notifications: {
    ticket_created: string
    ticket_approved: string
    ticket_rejected: string
  }
  onNotificationChange: (
    event: 'ticket_created' | 'ticket_approved' | 'ticket_rejected',
    value: string
  ) => void
  onResetTemplate: (event: 'ticket_created' | 'ticket_approved' | 'ticket_rejected') => void
}

function NotificationsTab({
  notifications,
  onNotificationChange,
  onResetTemplate,
}: NotificationsTabProps) {
  const notificationEvents = [
    {
      key: 'ticket_created' as const,
      label: 'Ticket Created',
      description: 'Уведомление при создании тикета',
      variables: ['{{user}}', '{{id}}'],
    },
    {
      key: 'ticket_approved' as const,
      label: 'Ticket Approved',
      description: 'Уведомление при одобрении тикета',
      variables: ['{{user}}', '{{title}}', '{{id}}'],
    },
    {
      key: 'ticket_rejected' as const,
      label: 'Ticket Rejected',
      description: 'Уведомление при отклонении тикета',
      variables: ['{{user}}', '{{title}}'],
    },
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold text-gray-900">Notification Templates</h3>
      {notificationEvents.map((event) => (
        <div key={event.key} className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-900">{event.label}</label>
              <p className="text-xs text-gray-500 mt-1">{event.description}</p>
            </div>
            <button
              onClick={() => onResetTemplate(event.key)}
              className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset to Default
            </button>
          </div>
          <textarea
            value={notifications[event.key]}
            onChange={(e) => onNotificationChange(event.key, e.target.value)}
            rows={4}
            maxLength={500}
            className="w-full px-3 py-2 border border-[#e2e8f0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter notification template..."
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">Available variables:</span>
              {event.variables.map((variable) => (
                <code
                  key={variable}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
                >
                  {variable}
                </code>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              {notifications[event.key].length}/500 characters
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Компонент раздела Banned Users
interface BannedUsersTabProps {
  bannedUsers: BannedUser[]
  isLoading: boolean
  searchQuery: string
  onSearchChange: (query: string) => void
  onUnban: (userId: string, username: string) => void
  unbanningUserId: string | null
}

function BannedUsersTab({
  bannedUsers,
  isLoading,
  searchQuery,
  onSearchChange,
  onUnban,
  unbanningUserId,
}: BannedUsersTabProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Banned Users</h3>
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by username or ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* List of Banned Users */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
          </div>
        ) : bannedUsers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">
              No banned users found. Everyone is welcome to suggest ideas!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {bannedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-4 bg-white border border-[#e2e8f0] rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Avatar */}
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{user.username}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 font-mono">{user.id}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Banned on {formatDate(user.banned_at)}</p>
                </div>

                {/* Unban Button */}
                <button
                  onClick={() => onUnban(user.id, user.username)}
                  disabled={unbanningUserId === user.id}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {unbanningUserId === user.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Unbanning...</span>
                    </>
                  ) : (
                    <span>Unban</span>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

