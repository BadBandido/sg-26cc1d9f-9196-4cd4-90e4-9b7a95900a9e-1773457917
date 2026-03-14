import { useEffect, useRef, useState } from "react";

interface AdBannerProps {
  /**
   * Ad slot ID for Google AdSense/AdMob
   * Example: "1234567890"
   */
  slot?: string;
  
  /**
   * Ad format: "auto" (responsive), "horizontal", "vertical", "rectangle"
   */
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  
  /**
   * Ad network: "adsense" (default), "admob", "medianet", "custom"
   */
  network?: "adsense" | "admob" | "medianet" | "custom";
  
  /**
   * Custom ad HTML (for networks like PropellerAds, Ezoic, etc.)
   */
  customAdHtml?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * AdBanner Component - Displays advertisements from various networks
 * 
 * Setup Instructions:
 * 
 * 1. GOOGLE ADSENSE:
 *    - Sign up at https://www.google.com/adsense
 *    - Get approved (can take 1-2 weeks)
 *    - Create ad unit, get the ad slot ID
 *    - Add to environment variables:
 *      NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
 *    - Add AdSense script to _document.tsx (see below)
 * 
 * 2. GOOGLE ADMOB (for PWAs):
 *    - Sign up at https://admob.google.com
 *    - Create app (use your PWA URL)
 *    - Create ad unit, get ad unit ID
 *    - Add to environment:
 *      NEXT_PUBLIC_ADMOB_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX
 * 
 * 3. MEDIA.NET:
 *    - Sign up at https://www.media.net
 *    - Get approved
 *    - Copy ad tag code
 *    - Use customAdHtml prop
 * 
 * 4. OTHER NETWORKS (PropellerAds, Ezoic, etc.):
 *    - Copy their ad code
 *    - Use customAdHtml prop
 */
export function AdBanner({ 
  slot, 
  format = "auto", 
  network = "adsense",
  customAdHtml,
  className = "" 
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    // Don't load ads in development mode
    if (process.env.NODE_ENV === "development") {
      return;
    }

    // Load custom HTML ads
    if (network === "custom" && customAdHtml && adRef.current) {
      adRef.current.innerHTML = customAdHtml;
      setAdLoaded(true);
      return;
    }

    // Load Google AdSense/AdMob ads
    if ((network === "adsense" || network === "admob") && slot) {
      try {
        // @ts-expect-error - AdSense global object
        if (typeof window !== "undefined" && window.adsbygoogle) {
          // @ts-expect-error - pushing to AdSense array
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
        }
      } catch (error) {
        console.error("Ad loading error:", error);
        setAdError(true);
      }
    }
  }, [network, slot, customAdHtml]);

  // Development mode - show placeholder
  if (process.env.NODE_ENV === "development") {
    return (
      <div className={`bg-muted border-2 border-dashed border-border rounded-lg p-4 text-center ${className}`}>
        <p className="text-sm text-muted-foreground">
          📢 Ad Placeholder
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Ads will appear here in production
        </p>
      </div>
    );
  }

  // No ad configuration
  if (!slot && !customAdHtml) {
    return null;
  }

  // Ad failed to load
  if (adError) {
    return null;
  }

  // Google AdSense
  if (network === "adsense") {
    const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    
    if (!clientId) {
      console.warn("NEXT_PUBLIC_ADSENSE_CLIENT_ID not set in environment variables");
      return null;
    }

    return (
      <div className={`ad-banner-container ${className}`} ref={adRef}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Google AdMob
  if (network === "admob") {
    const appId = process.env.NEXT_PUBLIC_ADMOB_APP_ID;
    
    if (!appId) {
      console.warn("NEXT_PUBLIC_ADMOB_APP_ID not set in environment variables");
      return null;
    }

    return (
      <div className={`ad-banner-container ${className}`} ref={adRef}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={appId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Custom HTML ads (Media.net, PropellerAds, etc.)
  if (network === "custom") {
    return (
      <div 
        className={`ad-banner-container ${className}`} 
        ref={adRef}
        dangerouslySetInnerHTML={{ __html: customAdHtml || "" }}
      />
    );
  }

  return null;
}

/**
 * Convenience components for specific ad placements
 */

// Bottom banner ad (above navigation)
export function BottomAdBanner({ slot }: { slot?: string }) {
  return (
    <AdBanner 
      slot={slot} 
      format="horizontal" 
      className="w-full max-w-screen-xl mx-auto mb-2"
    />
  );
}

// In-content ad (between sections)
export function InContentAdBanner({ slot }: { slot?: string }) {
  return (
    <AdBanner 
      slot={slot} 
      format="rectangle" 
      className="w-full max-w-md mx-auto my-4"
    />
  );
}

// Sidebar ad (for desktop layouts)
export function SidebarAdBanner({ slot }: { slot?: string }) {
  return (
    <AdBanner 
      slot={slot} 
      format="vertical" 
      className="w-full max-w-xs"
    />
  );
}