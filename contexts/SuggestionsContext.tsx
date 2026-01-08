'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Suggestion, SuggestionStatus, mockSuggestions } from '../data/suggestions'
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
  activeStatus: SuggestionStatus | 'All'
  searchQuery: string
  dismissedSimilar: Set<string> // IDs предложений, для которых отклонили похожие
  settings: SuggestionsConfig | null
  setSelectedSuggestionId: (id: string | null) => void
  setActiveStatus: (status: SuggestionStatus | 'All') => void
  setSearchQuery: (query: string) => void
  getSuggestionById: (id: string) => Suggestion | undefined
  updateSuggestionStatus: (id: string, status: SuggestionStatus) => void
  updateSuggestionCategory: (id: string, category: string) => void
  mergeSuggestion: (id: string, mergedInto: string) => void
  createSuggestion: (suggestion: Suggestion) => void
  getFilteredSuggestions: () => Suggestion[]
  getSimilarSuggestions: (suggestionId: string) => Suggestion[]
  dismissSimilarSuggestions: (suggestionId: string) => void
  // Методы для работы с настройками
  loadSettings: () => Promise<void>
  saveSettings: (config: SuggestionsConfig) => Promise<void>
  getCategories: () => SuggestionCategory[]
  getNotificationTemplate: (event: 'ticket_created' | 'ticket_approved' | 'ticket_rejected') => string
}

const SuggestionsContext = createContext<SuggestionsContextType | undefined>(undefined)

export function SuggestionsProvider({ children }: { children: ReactNode }) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(mockSuggestions)
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string | null>(null)
  const [activeStatus, setActiveStatus] = useState<SuggestionStatus | 'All'>('New')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [dismissedSimilar, setDismissedSimilar] = useState<Set<string>>(new Set())
  const [settings, setSettings] = useState<SuggestionsConfig | null>(null)

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

  const getFilteredSuggestions = useCallback((): Suggestion[] => {
    let filtered = suggestions

    // Применяем фильтр по статусу
    if (activeStatus !== 'All') {
      filtered = filtered.filter(s => s.lifecycle.status === activeStatus)
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
  }, [suggestions, activeStatus, searchQuery])

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

  return (
    <SuggestionsContext.Provider
      value={{
        suggestions,
        selectedSuggestionId,
        activeStatus,
        searchQuery,
        dismissedSimilar,
        settings,
        setSelectedSuggestionId,
        setActiveStatus,
        setSearchQuery,
        getSuggestionById,
        updateSuggestionStatus,
        updateSuggestionCategory,
        mergeSuggestion,
        createSuggestion,
        getFilteredSuggestions,
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

