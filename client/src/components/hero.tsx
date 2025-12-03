import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="relative pt-26 pb-32 px-4 sm:px-6 lg:px-8 bg-suku-black overflow-hidden">
      <div className="relative max-w-5xl mx-auto text-center">
        {/* Apple-style Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-suku-surface-light/50 border border-suku-border rounded-full mb-8">
          <Sparkles className="w-4 h-4 text-suku-red mr-2" />
          <span className="text-sm font-medium text-suku-text-muted tracking-wide">FROM SCRIPT TO SCREEN. WITH AI.</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-sans">
          Unleash the Future of{" "}
          <span className="text-suku-red">
            Creativity
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-suku-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed font-sans">
          An AI-powered creative production platform for filmmakers, authors, and storytellers. 
          Transform your imagination into reality — from first idea to final delivery.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <Button 
            onClick={() => scrollToSection("features")}
            className="w-full sm:w-auto bg-suku-red hover:bg-suku-red-hover text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center group font-sans"
          >
            Explore Features
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
          
          <Button 
            onClick={() => scrollToSection("use-cases")}
            variant="outline"
            className="w-full sm:w-auto px-8 py-4 rounded-lg font-medium border border-suku-border text-white hover:bg-white hover:text-suku-black transition-all duration-200 font-sans"
          >
            View Use Cases
          </Button>
        </div>

        {/* Premium Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          <div className="text-center group">
            <div className="text-5xl font-bold text-suku-red mb-3 group-hover:scale-110 transition-transform duration-300">10x</div>
            <div className="text-suku-text-muted text-lg">Faster Creation</div>
          </div>
          <div className="text-center group">
            <div className="text-5xl font-bold text-suku-red mb-3 group-hover:scale-110 transition-transform duration-300">6+</div>
            <div className="text-suku-text-muted text-lg">AI-Powered Tools</div>
          </div>
          <div className="text-center group">
            <div className="text-5xl font-bold text-suku-red mb-3 group-hover:scale-110 transition-transform duration-300">100%</div>
            <div className="text-suku-text-muted text-lg">Commercial Safe</div>
          </div>
        </div>
      </div>
    </section>
  );
}