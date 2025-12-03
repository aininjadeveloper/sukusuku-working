import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Zap, Target, Users } from "lucide-react";

export default function OurCreation() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const achievements = [
    {
      icon: <Sparkles className="w-6 h-6 text-suku-red" />,
      title: "10,000+",
      subtitle: "Scripts Generated",
      description: "Professional screenplays and books created by our AI"
    },
    {
      icon: <Zap className="w-6 h-6 text-suku-red" />,
      title: "50+ Hours",
      subtitle: "Time Saved Per Project",
      description: "Accelerating creative workflows with intelligent automation"
    },
    {
      icon: <Target className="w-6 h-6 text-suku-red" />,
      title: "98%",
      subtitle: "User Satisfaction",
      description: "Creators love our intuitive AI-powered tools"
    },
    {
      icon: <Users className="w-6 h-6 text-suku-red" />,
      title: "5,000+",
      subtitle: "Active Creators",
      description: "Filmmakers and writers using SukuSuku.ai daily"
    }
  ];

  return (
    <section id="achievements" className="py-24 px-4 sm:px-6 lg:px-8 bg-suku-dark">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
            Our <span className="text-suku-red">Impact</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Trusted by creators worldwide, SukuSuku.ai has transformed how content is created, 
            enabling thousands of filmmakers and writers to bring their visions to life with unprecedented speed and quality.
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement, index) => (
            <Card key={index} className="bg-suku-surface border border-gray-800 hover:border-suku-red/30 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-suku-red/10 border border-suku-red/20 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-suku-red/20 transition-colors duration-300">
                  {achievement.icon}
                </div>
                <div className="text-2xl font-bold text-suku-red mb-1">{achievement.title}</div>
                <div className="text-white font-medium mb-2">{achievement.subtitle}</div>
                <p className="text-suku-text-secondary text-sm leading-relaxed">{achievement.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-suku-red/10 to-suku-red/5 border border-suku-red/20 max-w-4xl mx-auto">
            <CardContent className="p-8 lg:p-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Creative Process?
              </h3>
              <p className="text-lg text-suku-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of creators who are already using SukuSuku.ai to bring their stories to life. 
                Start your creative journey today with our AI-powered tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => scrollToSection("features")}
                  className="bg-suku-red hover:bg-suku-red-hover text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center group"
                >
                  Try Our Tools
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
                <Button 
                  onClick={() => scrollToSection("contact")}
                  variant="outline"
                  className="border-suku-red text-suku-red hover:bg-suku-red hover:text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Get in Touch
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}