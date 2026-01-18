'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

interface TestConnectionButtonProps {
  onTest: () => Promise<boolean>
  testType?: 'imap' | 'smtp' | 'default'
  className?: string
}

export default function TestConnectionButton({
  onTest,
  testType = 'default',
  className = '',
}: TestConnectionButtonProps) {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleTest = async () => {
    setStatus('testing')
    setErrorMessage('')
    try {
      const result = await onTest()
      setStatus(result ? 'success' : 'error')
      if (!result) {
        setErrorMessage('Connection failed. Please check your settings.')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Connection failed')
    }
  }

  const getButtonText = () => {
    if (testType === 'imap') return 'Test IMAP Connection'
    if (testType === 'smtp') return 'Test SMTP Connection'
    return 'Test Connection'
  }

  return (
    <div className={className}>
      <button
        onClick={handleTest}
        disabled={status === 'testing'}
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
          status === 'testing'
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : status === 'success'
            ? 'bg-green-600 text-white hover:bg-green-700'
            : status === 'error'
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-gray-600 text-white hover:bg-gray-700'
        }`}
      >
        {status === 'testing' && <Loader2 className="h-4 w-4 animate-spin" />}
        {status === 'success' && <CheckCircle2 className="h-4 w-4" />}
        {status === 'error' && <XCircle className="h-4 w-4" />}
        <span>{getButtonText()}</span>
      </button>
      {status === 'error' && errorMessage && (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      )}
      {status === 'success' && (
        <p className="mt-2 text-sm text-green-600">Connection successful!</p>
      )}
    </div>
  )
}
