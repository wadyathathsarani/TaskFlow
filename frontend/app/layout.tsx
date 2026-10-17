import "./globals.css";
import ChatBot from "./components/ChatBot";
import { ThemeProvider } from "./ThemeProvider";

export const metadata = {
  title: "TaskFlow",
  description: "Modern project management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <ChatBot />
        </ThemeProvider>
      </body>
    </html>
  );
}