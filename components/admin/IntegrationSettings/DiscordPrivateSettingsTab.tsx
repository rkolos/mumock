'use client'

import { useState } from 'react'
import { IntegrationSettings } from '../../../data/integrations'
import { mockCategories, SourceType } from '../../../data/categories'
import DiscordOnboardingSimulator from './DiscordOnboardingSimulator'

interface DiscordPrivateSettingsTabProps {
  settings: IntegrationSettings
  onSettingsChange: (settings: IntegrationSettings) => void
}

export default function DiscordPrivateSettingsTab({
  settings,
  onSettingsChange,
}: DiscordPrivateSettingsTabProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  
  const categories = mockCategories.filter((cat) => cat.source_type === 'discord_private_bot' || cat.linked_integrations?.includes('discord_private_bot'))
  const sourceType: SourceType = 'discord_private_bot'

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
        <h3 className="text-base font-semibold text-gray-900 mb-4">Staff Identity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Send replies as Bot (Global Default)
              </label>
              <p className="text-xs text-gray-500">Анонимный режим по умолчанию</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.default_send_as_bot || false}
                onChange={(e) => handleChange('default_send_as_bot', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {!settings.default_send_as_bot && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Custom Signature
              </label>
              <input
                type="text"
                value={settings.default_custom_signature || ''}
                onChange={(e) => handleChange('default_custom_signature', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="— {{admin_name}} from Support"
              />
            </div>
          )}
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
