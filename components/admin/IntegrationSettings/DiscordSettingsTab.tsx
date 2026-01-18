'use client'

import { useState } from 'react'
import { X, Users } from 'lucide-react'
import { IntegrationSettings } from '../../../data/integrations'
import { mockCategories, SourceType } from '../../../data/categories'
import DiscordOnboardingSimulator from './DiscordOnboardingSimulator'

interface DiscordSettingsTabProps {
  settings: IntegrationSettings
  onSettingsChange: (settings: IntegrationSettings) => void
}

export default function DiscordSettingsTab({
  settings,
  onSettingsChange,
}: DiscordSettingsTabProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  
  const categories = mockCategories.filter((cat) => cat.source_type === 'discord' || cat.linked_integrations?.includes('discord'))
  const sourceType: SourceType = 'discord'

  const handleChange = (field: keyof IntegrationSettings, value: string | boolean) => {
    onSettingsChange({
      ...settings,
      [field]: value,
    })
  }

  const handleChangeWithString = (field: keyof IntegrationSettings, value: string | boolean | number) => {
    onSettingsChange({
      ...settings,
      [field]: value,
    })
  }

  const handleRemoveSourceRole = (role: string) => {
    // TODO: Implement source role removal
    console.log('Remove source role:', role)
  }

  const getSourceRoles = (): string[] => {
    // Mock source roles - можно будет подключить к реальным настройкам
    return ['@Support', '@Moderator', '@Admin']
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Onboarding Configuration</h3>
        <p className="text-sm text-gray-500 mb-4">
          Настройка точки входа — то, что видит пользователь до выбора категории
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Onboarding Text
            </label>
            <textarea
              value={settings.onboarding_text || ''}
              onChange={(e) => handleChangeWithString('onboarding_text', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Привет! Выберите тему обращения ниже..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Поддерживается Markdown и Emoji
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Menu Interface Style
            </label>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="menu_style"
                  value="BUTTONS"
                  checked={settings.menu_style === 'BUTTONS' || !settings.menu_style}
                  onChange={(e) => handleChangeWithString('menu_style', e.target.value as 'BUTTONS' | 'SELECT')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">🔲 🔲</span>
                    <span className="text-sm font-medium text-gray-900">Interactive Buttons</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Кнопки. Лучше для малого числа категорий (до 5-10).
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="menu_style"
                  value="SELECT"
                  checked={settings.menu_style === 'SELECT'}
                  onChange={(e) => handleChangeWithString('menu_style', e.target.value as 'BUTTONS' | 'SELECT')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">🔽</span>
                    <span className="text-sm font-medium text-gray-900">Select Dropdown</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Выпадающий список. Компактно, подходит для большого числа категорий.
                  </p>
                </div>
              </label>
            </div>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-800">
                <strong>Примечание:</strong> Для редактирования формы категории (поля, которые отображаются при выборе категории) перейдите во вкладку <strong>"Categories"</strong> и нажмите <strong>"Edit Config" (⚙️)</strong> у нужной категории.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Post-Submission Flow</h3>
        <p className="text-sm text-gray-500 mb-4">
          Сообщение от бота, которое появится в созданном тикете первым — после отправки формы пользователем
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ticket First Message
            </label>
            <textarea
              value={settings.ticket_first_message || 'Спасибо! Тикет {ticket_id} создан! Теперь вы можете добавить файлы, изображения или видео если это необходимо.'}
              onChange={(e) => handleChangeWithString('ticket_first_message', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Спасибо! Тикет {ticket_id} создан! Теперь вы можете добавить файлы, изображения или видео если это необходимо."
            />
            <p className="mt-1 text-xs text-gray-500">
              Сообщение от бота, которое появится в созданном тикете первым. Доступные переменные: {'{username}'}, {'{ticket_id}'}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Channel Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Channel Naming Template
            </label>
            <input
              type="text"
              value={settings.channel_naming_template || ''}
              onChange={(e) => handleChangeWithString('channel_naming_template', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ticket-{num}"
            />
            <p className="mt-1 text-xs text-gray-500">
              Шаблон имени канала при создании нового тикета. Используется для Discord Server Bot. Доступные переменные: {'{num}'}, {'{id}'}, {'{username}'}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Auto-create Channels
              </label>
              <p className="text-xs text-gray-500">Automatically create channels for new tickets</p>
            </div>
            <button
              onClick={() => handleChange('default_welcome_message', !true)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                true ? 'bg-black' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  true ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Source Mapped Roles (External - Discord)
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Список ролей Discord, которым разрешен просмотр канала тикета.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {getSourceRoles().map((role) => (
            <span
              key={role}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300"
            >
              {role}
              <button
                onClick={() => handleRemoveSourceRole(role)}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-[#e2e8f0] hover:bg-gray-50 rounded-md transition-colors">
          <Users className="h-4 w-4" />
          <span>Manage Discord Roles</span>
        </button>
      </div>
      </div>
      
      {/* Simulator */}
      <div className="lg:sticky lg:top-6 h-fit">
        <DiscordOnboardingSimulator
          onboardingText={settings.onboarding_text}
          menuStyle={settings.menu_style}
          categories={categories}
          sourceType={sourceType}
          selectedCategoryId={selectedCategoryId}
          onCategoryClick={setSelectedCategoryId}
          ticketFirstMessage={settings.ticket_first_message}
        />
      </div>
    </div>
  )
}
