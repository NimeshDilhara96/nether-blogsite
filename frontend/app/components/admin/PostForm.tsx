'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import TiptapEditor from './TiptapEditor'
import { Save, Upload, ArrowLeft } from 'lucide-react'
import { revalidateBlog } from '@/app/actions'
import Link from 'next/link'

type Category = { id: string; name: string }

interface PostFormProps {
  categories: Category[]
  initialData?: any
  postId?: string
}

const label: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: '#71717a',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#111',
  border: '1px solid #27272a',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '14px',
  color: '#e4e4e7',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s',
}

const card: React.CSSProperties = {
  backgroundColor: '#0a0a0a',
  border: '1px solid #1f1f1f',
  borderRadius: '12px',
  padding: '20px',
}

export default function PostForm({ categories, initialData, postId }: PostFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [categoryId, setCategoryId] = useState(initialData?.category_id || (categories[0]?.id || ''))
  const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status || 'draft')
  const [featuredImage, setFeaturedImage] = useState(initialData?.featured_image || '')
  const [loading, setLoading] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!postId && title) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }
  }, [title, postId])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImg(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `featured-${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from('blog-images').upload(fileName, file)
    if (uploadError) { setError(uploadError.message); setUploadingImg(false); return }
    const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName)
    setFeaturedImage(data.publicUrl)
    setUploadingImg(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const postData = {
      title, slug, excerpt, content,
      category_id: categoryId, status,
      featured_image: featuredImage,
      updated_at: new Date().toISOString(),
      ...(status === 'published' && !initialData?.published_at ? { published_at: new Date().toISOString() } : {})
    }
    let resultError = null
    if (postId) {
      const { error } = await supabase.from('posts').update(postData).eq('id', postId)
      resultError = error
    } else {
      const { error } = await supabase.from('posts').insert([postData])
      resultError = error
    }
    if (resultError) {
      setError(resultError.message)
      setLoading(false)
    } else {
      await revalidateBlog()
      router.push('/admin/posts')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/admin/posts" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '32px', height: '32px', borderRadius: '8px',
            backgroundColor: '#141414', border: '1px solid #1f1f1f',
            color: '#71717a', textDecoration: 'none',
          }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#f4f4f5', letterSpacing: '-0.02em' }}>
              {postId ? 'Edit Post' : 'New Post'}
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#52525b' }}>
              {postId ? 'Update your article' : 'Create a new article'}
            </p>
          </div>
        </div>
        <button type="submit" disabled={loading} style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          backgroundColor: loading ? '#3730a3' : '#6366f1',
          color: '#fff',
          border: 'none',
          padding: '9px 18px',
          borderRadius: '8px',
          fontSize: '14px', fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.15s',
        }}>
          <Save size={15} />
          {loading ? 'Saving...' : (postId ? 'Update Post' : 'Publish Post')}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          color: '#f87171',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          marginBottom: '20px',
        }}>
          {error}
        </div>
      )}

      {/* Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title */}
          <div style={card}>
            <label style={label}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title..."
              required
              style={{ ...inputStyle, fontSize: '16px', fontWeight: 500 }}
              onFocus={e => (e.target.style.borderColor = '#6366f1')}
              onBlur={e => (e.target.style.borderColor = '#27272a')}
            />
          </div>

          {/* Excerpt */}
          <div style={card}>
            <label style={label}>Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="A short description shown in previews and SEO..."
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => (e.target.style.borderColor = '#6366f1')}
              onBlur={e => (e.target.style.borderColor = '#27272a')}
            />
          </div>

          {/* Content */}
          <div style={card}>
            <label style={label}>Content</label>
            <TiptapEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '24px' }}>
          {/* Status & Slug */}
          <div style={card}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#a1a1aa', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #1a1a1a' }}>
              Settings
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={label}>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label style={label}>Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '12px' }}
                  onFocus={e => (e.target.style.borderColor = '#6366f1')}
                  onBlur={e => (e.target.style.borderColor = '#27272a')}
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div style={card}>
            <label style={label}>Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Featured Image */}
          <div style={card}>
            <label style={label}>Cover Image</label>
            {featuredImage && (
              <div style={{
                aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden',
                backgroundColor: '#111', marginBottom: '12px',
                border: '1px solid #1f1f1f',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featuredImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
              padding: '9px 14px',
              backgroundColor: '#141414',
              border: '1px solid #27272a',
              borderRadius: '8px',
              color: '#71717a',
              fontSize: '13px', fontWeight: 500,
              cursor: 'pointer',
            }}>
              <Upload size={14} />
              {uploadingImg ? 'Uploading...' : (featuredImage ? 'Change Image' : 'Upload Image')}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={uploadingImg} />
            </label>
          </div>
        </div>
      </div>
    </form>
  )
}
