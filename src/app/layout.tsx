import type { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import './globals.css';

export const metadata = {
  title: 'SaaS System',
  description: 'Управление производством',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body>
        <div className="flex">
          <Sidebar />
          <main className="flex-grow p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
