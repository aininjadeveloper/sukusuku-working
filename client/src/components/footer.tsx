import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Globe, FileText, Settings, Mail, Heart, Shield, CreditCard, Cookie, HelpCircle } from "lucide-react";
import { SiInstagram, SiYoutube, SiX } from "react-icons/si";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter! Stay tuned for updates.",
    });
    setEmail("");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer style={{ backgroundColor: '#0e0e0e' }} className="text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-suku-red" />
              About
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Our Vision
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Team
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-suku-red" />
              Policies
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/terms-conditions" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-suku-red" />
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-left"
                >
                  Contact
                </button>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Feedback
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-suku-red" />
              Subscribe
            </h4>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Stay updated with our latest features, announcements, and creative inspiration.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              />
              <Button
                type="submit"
                className="w-full bg-suku-red text-white px-4 py-3 rounded-xl font-medium hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Brand Section */}
        <div className="border-t border-gray-700 pt-12 mb-12">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-4 font-sans">SukuSuku<sup className="text-xs text-gray-400 ml-0.5">™</sup><span className="text-suku-red">.ai</span></h3>
            <p className="text-xl text-suku-red font-medium mb-4">From Script to Screen. With AI.</p>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Empowering creators worldwide to transform imagination into reality through the power of artificial intelligence.
            </p>
            
            {/* Social Media Links */}
            <div className="flex justify-center items-center space-x-6">
              <a
                href="mailto:hello@sukusuku.ai?subject=Inquiry about SukuSuku.ai&body=Hello SukuSuku.ai team,%0D%0A%0D%0AI would like to know more about your AI creative platform.%0D%0A%0D%0APlease feel free to contact me.%0D%0A%0D%0AThank you!"
                className="group flex items-center justify-center w-14 h-14 bg-gradient-to-br from-suku-red to-red-700 rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-red-500/25"
                data-testid="link-email"
                aria-label="Send us an email"
              >
                <Mail className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-200" />
              </a>
              <a
                href="https://x.com/sukusukuai"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-800 to-black rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-gray-500/25"
                data-testid="link-twitter"
                aria-label="Follow us on X (Twitter)"
              >
                <SiX className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-200" />
              </a>
              <a
                href="https://www.instagram.com/sukusukuai/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-pink-500/25"
                data-testid="link-instagram"
                aria-label="Follow us on Instagram"
              >
                <SiInstagram className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-200" />
              </a>
              <a
                href="https://www.youtube.com/@sukusukuai"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-red-500/25"
                data-testid="link-youtube"
                aria-label="Subscribe to our YouTube channel"
              >
                <SiYoutube className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-200" />
              </a>
            </div>
            
            <div className="mt-6 space-y-2">
              <p className="text-gray-400 text-sm">
                Connect with us across all platforms
              </p>
              <div className="flex justify-center space-x-4 text-xs text-gray-500">
                <span>hello@sukusuku.ai</span>
                <span>•</span>
                <span>@sukusukuai</span>
                <span>•</span>
                <span>Join our creative community</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-300 text-center md:text-left">
              <p>&copy; 2025 sukusuku™.ai. All rights reserved.</p>
              <p className="text-sm mt-1">Developed by Ai Masters World, Bengaluru, India</p>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-suku-red fill-current" />
              <span>@ SukuSukuai</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}