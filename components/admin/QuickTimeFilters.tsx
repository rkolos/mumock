'use client'

interface QuickTimeFiltersProps {
  value: string
  onChange: (value: string) => void
  counts: {
    all: number
    '1h': number
    '6h': number
    '12h': number
    '24h': number
  }
}

type FilterOption = 'all' | '1h' | '6h' | '12h' | '24h'

export default function QuickTimeFilters({ value, onChange, counts }: QuickTimeFiltersProps) {
  const options: Array<{ value: FilterOption; label: string; color: string }> = [
    { value: '24h', label: '24h+', color: 'text-red-600' },
    { value: '12h', label: '12h+', color: 'text-orange-600' },
    { value: '6h', label: '6h+', color: 'text-yellow-600' },
    { value: '1h', label: '1h+', color: 'text-gray-600' },
    { value: 'all', label: 'All', color: 'text-gray-600' },
  ]

  return (
    <div className="flex items-center gap-0 bg-gray-50 rounded-md p-1">
      {options.map((option) => {
        const isActive = value === option.value
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              px-3 py-1.5 text-sm font-medium rounded transition-colors
              flex items-center gap-2
              ${
                isActive
                  ? 'bg-white text-gray-900 shadow-sm'
                  : `${option.color} hover:bg-gray-100`
              }
            `}
          >
            <span>{option.label}</span>
            <span
              className={`
                px-1.5 py-0.5 text-xs rounded
                ${
                  isActive
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-gray-200 text-gray-600'
                }
              `}
            >
              {counts[option.value]}
            </span>
          </button>
        )
      })}
    </div>
  )
}

