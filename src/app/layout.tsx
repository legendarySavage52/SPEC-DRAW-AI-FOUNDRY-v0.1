// src/app/layout.tsx
import React from 'react';

export const metadata = {
  title: 'Agent-001 Audit',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>{children}</div>
      </body>
    </html>
  );
}
