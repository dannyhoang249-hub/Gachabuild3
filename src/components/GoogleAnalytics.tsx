'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

function GoogleAnalyticsTracker({ measurementId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Get measurement ID from props or environment
  const GA_MEASUREMENT_ID = measurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Track page views on route change
  useEffect(() => {
    if (GA_MEASUREMENT_ID && typeof window !== 'undefined' && window.gtag) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });

      // Log for debugging (remove in production if desired)
      if (process.env.NODE_ENV === 'development') {
        console.log('[GA] Page view tracked:', url);
      }
    }
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);

  return null;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  // Get measurement ID from props or environment
  const GA_MEASUREMENT_ID = measurementId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Don't render if no measurement ID is provided
  if (!GA_MEASUREMENT_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Google Analytics: No measurement ID provided');
    }
    return null;
  }

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
            console.log('[GA] Initialized with ID: ${GA_MEASUREMENT_ID}');
          `,
        }}
      />
      {/* Wrap the tracker in Suspense for Next.js 15 compatibility */}
      <Suspense fallback={null}>
        <GoogleAnalyticsTracker measurementId={GA_MEASUREMENT_ID} />
      </Suspense>
    </>
  );
}

// Helper function to track custom events
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[GA] Event tracked:', eventName, eventParams);
    }
  }
};

// Predefined events for common actions
export const analytics = {
  // Character interactions
  viewCharacter: (characterName: string, slug: string) => {
    trackEvent('view_character', {
      character_name: characterName,
      character_slug: slug,
    });
  },

  // Search interactions
  search: (query: string, resultsCount: number) => {
    trackEvent('search', {
      search_term: query,
      results_count: resultsCount,
    });
  },

  // Filter usage
  useFilter: (filterType: string, filterValue: string) => {
    trackEvent('use_filter', {
      filter_type: filterType,
      filter_value: filterValue,
    });
  },

  // Navigation
  clickNavigation: (destination: string, origin: string) => {
    trackEvent('navigation_click', {
      destination,
      origin,
    });
  },

  // Tier list interactions
  viewTierList: () => {
    trackEvent('view_tier_list');
  },

  // External links
  clickExternalLink: (url: string, linkText: string) => {
    trackEvent('click', {
      link_url: url,
      link_text: linkText,
      outbound: true,
    });
  },
};

// TypeScript declarations for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

