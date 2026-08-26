import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'easy-png-tools / Demo',
  description: 'Technical workspace for building PNG processing pipelines.',
  generator: 'easy-png-tools',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#eef1f4',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru" className="bg-background"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
