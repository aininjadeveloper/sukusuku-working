import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Globe,
  Sparkles,
  Brain,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/logo";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/logout"),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      // Clear local storage if any
      localStorage.clear();
      // Close dropdown
      setIsUserMenuOpen(false);
      // Navigate to home and refresh
      navigate("/");
      // Force page reload to completely reset state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    },
    onError: (error) => {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "backdrop-blur-xl border-b border-suku-border shadow-lg"
          : "backdrop-blur-xl"
        }`}
      style={{
        background: isScrolled
          ? "linear-gradient(135deg, #121212 0%, #1a1a1a 100%)"
          : "linear-gradient(135deg, rgba(18, 18, 18, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)",
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("home")}
            className="flex-shrink-0 transition-all duration-300 hover:scale-105"
          >
            <Logo size="sm" />
          </button>

          {/* Apple-style Desktop Navigation */}
          <div className="hidden md:block flex-1">
            <div className="ml-10 flex items-center space-x-1 lg:space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-white hover:text-suku-red transition-colors duration-200 font-medium text-sm lg:text-base px-2 lg:px-0"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-white hover:text-suku-red transition-colors duration-200 font-medium text-sm lg:text-base px-2 lg:px-0"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-white hover:text-suku-red transition-colors duration-200 font-medium text-sm lg:text-base px-2 lg:px-0 font-sans"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("use-cases")}
                className="text-white hover:text-suku-red transition-colors duration-200 font-medium text-sm lg:text-base px-2 lg:px-0 font-sans"
              >
                Use Cases
              </button>
              <button
                onClick={() => scrollToSection("models")}
                className="text-white hover:text-suku-red transition-colors duration-200 font-medium text-sm lg:text-base px-2 lg:px-0 font-sans"
              >
                AI Models
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-white hover:text-suku-red transition-colors duration-200 font-medium text-sm lg:text-base px-2 lg:px-0"
              >
                Contact
              </button>
            </div>
          </div>

          {/* User Authentication Section - With Gap */}
          <div className="hidden md:flex items-center gap-6 ml-auto flex-shrink-0">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-white hover:text-suku-red transition-colors duration-200"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={user.profileImageUrl}
                        alt={user.firstName}
                      />
                      <AvatarFallback className="bg-suku-red text-white text-sm">
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.firstName}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-suku-surface border border-suku-border rounded-lg shadow-lg overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-suku-border">
                        <p className="text-white font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          navigate("/account");
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-3 text-white hover:bg-suku-red transition-colors duration-200"
                      >
                        <UserIcon className="w-4 h-4 mr-2" />
                        Account Dashboard
                      </button>
                      <button
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                        className="flex items-center w-full text-left px-4 py-3 text-white hover:bg-red-600 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {logoutMutation.isPending ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Explore Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <Button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-suku-red hover:bg-suku-red-hover text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    Explore
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </Button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-suku-surface border border-suku-border rounded-lg shadow-lg overflow-hidden z-50">
                      <button
                        onClick={() => {
                          window.location.href = "/penora";
                        }}
                        className="block w-full text-left px-4 py-3 text-white hover:bg-suku-red hover:text-white transition-colors duration-200 font-medium"
                      >
                        Try Penora
                      </button>
                      <button
                        onClick={() => {
                          window.location.href = "/imagegene_link";
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-white hover:bg-suku-red hover:text-white transition-colors duration-200 font-medium"
                      >
                        Try ImageGene
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <button
                  onClick={() => navigate("/login")}
                  className="text-white hover:text-suku-red transition-colors duration-200 font-medium text-sm lg:text-base whitespace-nowrap"
                >
                  Login
                </button>
                <div className="relative" ref={dropdownRef}>
                  <Button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-suku-red hover:bg-suku-red-hover text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    Explore
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </Button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-suku-surface border border-suku-border rounded-lg shadow-lg overflow-hidden z-50">
                      <button
                        onClick={() => {
                          navigate("/login");
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-white hover:bg-suku-red hover:text-white transition-colors duration-200 font-medium"
                      >
                        Try Penora
                      </button>
                      <button
                        onClick={() => {
                          navigate("/login");
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-white hover:bg-suku-red hover:text-white transition-colors duration-200 font-medium"
                      >
                        Try ImageGene
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Apple-style Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-suku-red transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Apple-style Mobile Navigation - Scrollable Menu */}
        {isMenuOpen && (
          <div className="md:hidden max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="px-4 pt-4 pb-8 space-y-2 bg-suku-surface/95 backdrop-blur-xl border-t border-suku-border">
              {/* Navigation Links */}
              <button
                onClick={() => scrollToSection("home")}
                className="block w-full text-left px-3 py-3 text-white hover:text-suku-red transition-colors duration-200 font-medium text-sm"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left px-3 py-3 text-white hover:text-suku-red transition-colors duration-200 font-medium text-sm"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left px-3 py-3 text-white hover:text-suku-red transition-colors duration-200 font-medium text-sm"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("use-cases")}
                className="block w-full text-left px-3 py-3 text-white hover:text-suku-red transition-colors duration-200 font-medium text-sm"
              >
                Use Cases
              </button>
              <button
                onClick={() => scrollToSection("models")}
                className="block w-full text-left px-3 py-3 text-white hover:text-suku-red transition-colors duration-200 font-medium text-sm"
              >
                AI Models
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left px-3 py-3 text-white hover:text-suku-red transition-colors duration-200 font-medium text-sm"
              >
                Contact
              </button>

              {/* Divider */}
              <div className="border-t border-suku-border my-4"></div>

              {/* Auth Section */}
              {user ? (
                <div className="space-y-3">
                  <div className="px-3 py-2 text-gray-400 text-xs font-semibold uppercase">
                    Account
                  </div>
                  <button
                    onClick={() => {
                      navigate("/account");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left px-3 py-3 text-white hover:text-suku-red transition-colors duration-200 font-medium text-sm rounded-lg border border-suku-border"
                  >
                    <UserIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                    Account Dashboard
                  </button>
                  <button
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="flex items-center w-full text-left px-3 py-3 text-white hover:text-red-500 transition-colors duration-200 font-medium text-sm rounded-lg border border-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </button>
                </div>
              ) : (
                <div className="px-3 py-3 text-white hover:text-suku-red transition-colors duration-200 font-medium text-sm rounded-lg border border-suku-border text-center">
                  <a href="/api/auth/google" className="block">
                    Login with Google
                  </a>
                </div>
              )}

              {/* Explore Section */}
              <div className="border-t border-suku-border my-4"></div>
              <div className="px-3 py-2 text-gray-400 text-xs font-semibold uppercase">
                Explore
              </div>
              <Button
                onClick={() => {
                  if (user) {
                    window.location.href = "/penora";
                  } else {
                    navigate("/login");
                  }
                  setIsMenuOpen(false);
                }}
                className="w-full bg-suku-red hover:bg-suku-red-hover text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm"
              >
                <Sparkles className="w-4 h-4 mr-2 inline-block" />
                Try Penora
              </Button>
              <Button
                onClick={() => {
                  if (user) {
                    window.location.href = import.meta.env.VITE_IMAGEGENE_BASE_URL;
                  } else {
                    navigate("/login");
                  }
                  setIsMenuOpen(false);
                }}
                variant="outline"
                className="w-full border-suku-border text-white hover:bg-suku-red hover:text-white hover:border-suku-red px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm"
              >
                <Image className="w-4 h-4 mr-2 inline-block" />
                Try ImageGene
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
