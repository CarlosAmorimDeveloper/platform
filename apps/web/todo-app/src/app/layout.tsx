import type { Metadata } from "next";
import ReduxProvider from "@/redux/ReduxProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tarefas",
  description: "Aplicativo de gerenciamento de tarefas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
