import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageTransition from "./components/page_transition";
import Head from "next/head";
import Footer from "./components/Footer";
import FloatingIcon from "./components/FloatingIcon"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AniTeams",
  description: "Watch Anime for free",
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon.png" />
        <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
        <script>eruda.init();</script>
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PageTransition>{children}</PageTransition>

        {/* Floating Icon */}
        <FloatingIcon />

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
