import { useAuth, type User } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  LogOut,
  User as UserIcon,
  CreditCard,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useLocation } from "wouter";

interface UserCredits {
  penoraCredits: string;
  imagegeneCredits: string;
  totalCreditsUsed: string;
}

export default function Account() {
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: credits,
    isLoading: creditsLoading,
    refetch: refetchCredits,
  } = useQuery<UserCredits>({
    queryKey: ["/api/user/credits"],
    enabled: !!user,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "There was an error logging you out.",
        variant: "destructive",
      });
    },
  });

  if (authLoading || creditsLoading) {
    return (
      <div className="min-h-screen bg-suku-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-suku-red"></div>
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-suku-dark py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Account Dashboard
          </h1>
          <p className="text-gray-400">
            Manage your account and track your AI tool usage
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <Card className="bg-suku-surface border-suku-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your account details and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={user.profileImageUrl}
                    alt={user.firstName}
                  />
                  <AvatarFallback className="bg-suku-red text-white">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-gray-400">{user.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>

              <Separator className="bg-suku-border" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    First Name
                  </label>
                  <p className="text-white">
                    {user.firstName || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Last Name
                  </label>
                  <p className="text-white">
                    {user.lastName || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Email
                  </label>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Last Login
                  </label>
                  <p className="text-white">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credits Summary */}
          <Card className="bg-suku-surface border-suku-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Credits
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your available AI tool credits
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => refetchCredits()}
                  disabled={creditsLoading}
                  className="text-gray-400 hover:text-white"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${creditsLoading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Penora Credits</span>
                  <Badge className="bg-blue-600 text-white">
                    {credits?.penoraCredits ?? user?.penoraCredits ?? 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">ImageGene Credits</span>
                  <Badge className="bg-purple-600 text-white">
                    {credits?.imagegeneCredits ?? user?.imagegeneCredits ?? 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Used</span>
                  <Badge
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    {credits?.totalCreditsUsed ?? user?.totalCreditsUsed ?? 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Tools Access */}
          <Card className="bg-suku-surface border-suku-border lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-white">AI Tools Access</CardTitle>
              <CardDescription className="text-gray-400">
                Quick access to your AI creative tools with seamless
                authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-suku-border bg-suku-dark/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">Penora</h4>
                    <Badge className="bg-blue-600 text-white">
                      {credits?.penoraCredits || user.penoraCredits || "0"}{" "}
                      credits
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    AI-powered writing assistant for scripts, stories, and
                    creative content
                  </p>
                  <Button
                    onClick={() =>
                      window.open("/penora", "_blank")
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Launch Penora
                  </Button>
                </div>

                <div className="p-4 rounded-lg border border-suku-border bg-suku-dark/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">ImageGene</h4>
                    <Badge className="bg-purple-600 text-white">
                      {credits?.imagegeneCredits ||
                        user.imagegeneCredits ||
                        "0"}{" "}
                      credits
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Advanced AI image generation for visual content and artwork
                  </p>
                  <Button
                    onClick={() =>
                      window.open(
                        import.meta.env.VITE_IMAGEGENE_BASE_URL || "/imagegene",
                        "_blank",
                      )
                    }
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Launch ImageGene
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="bg-suku-surface border-suku-border lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-white">Account Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
