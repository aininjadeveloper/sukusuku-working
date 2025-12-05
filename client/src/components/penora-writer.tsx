import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PenTool,
  ExternalLink,
  Maximize2,
  BookOpen,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function PenoraWriter() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const PENORA_WRITER_URL = import.meta.env.VITE_PENORA_APP_URL?.replace(/\/$/, "");
  console.log("Debug: Penora Writer URL:", PENORA_WRITER_URL);

  const openInNewTab = () => {
    window.open(PENORA_WRITER_URL, '_blank');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  if (!PENORA_WRITER_URL) {
    return (
      <section className="py-24 px-4 text-center bg-suku-surface">
        <h2 className="text-xl font-bold text-red-500 mb-2">Configuration Error</h2>
        <p className="text-white">The Penora URL is not configured.</p>
        <p className="text-sm text-gray-400 mt-2">Please set VITE_PENORA_APP_URL in your .env file and rebuild.</p>
      </section>
    );
  }
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-suku-black">
        <div className="flex items-center justify-between p-4 border-b border-suku-border bg-suku-surface">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-suku-red" />
            <h3 className="text-lg font-semibold text-white">Penora</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={openInNewTab}
              variant="outline"
              size="sm"
              className="border-suku-border text-suku-text-secondary hover:bg-suku-red hover:text-white"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Open in New Tab
            </Button>
            <Button
              onClick={toggleFullscreen}
              variant="outline"
              size="sm"
              className="border-suku-border text-suku-text-secondary hover:bg-suku-red hover:text-white"
            >
              Exit Fullscreen
            </Button>
          </div>
        </div>
        <iframe
          src={PENORA_WRITER_URL}
          className="w-full h-[calc(100vh-80px)] border-0"
          title="Penora App"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    );
  }

  return (
    <section id="penora-writer" className="py-24 px-4 sm:px-6 lg:px-8 bg-suku-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-suku-red/10 text-suku-red border-suku-red/20 mb-6 px-4 py-2 text-sm font-medium">
            <PenTool className="w-4 h-4 mr-2" />
            Live Demo
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Try <span className="text-suku-red">Penora</span>
          </h2>
          <p className="text-xl text-suku-text-secondary max-w-3xl mx-auto leading-relaxed">
            Experience the magic of AI-powered storytelling with our live Penora application.
            Start creating compelling narratives in seconds.
          </p>
        </div>

        {/* Main Demo Card */}
        <Card className="apple-card mb-8">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-6 border-b border-suku-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-suku-red/10 border border-suku-red/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-suku-red" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Penora</h3>
                  <p className="text-sm text-suku-text-muted">AI-Powered Creative Writing Platform</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={openInNewTab}
                  variant="outline"
                  size="sm"
                  className="border-suku-border text-suku-text-secondary hover:bg-suku-red hover:text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Open in New Tab
                </Button>
                <Button
                  onClick={toggleFullscreen}
                  variant="outline"
                  size="sm"
                  className="border-suku-border text-suku-text-secondary hover:bg-suku-red hover:text-white"
                >
                  <Maximize2 className="w-4 h-4 mr-1" />
                  Fullscreen
                </Button>
              </div>
            </div>

            {/* Iframe Container */}
            <div className="relative">
              <iframe
                src={PENORA_WRITER_URL}
                className="w-full h-[600px] border-0 rounded-b-2xl"
                title="Penora App"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />

              {/* Loading overlay - optional */}
              <div className="absolute inset-0 bg-suku-black/50 flex items-center justify-center rounded-b-2xl pointer-events-none opacity-0 transition-opacity duration-300">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-suku-red border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-white">Loading Penora...</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="apple-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-suku-red/10 border border-suku-red/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-suku-red" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">AI-Powered Generation</h4>
              <p className="text-suku-text-secondary text-sm">Advanced AI creates compelling stories from your prompts</p>
            </CardContent>
          </Card>

          <Card className="apple-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-suku-red/10 border border-suku-red/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BookOpen className="w-6 h-6 text-suku-red" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Multiple Formats</h4>
              <p className="text-suku-text-secondary text-sm">Support for novels, scripts, short stories, and more</p>
            </CardContent>
          </Card>

          <Card className="apple-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-suku-red/10 border border-suku-red/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <PenTool className="w-6 h-6 text-suku-red" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Professional Tools</h4>
              <p className="text-suku-text-secondary text-sm">Complete writing environment with editing and export features</p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="apple-card max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to unlock your creativity?
              </h3>
              <p className="text-suku-text-secondary mb-6">
                Experience the full power of PenoraWriter with unlimited access to all features,
                advanced AI models, and professional export options.
              </p>
              <Button
                className="bg-suku-red hover:bg-suku-red-hover text-white px-8 py-3 rounded-lg font-medium flex items-center mx-auto"
                onClick={() => {
                  const element = document.getElementById("contact");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              >
                Get Full Access to PenoraWriter
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}