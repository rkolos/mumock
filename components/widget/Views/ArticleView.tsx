'use client'

import { useState, useEffect, useRef } from 'react'
import { FileText } from 'lucide-react'
import config from '../widget-config.json'
import { NavigationParams, Article } from '../../../types/widget'

interface ArticleViewProps {
  article?: Article
  onNavigate: (view: string, params?: NavigationParams) => void
  params?: NavigationParams
}

export default function ArticleView({ article, onNavigate, params = {} }: ArticleViewProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      const scrollableParent = contentRef.current.closest('.overflow-y-auto')
      if (scrollableParent) {
        scrollableParent.scrollTop = 0
      }
    }
  }, [article?.id])

  if (!article) {
    return (
      <div className="p-4">
        <p className="text-gray-600">Статья не найдена</p>
      </div>
    )
  }

  const searchQuery = params.searchQuery
  const filteredArticles = params.filteredArticles || []

  const relatedArticles = filteredArticles
    .filter((a: Article) => a.id !== article.id)
    .slice(0, 3)

  const handleRelatedArticleClick = (relatedArticle: Article) => {
    setIsTransitioning(true)
    setTimeout(() => {
      onNavigate('ARTICLE_VIEW', { 
        article: relatedArticle, 
        searchQuery, 
        filteredArticles 
      })
      setIsTransitioning(false)
    }, 150)
  }

  const handleFeedback = (helped: boolean) => {
    if (helped) {
      if (searchQuery && filteredArticles) {
        onNavigate('SEARCH_RESULTS', { searchQuery, filteredArticles })
      } else {
        onNavigate('HOME')
      }
    } else {
      onNavigate('AI_CHAT', { fromArticle: true, query: searchQuery || article.title, articleId: article.id })
    }
  }

  return (
    <div className="p-3 md:p-4" ref={contentRef}>
      <div 
        className={`mb-6 transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      >
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{article.title}</h1>
        <div 
          className="prose max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>

      {relatedArticles.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3">Другие результаты по вашему запросу</h2>
          <div className="space-y-2">
            {relatedArticles.map((relatedArticle: Article) => (
              <div
                key={relatedArticle.id}
                onClick={() => handleRelatedArticleClick(relatedArticle)}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 hover:border-blue-300 border border-transparent transition-all cursor-pointer flex items-start gap-3 group"
              >
                <FileText className="h-5 w-5 text-gray-400 group-hover:text-blue-600 flex-shrink-0 mt-0.5 transition-colors" />
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {relatedArticle.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
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
    </div>
  )
}

