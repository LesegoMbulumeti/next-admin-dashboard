"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import "./ui/globals.css";
const inter = Inter({ subsets: ["latin"] });

Amplify.configure(outputs);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <Authenticator.Provider>
            <Authenticator>
              {({ signOut, user }) => <>{children}</>}
            </Authenticator>
          </Authenticator.Provider>
      </body>
    </html>
  );
}
