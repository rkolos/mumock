'use client'

import { Lock, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UpsellOverlayProps {
  feature: 'analytics' | 'leaderboard'
}

export default function UpsellOverlay({ feature }: UpsellOverlayProps) {
  const router = useRouter()
  
  const featureName = feature === 'analytics' ? 'Detailed Analytics' : 'Leaderboard'
  
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Lock className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upgrade to Pro
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Unlock {featureName.toLowerCase()} including heatmaps, detailed activity charts, and leaderboards to better understand your community.
        </p>
        <button
          onClick={() => {
            // TODO: Navigate to upgrade page
            alert('Upgrade to Pro feature coming soon!')
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors font-medium"
        >
          Upgrade to Pro
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
