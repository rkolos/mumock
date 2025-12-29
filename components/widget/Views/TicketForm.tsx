'use client'

import { useState, useEffect, useRef } from 'react'
import { Paperclip, X, CheckCircle2, Bot, AlertCircle } from 'lucide-react'
import config from '../widget-config.json'
import { useWidget } from '../../../contexts/WidgetContext'
import { NavigationParams, FormField, TicketCategory } from '../../../types/widget'

// Тип для полей из JSON конфигурации (type как string)
type ConfigFormField = Omit<FormField, 'type'> & { type: string }
type ConfigTicketCategory = Omit<TicketCategory, 'fields'> & { fields: ConfigFormField[] }

interface TicketFormProps {
  onNavigate: (view: string, params?: NavigationParams) => void
  params?: NavigationParams
}

interface File {
  id: number
  name: string
  size: number
  progress: number
  uploaded: boolean
}

export default function TicketForm({ onNavigate, params = {} }: TicketFormProps) {
  const { createTicket, showToast, closeWidget } = useWidget()
  const categories = config.ticket_categories as Record<string, ConfigTicketCategory>
  const globalFields = (config.ticket_global_fields || []) as ConfigFormField[]
  
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [ticketToken, setTicketToken] = useState<string | null>(null)
  const [aiFilledFields, setAiFilledFields] = useState<Set<string>>(new Set())
  const [aiSelectedCategory, setAiSelectedCategory] = useState<string | null>(null)
  const [showCategoryWarning, setShowCategoryWarning] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const initialData: Record<string, string> = {}
    let initialCategory = 'general'
    const filledFields = new Set<string>()
    
    globalFields.forEach((field: ConfigFormField) => {
      if (field.type !== 'file') {
        initialData[field.name] = ''
      }
    })

    if (params.initialData) {
      const aiData = params.initialData
      
      if (aiData.category && categories[aiData.category as keyof typeof categories]) {
        initialCategory = aiData.category
        setAiSelectedCategory(aiData.category)
      }

      Object.keys(aiData).forEach(key => {
        if (key !== 'category' && aiData[key]) {
          initialData[key] = aiData[key]
          filledFields.add(key)
        }
      })
      setAiFilledFields(filledFields)
    } else {
      if (params.query) {
        initialData.description = params.query
      }
      if (params.articleId) {
        initialData.subject = `Вопрос по статье #${params.articleId}`
      }
    }

    setSelectedCategory(initialCategory)

    const categoryFields = categories[initialCategory]?.fields || []
    categoryFields.forEach((field: ConfigFormField) => {
      if (!initialData[field.name]) {
        initialData[field.name] = field.type === 'radio' ? '' : ''
      }
    })

    setFormData(initialData)
    setShowSuccess(false)
    setFiles([])
    setTicketId(null)
    setTicketToken(null)
    setErrors({})
    setIsSubmitting(false)
    setShowCategoryWarning(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (Object.keys(formData).length === 0) return

    const newCategoryFields = categories[selectedCategory]?.fields || []
    const newData = { ...formData }

    const globalFieldNames = globalFields.map((f: ConfigFormField) => f.name)
    const preservedData: Record<string, string> = {}
    globalFieldNames.forEach(name => {
      if (newData[name] !== undefined) {
        preservedData[name] = newData[name]
      }
    })

    Object.keys(newData).forEach(key => {
      if (!globalFieldNames.includes(key)) {
        delete newData[key]
      }
    })

    newCategoryFields.forEach((field: ConfigFormField) => {
      if (!newData[field.name]) {
        newData[field.name] = field.type === 'radio' ? '' : ''
      }
    })

    Object.assign(newData, preservedData)

    setFormData(newData)
    
    setAiFilledFields(prev => {
      const newSet = new Set(prev)
      const currentFieldNames = [
        ...globalFieldNames,
        ...newCategoryFields.map((f: ConfigFormField) => f.name)
      ]
      Array.from(newSet).forEach(name => {
        if (!currentFieldNames.includes(name)) {
          newSet.delete(name)
        }
      })
      return newSet
    })
  }, [selectedCategory])

  const handleCategoryChange = (newCategory: string) => {
    if (aiSelectedCategory && newCategory !== aiSelectedCategory) {
      setShowCategoryWarning(true)
    }
    setSelectedCategory(newCategory)
    setAiSelectedCategory(null)
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (aiFilledFields.has(name)) {
      setAiFilledFields(prev => {
        const newSet = new Set(prev)
        newSet.delete(name)
        return newSet
      })
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateField = (field: ConfigFormField, value: string): string => {
    const stringValue = String(value || '').trim()
    
    if (field.required && !stringValue) {
      return `${field.label} обязателен для заполнения`
    }
    
    if (field.type === 'email' && stringValue) {
      const patternValue = field.validation?.pattern
      let emailPattern
      if (typeof patternValue === 'string') {
        emailPattern = new RegExp(patternValue)
      } else {
        emailPattern = patternValue || /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
      if (!emailPattern.test(stringValue)) {
        return field.validation?.message || 'Введите корректный email адрес'
      }
    }
    
    return ''
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    globalFields.forEach((field: ConfigFormField) => {
      if (field.type !== 'file' && field.required) {
        const error = validateField(field, formData[field.name] || '')
        if (error) {
          newErrors[field.name] = error
          isValid = false
        }
      }
    })

    const categoryFields = categories[selectedCategory]?.fields || []
    categoryFields.forEach((field: ConfigFormField) => {
      const error = validateField(field, formData[field.name] || '')
      if (error) {
        newErrors[field.name] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    selectedFiles.forEach(file => {
      const fileId = Date.now() + Math.random()
      const newFile: File = {
        id: fileId,
        name: file.name,
        size: file.size,
        progress: 0,
        uploaded: false
      }
      
      setFiles(prev => [...prev, newFile])
      simulateFileUpload(fileId)
    })
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const simulateFileUpload = (fileId: number) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress: 100, uploaded: true } : f
        ))
      } else {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f
        ))
      }
    }, 200)
  }

  const removeFile = (fileId: number) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      const randomId = 'TK-' + Math.floor(Math.random() * 100000)
      const generateToken = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let token = ''
        for (let i = 0; i < 32; i++) {
          token += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return token
      }
      const token = generateToken()
      setTicketId(randomId)
      setTicketToken(token)

      const ticketData = {
        id: randomId,
        token: token,
        category: selectedCategory,
        formData: { ...formData },
        attachments: files.map(f => ({
          name: f.name,
          size: f.size
        })),
        context: {
          searchQuery: params.searchQuery || params.query || null,
          aiResponse: params.aiResponse || null,
          articleId: params.articleId || null,
          fromAI: params.fromAI || false,
          fromArticle: params.fromArticle || false,
          aiFilledFields: Array.from(aiFilledFields)
        },
        timestamp: new Date().toISOString()
      }

      // Создаем тикет в админке через контекст
      createTicket(ticketData)
      
      // Показываем toast уведомление
      showToast('Тикет успешно создан!', 'success')

      setIsSubmitting(false)
      setShowSuccess(true)
    }, 1500)
  }

  const isFormValid = (): boolean => {
    const globalValid = globalFields.every((field: ConfigFormField) => {
      if (field.type === 'file' || !field.required) return true
      const value = formData[field.name] || ''
      return value.trim() && !validateField(field, value)
    })

    const categoryFields = categories[selectedCategory]?.fields || []
    const categoryValid = categoryFields.every((field: ConfigFormField) => {
      if (!field.required) return true
      const value = formData[field.name] || ''
      return value.trim() && !validateField(field, value)
    })

    return globalValid && categoryValid
  }

  const renderField = (field: ConfigFormField) => {
    const value = formData[field.name] || ''
    const error = errors[field.name]
    const isAiFilled = aiFilledFields.has(field.name)

    if (field.type === 'textarea') {
      return (
        <div key={field.name} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <textarea
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              rows={field.rows || 5}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all ${
                error ? 'border-red-300' : isAiFilled ? 'border-blue-200 bg-blue-50' : 'border-gray-300'
              }`}
            />
            {isAiFilled && (
              <div className="absolute top-2 right-2 flex items-center gap-1 text-blue-600 text-xs">
                <Bot className="h-4 w-4" />
                <span>ИИ</span>
              </div>
            )}
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      )
    }

    if (field.type === 'dropdown') {
      return (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <select
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white ${
                error ? 'border-red-300' : isAiFilled ? 'border-blue-200 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <option value="">Выберите...</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {isAiFilled && (
              <div className="absolute top-2 right-8 flex items-center gap-1 text-blue-600 text-xs pointer-events-none">
                <Bot className="h-4 w-4" />
              </div>
            )}
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      )
    }

    if (field.type === 'radio') {
      return (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
            {isAiFilled && (
              <span className="ml-2 inline-flex items-center gap-1 text-blue-600 text-xs">
                <Bot className="h-3 w-3" />
                <span>ИИ</span>
              </span>
            )}
          </label>
          <div className={`space-y-2 p-3 rounded-lg ${isAiFilled ? 'bg-blue-50 border border-blue-200' : ''}`}>
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      )
    }

    if (field.type === 'date') {
      return (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <input
              type="date"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                error ? 'border-red-300' : isAiFilled ? 'border-blue-200 bg-blue-50' : 'border-gray-300'
              }`}
            />
            {isAiFilled && (
              <div className="absolute top-2 right-2 flex items-center gap-1 text-blue-600 text-xs pointer-events-none">
                <Bot className="h-4 w-4" />
              </div>
            )}
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      )
    }

    return (
      <div key={field.name} className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
          {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              error ? 'border-red-300' : isAiFilled ? 'border-blue-200 bg-blue-50' : 'border-gray-300'
            }`}
          />
          {isAiFilled && (
            <div className="absolute top-2 right-2 flex items-center gap-1 text-blue-600 text-xs pointer-events-none">
              <Bot className="h-4 w-4" />
              <span>ИИ</span>
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }

  if (showSuccess) {
    const userEmail = formData.email || 'указанный вами email'
    
    return (
      <div className="p-3 md:p-4 flex flex-col items-center justify-center min-h-[400px] animate-in fade-in">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">Тикет создан!</h2>
        <div className="w-full max-w-md space-y-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 text-center mb-2">
              Ваш номер обращения: <span className="font-semibold">{ticketId}</span>
            </p>
            <p className="text-sm text-gray-600 text-center">
              Мы ответим вам в течение 24 часов.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">
              Информация о тикете отправлена на почту
            </p>
            <p className="text-xs text-blue-800">
              Письмо с информацией о тикете отправлено на <span className="font-semibold">{userEmail}</span>
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Важно:</span>
            </p>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>Ответ саппорта поступит на вашу почту <span className="font-semibold">{userEmail}</span></li>
              <li>Дальнейшее общение по тикету будет происходить в почте</li>
              <li>Проверьте папку "Спам", если письмо не пришло</li>
            </ul>
          </div>
        </div>
        <button
          onClick={() => {
            setShowSuccess(false)
            setFormData({})
            setFiles([])
            setTicketId(null)
            setTicketToken(null)
            closeWidget()
            onNavigate('HOME')
          }}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Вернуться на главную
        </button>
      </div>
    )
  }

  const categoryFields = categories[selectedCategory]?.fields || []

  return (
    <div className="p-3 md:p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Категория <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {Object.values(categories).map((category: ConfigTicketCategory) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {showCategoryWarning && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-yellow-800 font-medium">Вы изменили категорию</p>
              <p className="text-xs text-yellow-700 mt-1">Дополнительные поля формы будут обновлены</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCategoryWarning(false)}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {globalFields.map((field: ConfigFormField) => {
          if (field.type === 'file') return null
          return renderField(field)
        })}

        {categoryFields.map((field: ConfigFormField) => renderField(field))}

        {config.features.enableAttachments && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Вложения (необязательно)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <Paperclip className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Выбрать файлы</span>
            </label>

            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map(file => (
                  <div key={file.id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      {!file.uploaded && (
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-200"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      )}
                      {file.uploaded && (
                        <p className="text-xs text-green-600 mt-1">Загружено</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={!isFormValid() || isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Отправка...
            </>
          ) : (
            'Отправить тикет'
          )}
        </button>
      </form>
    </div>
  )
}

