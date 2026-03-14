import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function App({ Component, pageProps }: AppProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Service Worker registered:", registration);
          })
          .catch((error) => {
            console.log("Service Worker registration failed:", error);
          });
      });
    }

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  return (
    <AuthProvider>
      {showInstallPrompt && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-gradient-to-r from-slate-800 to-slate-900 border border-yellow-500/30 rounded-lg p-4 shadow-2xl animate-in slide-in-from-bottom">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-400 text-sm mb-1">
                📖 Install Bible Quiz Game
              </h3>
              <p className="text-xs text-slate-300">
                Add to your home screen for quick access and offline play!
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowInstallPrompt(false)}
                className="text-xs"
              >
                Later
              </Button>
              <Button
                size="sm"
                onClick={handleInstallClick}
                className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 text-xs"
              >
                Install
              </Button>
            </div>
          </div>
        </div>
      )}
      <Component {...pageProps} />
    </AuthProvider>
  );
}