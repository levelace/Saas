'use client'

import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-80">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'flex items-start gap-3 p-4 rounded-lg border font-body text-sm animate-fade-up',
              t.type === 'success' && 'bg-cyan/10 border-cyan/30 text-white',
              t.type === 'error' && 'bg-red/10 border-red/30 text-white',
              t.type === 'info' && 'bg-card border-border-bright text-white',
            )}
          >
            <span className={cn(
              'text-xs mt-0.5',
              t.type === 'success' && 'text-cyan',
              t.type === 'error' && 'text-red',
              t.type === 'info' && 'text-amber',
            )}>
              {t.type === 'success' ? '✓' : t.type === 'error' ? '✗' : '▶'}
            </span>
            <span className="flex-1">{t.message}</span>
            <button onClick={() => remove(t.id)} className="text-muted hover:text-white transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
