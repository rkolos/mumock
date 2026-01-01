'use client'

import { useState, useRef } from 'react'
import {
  Upload,
  File,
  Trash2,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { KnowledgeFile, FileType } from '../../../data/knowledgeBase'

interface FilesLibraryViewProps {
  files: KnowledgeFile[]
  onFileUpload: (files: File[]) => void
  onFileDelete: (id: string) => void
}

export default function FilesLibraryView({
  files,
  onFileUpload,
  onFileDelete,
}: FilesLibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const itemsPerPage = 10

  // Форматирование размера файла
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Форматирование даты
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Получение цвета статуса файла
  const getFileStatusBadge = (status: KnowledgeFile['status']) => {
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

  // Обработка выбора файлов
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    onFileUpload(selectedFiles)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(Array.from(e.dataTransfer.files))
    }
  }

  // Фильтрация файлов
  const filteredFiles = files.filter((file) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return file.name.toLowerCase().includes(query)
  })

  // Пагинация
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedFiles = filteredFiles.slice(startIndex, endIndex)

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="p-4 border-b border-[#e2e8f0] bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Files Library</h2>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Files</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search files"
            className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#F5F7FB] p-6">
        {/* Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors mb-6 ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.md,.txt"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              Drag & drop PDF, DOCX, MD, TXT files here to train the AI
            </p>
            <p className="text-xs text-gray-500">или нажмите для выбора файлов</p>
          </label>
        </div>

        {/* Files Table */}
        {filteredFiles.length > 0 ? (
          <>
            <div className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-[#e2e8f0]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        File Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#e2e8f0]">
                    {paginatedFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4 text-gray-600" />
                            <span className="font-medium text-gray-900">{file.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(file.uploadDate)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="px-4 py-3 text-sm">{getFileStatusBadge(file.status)}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const link = document.createElement('a')
                                link.href = '#'
                                link.download = file.name
                                link.click()
                              }}
                              className="text-gray-600 hover:text-gray-900 transition-colors"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Вы уверены, что хотите удалить этот файл?')) {
                                  onFileDelete(file.id)
                                }
                              }}
                              className="text-red-600 hover:text-red-700 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#e2e8f0] bg-white mt-4 rounded-b-lg">
                <div className="text-sm text-gray-600">
                  {startIndex + 1}-{Math.min(endIndex, filteredFiles.length)} of{' '}
                  {filteredFiles.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-[#e2e8f0] rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${
                              currentPage === page
                                ? 'bg-black text-white'
                                : 'text-gray-700 hover:bg-gray-100 border border-[#e2e8f0]'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-2 text-gray-500">
                            ...
                          </span>
                        )
                      }
                      return null
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-[#e2e8f0] rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-12 text-center">
            <File className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No files found' : 'Нет загруженных файлов'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Добавьте свой первый файл в базу знаний, используя форму загрузки выше'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

