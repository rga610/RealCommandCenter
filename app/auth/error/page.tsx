// app/auth/error/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { BRANDING } from '@/public/images/branding/branding';
import Image from 'next/image';

export default function ErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <main className="min-h-screen flex items-center justify-center bg-primary-dark">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-8">
          <div className="relative w-64 h-20">
            <Image 
              src={BRANDING.logos.horizontalWhiteGold}
              alt="Luxury Living Costa Rica Logo" 
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-2xl">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertCircle size={48} />
          </div>
          <h1 className="text-2xl font-serif text-center text-primary-dark mb-4">Authentication Error</h1>
          <p className="text-center mb-6 text-gray-600">
            {error || "An error occurred during the authentication process. Please try again."}
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={() => router.push('/auth/signin')} 
              className="bg-accent-gold hover:bg-accent-gold-light text-primary-dark"
            >
              Return to Login
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}