import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic' // caching නවත්වන්න 

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Database එක active තියාගන්න පොඩි query එකක් run කරනවා
    const { data, error } = await supabase.from('categories').select('id').limit(1)

    if (error) {
      console.error('Keep-alive failed:', error.message)
      return NextResponse.json(
        { status: 'error', message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Supabase kept alive!',
      time: new Date().toISOString() 
    })
    
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
