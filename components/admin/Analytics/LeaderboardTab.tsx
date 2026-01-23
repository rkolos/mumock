'use client'

import { useState } from 'react'
import { Medal, Trophy, Award } from 'lucide-react'
import UpsellOverlay from './UpsellOverlay'
import { LeaderboardEntry, LeaderboardSortBy } from '../../../types/analytics'

interface LeaderboardTabProps {
  data: LeaderboardEntry[]
  sortBy: LeaderboardSortBy
  onSortChange: (sortBy: LeaderboardSortBy) => void
  isLeaderboardEnabled: boolean
}

export default function LeaderboardTab({
  data,
  sortBy,
  onSortChange,
  isLeaderboardEnabled,
}: LeaderboardTabProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) {
      return <Trophy className="h-5 w-5 text-yellow-500" />
    } else if (rank === 2) {
      return <Medal className="h-5 w-5 text-gray-400" />
    } else if (rank === 3) {
      return <Award className="h-5 w-5 text-orange-600" />
    }
    return null
  }
  
  return (
    <div className="space-y-6 relative">
      {!isLeaderboardEnabled && <UpsellOverlay feature="leaderboard" />}
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Top Users</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <div className="flex bg-gray-100 rounded-md p-1">
            <button
              onClick={() => onSortChange('messages')}
              className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
                sortBy === 'messages'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => onSortChange('channels')}
              className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
                sortBy === 'channels'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Channels Created
            </button>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Messages
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Channels Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((entry) => (
              <tr key={entry.userId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getRankIcon(entry.rank)}
                    <span className="text-sm font-medium text-gray-900">#{entry.rank}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img
                      src={entry.avatarUrl}
                      alt={entry.username}
                      className="h-10 w-10 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.username)}&background=random`
                      }}
                    />
                    <span className="text-sm font-medium text-gray-900">{entry.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{entry.messageCount.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{entry.channelsCreated.toLocaleString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
