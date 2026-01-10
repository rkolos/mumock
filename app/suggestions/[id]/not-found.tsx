'use client'

import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Suggestion Not Found</h2>
        <p className="text-gray-600 mb-6">The suggestion you're looking for doesn't exist.</p>
        <button
          onClick={() => router.push('/suggestions')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Suggestions
        </button>
      </div>
    </div>
  )
}

