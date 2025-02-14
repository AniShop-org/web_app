import localFont from "next/font/local";
import "./globals.css";
import { Suspense } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Ani Shop",
  description: "Ani Shop is a platform where you can find all anime merchandise.",
};

export default function RootLayout({ children }) {
  return (
    
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#191919]`}
      >
        <GoogleOAuthProvider clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}>
          <Suspense>
            {children}
          </Suspense>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
