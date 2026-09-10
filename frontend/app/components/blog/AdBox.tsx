'use client'

import { useEffect, useRef } from 'react'

/**
 * AdBox — placeholder ad unit, individually numbered by slot.
 *
 * Each slot number maps to a unique ad placement so you can assign
 * a different ad (AdSense slot ID, network code, etc.) to each one.
 *
 * Current placements:
 *   Slot 1 — Home page:     Leaderboard between featured post and cards grid
 *   Slot 2 — Home page:     Large rectangle below cards grid
 *   Slot 3 — Sidebar:       300×250 medium rectangle below newsletter
 *   Slot 4 — Article page:  Leaderboard before article content
 *   Slot 5 — Article page:  Large rectangle after article content
 *
 * To activate Google AdSense for a specific slot, replace its inner <div> with:
 *   <ins className="adsbygoogle"
 *     style={{ display: 'block' }}
 *     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
 *     data-ad-slot="YOUR_SLOT_ID_HERE"
 *     data-ad-format="auto"
 *     data-full-width-responsive="true"
 *   />
 */

type AdSize = 'leaderboard' | 'rectangle' | 'largeRectangle' | 'square' | 'inline'

const dimensions: Record<AdSize, { w: string; h: string; label: string }> = {
  leaderboard:    { w: '100%',   h: '90px',  label: '728 × 90 — Leaderboard' },
  rectangle:      { w: '300px', h: '250px', label: '300 × 250 — Medium Rectangle' },
  largeRectangle: { w: '100%',  h: '280px', label: '336 × 280 — Large Rectangle' },
  square:         { w: '250px', h: '250px', label: '250 × 250 — Square' },
  inline:         { w: '100%',  h: '120px', label: 'Inline Ad' },
}

interface AdBoxProps {
  /** Unique slot number for this placement (1, 2, 3 …). Use this to map to your AdSense slot ID. */
  slot: number
  size?: AdSize
  className?: string
}

export default function AdBox({ slot, size = 'rectangle', className = '' }: AdBoxProps) {
  const { w, h, label } = dimensions[size]
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Dynamically inject the Monetag script to avoid React client rendering errors
    if (adRef.current && !adRef.current.querySelector('script')) {
      const script = document.createElement('script')
      script.src = 'https://5gvci.com/act/files/tag.min.js?z=11765206'
      script.async = true
      script.setAttribute('data-cfasync', 'false')
      adRef.current.appendChild(script)
    }
  }, [])

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl overflow-hidden ${className}`}
      data-ad-slot={slot}
      aria-label={`Advertisement slot ${slot}`}
      style={{
        width: w,
        minHeight: h,
        maxWidth: '100%',
        border: '1.5px dashed #3f3f46',
        backgroundColor: 'transparent',
        backgroundImage: `repeating-linear-gradient(
          45deg,
          rgba(100,116,139,0.04) 0px,
          rgba(100,116,139,0.04) 1px,
          transparent 1px,
          transparent 12px
        )`,
      }}
    >
      {/* Top label row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          borderBottom: '1px solid #3f3f46',
          padding: '5px 12px',
          marginBottom: '10px',
          boxSizing: 'border-box',
        }}
      >
        <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#71717a' }}>
          Advertisement
        </span>
        {/* Slot badge */}
        <span
          style={{
            fontSize: '9px', fontWeight: 700, letterSpacing: '0.05em',
            color: '#fff',
            backgroundColor: '#4595ff',
            borderRadius: '4px',
            padding: '1px 7px',
          }}
        >
          Ad {slot}
        </span>
      </div>

      {/* Monetag Ad Script Container */}
      <div ref={adRef} style={{ textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center' }}>
        {/* Script is injected here via useEffect */}
      </div>
    </div>
  )
}
