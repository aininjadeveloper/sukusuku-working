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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
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
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-white hover:text-suku-red transition-colors duration-200 font-medium"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-white hover:text-suku-red transition-colors duration-200 font-medium"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-white hover:text-suku-red transition-colors duration-200 font-medium font-sans"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("use-cases")}
                className="text-white hover:text-suku-red transition-colors duration-200 font-medium font-sans"
              >
                Use Cases
              </button>
              <button
                onClick={() => scrollToSection("models")}
                className="text-white hover:text-suku-red transition-colors duration-200 font-medium font-sans"
              >
                AI Models
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-white hover:text-suku-red transition-colors duration-200 font-medium"
              >
                Contact
              </button>
            </div>
          </div>

          {/* User Authentication Section */}
          <div className="hidden md:flex items-center space-x-4">
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
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/login")}
                  className="text-white hover:text-suku-red transition-colors duration-200 font-medium"
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

        {/* Apple-style Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 space-y-1 bg-suku-surface/95 backdrop-blur-xl border-t border-suku-border">
              <button
                onClick={() => scrollToSection("home")}
                className="block w-full text-left px-3 py-3 text-white hover:text-suku-red transition-colors duration-200 font-medium"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left px-3 py-3 text-white hover:text-suku-red transition-colors duration-200 font-medium"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left px-3 py-3 text-white hover:text-suku-red transition-colors duration-200 font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("use-cases")}
                className="block w-full text-left px-3 py-3 text-white hover:text-suku-red transition-colors duration-200 font-medium"
              >
                Use Cases
              </button>
              <button
                onClick={() => scrollToSection("models")}
                className="block w-full text-left px-3 py-3 text-white hover:text-suku-red transition-colors duration-200 font-medium"
              >
                AI Models
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left px-3 py-3 text-white hover:text-suku-red transition-colors duration-200 font-medium"
              >
                Contact
              </button>
              {user ? (
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => {
                      navigate("/account");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left px-3 py-3 text-white hover:text-suku-red transition-colors duration-200 font-medium border border-suku-border rounded-lg"
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    Account Dashboard
                  </button>
                  <button
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="flex items-center w-full text-left px-3 py-3 text-white hover:text-red-500 transition-colors duration-200 font-medium border border-red-600 rounded-lg"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </button>
                </div>
              ) : (
                <a
                  href="/api/auth/google"
                  className="block w-full text-center px-3 py-3 text-white hover:text-suku-red transition-colors duration-200 font-medium border border-suku-border rounded-lg mt-4"
                >
                  Login with Google
                </a>
              )}
              <div className="mt-4 space-y-2">
                <Button
                  onClick={() => {
                    if (user) {
                      window.location.href = "penora";
                    } else {
                      navigate("/login");
                    }
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-suku-red hover:bg-suku-red-hover text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Try Penora
                </Button>
                <Button
                  onClick={() => {
                    if (user) {
                      window.location.href =
                        "https://image-gene-developeraim.replit.app/";
                    } else {
                      navigate("/login");
                    }
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full border-suku-border text-white hover:bg-suku-red hover:text-white hover:border-suku-red px-6 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Try ImageGene
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
