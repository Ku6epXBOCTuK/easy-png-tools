'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronDown, Copy, Download, Moon, RotateCcw, Sun } from 'lucide-react'

const directions = ['0° →', '45° ↗', '90° ↑', '135° ↖', '180° ←', '225° ↙', '270° ↓', '315° ↘']

export default function GradientPage() {
  const [start, setStart] = useState('#1769D2')
  const [end, setEnd] = useState('#00A8C7')
  const [direction, setDirection] = useState(135)
  const [opacity, setOpacity] = useState(100)
  const [type, setType] = useState<'linear' | 'radial'>('linear')
  const [dark, setDark] = useState(true)
  const [copied, setCopied] = useState(false)
  const gradient = useMemo(() => type === 'linear' ? `linear-gradient(${direction}deg, ${start} 0%, ${end} 100%)` : `radial-gradient(circle, ${start} 0%, ${end} 100%)`, [direction, end, start, type])
  const css = `background: ${gradient};\nopacity: ${opacity / 100};`
  const reset = () => { setStart('#1769D2'); setEnd('#00A8C7'); setDirection(135); setOpacity(100); setType('linear') }
  const copyCss = async () => { await navigator.clipboard?.writeText(css); setCopied(true); setTimeout(() => setCopied(false), 1400) }
  return <main className={`app-shell ${dark ? 'dark-mode' : ''}`}>
    <header className="topbar"><div className="brand"><span className="brand-mark">EP</span><span>easy-png-tools</span><span className="version">/ GRADIENT</span></div><div className="top-actions"><button className="icon-btn" aria-label="Toggle theme" onClick={() => setDark(!dark)}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button></div></header>
    <div className="tool-page"><div className="eyebrow">PNG PROCESSING <span>/</span> SINGLE TOOL</div><div className="tool-title"><div><h1>Gradient background.</h1><p className="lede">Create a clean, export-ready gradient with precise control over color, direction and transparency.</p></div><span className="tool-status"><i /> LIVE PREVIEW</span></div>
      <div className="gradient-layout"><section className="settings-panel"><div className="panel-heading"><div><span className="label">GRADIENT SETTINGS</span><strong>Configure output</strong></div><span className="step-type">TOOL 01</span></div>
        <div className="setting-group"><label>GRADIENT TYPE</label><div className="segmented wide"><button className={type === 'linear' ? 'selected' : ''} onClick={() => setType('linear')}>Linear</button><button className={type === 'radial' ? 'selected' : ''} onClick={() => setType('radial')}>Radial</button></div></div>
        <div className="setting-group"><label>COLOR STOPS</label><div className="color-row"><div className="color-field"><span className="swatch" style={{ background: start }} /><input value={start} onChange={e => setStart(e.target.value)} /></div><span className="stop-arrow">→</span><div className="color-field"><span className="swatch" style={{ background: end }} /><input value={end} onChange={e => setEnd(e.target.value)} /></div></div><div className="gradient-bar" style={{ background: gradient }} /></div>
        <div className="setting-group"><label>DIRECTION <output>{direction}°</output></label><input type="range" min="0" max="360" value={direction} onChange={e => setDirection(Number(e.target.value))} /><div className="direction-grid">{directions.map((item, i) => <button key={item} className={direction === i * 45 ? 'selected' : ''} onClick={() => setDirection(i * 45)}>{item}</button>)}</div></div>
        <div className="setting-group"><label>OPACITY <output>{opacity}%</output></label><input type="range" min="0" max="100" value={opacity} onChange={e => setOpacity(Number(e.target.value))} /></div>
        <div className="settings-footer"><button className="reset-btn" onClick={reset}><RotateCcw size={14} /> Reset</button><span className="auto-note"><i /> updates automatically</span></div>
      </section>
      <section className="gradient-preview"><div className="preview-toolbar"><div><span className="label">OUTPUT PREVIEW</span><strong>gradient.png</strong></div><div className="preview-actions"><button className="secondary-btn" onClick={copyCss}>{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy CSS'}</button><button className="download-btn"><Download size={15} /> Download PNG <ChevronDown size={14} /></button></div></div><div className="large-canvas"><div className="gradient-art" style={{ background: gradient, opacity: opacity / 100 }}><div className="art-mark">PNG</div><span>easy-png-tools</span></div></div><div className="code-block"><div><span className="label">GENERATED CSS</span><button className="icon-btn" onClick={copyCss} aria-label="Copy CSS"><Copy size={14} /></button></div><pre>{css}</pre></div></section></div>
    </div><footer className="footer"><span>easy-png-tools <b>v2.4.0</b></span><span>gradient tool · local-only</span><span>© 2024</span></footer>
  </main>
}
