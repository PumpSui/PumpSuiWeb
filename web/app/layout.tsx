import {Inter} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Metadata } from "next";
import "github-markdown-css/github-markdown.css";
import { Analytics } from "@vercel/analytics/react";
import localFont from "next/font/local";

const inter = Inter({ subsets: ["latin"] });

const Jaro = localFont({
  src: "./fonts/Jaro-Regular-VariableFont_opsz.ttf",
  variable: "--font-jaro-regular",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Boment",
  description: "Let's Bome Movement Together!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${Jaro.variable}`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics></Analytics>
      </body>
    </html>
  );
}

