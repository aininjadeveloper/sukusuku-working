import { Card, CardContent } from "@/components/ui/card";
import { PenTool, Music, Video, Image, FileText, Mic } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function Features() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const handlePenoraClick = () => {
    if (isAuthenticated) {
      window.open("/penora", "_blank");
    } else {
      navigate("/login");
    }
  };

  const handleImageGeneClick = () => {
    if (isAuthenticated) {
      window.open("/imagegene_link", "_blank");
    } else {
      navigate("/login");
    }
  };

  const features = [
    {
      icon: <PenTool className="w-8 h-8 text-suku-red" />,
      title: "Penora",
      subtitle: "Professional Scriptwriting & Book Creation",
      description:
        "Enterprise-grade AI writing platform designed for professional screenwriters, novelists, and content creators. Penora delivers industry-standard formatting, intelligent story structure analysis, and collaborative editing tools trusted by major studios worldwide.",
      details: "Professional Scripts • Novels • Publishing Ready",
      clickable: true,
      onClick: handlePenoraClick,
      available: true,
    },
    {
      icon: <Image className="w-8 h-8 text-suku-red" />,
      title: "ImageGene",
      subtitle: "Advanced AI Visual Creation Suite",
      description:
        "Revolutionary AI image generation platform combining cutting-edge algorithms with professional-grade output controls. Create commercial-quality visuals, concept art, and marketing materials with unprecedented precision and creative flexibility.",
      details: "Available Now • Professional Grade",
      clickable: true,
      onClick: handleImageGeneClick,
      available: true,
    },
    {
      icon: <Music className="w-8 h-8 text-suku-red" />,
      title: "Audioku",
      subtitle: "AI Music & Voiceover Production",
      description:
        "Next-generation audio AI platform delivering broadcast-quality music composition and natural voice synthesis. Purpose-built for content creators, advertisers, and media professionals requiring royalty-free, customizable audio solutions.",
      details: "🚀 Launching Soon",
      clickable: false,
      available: false,
      launchingSoon: true,
    },
    {
      icon: <Video className="w-8 h-8 text-suku-red" />,
      title: "Cineku",
      subtitle: "Professional Video Generation Engine",
      description:
        "Revolutionary AI video creation platform engineered for professional filmmakers and content studios. Generate cinematic sequences, promotional content, and visual effects with production-ready quality and seamless workflow integration.",
      details: "🚀 Launching Soon",
      clickable: false,
      available: false,
      launchingSoon: true,
    },
  ];

  return (
    <section
      id="features"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-suku-surface"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            AI-Powered <span className="text-suku-red">Creative Suite</span>
          </h2>
          <p className="text-lg text-suku-text-secondary max-w-3xl mx-auto leading-relaxed">
            Everything you need to bring your creative vision to life, powered
            by cutting-edge artificial intelligence. All tools use
            commercial-safe, open-source AI models — so you retain full
            ownership of your work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`apple-card group relative overflow-hidden ${
                feature.clickable
                  ? "cursor-pointer hover:border-suku-red/50 hover:scale-[1.02]"
                  : "hover:border-suku-red/30"
              } ${feature.launchingSoon ? "border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5" : ""}`}
              onClick={feature.clickable ? feature.onClick : undefined}
            >
              <CardContent className="p-8 relative">
                {feature.launchingSoon && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-amber-400 tracking-wide">
                        LAUNCHING SOON
                      </span>
                    </div>
                  </div>
                )}

                <div className="w-14 h-14 bg-suku-red/10 border border-suku-red/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-suku-red/20 transition-all duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-suku-red transition-colors duration-300">
                  {feature.title}
                </h3>

                <h4 className="text-sm font-medium text-suku-red/80 mb-4 tracking-wide">
                  {feature.subtitle}
                </h4>

                <p className="text-suku-text-secondary leading-relaxed mb-6 text-sm">
                  {feature.description}
                </p>

                <div
                  className={`text-sm font-semibold ${
                    feature.available
                      ? "text-green-400"
                      : feature.launchingSoon
                        ? "text-amber-400 animate-pulse"
                        : "text-suku-red"
                  }`}
                >
                  {feature.details}
                </div>

                {feature.clickable && (
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-6 bg-suku-red rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Flow */}
        <div className="mt-20 bg-gray-50 rounded-3xl p-8 lg:p-12">
          <h3 className="text-3xl font-bold text-suku-black text-center mb-12">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-suku-red text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold text-suku-black mb-2">
                Start with an idea
              </h4>
              <p className="text-gray-600 text-sm">
                Type a prompt or choose a creative goal
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-suku-red text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold text-suku-black mb-2">
                Choose your tool
              </h4>
              <p className="text-gray-600 text-sm">
                Penora, ImageGene, Audioku, or Cineku
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-suku-red text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold text-suku-black mb-2">
                Let AI generate
              </h4>
              <p className="text-gray-600 text-sm">
                Instantly see your content appear
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-suku-red text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="font-semibold text-suku-black mb-2">
                Download or continue
              </h4>
              <p className="text-gray-600 text-sm">
                Save your work, expand it, or share
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
