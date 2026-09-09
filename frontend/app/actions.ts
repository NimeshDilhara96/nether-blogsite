'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateBlog() {
  // ISR cache clear — next visitor gets fresh content
  revalidatePath('/', 'page')
  revalidatePath('/article/[slug]', 'page')
  revalidatePath('/category/[slug]', 'page')
  revalidatePath('/sitemap.xml')
}
