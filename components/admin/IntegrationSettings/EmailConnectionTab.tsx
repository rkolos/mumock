'use client'

import { useState } from 'react'
import { Integration, IntegrationSettings } from '../../../data/integrations'
import SecretField from './SecretField'
import TestConnectionButton from './TestConnectionButton'

interface EmailConnectionTabProps {
  integration: Integration
  settings: IntegrationSettings
  onSettingsChange: (settings: IntegrationSettings) => void
}

export default function EmailConnectionTab({
  integration,
  settings,
  onSettingsChange,
}: EmailConnectionTabProps) {
  const handleChange = (field: keyof IntegrationSettings, value: string | number) => {
    onSettingsChange({
      ...settings,
      [field]: value,
    })
  }

  const handleTestIMAP = async (): Promise<boolean> => {
    // TODO: Implement actual IMAP connection test
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return !!(settings.imap_server && settings.imap_username && settings.imap_password)
  }

  const handleTestSMTP = async (): Promise<boolean> => {
    // TODO: Implement actual SMTP connection test
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return !!(settings.smtp_server && settings.smtp_username && settings.smtp_password)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Email Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={settings.email_address || ''}
              onChange={(e) => handleChange('email_address', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="support@example.com"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">IMAP Settings (Incoming)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IMAP Server
            </label>
            <input
              type="text"
              value={settings.imap_server || ''}
              onChange={(e) => handleChange('imap_server', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="imap.example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IMAP Port
              </label>
              <input
                type="number"
                value={settings.imap_port || ''}
                onChange={(e) => handleChange('imap_port', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="993"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Security
              </label>
              <select
                value={settings.imap_security || 'ssl'}
                onChange={(e) => handleChange('imap_security', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ssl">SSL</option>
                <option value="tls">TLS</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={settings.imap_username || ''}
              onChange={(e) => handleChange('imap_username', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="support@example.com"
            />
          </div>

          <SecretField
            label="Password"
            value={settings.imap_password || ''}
            onChange={(value) => handleChange('imap_password', value)}
            placeholder="Enter IMAP password"
          />

          <TestConnectionButton onTest={handleTestIMAP} testType="imap" className="mt-4" />
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">SMTP Settings (Outgoing)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SMTP Server
            </label>
            <input
              type="text"
              value={settings.smtp_server || ''}
              onChange={(e) => handleChange('smtp_server', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="smtp.example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Port
              </label>
              <input
                type="number"
                value={settings.smtp_port || ''}
                onChange={(e) => handleChange('smtp_port', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="465"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Security
              </label>
              <select
                value={settings.smtp_security || 'ssl'}
                onChange={(e) => handleChange('smtp_security', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ssl">SSL</option>
                <option value="tls">TLS</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={settings.smtp_username || ''}
              onChange={(e) => handleChange('smtp_username', e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="support@example.com"
            />
          </div>

          <SecretField
            label="Password"
            value={settings.smtp_password || ''}
            onChange={(value) => handleChange('smtp_password', value)}
            placeholder="Enter SMTP password"
          />

          <TestConnectionButton onTest={handleTestSMTP} testType="smtp" className="mt-4" />
        </div>
      </div>

      {integration.connectionStatus === 'connected' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">Email connection active</span>
          </div>
          {integration.lastConnectedAt && (
            <div className="mt-2 text-sm text-green-700">
              <span className="font-medium">Last Connected:</span>{' '}
              {new Date(integration.lastConnectedAt).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
