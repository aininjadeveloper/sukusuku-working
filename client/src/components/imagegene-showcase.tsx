import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Image, Palette, Sparkles, Wand2 } from "lucide-react";
import { useLocation } from "wouter";
import { useAuthenticatedNavigation } from "@/lib/authHelpers";

export default function ImageGeneShowcase() {
  const [, navigate] = useLocation();
  const { navigateWithAuth, isAuthenticated } = useAuthenticatedNavigation();

  const features = [
    {
      icon: <Palette className="w-6 h-6 text-suku-red" />,
      title: "Multiple Art Styles",
      description: "Realistic, artistic, anime, digital art, and more"
    },
    {
      icon: <Image className="w-6 h-6 text-suku-red" />,
      title: "Custom Aspect Ratios",
      description: "Square, landscape, portrait - perfect for any project"
    },
    {
      icon: <Wand2 className="w-6 h-6 text-suku-red" />,
      title: "Advanced Controls",
      description: "Fine-tune steps, guidance, and negative prompts"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-suku-red" />,
      title: "Instant Generation",
      description: "High-quality images in 30-60 seconds"
    }
  ];

  return (
    <section id="imagegene" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-suku-red/10 text-suku-red border-suku-red/20 mb-6 px-4 py-2 text-sm font-medium">
            <Image className="w-4 h-4 mr-2" />
            AI Image Generation
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-suku-black mb-6">
            Introducing <span className="text-suku-red">ImageGene</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create stunning visuals for your projects using advanced AI technology. 
            ImageGene transforms your imagination into beautiful images — perfect for posters, thumbnails, concept art, and creative storytelling.
          </p>
        </div>

        {/* Main Card */}
        <Card className="apple-card mb-12">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side - Content */}
              <div className="p-8 lg:p-12">
                <h3 className="text-3xl font-bold text-suku-black mb-6">
                  ImageGene is not just a generator — it's a <span className="text-suku-red">vision</span>.
                </h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Simply describe what you want to see, choose your style, and watch as AI brings your vision to life. 
                  From movie posters to character designs, ImageGene delivers professional-quality results every time.
                </p>
                
                <div className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-suku-black mb-1">{feature.title}</h4>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => navigateWithAuth("/imagegene", "ImageGene")}
                    className="bg-suku-red text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center group"
                  >
                    {isAuthenticated ? "Try ImageGene" : "Try ImageGene"}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </div>
              </div>

              {/* Right Side - Visual */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 lg:p-12 flex items-center justify-center">
                <div className="text-center">
                  <Button
                    onClick={() => navigateWithAuth("/imagegene", "ImageGene")}
                    className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-300 hover:shadow-xl hover:from-purple-600 hover:to-blue-600"
                  >
                    <Image className="w-16 h-16 text-white" />
                  </Button>
                  <h4 className="text-2xl font-bold text-suku-black mb-2">Create Magic</h4>
                  <p className="text-gray-600">Where words become visuals</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-suku-red mb-2">∞</div>
            <div className="text-gray-600 font-medium">Images Possible</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-suku-red mb-2">8+</div>
            <div className="text-gray-600 font-medium">Art Styles</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-suku-red mb-2">30-60s</div>
            <div className="text-gray-600 font-medium">Generation Time</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-suku-red mb-2">HD</div>
            <div className="text-gray-600 font-medium">Quality Output</div>
          </div>
        </div>
      </div>
    </section>
  );
}