import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
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
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <ReduxProvider>{children}</ReduxProvider>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
