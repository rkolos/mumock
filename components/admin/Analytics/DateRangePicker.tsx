'use client'

import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'
import { DateRange, DateRangePreset } from '../../../types/analytics'
import { getDateRangePreset } from '../../../utils/analyticsApi'

interface DateRangePickerProps {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
}

export default function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFrom, setLocalFrom] = useState(dateRange.from)
  const [localTo, setLocalTo] = useState(dateRange.to)
  const [localPreset, setLocalPreset] = useState<DateRangePreset>(dateRange.preset || '7d')
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const presets: { value: DateRangePreset; label: string }[] = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: 'custom', label: 'Custom' },
  ]
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])
  
  const handlePresetSelect = (preset: DateRangePreset) => {
    setLocalPreset(preset)
    
    if (preset === 'custom') {
      setIsOpen(true)
    } else {
      const range = getDateRangePreset(preset)
      setLocalFrom(range.from)
      setLocalTo(range.to)
      onDateRangeChange(range)
      setIsOpen(false)
    }
  }
  
  const handleCustomApply = () => {
    if (localFrom && localTo && localFrom <= localTo) {
      onDateRangeChange({
        from: localFrom,
        to: localTo,
        preset: 'custom',
      })
      setIsOpen(false)
    }
  }
  
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  
  const displayText = dateRange.preset === 'custom'
    ? `${formatDisplayDate(dateRange.from)} - ${formatDisplayDate(dateRange.to)}`
    : presets.find(p => p.value === dateRange.preset)?.label || 'Select period'
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-900">{displayText}</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-80 p-4">
          <div className="space-y-4">
            {/* Presets */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Quick Select</label>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handlePresetSelect(preset.value)}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      localPreset === preset.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Custom Date Range */}
            {localPreset === 'custom' && (
              <div className="space-y-3 pt-3 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
                  <input
                    type="date"
                    value={localFrom}
                    onChange={(e) => setLocalFrom(e.target.value)}
                    max={localTo || undefined}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="date"
                    value={localTo}
                    onChange={(e) => setLocalTo(e.target.value)}
                    min={localFrom || undefined}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleCustomApply}
                  disabled={!localFrom || !localTo || localFrom > localTo}
                  className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
