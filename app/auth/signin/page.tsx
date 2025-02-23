'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <Button onClick={() => signIn('google', { callbackUrl: '/' })} className="w-full">
          Sign In with Google
        </Button>
      </div>
    </main>
  );
}