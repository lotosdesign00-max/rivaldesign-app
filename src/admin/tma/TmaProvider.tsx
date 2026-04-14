import React, { useEffect, useState } from 'react'
import { initInitData } from '@telegram-apps/sdk-react'

export function TmaProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function authTma() {
      try {
        // Init Telegram SDK
        const initDataInfo = initInitData()
        if (!initDataInfo) {
          throw new Error("No Telegram Init Data available. Make sure this is running inside Telegram.")
        }

        const rawInitData = window.Telegram?.WebApp?.initData
        if (!rawInitData) {
          throw new Error("Cannot extract raw init data.")
        }

        // Call our serverless function securely
        const response = await fetch('/api/tma-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData: rawInitData })
        })

        const data = await response.json()
        if (!response.ok || !data.ok) {
          throw new Error(data.error || "Authentication failed")
        }

        setIsAdmin(true)
      } catch (err: any) {
        setError(err.message || "Unknown error")
      }
    }

    const isTelegramEnvironment = typeof window !== 'undefined' && window.Telegram?.WebApp
    if (isTelegramEnvironment) {
      authTma()
    } else {
      // If we are not in TMA, we just bypass and let Supabase Auth handle it (web dashboard mode)
      setIsAdmin(true)
    }
  }, [])

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4 text-center">
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-destructive max-w-sm">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (isAdmin === null) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Authorizing...</div>
  }

  return <>{children}</>
}
