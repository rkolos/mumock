'use client'

import { useState, useEffect } from 'react'
import { RotateCcw } from 'lucide-react'
import { Category, SourceType } from '../../../data/categories'
import { getCategoryConfigForIntegration } from './CategorySettingsDialog'

interface DiscordOnboardingSimulatorProps {
  onboardingText?: string
  menuStyle?: 'BUTTONS' | 'SELECT'
  categories: Category[]
  sourceType: SourceType
  selectedCategoryId?: string | null
  onCategoryClick?: (categoryId: string | null) => void
  ticketFirstMessage?: string
}

type SimulatorState = 'onboarding' | 'modal_form' | 'ticket_created'

export default function DiscordOnboardingSimulator({
  onboardingText = 'Привет! Выберите тему обращения ниже...',
  menuStyle = 'BUTTONS',
  categories,
  sourceType,
  selectedCategoryId,
  onCategoryClick,
  ticketFirstMessage = 'Спасибо! Тикет {ticket_id} создан! Теперь вы можете добавить файлы, изображения или видео если это необходимо.',
}: DiscordOnboardingSimulatorProps) {
  const [state, setState] = useState<SimulatorState>('onboarding')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [firstUserMessage, setFirstUserMessage] = useState<string>('')
  const [firstMessageSent, setFirstMessageSent] = useState(false)

  // Если selectedCategoryId изменился (например, открылся дровер), показываем форму
  useEffect(() => {
    // Не переключаем состояние, если мы в состоянии ticket_created (после Submit)
    if (state === 'ticket_created') return
    
    if (selectedCategoryId && selectedCategoryId !== selectedCategory?.id) {
      const category = categories.find((c) => c.id === selectedCategoryId)
      if (category) {
        setSelectedCategory(category)
        setState('modal_form')
      }
    } else if (!selectedCategoryId && selectedCategory) {
      // Если selectedCategoryId очищен извне, сбрасываем состояние
      setSelectedCategory(null)
      setState('onboarding')
      setFormData({})
    }
  }, [selectedCategoryId, categories, selectedCategory, state])

  // Вставка первого сообщения в указанное поле формы
  useEffect(() => {
    if (state === 'modal_form' && selectedCategory && firstUserMessage && sourceType === 'discord_private_bot') {
      const config = getCategoryConfigForIntegration(selectedCategory, sourceType)
      const formFields = config.formFields || []
      const targetFieldId = config.first_message_field_id
      
      if (targetFieldId && formFields.find(f => f.id === targetFieldId)) {
        setFormData(prev => ({ ...prev, [targetFieldId]: firstUserMessage }))
      }
    }
  }, [state, selectedCategory, firstUserMessage, sourceType])

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category)
    setState('modal_form')
    onCategoryClick?.(category.id)
  }

  const handleCancel = () => {
    // Возвращаемся к экрану onboarding (для Discord Private Bot после первого сообщения покажет категории)
    setState('onboarding')
    setSelectedCategory(null)
    setFormData({})
  }

  const handleFirstMessageSubmit = () => {
    if (firstUserMessage.trim()) {
      setFirstMessageSent(true)
    }
  }

  const handleReset = () => {
    setState('onboarding')
    setSelectedCategory(null)
    setShowToast(false)
    setFormData({})
    setFirstUserMessage('')
    setFirstMessageSent(false)
    // Очищаем selectedCategoryId в родительском компоненте
    onCategoryClick?.(null)
  }

  const handleFormDataChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = () => {
    // Переходим к состоянию просмотра созданного тикета
    setState('ticket_created')
  }

  const getButtonColorClass = (style?: 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER') => {
    switch (style) {
      case 'PRIMARY':
        return 'bg-[#5865F2] hover:bg-[#4752C4]'
      case 'SECONDARY':
        return 'bg-gray-600 hover:bg-gray-700'
      case 'SUCCESS':
        return 'bg-green-600 hover:bg-green-700'
      case 'DANGER':
        return 'bg-red-600 hover:bg-red-700'
      default:
        return 'bg-[#5865F2] hover:bg-[#4752C4]'
    }
  }

  if (state === 'modal_form' && selectedCategory) {
    const config = getCategoryConfigForIntegration(selectedCategory, sourceType)
    const formFields = config.formFields || []

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Interactive Preview</h3>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
            title="Сбросить превью"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
        <div className="bg-[#2F3136] rounded-lg p-4 shadow-lg">
          {/* Discord Modal Header */}
          <div className="mb-4 pb-3 border-b border-[#202225]">
            <h4 className="text-lg font-semibold text-white">{selectedCategory.categoryName}</h4>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 mb-4">
            {formFields.length === 0 ? (
              <p className="text-sm text-gray-400">Нет полей в форме</p>
            ) : (
              formFields.map((field) => {
                const label = field.label || field.name
                const placeholder = field.placeholder || `Введите ${label.toLowerCase()}`
                const isTextarea = field.type === 'paragraph' || (!field.type && !field.short)

                return (
                  <div key={field.id}>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      {label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    {isTextarea ? (
                      <textarea
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFormDataChange(field.id, e.target.value)}
                        className="w-full px-3 py-2 bg-[#202225] border border-[#18191C] rounded text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                        rows={4}
                        placeholder={placeholder}
                      />
                    ) : (
                      <input
                        type="text"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFormDataChange(field.id, e.target.value)}
                        className="w-full px-3 py-2 bg-[#202225] border border-[#18191C] rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                        placeholder={placeholder}
                      />
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#202225]">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-[#202225] hover:bg-[#18191C] rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-[#5865F2] hover:bg-[#4752C4] rounded transition-colors"
            >
              Submit
            </button>
          </div>

        </div>
      </div>
    )
  }

  // Ticket Created State - Preview after form submission
  if (state === 'ticket_created' && selectedCategory) {
    const config = getCategoryConfigForIntegration(selectedCategory, sourceType)
    const formFields = config.formFields || []
    
    // Формируем сообщение бота с данными формы
    const formatTicketMessage = (message: string) => {
      return message
        .replace(/{username}/g, 'User123')
        .replace(/{ticket_id}/g, 'TICKET-001')
    }

    const ticketMessage = formatTicketMessage(ticketFirstMessage || 'Спасибо! Тикет {ticket_id} создан! Теперь вы можете добавить файлы, изображения или видео если это необходимо.')

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Interactive Preview</h3>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
            title="Сбросить превью"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
        <div className="bg-[#2F3136] rounded-lg p-4 shadow-lg">
          {/* Bot Avatar & Name */}
          <div className="mb-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-semibold">
              B
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Support Bot</div>
              <div className="text-xs text-gray-400">Today at 12:00 PM</div>
            </div>
          </div>

          {/* Discord Embed Style */}
          <div className="border-l-4 border-[#5865F2] pl-3 space-y-3">
            {/* Ticket First Message */}
            <div className="text-sm text-gray-200 whitespace-pre-wrap">
              {ticketMessage}
            </div>

            {/* Form Data as Embed Fields - показываем все поля в формате "название: содержимое" */}
            {formFields.length > 0 && Object.keys(formData).length > 0 && (
              <div className="space-y-2">
                {formFields.map((field) => {
                  const label = field.label || field.name
                  const value = formData[field.id]
                  if (!value) return null
                  return (
                    <div key={field.id} className="text-sm">
                      <span className="text-gray-400 font-medium">{label}:</span>{' '}
                      <span className="text-gray-200">{value}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Close Ticket Button */}
          <div className="mt-4 pt-3 border-t border-[#202225]">
            <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors w-full">
              Close Ticket
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Onboarding Menu State
  // Для Discord Private Bot: сначала показываем только поле ввода и кнопку
  if (sourceType === 'discord_private_bot' && !firstMessageSent) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Interactive Preview</h3>
        </div>
        <div className="bg-[#2F3136] rounded-lg p-4 shadow-lg">
          {/* Input Field and Send Button */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={firstUserMessage}
                onChange={(e) => setFirstUserMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleFirstMessageSubmit()
                  }
                }}
                className="w-full px-3 py-2 bg-[#202225] border border-[#18191C] rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                placeholder="Введите ваше сообщение..."
              />
            </div>
            <button
              onClick={handleFirstMessageSubmit}
              disabled={!firstUserMessage.trim()}
              className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition-colors"
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    )
  }

  // После отправки первого сообщения для Discord Private Bot: показываем чат с сообщениями и категориями
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Interactive Preview</h3>
      </div>
      <div className="bg-[#2F3136] rounded-lg p-4 shadow-lg">
        {/* User Message (if sent) */}
        {sourceType === 'discord_private_bot' && firstMessageSent && firstUserMessage && (
          <div className="mb-4 pb-3 border-b border-[#202225]">
            {/* User Avatar & Name */}
            <div className="mb-2 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-xs">
                U
              </div>
              <div>
                <div className="text-sm font-semibold text-white">User</div>
                <div className="text-xs text-gray-400">Just now</div>
              </div>
            </div>
            <div className="text-sm text-gray-200 whitespace-pre-wrap ml-11">
              {firstUserMessage}
            </div>
          </div>
        )}

        {/* Bot Message */}
        {(sourceType === 'discord_private_bot' && firstMessageSent) && (
          <div className="mb-4 pb-3 border-b border-[#202225]">
            {/* Bot Avatar & Name */}
            <div className="mb-2 flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-semibold text-xs">
                B
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Support Bot</div>
                <div className="text-xs text-gray-400">Just now</div>
              </div>
            </div>
            <div className="text-sm text-gray-300 whitespace-pre-wrap ml-11">
              {onboardingText}
            </div>
          </div>
        )}

        {/* Welcome Message (for non-Discord Private Bot) */}
        {sourceType !== 'discord_private_bot' && (
        <div className="mb-4 text-sm text-gray-300 whitespace-pre-wrap">{onboardingText}</div>
        )}

        {/* Menu: Buttons or Select */}
        {menuStyle === 'BUTTONS' ? (
          <div className="space-y-2">
            {categories.length === 0 ? (
              <p className="text-sm text-gray-400">Нет категорий</p>
            ) : (
              categories.map((category) => {
                const config = getCategoryConfigForIntegration(category, sourceType)
                const buttonLabel = config.button_label || category.categoryName
                const buttonEmoji = config.button_emoji || ''
                const buttonStyle = config.button_style || 'PRIMARY'

                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className={`w-full px-4 py-3 rounded text-white text-sm font-medium transition-colors ${getButtonColorClass(
                      buttonStyle
                    )}`}
                  >
                    {buttonEmoji && <span className="mr-2">{buttonEmoji}</span>}
                    {buttonLabel}
                  </button>
                )
              })
            )}
          </div>
        ) : (
          <select
            className="w-full px-3 py-2 bg-[#202225] border border-[#18191C] rounded text-white text-sm"
            onChange={(e) => {
              const category = categories.find((c) => c.id === e.target.value)
              if (category) {
                handleCategoryClick(category)
              }
            }}
            value=""
          >
            <option value="">Выберите категорию...</option>
            {categories.map((category) => {
              const config = getCategoryConfigForIntegration(category, sourceType)
              const buttonLabel = config.button_label || category.categoryName
              const buttonEmoji = config.button_emoji || ''
              return (
                <option key={category.id} value={category.id}>
                  {buttonEmoji} {buttonLabel}
                </option>
              )
            })}
          </select>
        )}
      </div>
    </div>
  )
}
