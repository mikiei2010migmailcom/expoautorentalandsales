import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Top Auto Rental & Sales LLC | Quality Pre-Owned Vehicles in Lafayette, LA",
  description: "Top Auto Rental & Sales LLC offers quality pre-owned vehicles for sale and rent in Lafayette, LA. Browse our inventory of sedans, SUVs, trucks, and more. Flexible rental options available. Visit us at 815 SW Evangeline Thruway.",
  keywords: ["used cars Lafayette LA", "car rental Lafayette", "pre-owned vehicles", "auto sales Louisiana", "truck rental", "SUV for sale", "affordable cars", "Top Auto Rental", "vehicle financing", "used car dealership"],
  authors: [{ name: "Top Auto Rental & Sales LLC" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Top Auto Rental & Sales LLC | Quality Pre-Owned Vehicles",
    description: "Quality pre-owned vehicles for sale and rent in Lafayette, LA. Flexible options to suit your needs.",
    url: "https://topautorentals.com",
    siteName: "Top Auto Rental & Sales LLC",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Auto Rental & Sales LLC",
    description: "Quality pre-owned vehicles for sale and rent in Lafayette, LA",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://topautorentals.com",
  },
};

// JSON-LD Structured Data for Automotive Business
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  "name": "Top Auto Rental & Sales LLC",
  "image": "https://topautorentals.com/logo.svg",
  "url": "https://topautorentals.com",
  "telephone": "337-706-7863",
  "email": "nzenon@expoautos.net",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "815 SW Evangeline Thruway",
    "addressLocality": "Lafayette",
    "addressRegion": "LA",
    "postalCode": "70501",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 30.2241,
    "longitude": -92.0169
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "10:00",
      "closes": "16:00"
    }
  ],
  "priceRange": "$5,000 - $75,000",
  "servesCuisine": "Automotive Sales and Rental",
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 30.2241,
      "longitude": -92.0169
    },
    "geoRadius": "250 mi"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
