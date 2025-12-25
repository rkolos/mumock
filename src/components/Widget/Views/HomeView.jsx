import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import config from '../../../widget-config.json'

function HomeView({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) {
      return []
    }
    
    const query = searchQuery.toLowerCase().trim()
    return config.mockData.articles.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.snippet.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const handleArticleClick = (article) => {
    onNavigate('ARTICLE_VIEW', { article, searchQuery, filteredArticles })
  }

  const handleNotHelped = () => {
    onNavigate('AI_CHAT', { fromSearch: true, query: searchQuery })
  }

  return (
    <div className="p-4">
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

      {/* Search Results */}
      {searchQuery.trim() && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {filteredArticles.length > 0 ? (
            <>
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all cursor-pointer"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
                  <p className="text-sm text-gray-600">{article.snippet}</p>
                </div>
              ))}
              <button
                onClick={handleNotHelped}
                className="w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                {config.ui.notHelpedButton}
              </button>
            </>
          ) : (
            <div className="text-center py-8 animate-in fade-in duration-200">
              <p className="text-gray-600 font-medium mb-2">{config.ui.emptySearchMessage}</p>
              <p className="text-sm text-gray-500 mb-4">{config.ui.emptySearchDescription}</p>
              <button
                onClick={handleNotHelped}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Спросить ИИ
              </button>
            </div>
          )}
        </div>
      )}

      {/* Welcome message when no search */}
      {!searchQuery.trim() && (
        <div className="text-center py-8 text-gray-500">
          <p>{config.branding.welcomeText}</p>
          <p className="text-sm mt-2">Начните вводить запрос для поиска по базе знаний</p>
        </div>
      )}
    </div>
  )
}

export default HomeView
