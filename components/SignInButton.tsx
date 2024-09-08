// components/SignInButton.tsx
import { signIn } from 'next-auth/react';
import { GithubSignInButton } from './GithubSignInButton';

interface IProps {
  providers: {
    name: string;
    id: string;
  }[];
}


export function SignIn({ providers }: IProps) {
  return Object.values(providers).map((provider) => {
    if (provider.name === 'GitHub') {
      return <GithubSignInButton key={provider.name} />;
    }
    return (
      <div key={provider.name}>
        <button
          onClick={() => signIn(provider.id)}
          type="button"
          className="bg-green-300"
        >
          Sign in with {provider.name}
        </button>
      </div>
    );
  });
}