import { getProviders } from "next-auth/react";
import CustomSignIn from '@/components/CustomSignIn';

export default async function SignInPage() {
  const providers = await getProviders();
  return <CustomSignIn providers={providers ?? {}} />;
}
