const CMS_SESSION_KEY = 'cms_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

interface CMSSession {
  username: string
  token: string
  expiresAt: number
}

export function setCMSSession(username: string, token: string) {
  if (typeof window === 'undefined') return
  const session: CMSSession = {
    username,
    token,
    expiresAt: Date.now() + SESSION_DURATION,
  }
  localStorage.setItem(CMS_SESSION_KEY, JSON.stringify(session))
}

export function getCMSSession(): CMSSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CMS_SESSION_KEY)
    if (!raw) return null
    const session: CMSSession = JSON.parse(raw)
    if (Date.now() > session.expiresAt) {
      clearCMSSession()
      return null
    }
    return session
  } catch {
    return null
  }
}

export function clearCMSSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CMS_SESSION_KEY)
}

export function isCMSAuthenticated(): boolean {
  return getCMSSession() !== null
}
