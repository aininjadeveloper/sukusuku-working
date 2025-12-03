import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  message?: string;
}

export function AuthGuard({ children, redirectTo = "/api/auth/google", message = "Please login to access this feature" }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication Required",
        description: message,
        variant: "destructive",
      });
      
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1500);
    }
  }, [user, isLoading, redirectTo, message, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-suku-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-suku-red mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-suku-dark flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-400 mb-6">{message}</p>
          <div className="animate-pulse text-gray-500">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}