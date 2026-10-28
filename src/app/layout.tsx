import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import PageTransitions from '@/components/PageTransitions'
import Navbar from '@/components/Navbar'

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Connor Voelk',
  description: 'Portfolio and Resume for Connor Voelk',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={plusJakartaSans.variable}>
        <PageTransitions />
        <Navbar />
        {children}
      </body>
    </html>
  )
}
