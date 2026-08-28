"use client"

import TopBar from '@/components/top-bar'
import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowUpRight, FileImage, Filter, Search, Sparkles } from "lucide-react"

const groups = [
  { name: "CONVERT", tools: [["Convert JPG to PNG", "Re-encode JPEG files as lossless PNG while preserving transparency.", "/easy-png-tools/gradient"], ["Convert WebP to PNG", "Turn WebP images into a universal PNG format for any workflow."], ["PNG to Base64", "Encode an image as a base64 string for embedding in code or styles."], ["PNG to Data URI", "Build a complete data URI ready for HTML and CSS."], ["Convert PNG to JPG", "Composite transparency over a selected backdrop and export JPEG."]] },
  { name: "TRANSPARENCY", tools: [["Remove background PNG", "Remove a solid background by color, tolerance, or edge-connected regions.", "/easy-png-tools/background-remover"], ["Extract alpha mask", "Turn the alpha channel into a clean black-and-white mask."], ["Round corners PNG", "Clip the image corners by a precise radius percentage."], ["Outline PNG", "Add a colored ring around opaque content with adjustable thickness."], ["Change PNG opacity", "Multiply the alpha channel while keeping the original colors unchanged."]] },
  { name: "COLOR", tools: [["Create gradient PNG", "Generate a smooth transition between two colors with direction controls.", "/easy-png-tools/gradient"], ["Grayscale PNG", "Convert the image to luminance-based shades of gray."], ["Invert colors PNG", "Invert every color channel while leaving alpha untouched."], ["Brightness & contrast", "Adjust brightness and contrast across a controlled range."], ["Temperature PNG", "Make an image warmer or cooler with a single precise control."]] },
  { name: "GEOMETRY", tools: [["Resize PNG", "Scale an image with bilinear interpolation and optional aspect lock."], ["Crop PNG", "Cut a rectangular area with exact coordinates and dimensions."], ["Rotate PNG", "Rotate by 90, 180, or 270 degrees without quality loss."], ["Flip PNG", "Mirror the image horizontally or vertically."], ["Add padding to PNG", "Expand the canvas on all sides by a chosen number of pixels."]] },
  { name: "FILTERS", tools: [["Blur PNG", "Apply a fast Gaussian-style blur with transparent edge handling."], ["Sharpen PNG", "Emphasize edges with an adjustable sharpening kernel."], ["Vignette PNG", "Smoothly darken the image edges while preserving the center."], ["JPEG artifacts", "Simulate low-quality JPEG recompression for testing."]] },
  { name: "ANALYZE", tools: [["PNG info", "Inspect dimensions, alpha presence, and unique color count."], ["Check grayscale", "Report whether the image contains only shades of gray."], ["Check transparency", "Detect transparent and semi-transparent pixels."], ["PNG orientation", "Classify the image as portrait, landscape, or square."]] },
]

export default function ListToolsPage() {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState("ALL")
  const filtered = useMemo(() => groups.map(group => ({ ...group, tools: group.tools.filter(([name, description]) => (active === "ALL" || active === group.name) && `${name} ${description}`.toLowerCase().includes(query.toLowerCase())) })).filter(group => group.tools.length), [query, active])
  return <main className="app-shell"><TopBar section="CATALOG" status="LOCAL MODE / READY" /><div className="catalog-page">
    <div className="catalog-head"><div><div className="eyebrow">EASY-PNG-TOOLS / CATALOG</div><h1>Tool catalog</h1><p>Focused utilities for working with PNG. Inspect, transform, and export — locally in your browser.</p></div><div className="catalog-total"><b>32</b><span>TOOLS<br />AVAILABLE</span></div></div>
    <div className="catalog-toolbar"><label className="catalog-search"><Search size={16} /><input aria-label="Search tools" placeholder="Search tools..." value={query} onChange={e => setQuery(e.target.value)} /></label><div className="catalog-filters"><Filter size={15} />{["ALL", ...groups.map(g => g.name)].map(name => <button key={name} className={active === name ? "active" : ""} onClick={() => setActive(name)}>{name}</button>)}</div></div>
    <div className="catalog-groups">{filtered.map(group => <section className="catalog-group" key={group.name}><div className="group-title"><span>{group.name}</span><i>{String(group.tools.length).padStart(2, "0")} TOOLS</i></div><div className="tool-cards">{group.tools.map(([name, description, href], index) => <Link className="tool-card" href={href || "#"} key={name} onClick={e => { if (!href) e.preventDefault() }}><span className="tool-icon"><FileImage size={19} /></span><span className="tool-copy"><strong>{name}</strong><span>{description}</span></span><span className="tool-index">{String(index + 1).padStart(2, "0")}</span><ArrowUpRight size={16} className="tool-arrow" /></Link>)}</div></section>)}</div>
    {!filtered.length && <div className="catalog-empty"><Sparkles size={18} /> No tools match your search.</div>}
    <footer className="catalog-footer">ALL OPERATIONS RUN LOCALLY <span>•</span> YOUR FILES NEVER LEAVE THIS DEVICE</footer>
  </div></main>
}
