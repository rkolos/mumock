import { useState } from 'react'
import config from '../../widget-config.json'
import Layout from './Layout'
import HomeView from './Views/HomeView'
import SearchResults from './Views/SearchResults'
import TicketForm from './Views/TicketForm'
import AIChat from './Views/AIChat'
import ArticleView from './Views/ArticleView'

const VIEWS = {
  HOME: HomeView,
  SEARCH_RESULTS: SearchResults,
  TICKET_FORM: TicketForm,
  AI_CHAT: AIChat,
  ARTICLE_VIEW: ArticleView,
}

function WidgetRoot({ isOpen, onClose }) {
  const [currentView, setCurrentView] = useState(config.navigation.initialView)
  const [viewParams, setViewParams] = useState({})

  const handleNavigate = (viewName, params = {}) => {
    setCurrentView(viewName)
    setViewParams(params)
  }

  const handleBack = () => {
    // Если мы в ArticleView и был поиск, возвращаемся к результатам поиска
    if (currentView === 'ARTICLE_VIEW' && viewParams.searchQuery && viewParams.filteredArticles) {
      handleNavigate('SEARCH_RESULTS', { 
        searchQuery: viewParams.searchQuery, 
        filteredArticles: viewParams.filteredArticles 
      })
    } else if (currentView === 'ARTICLE_VIEW') {
      // Если нет контекста поиска, возвращаемся на главную
      handleNavigate('HOME')
    } else {
      handleNavigate('HOME')
    }
  }

  const handleClose = () => {
    setCurrentView(config.navigation.initialView)
    setViewParams({})
    onClose()
  }

  const viewConfig = config.navigation.views[currentView] || config.navigation.views.HOME
  const CurrentViewComponent = VIEWS[currentView] || HomeView

  // Кнопка "Назад" показывается только для ARTICLE_VIEW
  const showBackButton = currentView === 'ARTICLE_VIEW'

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-4 md:right-4 md:w-[380px] md:h-[600px] z-[1000] transition-all duration-300 ease-out">
      <Layout
        title={viewConfig.title}
        showBackButton={showBackButton}
        onClose={handleClose}
        onBack={handleBack}
      >
        <CurrentViewComponent 
          onNavigate={handleNavigate} 
          params={viewParams}
          article={viewParams.article}
        />
      </Layout>
    </div>
  )
}

export default WidgetRoot

