"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Amplify } from "aws-amplify";
import { configureAmplify } from "./utils/auth";
import "./ui/globals.css";

const inter = Inter({ subsets: ["latin"] });

// Configure Amplify with our custom configuration
configureAmplify();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}