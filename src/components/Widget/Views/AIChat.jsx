import { useState, useEffect } from 'react'
import config from '../../../widget-config.json'

function AIChat({ onNavigate, params = {} }) {
  const [query, setQuery] = useState(params.query || '')
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState(null)

  useEffect(() => {
    if (params.query) {
      setQuery(params.query)
    }
  }, [params.query])

  const getAIResponse = (userQuery) => {
    const lowerQuery = userQuery.toLowerCase()
    if (lowerQuery.includes('оплат') || lowerQuery.includes('платеж') || lowerQuery.includes('деньг')) {
      return config.ai_response_mock.payment
    }
    if (lowerQuery.includes('техническ') || lowerQuery.includes('ошибк') || lowerQuery.includes('не работ')) {
      return config.ai_response_mock.technical
    }
    return config.ai_response_mock.default
  }

  const generateInitialData = (userQuery) => {
    const lowerQuery = userQuery.toLowerCase()
    const initialData = {}

    // Определение категории на основе запроса
    if (lowerQuery.includes('оплат') || lowerQuery.includes('платеж') || lowerQuery.includes('деньг') || lowerQuery.includes('транзакц')) {
      initialData.category = 'billing_finance'
      
      // Извлечение ID транзакции (простая имитация)
      const transactionMatch = userQuery.match(/(?:транзакц|платеж|оплат)[\w\s]*?([A-Z0-9-]{5,})/i)
      if (transactionMatch) {
        initialData.transaction_id = transactionMatch[1]
      }
      
      // Определение способа оплаты
      if (lowerQuery.includes('карт') || lowerQuery.includes('card')) {
        initialData.payment_method = 'card'
      } else if (lowerQuery.includes('крипт') || lowerQuery.includes('crypto')) {
        initialData.payment_method = 'crypto'
      } else if (lowerQuery.includes('перевод') || lowerQuery.includes('wire')) {
        initialData.payment_method = 'wire_transfer'
      }
    } else if (lowerQuery.includes('техническ') || lowerQuery.includes('ошибк') || lowerQuery.includes('не работ') || lowerQuery.includes('баг')) {
      initialData.category = 'technical_support'
      
      // Определение среды
      if (lowerQuery.includes('продакшн') || lowerQuery.includes('production')) {
        initialData.environment = 'production'
      } else if (lowerQuery.includes('тест') || lowerQuery.includes('staging')) {
        initialData.environment = 'staging'
      } else {
        initialData.environment = 'dev'
      }
      
      // Определение модуля
      if (lowerQuery.includes('api') || lowerQuery.includes('апи')) {
        initialData.component = 'api'
      } else if (lowerQuery.includes('фронт') || lowerQuery.includes('frontend') || lowerQuery.includes('интерфейс')) {
        initialData.component = 'frontend'
      } else if (lowerQuery.includes('баз') || lowerQuery.includes('database') || lowerQuery.includes('данн')) {
        initialData.component = 'database'
      }
      
      // Определение критичности
      if (lowerQuery.includes('критич') || lowerQuery.includes('блок') || lowerQuery.includes('срочн')) {
        initialData.severity = 'blocker'
      } else if (lowerQuery.includes('высок') || lowerQuery.includes('важн')) {
        initialData.severity = 'high'
      } else if (lowerQuery.includes('средн')) {
        initialData.severity = 'medium'
      } else {
        initialData.severity = 'low'
      }
    } else if (lowerQuery.includes('партнер') || lowerQuery.includes('сотруднич') || lowerQuery.includes('компани')) {
      initialData.category = 'partnership'
      
      // Извлечение названия компании (простая имитация)
      const companyMatch = userQuery.match(/(?:компани|организац)[\w\s]*?([А-ЯЁA-Z][\w\s]+)/i)
      if (companyMatch) {
        initialData.company_name = companyMatch[1].trim()
      }
    } else {
      initialData.category = 'general'
    }

    // Предзаполнение темы и описания
    initialData.subject = userQuery.length > 50 ? userQuery.substring(0, 50) + '...' : userQuery
    initialData.description = userQuery

    return initialData
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setAiResponse(null)

    // Имитация загрузки 2 секунды
    setTimeout(() => {
      const response = getAIResponse(query)
      setAiResponse(response)
      setIsLoading(false)
    }, 2000)
  }

  const handleFeedback = (helped) => {
    if (helped) {
      onNavigate('HOME')
    } else {
      // Генерируем initialData для предзаполнения формы
      const initialData = generateInitialData(query)
      onNavigate('TICKET_FORM', { 
        fromAI: true, 
        query, 
        aiResponse,
        initialData 
      })
    }
  }

  return (
    <div className="p-3 md:p-4">
      {!aiResponse ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-gray-600 mb-4">{config.ui.aiPrompt}</p>
            <textarea
              rows={5}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Опишите проблему подробнее..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {isLoading ? config.ui.aiLoadingMessage : 'Спросить ИИ'}
          </button>
        </form>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* User Query */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Ваш запрос:</p>
            <p className="text-gray-900">{query}</p>
          </div>

          {/* AI Response */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">Ответ ИИ-ассистента:</p>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
          </div>

          {/* Feedback Block */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">{config.ui.feedbackQuestion}</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleFeedback(true)}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
              >
                {config.ui.feedbackYes}
              </button>
              <button
                onClick={() => handleFeedback(false)}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              >
                {config.ui.feedbackNo}
              </button>
            </div>
          </div>

          {/* New Query Button */}
          <button
            onClick={() => {
              setAiResponse(null)
              setQuery('')
            }}
            className="w-full px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium text-sm"
          >
            Задать новый вопрос
          </button>
        </div>
      )}

      {/* Loading Animation */}
      {isLoading && (
        <div className="mt-4 flex items-center justify-center space-x-2 animate-in fade-in duration-200">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-sm text-gray-600 ml-2">{config.ui.aiLoadingMessage}</span>
        </div>
      )}
    </div>
  )
}

export default AIChat
