'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { Suggestion, SuggestionStatus, SuggestionCluster, mockSuggestions, createMockClusters } from '../data/suggestions'
import {
  SuggestionsConfig,
  SuggestionCategory,
  defaultSuggestionsConfig,
} from '../data/suggestionsConfig'
import {
  fetchSuggestionsSettings,
  saveSuggestionsSettings,
} from '../utils/suggestionsSettingsApi'

interface SuggestionsContextType {
  suggestions: Suggestion[]
  selectedSuggestionId: string | null
  statusFilters: SuggestionStatus[] // массив выбранных статусов
  searchQuery: string
  dismissedSimilar: Set<string> // IDs предложений, для которых отклонили похожие
  settings: SuggestionsConfig | null
  // Фильтры
  categoryFilters: string[]
  scoreFilter: { type: 'more' | 'less'; value: number } | null
  dateFilter: { from: string; to: string } | null
  setSelectedSuggestionId: (id: string | null) => void
  setStatusFilters: (statuses: SuggestionStatus[]) => void
  setSearchQuery: (query: string) => void
  setCategoryFilters: (categories: string[]) => void
  setScoreFilter: (filter: { type: 'more' | 'less'; value: number } | null) => void
  setDateFilter: (filter: { from: string; to: string } | null) => void
  clearAllFilters: () => void
  removeFilter: (type: 'category' | 'score' | 'date' | 'status') => void
  getSuggestionById: (id: string) => Suggestion | undefined
  updateSuggestionStatus: (id: string, status: SuggestionStatus) => void
  updateSuggestionCategory: (id: string, category: string) => void
  mergeSuggestion: (id: string, mergedInto: string) => void
  createSuggestion: (suggestion: Suggestion) => void
  deleteSuggestions: (ids: string[]) => void
  bulkUpdateStatus: (ids: string[], status: SuggestionStatus) => void
  bulkMergeSuggestions: (sourceIds: string[], targetId: string) => void
  getFilteredSuggestions: () => Suggestion[]
  getGroupedSuggestions: () => (SuggestionCluster | Suggestion)[]
  getSimilarSuggestions: (suggestionId: string) => Suggestion[]
  dismissSimilarSuggestions: (suggestionId: string) => void
  // Методы для работы с настройками
  loadSettings: () => Promise<void>
  saveSettings: (config: SuggestionsConfig) => Promise<void>
  getCategories: () => SuggestionCategory[]
  getNotificationTemplate: (event: 'ticket_created' | 'ticket_approved' | 'ticket_rejected') => string
  // AI Grouping
  isAIGroupingEnabled: boolean
  setIsAIGroupingEnabled: (enabled: boolean) => void
}

const SuggestionsContext = createContext<SuggestionsContextType | undefined>(undefined)

