// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import '@fontsource/noto-serif-display/400.css';
import '@fontsource/noto-serif-display/600.css';
import '@fontsource/outfit';

import { ClerkProvider } from '@clerk/nextjs';
import { Providers } from './providers';
import Header from '@/components/core/Header'; 
// ^ or wherever your custom Header is located

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
    <ClerkProvider>
      <html lang="en">
        <body className="bg-[#fcfcfc]">
          {/* Use your custom header globally */}
          <Header />
          {/* Then the rest of your app */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
