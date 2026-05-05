import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { GameProvider } from "@/contexts/GameContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import StructuredData from "@/components/StructuredData";
import HydrationFix from "@/components/HydrationFix";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://duetnightabyss.gachabuild.com'),
  title: "Duet Night Abyss Character Tier List & Guide Hub | Bảng xếp hạng và hướng dẫn nhân vật DNA",
  description: "Complete Duet Night Abyss character tier list, builds, and strategies. Find the best DNA characters ranked by effectiveness. Expert guides for Vanguard, Support, and Annihilator roles. | Bảng xếp hạng nhân vật Duet Night Abyss hoàn chỉnh, build và chiến thuật. Tìm nhân vật DNA tốt nhất được xếp hạng theo hiệu quả. Hướng dẫn chuyên gia cho vai trò Tiền phong, Hỗ trợ và Hủy diệt.",
  keywords: "Duet Night Abyss, DNA, character tier list, character guide, builds, strategies, vanguard, support, annihilator, gacha game, tier list, character database, game guide, bảng xếp hạng nhân vật, hướng dẫn nhân vật, build nhân vật, chiến thuật, tiền phong, hỗ trợ, hủy diệt, game gacha, cơ sở dữ liệu nhân vật, hướng dẫn game",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Duet Night Abyss Character Tier List & Guide Hub | Bảng xếp hạng và hướng dẫn nhân vật DNA",
    description: "Complete Duet Night Abyss character tier list, builds, and strategies. Find the best DNA characters ranked by effectiveness.",
    type: "website",
    locale: "en_US",
    url: "https://duetnightabyss.gachabuild.com",
    siteName: "Duet Night Abyss Guide Hub",
    images: [
      {
        url: "https://duetnightabyss.gachabuild.com/duetnightabyss.png",
        width: 1200,
        height: 630,
        alt: "Duet Night Abyss Character Tier List",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Duet Night Abyss Character Tier List & Guide Hub | Bảng xếp hạng và hướng dẫn nhân vật DNA",
    description: "Complete Duet Night Abyss character tier list, builds, and strategies. Find the best DNA characters ranked by effectiveness.",
    images: ["https://duetnightabyss.gachabuild.com/duetnightabyss.png"],
    creator: "@DuetNightAbyss",
    site: "@DuetNightAbyss",
  },
  alternates: {
    canonical: "https://duetnightabyss.gachabuild.com",
    languages: {
      'en-US': 'https://duetnightabyss.gachabuild.com',
      'vi-VN': 'https://duetnightabyss.gachabuild.com',
      'x-default': 'https://duetnightabyss.gachabuild.com',
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <StructuredData type="website" />
        <GoogleAnalytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Aggressive cleanup of browser extension attributes that cause hydration mismatches
              (function() {
                const attributesToRemove = ['bis_skin_checked', 'data-bis-skinned', 'autofilled', 'data-bis-ignore'];
                
                const cleanupAttributes = () => {
                  document.querySelectorAll('*').forEach(element => {
                    attributesToRemove.forEach(attr => {
                      if (element.hasAttribute(attr)) {
                        element.removeAttribute(attr);
                      }
                    });
                  });
                };
                
                // Run immediately and aggressively
                cleanupAttributes();
                
                // Run on DOM ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', cleanupAttributes);
                }
                
                // Run on window load
                window.addEventListener('load', cleanupAttributes);
                
                // Run immediately after React hydration
                setTimeout(cleanupAttributes, 100);
                setTimeout(cleanupAttributes, 500);
                setTimeout(cleanupAttributes, 1000);
                
                // Run periodically
                setInterval(cleanupAttributes, 2000);
                
                // Monitor DOM mutations aggressively
                if (typeof MutationObserver !== 'undefined') {
                  const observer = new MutationObserver((mutations) => {
                    let shouldCleanup = false;
                    mutations.forEach(mutation => {
                      if (mutation.type === 'attributes') {
                        const attrName = mutation.attributeName;
                        if (attributesToRemove.includes(attrName)) {
                          shouldCleanup = true;
                        }
                      }
                    });
                    if (shouldCleanup) {
                      cleanupAttributes();
                    }
                  });
                  
                  // Start observing as soon as body exists
                  const startObserving = () => {
                    if (document.body) {
                      observer.observe(document.body, { 
                        attributes: true, 
                        subtree: true, 
                        attributeFilter: attributesToRemove
                      });
                    } else {
                      setTimeout(startObserving, 10);
                    }
                  };
                  startObserving();
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
        suppressContentEditableWarning={true}
      >
        <HydrationFix />
        <GameProvider>
          <LanguageProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </LanguageProvider>
        </GameProvider>
      </body>
    </html>
  );
}
