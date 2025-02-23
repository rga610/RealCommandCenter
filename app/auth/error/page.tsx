'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Adjust the import path as needed

export default function ErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="mb-4">An error occurred during the authentication process. Please try again.</p>
        {error && <p className="text-red-500 mb-4">Error: {error}</p>}
        <Button onClick={() => router.push('/auth/signin')} className="w-full">
          Go to Login
        </Button>
      </div>
    </main>
  );
}