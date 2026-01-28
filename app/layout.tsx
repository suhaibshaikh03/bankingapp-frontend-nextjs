import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBarWithBlur from "./components/NavBarWithBlur";
import Footer from "./components/Footer"
import AuthWrapper from "../components/AuthWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "S2Pay",
  description: "Secure payment platform",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        <AuthWrapper>
          <NavBarWithBlur>
            {children}
          </NavBarWithBlur>
          <Footer/>
        </AuthWrapper>
      </body>
    </html>
  );
}
