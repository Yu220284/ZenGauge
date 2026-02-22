import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth/auth-context'

export const metadata: Metadata = {
  title: 'ZenGauge - Find Your Inner Peace',
  description: 'Personalized zen meditation app',
  icons: {
    icon: '/ZenGauge_icon.png',
  },
  openGraph: {
    title: 'ZenGauge - Find Your Inner Peace',
    description: 'Personalized zen meditation app',
    images: ['/ZenGauge_icon.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZenGauge - Find Your Inner Peace',
    description: 'Personalized zen meditation app',
    images: ['/ZenGauge_icon.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
