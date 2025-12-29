'use client'

import { useState, useEffect, useRef } from 'react'
import { User, ChevronDown } from 'lucide-react'
import { useWidget } from '../../contexts/WidgetContext'

interface UserPreferences {
  translation_lang: string | null
}

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences: UserPreferences
}

// Список языков для перевода
const translationLanguages = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'de-DE', name: 'German (DE)', flag: '🇩🇪' },
  { code: 'es-ES', name: 'Spanish (ES)', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French (FR)', flag: '🇫🇷' },
  { code: 'pt-BR', name: 'Portuguese (BR)', flag: '🇧🇷' },
  { code: 'ru-RU', name: 'Russian (RU)', flag: '🇷🇺' },
  { code: 'it-IT', name: 'Italian (IT)', flag: '🇮🇹' },
  { code: 'nl-NL', name: 'Dutch (NL)', flag: '🇳🇱' },
]

export default function ProfilePage() {
  const { showToast } = useWidget()
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'Vladislav Panov',
    email: 'v.panov@dt.team',
    preferences: {
      translation_lang: 'de-DE', // По умолчанию German (DE) для демонстрации
    },
  })

  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Получение текущего выбранного языка
  const getCurrentLanguage = () => {
    if (!user.preferences.translation_lang) {
      return { code: null, name: 'System Default (English)', flag: '🌐' }
    }
    const lang = translationLanguages.find((l) => l.code === user.preferences.translation_lang)
    return lang || { code: user.preferences.translation_lang, name: user.preferences.translation_lang, flag: '🌐' }
  }

  // Обработка изменения языка
  const handleLanguageChange = async (langCode: string | null) => {
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        translation_lang: langCode,
      },
    }
    setUser(updatedUser)
    setIsLanguageDropdownOpen(false)

    // Имитация API запроса на сохранение
    try {
      // Здесь должен быть реальный API запрос
      // await fetch('/api/user/preferences', { method: 'POST', body: JSON.stringify({ translation_lang: langCode }) })
      
      // Показываем toast уведомление
      showToast('Preferences saved', 'success')
    } catch (error) {
      console.error('Error saving preferences:', error)
      showToast('Error saving preferences', 'error')
    }
  }

  const currentLang = getCurrentLanguage()

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      {/* Container with max-width */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-base font-bold text-gray-900">My Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* App Preferences Card */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm mt-6">
          <div className="px-6 pt-6 pb-4">
            <h2 className="text-base font-semibold" style={{ fontSize: '16px', color: '#212121' }}>
              App Preferences
            </h2>
          </div>

          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderTop: '1px solid #f0f0f0' }}
          >
            <div className="flex-1">
              <div className="text-sm font-medium mb-1" style={{ color: '#616161' }}>
                Translation Target Language
              </div>
              <div
                className="text-gray-500 text-xs mt-1"
                style={{ maxWidth: '250px', lineHeight: '1.4' }}
              >
                Defines the language for incoming message translation.
              </div>
            </div>

            <div className="ml-4" style={{ width: '220px' }} ref={dropdownRef}>
              <div className="relative">
                <button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  style={{ minHeight: '32px' }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '18px' }}>{currentLang.flag}</span>
                    <span className="text-sm text-gray-900">{currentLang.name}</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-600 transition-transform ${
                      isLanguageDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isLanguageDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    {/* System Default Option */}
                    <button
                      onClick={() => handleLanguageChange(null)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 first:rounded-t-md ${
                        !user.preferences.translation_lang
                          ? 'bg-blue-50 text-blue-900'
                          : 'text-gray-900'
                      }`}
                    >
                      <span style={{ fontSize: '18px' }}>🌐</span>
                      <span>System Default (English)</span>
                    </button>

                    {/* Language Options */}
                    {translationLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 last:rounded-b-md ${
                          user.preferences.translation_lang === lang.code
                            ? 'bg-blue-50 text-blue-900'
                            : 'text-gray-900'
                        }`}
                      >
                        <span style={{ fontSize: '18px' }}>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
