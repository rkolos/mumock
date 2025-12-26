'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search } from 'lucide-react'
import config from '../widget-config.json'

interface SearchResultsProps {
  onNavigate: (view: string, params?: any) => void
  params?: any
}

export default function SearchResults({ onNavigate, params = {} }: SearchResultsProps) {
  const initialArticles = params.filteredArticles || config.mockData.articles
  const [searchQuery, setSearchQuery] = useState(params.searchQuery || '')

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) {
      return initialArticles
    }
    
    const query = searchQuery.toLowerCase().trim()
    return initialArticles.filter((article: any) => 
      article.title.toLowerCase().includes(query) ||
      article.snippet.toLowerCase().includes(query)
    )
  }, [searchQuery, initialArticles])

  useEffect(() => {
    if (params.searchQuery !== undefined) {
      setSearchQuery(params.searchQuery)
    }
  }, [params.searchQuery])

  const handleArticleClick = (article: any) => {
    onNavigate('ARTICLE_VIEW', { article, searchQuery, filteredArticles })
  }

  const handleNotHelped = () => {
    onNavigate('AI_CHAT', { fromSearch: true, query: searchQuery })
  }

  return (
    <div className="p-3 md:p-4">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по базе знаний..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>
      <div className="mb-4">
        <p className="text-gray-600">
          {searchQuery ? `Найдено статей по запросу "${searchQuery}": ${filteredArticles.length}` : `Найдено статей: ${filteredArticles.length}`}
        </p>
      </div>
      <div className="space-y-3">
        {filteredArticles.map((article: any) => (
          <div
            key={article.id}
            onClick={() => handleArticleClick(article)}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all cursor-pointer"
          >
            <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
            <p className="text-sm text-gray-600">{article.snippet}</p>
          </div>
        ))}
        {searchQuery && (
          <button
            onClick={handleNotHelped}
            className="w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
          >
            {config.ui.notHelpedButton}
          </button>
        )}
      </div>
    </div>
  )
}

