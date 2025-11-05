import { Providers } from '@/app/providers';
import { getFeatureFlags } from '@repo/analytics/server';
import { withAuth } from '@repo/auth/server';
import { getUrl } from '@repo/utils';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Urbanist } from 'next/font/google';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const urbanistSerif = Urbanist({
  variable: '--font-serif',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'StartupKit Next Template',
  description: '',
  metadataBase: new URL(getUrl()),
  openGraph: {
    title: 'StartupKit Next Template',
    description: '',
    url: getUrl(),
    siteName: 'StartupKit Next Template',
    images: [
      {
        url: '/hero/og.avif',
        width: 1200,
        height: 630,
        alt: 'StartupKit Next Template',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StartupKit Next Template',
    description: '',
    images: ['/hero/og.avif'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 'no',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await withAuth();
  const flags = await getFeatureFlags(user?.id);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${urbanistSerif.variable} antialiased`}
      >
        <Providers flags={flags} user={user}>
          <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-grow">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
