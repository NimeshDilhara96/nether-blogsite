'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // We run this once when the component mounts
    const trackView = async () => {
      const supabase = createClient();
      // Call the increment_view_count RPC function in Supabase
      await supabase.rpc('increment_view_count', { post_slug: slug });
    };

    // Use a small delay so we don't block immediate rendering, and only fire for true page views
    const timer = setTimeout(() => {
      trackView();
    }, 2000);

    return () => clearTimeout(timer);
  }, [slug]);

  // This component doesn't render anything
  return null;
}
