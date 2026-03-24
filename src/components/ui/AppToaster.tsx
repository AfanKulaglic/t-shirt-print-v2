'use client'

import { useEffect, useState } from 'react'
import hotToast, {
  Toaster,
  ToastBar,
  type Toast,
  type ToastPosition,
} from 'react-hot-toast'

const DEFAULT_POSITION: ToastPosition = 'bottom-right'

function useToastTimeLeftPercent(t: Toast) {
  const [pct, setPct] = useState(100)

  useEffect(() => {
    const duration = t.duration
    if (duration === Infinity || duration === undefined) {
      setPct(100)
      return
    }

    const tick = () => {
      const now = Date.now()
      const durationLeft = duration + t.pauseDuration - (now - t.createdAt)
      setPct(Math.max(0, Math.min(100, (durationLeft / duration) * 100)))
    }

    tick()
    const id = setInterval(tick, 48)
    return () => clearInterval(id)
  }, [t.id, t.duration, t.createdAt, t.pauseDuration])

  return pct
}

function ToastWithChrome({ toast: t }: { toast: Toast }) {
  const pct = useToastTimeLeftPercent(t)
  const pos = t.position || DEFAULT_POSITION
  const showBar =
    t.duration !== Infinity &&
    t.duration !== undefined &&
    t.type !== 'loading'

  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const fn = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  const dismiss = () => {
    hotToast.dismiss(t.id)
  }

  return (
    <ToastBar toast={t} position={pos}>
      {({ icon, message }) => (
        <button
          type="button"
          className="relative w-full min-w-0 cursor-pointer overflow-hidden rounded-[inherit] border-0 bg-transparent p-0 text-left font-inherit text-inherit"
          aria-label="Zatvori obavještenje"
          title="Klikni za zatvaranje"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            dismiss()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              dismiss()
            }
          }}
        >
          <div className="flex items-center gap-2 px-4 py-3 pr-3">
            {icon}
            <div className="min-w-0 flex-1">{message}</div>
          </div>
          {showBar && !reduceMotion && (
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-[3px] bg-black/25"
              aria-hidden
            >
              <div
                className="h-full rounded-sm bg-orange-400/90"
                style={{
                  transform: `scaleX(${pct / 100})`,
                  transformOrigin: 'right center',
                }}
              />
            </div>
          )}
        </button>
      )}
    </ToastBar>
  )
}

interface AppToasterProps {
  position?: ToastPosition
}

export function AppToaster({ position = DEFAULT_POSITION }: AppToasterProps) {
  return (
    <Toaster
      position={position}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1f2937',
          color: '#fff',
          borderRadius: '12px',
          padding: 0,
          overflow: 'hidden',
          maxWidth: 'min(100vw - 2rem, 420px)',
          boxShadow:
            '0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.15)',
        },
        success: {
          duration: 4000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          duration: 4500,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
        loading: {
          duration: Infinity,
        },
      }}
    >
      {(t) => <ToastWithChrome toast={t} />}
    </Toaster>
  )
}
