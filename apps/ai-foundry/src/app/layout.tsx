import type { Metadata } from 'next';
import './globals.css';

/**
 * Root Layout
 * 
 * Provides the base HTML structure and global styles
 * for all pages in the application.
 */

export const metadata: Metadata = {
  title: 'Repository Audit Agent v1.0',
  description: 'AI-powered repository analysis and architecture documentation',
  keywords: ['audit', 'repository', 'architecture', 'analysis'],
  authors: [{ name: 'Michael Flannery', url: 'https://github.com/legendarySavage52' }],
};

export interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Root Layout Component
 * 
 * @param {RootLayoutProps} props - Layout props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Root layout
 */
export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
