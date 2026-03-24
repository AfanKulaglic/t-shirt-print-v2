import { createSupabaseAdmin } from '@/lib/supabase'

export type AppSettingsRow = {
  smtp_host?: string | null
  smtp_port?: number | null
  smtp_user?: string | null
  smtp_password?: string | null
  smtp_secure?: boolean | null
  smtp_from?: string | null
  order_notify_emails?: string | null
  updated_at: string
}

const EMAIL_SPLIT = /[\s,;]+/

function parseEmailList(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const part of raw.split(EMAIL_SPLIT)) {
    const t = part.trim()
    if (!t || seen.has(t.toLowerCase())) continue
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) continue
    seen.add(t.toLowerCase())
    out.push(t)
  }
  return out
}

export async function getOrderNotifyRecipients(): Promise<string[]> {
  const row = await getAppSettingsRow()
  const fromDb = parseEmailList(row?.order_notify_emails)
  if (fromDb.length > 0) return fromDb
  const env = process.env.ORDER_NOTIFY_EMAIL
  if (env?.trim()) return [env.trim()]
  return []
}

export async function getAppSettingsRow(): Promise<AppSettingsRow | null> {
  const supabase = createSupabaseAdmin()
  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('getAppSettingsRow:', error)
    return null
  }
  return data as AppSettingsRow | null
}

export async function getResolvedSmtpTransportOptions(): Promise<{
  host: string
  port: number
  secure: boolean
  auth: { user: string; pass: string }
  defaultFrom: string
}> {
  const row = await getAppSettingsRow()
  const dbHost = row?.smtp_host?.trim()

  if (dbHost) {
    const pass = row?.smtp_password || process.env.SMTP_PASS || ''
    const user = row?.smtp_user?.trim() || ''
    const port = row?.smtp_port ?? 465
    const secure = row?.smtp_secure ?? true
    const fromDb = row?.smtp_from?.trim()
    const defaultFrom =
      fromDb ||
      (user ? `Shirt Shop <${user}>` : undefined) ||
      process.env.SMTP_FROM ||
      'Shirt Shop <noreply@example.com>'
    return { host: dbHost, port, secure, auth: { user, pass }, defaultFrom }
  }

  return {
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
    defaultFrom: process.env.SMTP_FROM || 'Shirt Shop <noreply@example.com>',
  }
}
