import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'

type AdminPost = {
  id: string
  title: string
  status: 'draft' | 'published'
  published_at: string | null
  category: { name: string } | { name: string }[] | null
}

export default async function AdminPostsPage() {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('posts')
    .select('id, title, status, published_at, category:categories(name)')
    .order('created_at', { ascending: false })

  const posts = (data ?? []) as unknown as AdminPost[]

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#f4f4f5', letterSpacing: '-0.02em' }}>
            Posts
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#52525b' }}>
            {posts?.length ?? 0} total articles
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            backgroundColor: '#6366f1',
            color: '#fff',
            padding: '9px 16px',
            borderRadius: '8px',
            fontSize: '14px', fontWeight: 600,
            textDecoration: 'none',
            transition: 'background 0.15s',
          }}
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: '#0a0a0a',
        border: '1px solid #1f1f1f',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1f1f1f' }}>
              {['Title', 'Status', 'Category', 'Date', 'Actions'].map((h, i) => (
                <th key={h} style={{
                  padding: '12px 16px',
                  textAlign: i === 4 ? 'right' : 'left',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#52525b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  backgroundColor: '#0a0a0a',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts?.map((post, idx) => (
              <tr key={post.id} style={{
                borderBottom: idx < (posts.length - 1) ? '1px solid #1a1a1a' : 'none',
              }}>
                <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 500, color: '#e4e4e7', maxWidth: '320px' }}>
                  <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.title}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '3px 9px',
                    borderRadius: '5px',
                    fontSize: '12px', fontWeight: 500,
                    ...(post.status === 'published'
                      ? { backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }
                      : { backgroundColor: 'rgba(113,113,122,0.15)', color: '#71717a' }
                    )
                  }}>
                    <span style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      backgroundColor: post.status === 'published' ? '#10b981' : '#52525b'
                    }} />
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#71717a' }}>
                  {Array.isArray(post.category) ? post.category[0]?.name : post.category?.name || '—'}
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#52525b' }}>
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                    : '—'}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '30px', height: '30px',
                        borderRadius: '6px',
                        color: '#71717a',
                        textDecoration: 'none',
                        backgroundColor: 'transparent',
                        transition: 'background 0.15s',
                      }}
                      title="Edit"
                    >
                      <Edit size={15} />
                    </Link>
                    <form action={async () => {
                      'use server'
                      const sb = await createClient()
                      await sb.from('posts').delete().eq('id', post.id)
                      revalidatePath('/')
                      revalidatePath('/admin/posts')
                    }}>
                      <button type="submit" title="Delete" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '30px', height: '30px',
                        borderRadius: '6px',
                        color: '#71717a',
                        background: 'none', border: 'none',
                        cursor: 'pointer',
                      }}>
                        <Trash2 size={15} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {(!posts || posts.length === 0) && (
              <tr>
                <td colSpan={5} style={{ padding: '60px 16px', textAlign: 'center', color: '#52525b', fontSize: '14px' }}>
                  No posts yet. Create your first post to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
