'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface SecretFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
}

export default function SecretField({
  value,
  onChange,
  placeholder,
  label,
  className = '',
}: SecretFieldProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <div className="relative">
        <input
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-10 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
