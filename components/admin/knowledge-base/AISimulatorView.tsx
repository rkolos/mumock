'use client'

import { useState } from 'react'
import { Search, Sparkles, Loader2, FileText, Ticket, ChevronDown, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface AISimulatorViewProps {
  onBack?: () => void
}

interface Snippet {
  source_type: 'file' | 'ticket'
  source_name: string
  source_id: string
  content: string
  score: number
}

interface QueryResult {
  answer: string
  snippets: Snippet[]
}

export default function AISimulatorView({ onBack }: AISimulatorViewProps = {}) {
  const [query, setQuery] = useState('')
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [expandedSnippets, setExpandedSnippets] = useState<Set<number>>(new Set([0]))

  // Генерация ответа в Query Console
  const handleGenerateAnswer = async () => {
    if (!query.trim()) return

    // Скрываем предыдущий результат
    setQueryResult(null)
    setIsGenerating(true)
    setExpandedSnippets(new Set([0])) // Сбрасываем состояние аккордеона, первый элемент развернут

    // Симуляция запроса к RAG-системе
    setTimeout(() => {
      const result: QueryResult = {
        answer: `Это пример ответа RAG-системы на вопрос: "${query}". В реальной системе здесь будет ответ, сгенерированный на основе загруженных данных и знаний из тикетов. Ответ может содержать несколько абзацев и подробную информацию из базы знаний.\n\nВ данном случае система использует информацию из загруженных документов и ранее решенных тикетов для формирования наиболее точного ответа.`,
        snippets: [
          {
            source_type: 'file',
            source_name: 'Refund_Policy.pdf',
            source_id: 'file_refund_policy_001',
            content: 'Согласно политике возврата средств, клиенты могут запросить возврат в течение 30 дней с момента покупки. Для оформления возврата необходимо заполнить форму на сайте или связаться с поддержкой. Обработка возврата занимает от 5 до 10 рабочих дней.',
            score: 0.87123456,
          },
          {
            source_type: 'ticket',
            source_name: 'Ticket #8841: Вопрос о возврате средств',
            source_id: '8841',
            content: 'Клиент обратился с вопросом о возврате средств за подписку. Было выяснено, что возврат возможен в течение 30 дней. Клиент получил инструкции по заполнению формы возврата.',
            score: 0.57176661,
          },
          {
            source_type: 'file',
            source_name: 'Terms_of_Service.pdf',
            source_id: 'file_terms_002',
            content: 'Условия возврата средств описаны в разделе 4.2 настоящего соглашения. Возврат производится на тот же способ оплаты, который использовался при покупке.',
            score: 0.42345678,
          },
        ],
      }
      setQueryResult(result)
      setIsGenerating(false)
    }, 1500)
  }

  // Переключение раскрытия сниппета
  const toggleSnippetExpanded = (index: number) => {
    setExpandedSnippets((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="p-4 border-b border-[#e2e8f0] bg-white">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Back to Knowledge Base"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
          )}
          <h2 className="text-lg font-bold text-gray-900">AI Simulator</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#F5F7FB] p-6">
        <div className="flex flex-col items-center py-8">
          {/* Input Zone */}
          <div className="w-full max-w-[800px]">
            <div className="text-sm text-gray-500 mb-2">Test Query</div>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., How do I reset my 2FA?"
              rows={3}
              className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  handleGenerateAnswer()
                }
              }}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleGenerateAnswer}
                disabled={!query.trim() || isGenerating}
                className="flex items-center gap-2 px-6 py-2 bg-black text-white hover:bg-gray-900 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Answer
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Zone */}
          {isGenerating && (
            <div className="w-full max-w-[800px] mt-12">
              <div className="bg-white border border-[#e2e8f0] rounded-lg p-6">
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              </div>
            </div>
          )}

          {queryResult && !isGenerating && (
            <div className="w-full max-w-[800px] mt-12">
              <div className="bg-white border border-[#e2e8f0] rounded-lg overflow-hidden">
                {/* Блок А: Ответ ИИ */}
                <div className="bg-white px-6 py-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    AI Generated Response
                  </div>
                  <div className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {queryResult.answer}
                  </div>
                </div>

                {/* Разделитель */}
                <div className="border-t border-[#e2e8f0]"></div>

                {/* Блок Б: Использованный контекст */}
                <div className="bg-gray-50 px-6 py-4">
                  <div className="text-xs font-semibold text-gray-700 mb-4">
                    Retrieved Context ({queryResult.snippets.length})
                  </div>

                  {/* Список сниппетов (Accordion) */}
                  <div className="space-y-2">
                    {queryResult.snippets.map((snippet, index) => {
                      const isExpanded = expandedSnippets.has(index)

                      return (
                        <div
                          key={index}
                          className="bg-white border border-[#e2e8f0] rounded-lg overflow-hidden"
                        >
                          {/* Заголовок элемента списка */}
                          <button
                            onClick={() => toggleSnippetExpanded(index)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {/* Иконка типа источника */}
                              <div className="flex-shrink-0">
                                {snippet.source_type === 'file' ? (
                                  <FileText className="h-4 w-4 text-gray-600" />
                                ) : (
                                  <Ticket className="h-4 w-4 text-blue-600" />
                                )}
                              </div>

                              {/* Название источника */}
                              <span className="font-medium text-sm text-gray-900 truncate">
                                {snippet.source_name}
                              </span>
                            </div>

                            {/* Показатель релевантности */}
                            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                              <span className="text-xs text-gray-500">Score:</span>
                              <span className="text-xs text-gray-700 font-mono">
                                {snippet.score}
                              </span>
                              <ChevronDown
                                className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ${
                                  isExpanded ? 'transform rotate-180' : ''
                                }`}
                              />
                            </div>
                          </button>

                          {/* Тело элемента списка (Expanded) */}
                          {isExpanded && (
                            <div className="px-4 py-3 border-t border-[#e2e8f0] bg-gray-50">
                              {/* Текст сниппета (стилизован как цитата) */}
                              <div className="border-l-4 border-blue-500 pl-4 py-2 mb-3">
                                <div className="text-sm text-gray-700 font-mono whitespace-pre-wrap leading-relaxed">
                                  {snippet.content}
                                </div>
                              </div>

                              {/* Кнопка перехода */}
                              <Link
                                href={
                                  snippet.source_type === 'file'
                                    ? `#file-${snippet.source_id}`
                                    : `/tickets/${snippet.source_id}`
                                }
                                target="_blank"
                                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 hover:underline"
                              >
                                Open Source
                              </Link>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!queryResult && !isGenerating && (
            <div className="w-full max-w-[800px] mt-12 text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <div className="text-gray-500 mt-4">
                Enter a question above to test the RAG accuracy.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

