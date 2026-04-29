import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kredance | AI Automation, Web Development & Digital Marketing",
  description:
    "Kredance is a full-service digital agency specializing in AI automation, custom websites, SEO, eCommerce, and digital marketing solutions.",
  icons: {
    icon: "/black_no_bg.png",
  },
  other: {
    "theme-color": "#ffffff",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
