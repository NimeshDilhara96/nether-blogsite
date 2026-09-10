

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
  return (
    <div
      className={`flex items-center justify-center my-6 overflow-hidden ${className}`}
      data-ad-slot={slot}
      aria-label="Advertisement"
      style={{
        width: '100%',
        maxWidth: '100%',
        margin: '1.5rem auto',
      }}
    >
      {/* Adsterra 300x250 Banner Ad */}
      <div style={{ textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <iframe
          title="Advertisement"
          srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;padding:0;overflow:hidden;display:flex;justify-content:center;align-items:center;background:transparent;}</style></head><body><script type="text/javascript">atOptions = {'key' : '4bd30cd2632ba50a7d282d4875f124a7','format' : 'iframe','height' : 250,'width' : 300,'params' : {}};</script><script type="text/javascript" src="https://www.highrevenueformat.com/4bd30cd2632ba50a7d282d4875f124a7/invoke.js"></script></body></html>`}
          width="300"
          height="250"
          style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
          scrolling="no"
        />
      </div>
    </div>
  )
}
