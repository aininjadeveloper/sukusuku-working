import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen, ArrowLeft, CreditCard } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { AuthGuard } from "@/components/auth-guard";

interface AuthToken {
  token: string;
}

interface UserCredits {
  penoraCredits: string;
  imagegeneCredits: string;
  totalCreditsUsed: string;
}

export default function PenoraFull() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const PENORA_BASE_URL = import.meta.env.VITE_PENORA_APP_URL || "https://penora.sukusuku.ai/";
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const { data: authToken } = useQuery<AuthToken>({
    queryKey: ["/api/auth/token"],
    enabled: !!user,
  });

  useEffect(() => {
    if (user && authToken?.token) {
      try {
        const url = new URL(PENORA_BASE_URL);
        url.searchParams.set("user_id", user.id.toString());
        url.searchParams.set("email", user.email || "");
        url.searchParams.set("token", authToken.token);
        setIframeUrl(url.toString());
      } catch (e) {
        console.error("Failed to construct simplified Penora URL", e);
        setIframeUrl(PENORA_BASE_URL);
      }
    } else if (!user) {
      // If not logged in, maybe just base url? Or nothing?
      // The AuthGuard handles login requirement usually.
      // Let's default to base if something is missing but show loading if we expect auth.
    }
  }, [user, authToken, PENORA_BASE_URL]);

  const { data: credits } = useQuery<UserCredits>({
    queryKey: ["/api/user/credits"],
    enabled: !!user,
  });

  useEffect(() => {
    if (authToken?.token) {
      sessionStorage.setItem('sukusuku_auth_token', authToken.token);
    }
  }, [authToken]);

  const openInNewTab = () => {
    window.open(iframeUrl || PENORA_BASE_URL, '_blank');
  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <AuthGuard message="Please login with Google to access Penora AI writing assistant">
      <div className="fixed inset-0 z-50 bg-suku-black flex flex-col">
        {/* Mobile Responsive Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border-b border-suku-border bg-suku-surface gap-3 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <BookOpen className="w-5 h-5 text-suku-red flex-shrink-0" />
            <h3 className="text-sm sm:text-lg font-semibold text-white truncate">Penora AI Writing Assistant</h3>
            {credits && (
              <button
                onClick={() => {
                  try {
                    const pricingUrl = new URL(`${PENORA_BASE_URL}/pricing`);
                    if (user && authToken?.token) {
                      pricingUrl.searchParams.set("user_id", user.id.toString());
                      pricingUrl.searchParams.set("email", user.email || "");
                      pricingUrl.searchParams.set("token", authToken.token);
                    }
                    setIframeUrl(pricingUrl.toString());
                  } catch (e) {
                    console.error("Failed to construct pricing URL", e);
                    setIframeUrl(`${PENORA_BASE_URL}/pricing`);
                  }
                }}
                className="hidden sm:flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none flex-shrink-0"
                title="Get more credits"
              >
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-xs sm:text-sm font-medium whitespace-nowrap">
                  {credits.penoraCredits} credits
                </span>
              </button>
            )}
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={openInNewTab}
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none border-suku-border text-suku-text-secondary hover:bg-suku-red hover:text-white text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1 flex-shrink-0" />
              <span className="hidden sm:inline">Open</span>
            </Button>
            <Button
              onClick={goBack}
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none border-suku-border text-suku-text-secondary hover:bg-suku-red hover:text-white text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1 flex-shrink-0" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>
        </div>
        {/* Iframe Container - Fills Remaining Space */}
        <div className="flex-1 overflow-hidden">
          {iframeUrl ? (
            <iframe
              src={iframeUrl}
              className="w-full h-full border-0"
              title="Penora App"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation allow-pointer-lock allow-downloads"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-suku-text-secondary">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-suku-red mx-auto mb-2"></div>
                <p className="text-sm">Loading Penora...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}