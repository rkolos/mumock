'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Macro, MacroCategory, mockMacros } from '../../../data/macros'
import MacroCategoryDialog from '../MacroCategoryDialog'
import MacroDialog from '../MacroDialog'

export default function MacrosList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [showMacroDialog, setShowMacroDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingMacro, setEditingMacro] = useState<Macro | null>(null)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [macrosData, setMacrosData] = useState<MacroCategory[]>(mockMacros)

  // Получаем все макросы в плоском виде
  const allMacros = useMemo(() => {
    return macrosData.flatMap((cat) => cat.items)
  }, [macrosData])

  // Получаем список категорий
  const categories = useMemo(() => {
    return macrosData.map((cat) => cat.category)
  }, [macrosData])

  // Подсчет количества макросов по категориям
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    macrosData.forEach((cat) => {
      counts[cat.category] = cat.items.length
    })
    return counts
  }, [macrosData])

  // Фильтрация макросов
  const filteredMacros = useMemo(() => {
    let filtered = allMacros

    // Фильтр по категории
    if (selectedCategory) {
      filtered = filtered.filter((macro) => macro.category === selectedCategory)
    }

    // Фильтр по поисковому запросу
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (macro) =>
          macro.title.toLowerCase().includes(query) ||
          macro.text.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [allMacros, selectedCategory, searchQuery])

  // Сортировка по title
  const sortedMacros = useMemo(() => {
    return [...filteredMacros].sort((a, b) => a.title.localeCompare(b.title))
  }, [filteredMacros])

  // Пагинация
  const paginatedMacros = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    const end = start + rowsPerPage
    return sortedMacros.slice(start, end)
  }, [sortedMacros, currentPage, rowsPerPage])

  const totalPages = Math.ceil(sortedMacros.length / rowsPerPage)

  // Сброс страницы при изменении фильтров
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery])

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category)
  }

  const handleCreateCategory = () => {
    setEditingCategory(null)
    setShowCategoryDialog(true)
  }

  const handleEditCategory = (categoryName: string) => {
    setEditingCategory(categoryName)
    setShowCategoryDialog(true)
  }

  const handleDeleteCategory = (categoryName: string) => {
    const categoryData = macrosData.find((cat) => cat.category === categoryName)
    if (!categoryData) return

    const macroCount = categoryData.items.length
    if (macroCount > 0) {
      // Перемещаем макросы в "Uncategorized" или удаляем категорию из макросов
      const updatedMacros = macrosData.map((cat) => {
        if (cat.category === categoryName) {
          return {
            ...cat,
            items: cat.items.map((macro) => ({
              ...macro,
              category: 'Uncategorized',
            })),
          }
        }
        return cat
      })

      // Объединяем макросы в Uncategorized
      const uncategorizedIndex = updatedMacros.findIndex(
        (cat) => cat.category === 'Uncategorized'
      )
      if (uncategorizedIndex >= 0) {
        const uncategorized = updatedMacros[uncategorizedIndex]
        const deletedCategory = updatedMacros.find(
          (cat) => cat.category === categoryName
        )
        if (deletedCategory) {
          uncategorized.items.push(...deletedCategory.items)
        }
        updatedMacros.splice(
          updatedMacros.findIndex((cat) => cat.category === categoryName),
          1
        )
      } else {
        // Создаем Uncategorized если его нет
        const deletedCategory = updatedMacros.find(
          (cat) => cat.category === categoryName
        )
        if (deletedCategory) {
          updatedMacros.push({
            category: 'Uncategorized',
            items: deletedCategory.items.map((macro) => ({
              ...macro,
              category: 'Uncategorized',
            })),
          })
          updatedMacros.splice(
            updatedMacros.findIndex((cat) => cat.category === categoryName),
            1
          )
        }
      }

      setMacrosData(updatedMacros)
      if (selectedCategory === categoryName) {
        setSelectedCategory(null)
      }
    } else {
      // Просто удаляем категорию
      setMacrosData(macrosData.filter((cat) => cat.category !== categoryName))
      if (selectedCategory === categoryName) {
        setSelectedCategory(null)
      }
    }
  }

  const handleSaveCategory = (name: string) => {
    if (editingCategory) {
      // Редактирование категории - обновляем и категорию, и макросы в одном вызове
      setMacrosData((prev) =>
        prev.map((cat) => {
          if (cat.category === editingCategory) {
            return {
              ...cat,
              category: name,
              items: cat.items.map((macro) => ({
                ...macro,
                category: name,
              })),
            }
          }
          return cat
        })
      )
      if (selectedCategory === editingCategory) {
        setSelectedCategory(name)
      }
    } else {
      // Создание новой категории
      setMacrosData([...macrosData, { category: name, items: [] }])
    }
  }

  const handleCreateMacro = () => {
    setEditingMacro(null)
    setShowMacroDialog(true)
  }

  const handleEditMacro = (macro: Macro) => {
    setEditingMacro(macro)
    setShowMacroDialog(true)
  }

  const handleDeleteMacro = (macroId: number) => {
    setMacrosData(
      macrosData.map((cat) => ({
        ...cat,
        items: cat.items.filter((macro) => macro.id !== macroId),
      }))
    )
  }

  const handleSaveMacro = (
    macroData: Omit<Macro, 'id'> & { id?: number }
  ) => {
    if (editingMacro) {
      // Редактирование макроса
      const oldCategory = editingMacro.category
      const newCategory = macroData.category

      if (oldCategory === newCategory) {
        // Категория не изменилась - просто обновляем макрос
        setMacrosData(
          macrosData.map((cat) => ({
            ...cat,
            items: cat.items.map((macro) =>
              macro.id === editingMacro.id
                ? { ...macro, ...macroData }
                : macro
            ),
          }))
        )
      } else {
        // Категория изменилась - перемещаем макрос
        setMacrosData(
          macrosData.map((cat) => {
            if (cat.category === oldCategory) {
              return {
                ...cat,
                items: cat.items.filter((macro) => macro.id !== editingMacro.id),
              }
            }
            if (cat.category === newCategory) {
              return {
                ...cat,
                items: [
                  ...cat.items,
                  { ...editingMacro, ...macroData } as Macro,
                ],
              }
            }
            return cat
          })
        )

        // Если новая категория не существует, создаем её
        const categoryExists = macrosData.some(
          (cat) => cat.category === newCategory
        )
        if (!categoryExists) {
          setMacrosData((prev) => [
            ...prev,
            {
              category: newCategory,
              items: [{ ...editingMacro, ...macroData } as Macro],
            },
          ])
        }
      }
    } else {
      // Создание нового макроса
      const newId = Math.max(...allMacros.map((m) => m.id), 0) + 1
      const newMacro: Macro = {
        id: newId,
        ...macroData,
      }

      // Проверяем, существует ли категория
      const categoryExists = macrosData.some(
        (cat) => cat.category === macroData.category
      )

      if (categoryExists) {
        // Категория существует - добавляем макрос
        setMacrosData(
          macrosData.map((cat) =>
            cat.category === macroData.category
              ? { ...cat, items: [...cat.items, newMacro] }
              : cat
          )
        )
      } else {
        // Категория не существует - создаем новую категорию
        setMacrosData([...macrosData, { category: macroData.category, items: [newMacro] }])
      }
    }
  }

  const totalMacrosCount = allMacros.length

  return (
    <div className="flex h-full bg-[#f8fafc]">
      {/* Левая колонка: Категории */}
      <div className="w-[280px] bg-white border-r border-[#e2e8f0] flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Categories</h2>
          <button
            onClick={handleCreateCategory}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Add Category"
          >
            <Plus className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Список категорий */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <button
              onClick={() => handleCategorySelect(null)}
              className={`
                w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-colors
                ${
                  selectedCategory === null
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <span className="text-sm font-medium">All Macros</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {totalMacrosCount}
              </span>
            </button>

            {categories.map((category) => (
              <div
                key={category}
                className="relative group"
                onMouseEnter={() => setHoveredCategory(category)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <button
                  onClick={() => handleCategorySelect(category)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-colors
                    ${
                      selectedCategory === category
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-sm font-medium">{category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {categoryCounts[category] || 0}
                    </span>
                    {hoveredCategory === category && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditCategory(category)
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Edit Category"
                        >
                          <Edit className="h-3.5 w-3.5 text-gray-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteCategory(category)
                          }}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Правая колонка: Список макросов */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-[#e2e8f0] p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {selectedCategory ? `${selectedCategory} Macros` : 'All Macros'}
            </h2>
            <button
              onClick={handleCreateMacro}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Macro</span>
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search macros..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#e2e8f0] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Таблица */}
        <div className="flex-1 overflow-y-auto bg-white">
          {paginatedMacros.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-[#e2e8f0] sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Title
                    </th>
                    {!selectedCategory && (
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Category
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Preview
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#e2e8f0]">
                  {paginatedMacros.map((macro) => (
                    <tr
                      key={macro.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {macro.title}
                      </td>
                      {!selectedCategory && (
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {macro.category}
                          </span>
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div className="max-w-md truncate" title={macro.text}>
                          {macro.text.length > 100
                            ? `${macro.text.substring(0, 100)}...`
                            : macro.text}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditMacro(macro)}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            title="Edit Macro"
                          >
                            <Edit className="h-4 w-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteMacro(macro.id)}
                            className="p-1.5 hover:bg-red-100 rounded transition-colors"
                            title="Delete Macro"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <p className="text-sm">No macros found</p>
                {searchQuery && (
                  <p className="text-xs text-gray-400 mt-1">
                    Try adjusting your search query
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Пагинация */}
        {sortedMacros.length > 0 && (
          <div className="bg-white border-t border-[#e2e8f0] px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {paginatedMacros.length > 0
                ? `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(
                    currentPage * rowsPerPage,
                    sortedMacros.length
                  )} of ${sortedMacros.length}`
                : '0 of 0'}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="px-2 py-1 border border-[#e2e8f0] rounded text-sm text-gray-700 bg-white"
                >
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages || 1, p + 1))
                  }
                  disabled={currentPage >= totalPages}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Диалоги */}
      <MacroCategoryDialog
        isOpen={showCategoryDialog}
        onClose={() => {
          setShowCategoryDialog(false)
          setEditingCategory(null)
        }}
        onSave={handleSaveCategory}
        onDelete={
          editingCategory
            ? () => handleDeleteCategory(editingCategory)
            : undefined
        }
        categoryName={editingCategory || undefined}
        macroCount={
          editingCategory ? categoryCounts[editingCategory] || 0 : 0
        }
      />

      <MacroDialog
        isOpen={showMacroDialog}
        onClose={() => {
          setShowMacroDialog(false)
          setEditingMacro(null)
        }}
        onSave={handleSaveMacro}
        categories={categories}
        initialCategory={selectedCategory || undefined}
        macro={editingMacro || undefined}
      />
    </div>
  )
}

