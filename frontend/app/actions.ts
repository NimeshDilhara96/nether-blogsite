'use server'

import { revalidatePath } from 'next/cache'

const SITEMAP_URL = 'https://netherx.mommentx.space/sitemap.xml'

export async function revalidateBlog() {
  revalidatePath('/')
  revalidatePath('/article/[slug]', 'page')
  revalidatePath('/category/[slug]', 'page')
  revalidatePath('/sitemap.xml')

  // Auto-ping Google to re-crawl sitemap after every publish/update
  try {
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`, {
      method: 'GET',
      cache: 'no-store',
    })
  } catch {
    // Non-critical — don't fail the publish if ping fails
  }
}

export async function pingGoogleNow(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`, {
      method: 'GET',
      cache: 'no-store',
    })
    if (res.ok) {
      return { success: true, message: 'Google pinged successfully! Sitemap re-crawl requested.' }
    }
    return { success: false, message: `Google returned status ${res.status}` }
  } catch (e) {
    return { success: false, message: `Ping failed: ${e}` }
  }
}
