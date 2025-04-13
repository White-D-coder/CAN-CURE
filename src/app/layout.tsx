import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatBot from "../components/ChatBot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fusion - Leveraging Science",
  description: "Scientific and pathology services for novel drug discoveries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <div className="fixed bottom-0 right-0 m-4">
          <ChatBot />
        </div>
      </body>
    </html>
  );
}
