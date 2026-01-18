// Типы для виджета поддержки

export interface Article {
  id: number
  title: string
  snippet: string
  content: string
}

export interface FormFieldOption {
  value: string
  label: string
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'textarea' | 'dropdown' | 'radio' | 'checkbox' | 'date' | 'file'
  placeholder?: string
  required: boolean
  rows?: number
  options?: FormFieldOption[]
  validation?: {
    pattern?: string | RegExp
    message?: string
  }
}

export interface TicketCategory {
  id: string
  label: string
  fields: FormField[]
}

export interface WidgetTicketData {
  id: string
  token: string
  category: string
  formData: Record<string, string>
  attachments?: Array<{
    name: string
    size: number
  }>
  context?: {
    searchQuery?: string | null
    aiResponse?: string | null
    articleId?: number | null
    fromAI?: boolean
    fromArticle?: boolean
    aiFilledFields?: string[]
  }
  timestamp: string
}

export interface NavigationParams {
  query?: string
  searchQuery?: string
  article?: Article
  articleId?: number
  filteredArticles?: Article[]
  initialData?: Record<string, string>
  aiResponse?: string
  fromAI?: boolean
  fromArticle?: boolean
  fromSearch?: boolean
}

export interface ViewComponentProps {
  onNavigate: (view: string, params?: NavigationParams) => void
  params?: NavigationParams
  article?: Article
}

