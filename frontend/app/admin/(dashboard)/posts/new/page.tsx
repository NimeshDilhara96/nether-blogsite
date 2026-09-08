import { createClient } from '@/lib/supabase/server'
import PostForm from '@/app/components/admin/PostForm'

export default async function NewPostPage() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">New Post</h1>
      <PostForm categories={categories || []} />
    </div>
  )
}
