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
      <div className="fixed inset-0 z-50 bg-suku-black">
        <div className="flex items-center justify-between p-4 border-b border-suku-border bg-suku-surface">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-suku-red" />
            <h3 className="text-lg font-semibold text-white">Penora AI Writing Assistant</h3>
            {credits && (
              { credits && (
                <button
                  onClick={() => {
                    try {
                      const pricingUrl = new URL("https://penora.sukusuku.ai/pricing");
                      if (user && authToken?.token) {
                        pricingUrl.searchParams.set("user_id", user.id.toString());
                        pricingUrl.searchParams.set("email", user.email || "");
                        pricingUrl.searchParams.set("token", authToken.token);
                      }
                      setIframeUrl(pricingUrl.toString());
                    } catch (e) {
                      console.error("Failed to construct pricing URL", e);
                      setIframeUrl("https://penora.sukusuku.ai/pricing");
                    }
                  }}
                  className="flex items-center space-x-2 ml-4 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                  title="Get more credits"
                >
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm font-medium">
                    {credits.penoraCredits} credits
                  </span>
                </button>
              )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={openInNewTab}
              variant="outline"
              size="sm"
              className="border-suku-border text-suku-text-secondary hover:bg-suku-red hover:text-white"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Open in New Tab
            </Button>
            <Button
              onClick={goBack}
              variant="outline"
              size="sm"
              className="border-suku-border text-suku-text-secondary hover:bg-suku-red hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Button>
          </div>
        </div>
        {iframeUrl ? (
          <iframe
            src={iframeUrl}
            className="w-full h-[calc(100vh-80px)] border-0"
            title="Penora App"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation allow-pointer-lock allow-downloads"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-[calc(100vh-80px)] text-suku-text-secondary">
            Loading Penora...
          </div>
        )}
      </div>
    </AuthGuard>
  );
}