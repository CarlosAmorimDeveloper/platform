import type { Metadata } from 'next';
import ReduxProvider from '@/redux/ReduxProvider';
import { ThemeRegistry } from './ThemeRegistry';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tarefas',
  description: 'Aplicativo de gerenciamento de tarefas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeRegistry>
          <ReduxProvider>{children}</ReduxProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
