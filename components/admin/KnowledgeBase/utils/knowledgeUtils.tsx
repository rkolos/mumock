import React from 'react'
import { KnowledgeFile, FileStatus, FileType, IndexStatus } from '../../../../data/knowledgeBase'

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatRelativeDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    if (!dateString.includes('T') && !dateString.includes(' ')) {
      date.setHours(0, 0, 0, 0)
    }
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  } catch {
    return dateString
  }
}

export const getFileStatusBadge = (status: FileStatus) => {
  switch (status) {
    case 'active':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      )
    case 'indexing':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
          Indexing
        </span>
      )
    case 'error':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
          Error
        </span>
      )
  }
}

export const getIndexStatus = (files: KnowledgeFile[]): { status: IndexStatus; label: string; icon: JSX.Element } => {
  const indexingFilesCount = files.filter((f) => f.status === 'indexing').length
  
  if (indexingFilesCount > 0) {
    return {
      status: 'indexing',
      label: `Indexing... (${indexingFilesCount} items pending)`,
      icon: <span className="text-xl">🟡</span>,
    }
  }
  if (files.some((f) => f.status === 'error')) {
    return {
      status: 'error',
      label: 'Error (Check Logs)',
      icon: <span className="text-xl">🔴</span>,
    }
  }
  return {
    status: 'synced',
    label: 'Synced (Все данные векторизованы)',
    icon: <span className="text-xl">🟢</span>,
  }
}

export const getFirstLine = (body: string): string => {
  const firstLine = body.split('\n')[0].trim()
  if (!firstLine) return 'Untitled'
  return firstLine.replace(/^#+\s*/, '')
}

export const getSnippet = (text: string, maxLength: number = 120): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const getFileTypeFromExtension = (extension: string): FileType => {
  if (extension === 'pdf') return 'pdf'
  if (extension === 'docx') return 'docx'
  if (extension === 'md') return 'md'
  if (extension === 'txt') return 'txt'
  return 'txt'
}

