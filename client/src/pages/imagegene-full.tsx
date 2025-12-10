import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Image, ArrowLeft, CreditCard } from "lucide-react";
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

export default function ImageGeneFull() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const IMAGEGENE_URL = import.meta.env.VITE_IMAGEGENE_BASE_URL;

  const { data: authToken } = useQuery<AuthToken>({
    queryKey: ["/api/auth/token"],
    enabled: !!user,
  });

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
    const url = authToken?.token
      ? `${IMAGEGENE_URL}?token=${authToken.token}`
      : IMAGEGENE_URL;
    window.open(url, '_blank');
  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <AuthGuard message="Please login with Google to access ImageGene AI image generator">
      <div className="fixed inset-0 z-50 bg-suku-black flex flex-col">
        {/* Mobile Responsive Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border-b border-suku-border bg-suku-surface gap-3 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <Image className="w-5 h-5 text-suku-red flex-shrink-0" />
            <h3 className="text-sm sm:text-lg font-semibold text-white truncate">ImageGene AI Image Generator</h3>
            {credits && (
              <div className="hidden sm:flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4 flex-shrink-0">
                <CreditCard className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-xs sm:text-sm font-medium whitespace-nowrap">
                  {credits.imagegeneCredits} credits
                </span>
              </div>
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
          <iframe
            src={authToken?.token ? `${IMAGEGENE_URL}?token=${authToken.token}&user_id=${encodeURIComponent(user?.id || '')}&email=${encodeURIComponent(user?.email || '')}&first_name=${encodeURIComponent(user?.firstName || '')}&last_name=${encodeURIComponent(user?.lastName || '')}` : IMAGEGENE_URL}
            className="w-full h-full border-0"
            title="ImageGene App"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-top-navigation allow-pointer-lock"
          />
        </div>
      </div>
    </AuthGuard>
  );
}