export function SuggestionsProvider({ children }: { children: ReactNode }) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(mockSuggestions)
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null)
  const [statusFilters, setStatusFilters] = useState<SuggestionStatus[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [dismissedSimilar, setDismissedSimilar] = useState<Set<string>>(new Set())
  const [settings, setSettings] = useState<SuggestionsConfig | null>(null)
  // Состояние фильтров
  const [categoryFilters, setCategoryFilters] = useState<string[]>([])
  const [scoreFilter, setScoreFilter] = useState<{ type: 'more' | 'less'; value: number } | null>(null)
  const [dateFilter, setDateFilter] = useState<{ from: string; to: string } | null>(null)
  const [isAIGroupingEnabled, setIsAIGroupingEnabled] = useState<boolean>(false)

  // Загружаем состояние из localStorage после монтирования компонента
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStatus = localStorage.getItem('suggestions_statusFilters')
      const savedQuery = localStorage.getItem('suggestions_searchQuery')
      const savedCategoryFilters = localStorage.getItem('suggestions_categoryFilters')
      const savedScoreFilter = localStorage.getItem('suggestions_scoreFilter')
      const savedDateFilter = localStorage.getItem('suggestions_dateFilter')
      
      // Миграция старого формата activeStatus в новый формат statusFilters
      const oldActiveStatus = localStorage.getItem('suggestions_activeStatus')
      if (oldActiveStatus && oldActiveStatus !== 'All') {
        try {
          setStatusFilters([oldActiveStatus as SuggestionStatus])
          localStorage.removeItem('suggestions_activeStatus') // Удаляем старый формат
        } catch (e) {
          console.error('Failed to migrate activeStatus:', e)
        }
      }
      
      if (savedStatus) {
        try {
          const parsed = JSON.parse(savedStatus)
          if (Array.isArray(parsed)) {
            setStatusFilters(parsed)
          }
        } catch (e) {
          console.error('Failed to parse status filters:', e)
        }
      }
      if (savedQuery) {
        setSearchQuery(savedQuery)
      }
      if (savedCategoryFilters) {
        try {
          setCategoryFilters(JSON.parse(savedCategoryFilters))
        } catch (e) {
          console.error('Failed to parse category filters:', e)
        }
      }
      if (savedScoreFilter) {
        try {
          setScoreFilter(JSON.parse(savedScoreFilter))
        } catch (e) {
          console.error('Failed to parse score filter:', e)
        }
      }
      if (savedDateFilter) {
        try {
          setDateFilter(JSON.parse(savedDateFilter))
        } catch (e) {
          console.error('Failed to parse date filter:', e)
        }
      }
    }
  }, [])

  // Сохраняем statusFilters в localStorage при изменении
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('suggestions_statusFilters', JSON.stringify(statusFilters))
    }
  }, [statusFilters])

  // Сохраняем searchQuery в localStorage при изменении
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('suggestions_searchQuery', searchQuery)
    }
  }, [searchQuery])

  // Сохраняем фильтры в localStorage при изменении
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('suggestions_categoryFilters', JSON.stringify(categoryFilters))
    }
  }, [categoryFilters])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (scoreFilter) {
        localStorage.setItem('suggestions_scoreFilter', JSON.stringify(scoreFilter))
      } else {
        localStorage.removeItem('suggestions_scoreFilter')
      }
    }
  }, [scoreFilter])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (dateFilter) {
        localStorage.setItem('suggestions_dateFilter', JSON.stringify(dateFilter))
      } else {
        localStorage.removeItem('suggestions_dateFilter')
      }
    }
  }, [dateFilter])

  const getSuggestionById = useCallback((id: string): Suggestion | undefined => {
    return suggestions.find(s => s.id === id)
  }, [suggestions])

  const updateSuggestionStatus = useCallback((id: string, status: SuggestionStatus) => {
    setSuggestions(prev => prev.map(s => 
      s.id === id 
        ? { ...s, lifecycle: { ...s.lifecycle, status } }
        : s
    ))
  }, [])

  const updateSuggestionCategory = useCallback((id: string, category: string) => {
    setSuggestions(prev => prev.map(s => 
      s.id === id 
        ? { ...s, content: { ...s.content, category } }
        : s
    ))
  }, [])

  const mergeSuggestion = useCallback((id: string, mergedInto: string) => {
    setSuggestions(prev => prev.map(s => 
      s.id === id 
        ? { 
            ...s, 
            lifecycle: { 
              ...s.lifecycle, 
              status: 'Duplicate' as SuggestionStatus,
              merged_into: mergedInto 
            } 
          }
        : s
    ))
  }, [])

  const createSuggestion = useCallback((suggestion: Suggestion) => {
    setSuggestions(prev => [suggestion, ...prev])
  }, [])

  const deleteSuggestions = useCallback((ids: string[]) => {
    setSuggestions(prev => prev.filter(s => !ids.includes(s.id)))
    // Если удаляем выбранное предложение, сбрасываем выбор
    setSelectedSuggestionId(prevId => prevId && ids.includes(prevId) ? null : prevId)
  }, [])

  const bulkUpdateStatus = useCallback((ids: string[], status: SuggestionStatus) => {
    setSuggestions(prev => prev.map(s => 
      ids.includes(s.id)
        ? { ...s, lifecycle: { ...s.lifecycle, status } }
        : s
    ))
  }, [])

  const bulkMergeSuggestions = useCallback((sourceIds: string[], targetId: string) => {
    setSuggestions(prev => {
      // Находим мастер-тикет и дочерние тикеты
      const master = prev.find(s => s.id === targetId)
      const children = prev.filter(s => sourceIds.includes(s.id))
      
      if (!master) return prev
      
      // Суммируем голоса
      let totalUpvotes = master.metrics.upvotes
      let totalDownvotes = master.metrics.downvotes
      
      children.forEach(child => {
        totalUpvotes += child.metrics.upvotes
        totalDownvotes += child.metrics.downvotes
      })
      
      const newScore = totalUpvotes - totalDownvotes
      
      // Формируем список ID дочерних тикетов для добавления в description
      const childIds = children.map(c => `#${c.id}`).join(', ')
      const mergedText = `\n\nMerged from: ${childIds}`
      
      return prev.map(s => {
        if (s.id === targetId) {
          // Обновляем мастер-тикет: суммируем голоса и добавляем ссылки
          return {
            ...s,
            metrics: {
              upvotes: totalUpvotes,
              downvotes: totalDownvotes,
              score: newScore,
            },
            content: {
              ...s.content,
              description: s.content.description + mergedText,
            },
          }
        } else if (sourceIds.includes(s.id)) {
          // Помечаем дочерние тикеты как Duplicate
          return {
            ...s,
            lifecycle: {
              ...s.lifecycle,
              status: 'Duplicate' as SuggestionStatus,
              merged_into: targetId,
            },
          }
        }
        return s
      })
    })
  }, [])

  const getFilteredSuggestions = useCallback((): Suggestion[] => {
    let filtered = suggestions

    // Применяем фильтр по статусам (можно выбрать несколько)
    if (statusFilters.length > 0) {
      filtered = filtered.filter(s => statusFilters.includes(s.lifecycle.status))
    }

    // Применяем фильтр по категориям
    if (categoryFilters.length > 0) {
      filtered = filtered.filter(s => categoryFilters.includes(s.content.category))
    }

    // Применяем фильтр по score
    if (scoreFilter) {
      if (scoreFilter.type === 'more') {
        filtered = filtered.filter(s => s.metrics.score > scoreFilter.value)
      } else {
        filtered = filtered.filter(s => s.metrics.score < scoreFilter.value)
      }
    }

    // Применяем фильтр по дате
    if (dateFilter) {
      const fromDate = new Date(dateFilter.from).getTime()
      const toDate = new Date(dateFilter.to).getTime()
      filtered = filtered.filter(s => {
        const createdDate = new Date(s.created_at).getTime()
        return createdDate >= fromDate && createdDate <= toDate
      })
    }

    // Применяем поиск
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(s => 
        s.content.title.toLowerCase().includes(query) ||
        s.id.toLowerCase().includes(query)
      )
    }

    // Сортировка: сначала закрепленные, затем по дате создания (новые выше)
    return filtered.sort((a, b) => {
      // Сначала закрепленные
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      // Затем по дате создания (новые выше)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [suggestions, statusFilters, searchQuery, categoryFilters, scoreFilter, dateFilter])

  // Группировка предложений для AI Grouping режима
  const getGroupedSuggestions = useCallback((): (SuggestionCluster | Suggestion)[] => {
    // Получаем отфильтрованные предложения
    let filtered = suggestions

    // Применяем фильтр по статусам
    if (statusFilters.length > 0) {
      filtered = filtered.filter(s => statusFilters.includes(s.lifecycle.status))
    }

    // Применяем фильтр по категориям
    if (categoryFilters.length > 0) {
      filtered = filtered.filter(s => categoryFilters.includes(s.content.category))
    }

    // Применяем фильтр по score
    if (scoreFilter) {
      if (scoreFilter.type === 'more') {
        filtered = filtered.filter(s => s.metrics.score > scoreFilter.value)
      } else {
        filtered = filtered.filter(s => s.metrics.score < scoreFilter.value)
      }
    }

    // Применяем фильтр по дате
    if (dateFilter) {
      const fromDate = new Date(dateFilter.from).getTime()
      const toDate = new Date(dateFilter.to).getTime()
      filtered = filtered.filter(s => {
        const createdDate = new Date(s.created_at).getTime()
        return createdDate >= fromDate && createdDate <= toDate
      })
    }

    // Применяем поиск
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(s => 
        s.content.title.toLowerCase().includes(query) ||
        s.id.toLowerCase().includes(query)
      )
    }

    // Сортируем: сначала закрепленные, затем по дате создания
    filtered = filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return createMockClusters(filtered)
  }, [suggestions, statusFilters, searchQuery, categoryFilters, scoreFilter, dateFilter])

  // Поиск похожих предложений (по категории и похожести заголовка)
  const getSimilarSuggestions = useCallback((suggestionId: string): Suggestion[] => {
    const current = getSuggestionById(suggestionId)
    if (!current || current.lifecycle.status !== 'New') return []

    // Ищем предложения с той же категорией и похожим заголовком
    const similar = suggestions.filter(s => {
      if (s.id === suggestionId) return false
      if (s.lifecycle.status === 'Duplicate') return false
      
      // Проверяем категорию
      const sameCategory = s.content.category === current.content.category
      
      // Проверяем похожесть заголовка (простейший алгоритм - общие слова)
      const currentWords = current.content.title.toLowerCase().split(/\s+/)
      const otherWords = s.content.title.toLowerCase().split(/\s+/)
      const commonWords = currentWords.filter(word => 
        word.length > 3 && otherWords.includes(word)
      )
      const hasSimilarTitle = commonWords.length >= 2

      return sameCategory && hasSimilarTitle
    })

    return similar.slice(0, 5) // Максимум 5 похожих
  }, [suggestions, getSuggestionById])

  const dismissSimilarSuggestions = useCallback((suggestionId: string) => {
    setDismissedSimilar(prev => {
      const next = new Set(prev)
      next.add(suggestionId)
      return next
    })
  }, [])

  // Lazy загрузка настроек при открытии модального окна
  const loadSettings = useCallback(async () => {
    if (settings !== null) {
      // Настройки уже загружены
      return
    }
    try {
      const loadedSettings = await fetchSuggestionsSettings()
      setSettings(loadedSettings)
    } catch (error) {
      console.error('Failed to load suggestions settings:', error)
      // В случае ошибки используем дефолтные настройки
      setSettings(defaultSuggestionsConfig)
    }
  }, [settings])

  // Сохранение настроек
  const saveSettings = useCallback(async (config: SuggestionsConfig) => {
    try {
      const savedSettings = await saveSuggestionsSettings(config)
      setSettings(savedSettings)
    } catch (error) {
      console.error('Failed to save suggestions settings:', error)
      throw error // Пробрасываем ошибку для обработки в компоненте
    }
  }, [])

  // Получение списка категорий
  const getCategories = useCallback((): SuggestionCategory[] => {
    if (!settings) {
      return defaultSuggestionsConfig.categories
    }
    return settings.categories
  }, [settings])

  // Получение шаблона уведомления
  const getNotificationTemplate = useCallback(
    (event: 'ticket_created' | 'ticket_approved' | 'ticket_rejected'): string => {
      if (!settings) {
        return defaultSuggestionsConfig.notifications[event]
      }
      return settings.notifications[event]
    },
    [settings]
  )

  // Методы для управления фильтрами
  const handleSetCategoryFilters = useCallback((categories: string[]) => {
    setCategoryFilters(categories)
  }, [])

  const handleSetScoreFilter = useCallback((filter: { type: 'more' | 'less'; value: number } | null) => {
    setScoreFilter(filter)
  }, [])

  const handleSetDateFilter = useCallback((filter: { from: string; to: string } | null) => {
    setDateFilter(filter)
  }, [])

  const clearAllFilters = useCallback(() => {
    setCategoryFilters([])
    setScoreFilter(null)
    setDateFilter(null)
    setStatusFilters([])
  }, [])

  const removeFilter = useCallback((type: 'category' | 'score' | 'date' | 'status') => {
    switch (type) {
      case 'category':
        setCategoryFilters([])
        break
      case 'score':
        setScoreFilter(null)
        break
      case 'date':
        setDateFilter(null)
        break
      case 'status':
        setStatusFilters([])
        break
    }
  }, [])

  const handleSetStatusFilters = useCallback((statuses: SuggestionStatus[]) => {
    setStatusFilters(statuses)
  }, [])

  return (
    <SuggestionsContext.Provider
      value={{
        suggestions,
        selectedSuggestionId,
        statusFilters,
        searchQuery,
        dismissedSimilar,
        settings,
        categoryFilters,
        scoreFilter,
        dateFilter,
        isAIGroupingEnabled,
        setSelectedSuggestionId,
        setStatusFilters: handleSetStatusFilters,
        setSearchQuery,
        setCategoryFilters: handleSetCategoryFilters,
        setScoreFilter: handleSetScoreFilter,
        setDateFilter: handleSetDateFilter,
        setIsAIGroupingEnabled,
        clearAllFilters,
        removeFilter,
        getSuggestionById,
        updateSuggestionStatus,
        updateSuggestionCategory,
        mergeSuggestion,
        createSuggestion,
        deleteSuggestions,
        bulkUpdateStatus,
        bulkMergeSuggestions,
        getFilteredSuggestions,
        getGroupedSuggestions,
        getSimilarSuggestions,
        dismissSimilarSuggestions,
        loadSettings,
        saveSettings,
        getCategories,
        getNotificationTemplate,
      }}
    >
      {children}
    </SuggestionsContext.Provider>
  )
}

export function useSuggestions() {
  const context = useContext(SuggestionsContext)
  if (context === undefined) {
    throw new Error('useSuggestions must be used within a SuggestionsProvider')
  }
  return context
}

