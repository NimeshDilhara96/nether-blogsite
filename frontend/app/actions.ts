'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateBlog() {
  revalidatePath('/')
  revalidatePath('/article/[slug]', 'page')
}
