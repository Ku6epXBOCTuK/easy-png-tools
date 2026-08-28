"use client"

import Link from "next/link"
import { CircleHelp, Moon, Sun } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const links = [
  ["Workspace", "/"],
  ["Catalog", "/easy-png-tools/list-tools"],
  ["Gradient", "/easy-png-tools/gradient"],
  ["Background remover", "/easy-png-tools/background-remover"],
] as const

export function TopBar({ section = "WORKSPACE", status = "LOCAL MODE / READY" }: { section?: string; status?: string }) {
  const pathname = usePathname()
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem("ep-theme")
    const isDark = stored === "dark"
    setDark(isDark)
    document.documentElement.classList.toggle("dark-mode", isDark)
  }, [])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark-mode", next)
    window.localStorage.setItem("ep-theme", next ? "dark" : "light")
  }

  return <header className="topbar"><Link href="/" className="brand"><span className="brand-mark">EP</span><span>easy-png-tools</span><span className="version">/ {section}</span></Link><nav className="top-nav" aria-label="Primary navigation">{links.map(([label, href]) => <Link key={href} className={pathname === href ? "active" : ""} href={href}>{label}</Link>)}</nav><div className="top-actions"><span className="status"><i /> {status}</span><button className="icon-btn" aria-label="Help"><CircleHelp size={17} /></button><button className="icon-btn" aria-label="Toggle theme" onClick={toggleTheme}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button><div className="language"><button className="active">RU</button><span>/</span><button>EN</button></div></div></header>
}

export default TopBar
