
import './globals.css';
import { Providers } from '../components/utilities/providers';

export const metadata = {
  title: 'Todo App',
  description: 'A simple todo app built with Next.js, Tailwind, and MongoDB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
        <body>
          <Providers>
            <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-6 flex flex-col justify-center sm:py-12">{children}</div>
          </Providers>
        </body>
    </html>
  );
}

