'use client'

import { useMemo, useState } from 'react'
import { Download, Moon, RotateCcw, Sun, Upload, Check } from 'lucide-react'

export default function BackgroundRemoverPage() {
  const [color, setColor] = useState('#E8EEF2')
  const [similarity, setSimilarity] = useState(72)
  const [outerOnly, setOuterOnly] = useState(true)
  const [showMask, setShowMask] = useState(false)
  const [dark, setDark] = useState(true)
  const [downloaded, setDownloaded] = useState(false)
  const previewBackground = showMask ? 'repeating-conic-gradient(#7b8791 0 25%, #cbd3da 0 50%) 50% / 28px 28px' : 'repeating-conic-gradient(#d7dce0 0 25%, #f3f5f6 0 50%) 50% / 28px 28px'
  const subjectStyle = useMemo(() => ({ background: showMask ? '#596773' : 'linear-gradient(145deg,#1769d2 0 38%,#00a8c7 38% 66%,#bd7411 66%)', opacity: showMask ? .88 : 1, clipPath: `polygon(23% 11%, 73% 8%, 89% 30%, 79% 81%, 52% 93%, 17% 78%, 8% 39%)` }), [showMask])
  const reset = () => { setColor('#E8EEF2'); setSimilarity(72); setOuterOnly(true); setShowMask(false) }
  return <main className={`app-shell ${dark ? 'dark-mode' : ''}`}>
    <header className="topbar"><div className="brand"><span className="brand-mark">EP</span><span>easy-png-tools</span><span className="version">/ BACKGROUND REMOVER</span></div><div className="top-actions"><span className="status"><i /> AUTO PROCESSING</span><button className="icon-btn" aria-label="Toggle theme" onClick={() => setDark(!dark)}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button></div></header>
    <div className="tool-page"><div className="eyebrow">PNG PROCESSING <span>/</span> SINGLE TOOL</div><div className="tool-title"><div><h1>Remove background.</h1><p className="lede">Select a background color and tune the edge detection. Changes are processed automatically in your browser.</p></div><span className="tool-status"><i /> LIVE PREVIEW</span></div>
      <div className="remover-layout"><section className="settings-panel"><div className="panel-heading"><div><span className="label">REMOVER SETTINGS</span><strong>Configure detection</strong></div><span className="step-type">TOOL 02</span></div>
        <div className="setting-group"><label>BACKGROUND COLOR</label><div className="color-field"><span className="swatch" style={{ background: color }} /><input value={color} onChange={e => setColor(e.target.value)} /><input className="native-color" type="color" value={color} onChange={e => setColor(e.target.value)} aria-label="Choose background color" /></div><div className="color-reference"><span style={{ background: color }} /> sampled from image background</div></div>
        <div className="setting-group"><label>COLOR SIMILARITY <output>{similarity}%</output></label><input type="range" min="0" max="100" value={similarity} onChange={e => setSimilarity(Number(e.target.value))} /><div className="range-hints"><span>strict edges</span><span>more removal</span></div></div>
        <div className="setting-group toggle-group"><label><span>OUTER COLOR ONLY</span><input type="checkbox" checked={outerOnly} onChange={e => setOuterOnly(e.target.checked)} /><b className="toggle" /></label><p>Only remove connected background pixels from the edges.</p></div>
        <div className="setting-group toggle-group"><label><span>SHOW MASK</span><input type="checkbox" checked={showMask} onChange={e => setShowMask(e.target.checked)} /><b className="toggle" /></label><p>Preview the detected transparency mask.</p></div>
        <div className="settings-footer"><button className="reset-btn" onClick={reset}><RotateCcw size={14} /> Reset</button><span className="auto-note"><i /> updates automatically</span></div>
      </section>
      <section className="remover-preview"><div className="preview-toolbar"><div><span className="label">SOURCE / RESULT</span><strong>comparison.png</strong></div><div className="preview-actions"><span className="processed"><Check size={14} /> processed</span><button className="download-btn" onClick={() => setDownloaded(true)}><Download size={15} /> {downloaded ? 'Downloaded' : 'Download result'}</button></div></div><div className="comparison-grid"><div className="image-card"><div className="image-label"><span>SOURCE</span><b>original.png</b></div><div className="remover-canvas source-canvas"><div className="subject subject-source" style={subjectStyle}><span>OBJECT</span></div><span className="canvas-size">1200 × 800</span></div></div><div className="image-card"><div className="image-label"><span>RESULT</span><b>{showMask ? 'mask-preview.png' : 'removed-bg.png'}</b></div><div className="remover-canvas" style={{ background: previewBackground }}><div className="subject" style={subjectStyle}><span>{showMask ? 'MASK' : 'PNG'}</span></div><span className="canvas-size">1200 × 800</span></div></div></div><div className="result-meta"><span>FORMAT <b>PNG-24</b></span><span>ALPHA <b>{showMask ? 'MASK' : 'ENABLED'}</b></span><span>SIMILARITY <b>{similarity}%</b></span></div></section></div>
    </div><footer className="footer"><span>easy-png-tools <b>v2.4.0</b></span><span>background remover · local-only</span><span>© 2024</span></footer>
  </main>
}
