// components/GithubSignInButton.tsx
import { signIn } from 'next-auth/react';

export function GithubSignInButton() {
  return (
    <button
      onClick={() => signIn('github')}
      type="button"
      className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded"
    >
      Sign in with GitHub
    </button>
  );
}