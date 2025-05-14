"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { store } from "@/store/store";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { WebSocketProvider } from "@/context/WebSocketContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <WebSocketProvider>
        <Provider store={store}>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {children}
            <Toaster richColors />
          </body>
        </Provider>
      </WebSocketProvider>
    </html>
  );
}
