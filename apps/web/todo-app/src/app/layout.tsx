import type { Metadata } from "next";
import ReduxProvider from "@/redux/ReduxProvider";

export const metadata: Metadata = {
  title: "Todo App",
  description: "Task management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
