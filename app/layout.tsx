import './globals.css';
import type { Metadata } from 'next';
import '@fontsource/noto-serif-display/400.css';
import '@fontsource/noto-serif-display/600.css';
import '@fontsource/outfit';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Real Estate Command Center',
  description: 'Internal real estate agent dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#fcfcfc]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
