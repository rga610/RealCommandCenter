// app/auth/signin/page.tsx
'use client';

import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BRANDING } from "@/public/images/branding/branding";
import Image from "next/image";

export default function SignInPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      // Redirect to homepage if already signed in
      router.push("/");
    }
  }, [isSignedIn, router]);

  // Optionally render nothing or a loader while redirecting
  if (isSignedIn) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-primary-dark">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-8">
          <div className="relative w-64 h-20">
            <Image 
              src={BRANDING.logos.horizontalWhiteGold}
              alt="Luxury Living Costa Rica Logo" 
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-2xl">
          <h1 className="text-2xl font-serif text-center text-primary-dark mb-6">
            Command Center
          </h1>
          <SignIn
            path="/auth/signin"
            routing="path"
            signUpUrl="/auth/signup"
            redirectUrl="/"
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-accent-gold hover:bg-accent-gold-light text-primary-dark",
                footerActionLink: "text-accent-gold hover:text-accent-gold-light",
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
