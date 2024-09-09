'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ClientSafeProvider } from "next-auth/react";

export default function CustomSignIn({ providers }: { providers: Record<string, ClientSafeProvider> }) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='p-8 bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold mb-4'>Sign In</h1>
        {Object.values(providers).map((provider) => (
          <Button
            key={provider.id}
            onClick={() => signIn(provider.id, { callbackUrl: '/' })}
            className="mb-2"
          >
            Sign in with {provider.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
