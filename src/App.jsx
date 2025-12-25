import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import WidgetRoot from './components/Widget/WidgetRoot'
import config from './widget-config.json'

function App() {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false)
  const primaryColor = config.branding.primaryColor

  const toggleWidget = () => {
    setIsWidgetOpen(!isWidgetOpen)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Support Widget Demo
        </h1>
        <p className="text-gray-600 mb-4">
          Виджет поддержки расположен в правом нижнем углу
        </p>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">О проекте</h2>
          <p className="text-gray-700">
            Это демонстрация интерактивного виджета поддержки с возможностью
            поиска по базе знаний, помощи ИИ и создания обращений.
          </p>
        </div>
      </div>

      {/* Launcher Button */}
      {!isWidgetOpen && (
        <button
          onClick={toggleWidget}
          className="fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all z-[999] flex items-center justify-center text-white"
          style={{ backgroundColor: primaryColor }}
          aria-label="Открыть виджет поддержки"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Widget Container */}
      <WidgetRoot isOpen={isWidgetOpen} onClose={() => setIsWidgetOpen(false)} />
    </div>
  )
}

export default App
