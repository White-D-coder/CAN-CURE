import { Inter } from "next/font/google";
import "./globals.css";
import ChatBot from "../components/ChatBot";
import { AuthProvider } from "../contexts/AuthContext";
import { Navbar } from "../components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CanCure - Leveraging Science",
  description: "Scientific and pathology services for novel drug discoveries",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          {children}
          <div className="fixed bottom-0 right-0 m-4">
            <ChatBot />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
