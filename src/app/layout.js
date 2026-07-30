import { Arimo, Ubuntu } from "next/font/google";
import "./globals.css";

const arimo = Arimo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-arimo",
});

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "400", "500", "700"],
  display: "swap",
  variable: "--font-ubuntu",
});

export const metadata = {
  title: "MontirGO",
  description:
    "Helping mechanics respond faster with AI-powered service requests and real-time location tracking.",
  applicationName: "MontirGO",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MontirGO",
  },

  formatDetection: {
    telephone: false,
  },

  openGraph: {
    title: "MontirGo | AI-Powered Roadside Assistance Platform",
    description:
      "Connect nearby mechanics with customers through real-time service requests, AI-powered issue analysis, and live location tracking.",
    url: "https://montirgo.vercel.app",
    siteName: "MontirGo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MontirGo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "MontirGo | AI-Powered Roadside Assistance Platform",
    description:
      "Connect nearby mechanics with customers through real-time service requests, AI-powered issue analysis, and live location tracking.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${arimo.variable} ${ubuntu.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
