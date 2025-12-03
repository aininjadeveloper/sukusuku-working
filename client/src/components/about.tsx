import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Lightbulb, Award, ArrowRight, Globe, Zap } from "lucide-react";

export default function About() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const values = [
    {
      icon: <Lightbulb className="w-6 h-6 text-suku-red" />,
      title: "Innovation",
      description: "Pushing the boundaries of AI-powered creativity with cutting-edge technology and original thinking."
    },
    {
      icon: <Users className="w-6 h-6 text-suku-red" />,
      title: "Empowerment",
      description: "Democratizing content creation by making professional-grade tools accessible to everyone."
    },
    {
      icon: <Target className="w-6 h-6 text-suku-red" />,
      title: "Quality",
      description: "Delivering exceptional results that meet professional standards across all creative mediums."
    },
    {
      icon: <Award className="w-6 h-6 text-suku-red" />,
      title: "Ownership",
      description: "Ensuring creators retain full ownership and commercial rights to their AI-generated content."
    }
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-suku-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-sans">
            About <span className="text-suku-red">SukuSuku<sup className="text-xs text-gray-400 ml-0.5">™</sup>.ai</span>
          </h2>
          <p className="text-lg text-suku-text-secondary max-w-4xl mx-auto leading-relaxed">
            Founded by <span className="text-white font-medium">AI Masters World</span> in Bengaluru, India, SukuSuku<sup className="text-xs text-gray-400 ml-0.5">™</sup>.ai is a pioneering technology company revolutionizing the creative industry through artificial intelligence. We develop enterprise-grade AI solutions that empower content creators, filmmakers, and digital studios to transform ideas into professional productions with unprecedented speed and quality.
          </p>
        </div>

        {/* Company Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <div className="apple-card p-8">
            <div className="w-12 h-12 bg-suku-red/10 border border-suku-red/20 rounded-lg flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-suku-red" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Our Vision</h3>
            <p className="text-suku-text-secondary leading-relaxed">
              To establish the global standard for AI-powered creative production, where every storyteller—from independent creators to major studios—has access to professional-grade tools that transform imagination into reality without traditional constraints of budget, time, or technical expertise.
            </p>
          </div>

          <div className="apple-card p-8">
            <div className="w-12 h-12 bg-suku-red/10 border border-suku-red/20 rounded-lg flex items-center justify-center mb-6">
              <Lightbulb className="w-6 h-6 text-suku-red" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
            <p className="text-suku-text-secondary leading-relaxed">
              We democratize professional content creation by delivering AI-powered creative suites that enable filmmakers, writers, and digital artists to produce studio-quality work. Our platform eliminates traditional production barriers while maintaining the highest standards of creative authenticity and commercial viability.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-white text-center mb-12 font-sans">Why Choose SukuSuku<sup className="text-xs text-gray-400 ml-0.5">™</sup>.ai</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-suku-red/10 border border-suku-red/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-suku-red" />
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Enterprise Quality</h4>
              <p className="text-suku-text-secondary text-sm leading-relaxed">
                Production-ready AI tools trusted by professionals, delivering commercial-grade output with industry-standard formatting and quality assurance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-suku-red/10 border border-suku-red/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-suku-red" />
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Innovation Leadership</h4>
              <p className="text-suku-text-secondary text-sm leading-relaxed">
                Cutting-edge AI research and development, continuously advancing the capabilities of creative artificial intelligence for next-generation content production.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-suku-red/10 border border-suku-red/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-suku-red" />
              </div>
              <h4 className="text-lg font-bold text-white mb-3">Global Accessibility</h4>
              <p className="text-suku-text-secondary text-sm leading-relaxed">
                Worldwide availability with multi-language support, enabling creators across all markets to access professional AI-powered production tools.
              </p>
            </div>
          </div>
        </div>

        {/* Product Suite Overview */}
        <div className="apple-card p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Our Product Ecosystem</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-green-400 mb-3">Available Now</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-medium">Penora:</span>
                    <span className="text-suku-text-secondary"> Professional scriptwriting and book creation platform</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="text-white font-medium">ImageGene:</span>
                    <span className="text-suku-text-secondary"> Advanced AI visual creation and design suite</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-amber-400 mb-3">Launching Soon</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                  <div>
                    <span className="text-white font-medium">Audioku:</span>
                    <span className="text-suku-text-secondary"> Professional music and voiceover production platform</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                  <div>
                    <span className="text-white font-medium">Cineku:</span>
                    <span className="text-suku-text-secondary"> Enterprise video generation and editing engine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}