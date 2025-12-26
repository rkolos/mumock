'use client'

import { useState } from 'react'
import config from './widget-config.json'
import Layout from './Layout'
import HomeView from './Views/HomeView'
import SearchResults from './Views/SearchResults'
import TicketForm from './Views/TicketForm'
import AIChat from './Views/AIChat'
import ArticleView from './Views/ArticleView'

const VIEWS: Record<string, React.ComponentType<any>> = {
  HOME: HomeView,
  SEARCH_RESULTS: SearchResults,
  TICKET_FORM: TicketForm,
  AI_CHAT: AIChat,
  ARTICLE_VIEW: ArticleView,
}

interface WidgetRootProps {
  isOpen: boolean
  onClose: () => void
}

export default function WidgetRoot({ isOpen, onClose }: WidgetRootProps) {
  const [currentView, setCurrentView] = useState(config.navigation.initialView)
  const [viewParams, setViewParams] = useState<any>({})

  const handleNavigate = (viewName: string, params: any = {}) => {
    setCurrentView(viewName)
    setViewParams(params)
  }

  const handleBack = () => {
    if (currentView === 'ARTICLE_VIEW' && viewParams.searchQuery && viewParams.filteredArticles) {
      handleNavigate('SEARCH_RESULTS', { 
        searchQuery: viewParams.searchQuery, 
        filteredArticles: viewParams.filteredArticles 
      })
    } else if (currentView === 'ARTICLE_VIEW') {
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

  const viewConfig = (config.navigation.views as any)[currentView] || (config.navigation.views as any).HOME
  const CurrentViewComponent = VIEWS[currentView] || HomeView

  const showBackButton = currentView === 'ARTICLE_VIEW'

  if (!isOpen) return null

  // Предотвращаем прокрутку фона при взаимодействии с виджетом
  const handleWidgetClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleWidgetWheel = (e: React.WheelEvent) => {
    e.stopPropagation()
  }

  return (
    <>
      {/* Backdrop blur overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[999] md:hidden"
        onClick={handleClose}
      />
      
      {/* Widget Window */}
      <div 
        className="fixed inset-0 md:inset-auto md:bottom-[24px] md:right-[24px] md:w-[380px] md:h-[600px] z-[1000] transition-all duration-300 ease-out"
        onClick={handleWidgetClick}
        onWheel={handleWidgetWheel}
      >
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
    </>
  )
}

