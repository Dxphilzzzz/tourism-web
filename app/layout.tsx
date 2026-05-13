// ============================================================
// TourEase — Root Layout
// Providers, fonts, SEO, PWA
// ============================================================
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import { AuthProvider }  from '@/providers/auth-provider';
import { Toaster }       from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'TourEase — Discover the Philippines',
    template: '%s | TourEase',
  },
  description:
    'Community-powered tourism platform for discovering destinations, businesses, travel guides, and local experiences across the Philippines.',
  keywords: ['tourism', 'Philippines', 'travel', 'destinations', 'hotels', 'restaurants', 'tour guide'],
  authors: [{ name: 'TourEase Team' }],
  creator: 'TourEase',
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'TourEase',
    title: 'TourEase — Discover the Philippines',
    description: 'Community-powered tourism platform for the Philippines.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TourEase — Discover the Philippines',
    description: 'Community-powered tourism platform for the Philippines.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)',  color: '#0c4a6e' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              expand={false}
              toastOptions={{
                style: {
                  fontFamily: 'var(--font-sans)',
                  borderRadius: '0.625rem',
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
