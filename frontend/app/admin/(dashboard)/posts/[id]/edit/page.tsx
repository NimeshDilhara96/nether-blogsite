import { createClient } from '@/lib/supabase/server'
import PostForm from '@/app/components/admin/PostForm'
import { notFound } from 'next/navigation'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [categoriesResponse, postResponse] = await Promise.all([
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('posts').select('*').eq('id', id).single()
  ])

  if (!postResponse.data) {
    notFound()
  }

  return (
    <PostForm
      categories={categoriesResponse.data || []}
      initialData={postResponse.data}
      postId={id}
    />
  )
}
