// app/auth/signup/page.tsx
'use client';

import { SignUp } from "@clerk/nextjs";
import { BRANDING } from '@/public/images/branding/branding';
import Image from 'next/image';

export default function SignUpPage() {
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
          <h1 className="text-2xl font-serif text-center text-primary-dark mb-6">
            Create Your Account
          </h1>
          <SignUp
            path="/auth/signup"
            routing="path"
            signInUrl="/auth/signin"
            redirectUrl="/"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-accent-gold hover:bg-accent-gold-light text-primary-dark',
                footerActionLink: 'text-accent-gold hover:text-accent-gold-light',
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}