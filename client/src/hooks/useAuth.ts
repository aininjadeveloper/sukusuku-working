import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  penoraCredits?: string;
  imagegeneCredits?: string;
  totalCreditsUsed?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn<User | null>({ on401: "returnNull" }),
    retry: false,
  });

  return {
    user: user || undefined,
    isLoading,
    isAuthenticated: !!user,
  };
}