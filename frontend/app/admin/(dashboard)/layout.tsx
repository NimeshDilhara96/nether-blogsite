import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { LogOut, FileText } from 'lucide-react'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  const { data: admin } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!admin) {
    notFound()
  }

  const initials = user.email?.charAt(0).toUpperCase() ?? 'A'
  const username = user.email?.split('@')[0] ?? ''

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#0f0f0f',
      color: '#e4e4e7',
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        flexShrink: 0,
        backgroundColor: '#0a0a0a',
        borderRight: '1px solid #1f1f1f',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #1f1f1f' }}>
          <Link href="/admin/posts" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '13px', color: '#fff',
              flexShrink: 0,
            }}>NX</div>
            <span style={{ fontWeight: 600, fontSize: '15px', color: '#f4f4f5', letterSpacing: '-0.01em' }}>
              Nether Admin
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: '6px' }}>
            Content
          </div>
          <Link href="/admin/posts" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 10px',
            borderRadius: '8px',
            textDecoration: 'none',
            color: '#a1a1aa',
            fontSize: '14px',
            fontWeight: 500,
            backgroundColor: '#1a1a1a',
            transition: 'background 0.15s',
          }}>
            <FileText size={16} style={{ color: '#6366f1' }} />
            Posts
          </Link>
        </nav>

        {/* User */}
        <div style={{ padding: '12px', borderTop: '1px solid #1f1f1f' }}>
          <div style={{
            backgroundColor: '#141414',
            borderRadius: '10px',
            border: '1px solid #1f1f1f',
            padding: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{
                width: '32px', height: '32px',
                backgroundColor: '#27272a',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 600, color: '#a1a1aa',
                flexShrink: 0,
              }}>
                {initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#f4f4f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {username}
                </div>
                <div style={{ fontSize: '11px', color: '#52525b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.email}
                </div>
              </div>
            </div>
            <form action="/auth/signout" method="post">
              <button style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                width: '100%', padding: '6px 8px',
                background: 'none', border: 'none',
                borderRadius: '6px',
                color: '#71717a', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer',
              }}>
                <LogOut size={14} />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', backgroundColor: '#0f0f0f' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 48px' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
