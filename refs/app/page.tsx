'use client'

import { useMemo, useState } from 'react'
import { ArrowDownToLine, Check, ChevronDown, CircleHelp, Download, GripVertical, Link2, Moon, MoreHorizontal, Plus, RotateCcw, Settings2, SlidersHorizontal, Sun, Upload, X } from 'lucide-react'

const initialSteps = [
  { id: 1, title: 'Gradient background', type: 'BACKGROUND' },
  { id: 2, title: 'Remove background', type: 'TRANSFORM' },
  { id: 3, title: 'Add outline', type: 'STYLE' },
  { id: 4, title: 'Round corners', type: 'STYLE' },
]

function PreviewTile({ label, sublabel, style, active = false }: { label: string; sublabel: string; style: React.CSSProperties; active?: boolean }) {
  return <div className={`preview-tile ${active ? 'active' : ''}`}><div className="tile-canvas"><div className="image-preview" style={style}><span className="sample-icon">PNG</span><span>easy-png-tools</span></div></div><div className="tile-label"><span>{label}</span><b>{sublabel}</b></div></div>
}

export default function Page() {
  const [steps, setSteps] = useState(initialSteps)
  const [angle, setAngle] = useState(135)
  const [radius, setRadius] = useState(18)
  const [outline, setOutline] = useState(2)
  const [language, setLanguage] = useState('RU')
  const [dark, setDark] = useState(false)
  const [showIntermediate, setShowIntermediate] = useState(true)
  const [gradient, setGradient] = useState('#DCEBFF')
  const gradientStyle = useMemo(() => ({ background: `linear-gradient(${angle}deg, ${gradient}, #8BC8F5)` }), [angle, gradient])
  const finalStyle = { ...gradientStyle, borderRadius: radius, boxShadow: `0 0 0 ${outline}px #16202B` }

  return <main className={dark ? 'app-shell dark-mode' : 'app-shell'}>
    <header className="topbar"><div className="brand"><span className="brand-mark">EP</span><span>easy-png-tools</span><span className="version">/ DEMO</span></div><div className="top-actions"><span className="status"><i /> AUTO PIPELINE</span><button className="icon-btn" aria-label="Help"><CircleHelp size={17} /></button><button className="icon-btn" aria-label="Toggle theme" onClick={() => setDark(!dark)}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button><div className="language"><button className={language === 'RU' ? 'active' : ''} onClick={() => setLanguage('RU')}>RU</button><button className={language === 'EN' ? 'active' : ''} onClick={() => setLanguage('EN')}>EN</button></div></div></header>
    <div className="page-grid">
      <section className="workspace"><div className="eyebrow">PNG PROCESSING <span>/</span> WORKSPACE</div><div className="title-row"><div><h1>Build your image pipeline.</h1><p className="lede">Chain simple tools together. Every change is processed automatically and previewed at each stage.</p></div><div className="file-chip"><Upload size={15} /><span>source.png</span><b>1.8 MB</b></div></div>
        <div className="pipeline-head"><div><span className="label">PROCESSING PIPELINE</span><strong>{steps.length} active steps <em>• LIVE</em></strong></div><button className="add-btn" onClick={() => setSteps([...steps, { id: Date.now(), title: 'New adjustment', type: 'STYLE' }])}><Plus size={15} /> Add tool</button></div>
        <div className="steps-list">{steps.map((step, index) => <article className="step-card" key={step.id}><div className="step-index">{String(index + 1).padStart(2, '0')}</div><GripVertical className="drag" size={16} /><div className="step-body"><div className="step-heading"><div><span className="step-type">{step.type}</span><h2>{step.title}</h2></div><div className="step-tools"><span className="check"><Check size={12} /> AUTO</span><button aria-label="Remove step" onClick={() => setSteps(steps.filter(item => item.id !== step.id))}><X size={16} /></button><MoreHorizontal size={17} /></div></div>{index === 0 ? <div className="controls"><div className="control-block"><label>COLOR</label><div className="color-field"><span className="swatch" style={{ background: gradient }} /><input value={gradient} onChange={e => setGradient(e.target.value)} aria-label="Gradient color" /><ChevronDown size={14} /></div></div><div className="control-block"><label>DIRECTION <output>{angle}°</output></label><input type="range" min="0" max="360" value={angle} onChange={e => setAngle(Number(e.target.value))} /></div><div className="control-block"><label>OPACITY <output>100%</output></label><div className="segmented"><button className="selected">100</button><button>75</button><button>50</button><button>25</button></div></div></div> : index === 2 ? <div className="controls compact"><div className="control-block"><label>WIDTH <output>{outline}px</output></label><input type="range" min="0" max="8" value={outline} onChange={e => setOutline(Number(e.target.value))} /></div><div className="control-block"><label>COLOR</label><div className="color-field"><span className="swatch dark" /><input value="#16202B" readOnly /></div></div></div> : index === 3 ? <div className="controls compact"><div className="control-block"><label>RADIUS <output>{radius}px</output></label><input type="range" min="0" max="48" value={radius} onChange={e => setRadius(Number(e.target.value))} /></div><div className="toggle-row"><span>Preserve aspect ratio</span><button className="toggle on" aria-label="Preserve aspect ratio"><i /></button></div></div> : <div className="transform-note"><SlidersHorizontal size={15} /> Automatic subject detection enabled</div>}</div></article>)}</div>
        <div className="pipeline-footer"><button className="reset-btn" onClick={() => setSteps(initialSteps)}><RotateCcw size={14} /> Reset pipeline</button><span className="auto-note"><i /> changes are applied automatically</span></div>
      </section>
      <section className="preview-panel"><div className="preview-top"><div><span className="label">PIPELINE OUTPUTS</span><strong>Visual history</strong></div><div className="preview-actions"><button className="history-toggle top-toggle" onClick={() => setShowIntermediate(!showIntermediate)} aria-expanded={showIntermediate}>{showIntermediate ? 'Hide intermediate' : 'Show intermediate'} <ChevronDown size={15} className={showIntermediate ? 'rotated' : ''} /></button><button className="download-btn"><Download size={16} /> Download result <ArrowDownToLine size={14} /></button><div className="preview-meta"><div><span>DIMENSIONS</span><b>1200 × 800 px</b></div><div><span>FORMAT</span><b>PNG-24</b></div><div><span>SIZE</span><b>1.2 MB</b></div></div><button className="icon-btn" aria-label="Preview settings"><Settings2 size={17} /></button></div></div><div className="preview-stack"><PreviewTile label="SOURCE" sublabel="original.png · 1200 × 800" style={{ background: '#8d9aa5' }} />{showIntermediate && <><PreviewTile label="STEP 01" sublabel="gradient applied" style={gradientStyle} /><PreviewTile label="STEP 02" sublabel="background removed" style={{ ...gradientStyle, clipPath: 'inset(10% 8% 10% 8% round 12px)' }} /><PreviewTile label="STEP 03" sublabel="outline added" style={{ ...gradientStyle, boxShadow: `0 0 0 ${outline}px #16202B` }} /></>}<PreviewTile label="FINAL OUTPUT" sublabel="ready · PNG-24" style={finalStyle} active /></div><p className="preview-note">Output is generated in-browser. Your files never leave this device.</p></section>
    </div><footer className="footer"><span>easy-png-tools <b>v2.4.0</b></span><span><Link2 size={13} /> pipeline is local-only</span><span>© 2024</span></footer>
  </main>
}
