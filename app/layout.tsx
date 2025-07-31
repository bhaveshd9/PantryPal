import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pantry Tracker',
  description: 'Track your pantry items and expiration dates',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Global error handler to prevent [object Event] errors
              window.addEventListener('error', function(event) {
                if (event.error && typeof event.error === 'object' && event.error.toString() === '[object Event]') {
                  console.warn('Caught event object error:', event.error);
                  event.preventDefault();
                  return false;
                }
              });
              
              // Handle unhandled promise rejections
              window.addEventListener('unhandledrejection', function(event) {
                if (event.reason && typeof event.reason === 'object' && event.reason.toString() === '[object Event]') {
                  console.warn('Caught unhandled promise rejection with event object:', event.reason);
                  event.preventDefault();
                  return false;
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}