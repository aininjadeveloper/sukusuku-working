import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Book, Film, Users, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { useAuthenticatedNavigation } from "@/lib/authHelpers";

export default function Penora() {
  const [, navigate] = useLocation();
  const { navigateWithAuth, isAuthenticated } = useAuthenticatedNavigation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const features = [
    {
      icon: <Film className="w-6 h-6 text-suku-red" />,
      title: "Film Scripts & Scene Breakdowns",
      description: "Complete screenplays with professional formatting",
    },
    {
      icon: <Book className="w-6 h-6 text-suku-red" />,
      title: "Complete Novels & Stories",
      description: "Full-length books, short stories, and children's books",
    },
    {
      icon: <Users className="w-6 h-6 text-suku-red" />,
      title: "Personalized Writing Experience",
      description: "Tailored to your genre, voice, and storytelling style",
    },
    {
      icon: <Zap className="w-6 h-6 text-suku-red" />,
      title: "Ongoing Development Tools",
      description: "Draft development, editing, and expansion features",
    },
  ];

  return (
    <section
      id="penora"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-red-50 text-suku-red border-red-100 mb-6 px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Phase 1 Launch
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-suku-black mb-6">
            Introducing <span className="text-suku-red">Penora</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
            An immersive, AI-powered writing experience built for authors,
            scriptwriters, and storytellers. Penora blends intelligence and
            inspiration — providing a serene, creative environment where stories
            take shape.
          </p>
          <p className="text-lg text-suku-red font-medium">
            From Thought to Story, with Penora.
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-white rounded-3xl shadow-xl border-0 overflow-hidden mb-16">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left Side - Content */}
              <div className="p-8 lg:p-12">
                <h3 className="text-3xl font-bold text-suku-black mb-6">
                  Penora is not a tool — it's a{" "}
                  <span className="text-suku-red">zone</span>.
                </h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Once you click the "Write" button, you enter a world where
                  stories take shape, characters come alive, and books begin —
                  all with just a prompt. Experience writing like never before
                  in our immersive creative environment.
                </p>

                <div className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-suku-black mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => {
                      if (isAuthenticated) {
                        window.location.href = "/penora";
                      } else {
                        navigateWithAuth("/penora", "Penora");
                      }
                    }}
                    className="bg-suku-red text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center group"
                  >
                    Try Penora
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </div>
              </div>

              {/* Right Side - Visual */}
              <div className="bg-gradient-to-br from-red-50 to-gray-50 p-8 lg:p-12 flex items-center justify-center">
                <div className="text-center">
                  <Button
                    onClick={() => {
                      if (isAuthenticated) {
                        window.location.href = "/penora_link";
                      } else {
                        navigateWithAuth("/penora", "Penora");
                      }
                    }}
                    className="w-32 h-32 bg-suku-red rounded-3xl flex items-center justify-center mb-6 shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-300 hover:shadow-xl hover:bg-red-700"
                  >
                    <Book className="w-16 h-16 text-white" />
                  </Button>
                  <h4 className="text-2xl font-bold text-suku-black mb-2">
                    Enter the Zone
                  </h4>
                  <p className="text-gray-600">Where creativity meets AI</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-suku-red mb-2">∞</div>
            <div className="text-gray-600 font-medium">Stories Possible</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-suku-red mb-2">1-Click</div>
            <div className="text-gray-600 font-medium">To Start Writing</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-suku-red mb-2">24/7</div>
            <div className="text-gray-600 font-medium">Creative Assistant</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-suku-red mb-2">100%</div>
            <div className="text-gray-600 font-medium">Your Ownership</div>
          </div>
        </div>
      </div>
    </section>
  );
}
