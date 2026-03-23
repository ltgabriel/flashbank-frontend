'use client'

import { Inter } from 'next/font/google'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <NuqsAdapter>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}