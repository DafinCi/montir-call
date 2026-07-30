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
