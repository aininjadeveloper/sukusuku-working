import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";

interface AuthFormsProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export function AuthForms({ onSuccess, onClose }: AuthFormsProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reset forms when switching between login/signup
  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    // Don't reset forms - just clear errors instead
    if (isLogin) {
      registerForm.reset(undefined, { keepValues: false });
    } else {
      loginForm.reset(undefined, { keepValues: false });
    }
  };

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Login Successful",
        description: "Welcome back to sukusuku.ai!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      const message = error.message || "Login failed. Please try again.";
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      // Basic validation before sending
      if (!data.email || !data.password || !data.firstName || !data.lastName) {
        throw new Error("All fields are required");
      }
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords don't match");
      }
      if (data.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration Successful",
        description: "Welcome to sukusuku.ai! Your account has been created.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      const message = error.message || "Registration failed. Please try again.";
      toast({
        title: "Registration Failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const onLoginSubmit = (data: LoginInput) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: any) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="apple-card">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-white">
            {isLogin ? "Welcome Back" : "Join sukusuku.ai"}
          </CardTitle>
          <CardDescription className="text-suku-text-secondary">
            {isLogin 
              ? "Sign in to access your AI creative tools" 
              : "Create your account to start creating with AI"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Google OAuth Button */}
          <Button 
            asChild
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 py-3 h-auto"
          >
            <a href="/api/auth/google" className="flex items-center justify-center space-x-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium">Continue with Google</span>
            </a>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-suku-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-suku-surface px-2 text-suku-text-muted">Or continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          {isLogin ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                        <FormControl>
                          <Input
                            id={`login-email-${field.name}`}
                            name={field.name}
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10 bg-suku-surface border-suku-border text-white"
                            autoComplete="email"
                            aria-invalid={!!fieldState.error}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                        <FormControl>
                          <Input
                            id={`login-password-${field.name}`}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-10 pr-10 bg-suku-surface border-suku-border text-white"
                            autoComplete="current-password"
                            aria-invalid={!!fieldState.error}
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white z-10"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-suku-red hover:bg-suku-red-hover text-white py-3 h-auto"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </Form>
          ) : (
            /* Register Form */
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={registerForm.control}
                    name="firstName"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-white">First Name</FormLabel>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                          <FormControl>
                            <Input
                              id={`firstName-${field.name}`}
                              placeholder="First name"
                              className="pl-10 bg-suku-surface border-suku-border text-white"
                              autoComplete="given-name"
                              aria-invalid={!!fieldState.error}
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="lastName"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-white">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            id={`lastName-${field.name}`}
                            placeholder="Last name"
                            className="bg-suku-surface border-suku-border text-white"
                            autoComplete="family-name"
                            aria-invalid={!!fieldState.error}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                        <FormControl>
                          <Input
                            id={`email-${field.name}`}
                            name={field.name}
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10 bg-suku-surface border-suku-border text-white"
                            autoComplete="email"
                            aria-invalid={!!fieldState.error}
                            autoFocus
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                        <FormControl>
                          <Input
                            id={`password-${field.name}`}
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="pl-10 pr-10 bg-suku-surface border-suku-border text-white"
                            autoComplete="new-password"
                            aria-invalid={!!fieldState.error}
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white z-10"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-white">Confirm Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                        <FormControl>
                          <Input
                            id={`confirmPassword-${field.name}`}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="pl-10 pr-10 bg-suku-surface border-suku-border text-white"
                            autoComplete="new-password"
                            aria-invalid={!!fieldState.error}
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white z-10"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-suku-red hover:bg-suku-red-hover text-white py-3 h-auto"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Creating account..." : "Create Account"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </Form>
          )}

          {/* Toggle between login/register */}
          <div className="text-center">
            <button
              onClick={handleToggleMode}
              className="text-suku-text-secondary hover:text-white transition-colors duration-200"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}