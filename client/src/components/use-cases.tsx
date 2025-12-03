import { Card, CardContent } from "@/components/ui/card";
import { Film, BookOpen, Monitor, Building2, GraduationCap, TrendingUp } from "lucide-react";

export default function UseCases() {
  const useCases = [
    {
      icon: <Film className="w-8 h-8 text-suku-red" />,
      title: "Filmmakers",
      description: "From concept to post-production, streamline your filmmaking process with AI-powered tools for every stage of production.",
      benefits: "Script generation, scene breakdowns, music scoring"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-suku-red" />,
      title: "Authors",
      description: "Break through writer's block and enhance your storytelling with AI assistance for plot development and character creation.",
      benefits: "Novels, short stories, children's books"
    },
    {
      icon: <Monitor className="w-8 h-8 text-suku-red" />,
      title: "Digital Creators",
      description: "Produce engaging content faster with AI tools that understand your audience and optimize for maximum impact.",
      benefits: "Video content, thumbnails, social media assets"
    },
    {
      icon: <Building2 className="w-8 h-8 text-suku-red" />,
      title: "Businesses",
      description: "Create professional marketing content, presentations, and brand materials with enterprise-grade AI tools.",
      benefits: "Marketing campaigns, brand materials, presentations"
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-suku-red" />,
      title: "Educators",
      description: "Develop engaging educational content and interactive learning materials that captivate and inspire students.",
      benefits: "Course materials, interactive content, assessments"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-suku-red" />,
      title: "Marketers",
      description: "Generate compelling campaigns, social media content, and advertising materials that drive results and engagement.",
      benefits: "Ad campaigns, social content, marketing copy"
    }
  ];

  return (
    <section id="use-cases" className="py-32 px-4 sm:px-6 lg:px-8 bg-suku-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-8">
            Who Can Use <span className="text-suku-red">SukuSuku.ai?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Our platform empowers creators across industries to transform their ideas into reality. 
            From students and independent writers to full-scale studios — we support all storytellers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <Card 
              key={index} 
              className="group premium-card premium-glow-hover transition-all duration-500 transform hover:-translate-y-2"
            >
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-suku-surface-elevated border border-suku-border rounded-xl flex items-center justify-center mb-6 group-hover:border-suku-red group-hover:bg-suku-red/10 transition-all duration-300 group-hover:scale-110 transform">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-suku-red transition-colors duration-300">
                  {useCase.title}
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {useCase.description}
                </p>
                <div className="text-sm text-suku-red font-semibold">
                  {useCase.benefits}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Core Values Section */}
        <div className="mt-24 premium-card p-12 lg:p-16 premium-glow">
          <h3 className="text-4xl font-bold text-suku-text-primary text-center mb-16 text-shadow-premium">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-suku-red/10 border border-suku-red/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-suku-red/20 transition-all duration-300">
                <span className="text-suku-red text-xl font-bold">🎨</span>
              </div>
              <h4 className="font-semibold text-suku-text-primary mb-4 text-lg">Creativity Without Limits</h4>
              <p className="text-suku-text-secondary font-light">Everyone deserves the freedom to create — no matter their background or skill</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-suku-red/10 border border-suku-red/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-suku-red/20 transition-all duration-300">
                <span className="text-suku-red text-xl font-bold">⚡</span>
              </div>
              <h4 className="font-semibold text-suku-text-primary mb-4 text-lg">Empowerment Through Simplicity</h4>
              <p className="text-suku-text-secondary font-light">We build tools that are easy to use, yet powerful enough to create magic</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-suku-red/10 border border-suku-red/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-suku-red/20 transition-all duration-300">
                <span className="text-suku-red text-xl font-bold">🤝</span>
              </div>
              <h4 className="font-semibold text-suku-text-primary mb-4 text-lg">Inclusivity in Storytelling</h4>
              <p className="text-suku-text-secondary font-light">From indie writers to visionary directors — we support all storytellers</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-suku-red rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">🛡️</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Innovation with Integrity</h4>
              <p className="text-gray-300 text-sm">We use ethical, open-source AI to ensure legal safety and creative freedom</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-suku-red rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">💨</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Speed with Soul</h4>
              <p className="text-gray-300 text-sm">Fast results that still feel meaningful, expressive, and truly human</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-suku-red rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">🎬</span>
              </div>
              <h4 className="font-semibold text-white mb-2">From Script to Screen — and Beyond</h4>
              <p className="text-gray-300 text-sm">We support every step of the journey — from the first idea to final delivery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}