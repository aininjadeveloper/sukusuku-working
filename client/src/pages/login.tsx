import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { AuthForms } from "@/components/auth-forms";

export default function Login() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleAuthSuccess = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-suku-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-suku-red border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-suku-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">sukusuku.ai</h1>
          <p className="text-suku-text-secondary">AI-Powered Creative Platform</p>
        </div>
        
        <AuthForms onSuccess={handleAuthSuccess} />
      </div>
    </div>
  );
}