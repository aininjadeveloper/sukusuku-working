import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const useAuthenticatedNavigation = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  const navigateWithAuth = (path: string, appName: string) => {
    if (isLoading) return;
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: `Please signup or login to access ${appName}`,
        variant: "destructive",
      });
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }
    
    // User is authenticated, navigate to the app
    window.location.href = path;
  };

  return { navigateWithAuth, isAuthenticated: !!user, isLoading };
};