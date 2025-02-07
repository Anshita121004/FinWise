import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const playfair_Display = Playfair_Display({ subsets: ["latin"] });

export const metadata = {
  title: "FinWise",
  description: "Track Your Expenses",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={playfair_Display.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
