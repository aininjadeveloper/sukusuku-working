import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, Sparkles, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DemoPenora() {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateText = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Type something to generate content with AI",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI text generation
    setTimeout(() => {
      const demoResults = [
        `Here's a creative piece based on "${prompt}":\n\nIn the realm of digital creativity, where imagination meets innovation, your idea takes shape. This AI-powered writing assistant transforms simple prompts into compelling narratives, engaging articles, and professional content.\n\nThe future of content creation is here, where human creativity is amplified by artificial intelligence. Every word is crafted with precision, every sentence flows with purpose, and every paragraph builds towards a meaningful conclusion.\n\nLet your ideas flourish in this collaborative space between human insight and machine learning capabilities.`,
        
        `Creative Content for "${prompt}":\n\nOnce upon a time, in a world where words held magical power, writers discovered a secret companion - an AI that could weave stories from the simplest of threads. Your prompt becomes the seed from which entire gardens of prose can bloom.\n\nThis digital muse doesn't replace creativity; it enhances it. Like a skilled editor who never sleeps, or a research assistant with infinite knowledge, this tool helps transform rough ideas into polished gems.\n\nThe art of writing evolves, but its heart remains unchanged - the desire to communicate, to inspire, and to connect with others through the power of language.`,
        
        `Professional Response to "${prompt}":\n\nBased on your input, here's a comprehensive analysis and creative interpretation. Modern AI writing tools serve as collaborative partners in the creative process, offering suggestions, expanding ideas, and helping overcome writer's block.\n\nKey benefits include:\n• Enhanced productivity and creativity\n• Consistent tone and style\n• Research assistance and fact-checking\n• Multiple format adaptability\n• Real-time collaboration features\n\nThis technology represents a new chapter in content creation, where human creativity is augmented by intelligent systems designed to understand context, maintain coherence, and inspire innovation.`
      ];
      
      const randomResult = demoResults[Math.floor(Math.random() * demoResults.length)];
      setGeneratedText(randomResult);
      setIsGenerating(false);
      
      toast({
        title: "Content Generated!",
        description: "Your AI-powered content is ready",
      });
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'penora-content.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded!",
      description: "Content saved as text file",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-suku-black via-gray-900 to-suku-black p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <PenTool className="w-8 h-8 text-suku-red" />
            <h1 className="text-3xl font-bold text-white">Penora AI Writer</h1>
            <Sparkles className="w-8 h-8 text-suku-red" />
          </div>
          <p className="text-gray-400 text-lg">
            Transform your ideas into compelling content with AI-powered writing assistance
          </p>
        </div>

        {/* Input Section */}
        <Card className="bg-suku-surface border-suku-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <PenTool className="w-5 h-5 text-suku-red" />
              <span>Your Writing Prompt</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your writing prompt here... (e.g., 'Write a blog post about AI creativity', 'Create a story about space exploration', 'Draft an email for a business proposal')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] bg-suku-black border-suku-border text-white resize-none"
            />
            <Button
              onClick={generateText}
              disabled={isGenerating}
              className="w-full bg-suku-red hover:bg-suku-red-hover text-white font-medium py-3"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Content...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Content</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        {generatedText && (
          <Card className="bg-suku-surface border-suku-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-suku-red" />
                  <span>Generated Content</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="border-suku-border text-suku-text-secondary hover:bg-suku-red hover:text-white"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    onClick={downloadText}
                    variant="outline"
                    size="sm"
                    className="border-suku-border text-suku-text-secondary hover:bg-suku-red hover:text-white"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-suku-black p-4 rounded-lg border border-suku-border">
                <pre className="text-white whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {generatedText}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Demo Notice */}
        <Card className="bg-blue-900/20 border-blue-500/30">
          <CardContent className="p-4">
            <p className="text-blue-300 text-sm text-center">
              🎯 This is a demo version of Penora AI Writer. In the full version, content is generated using advanced AI models 
              with real-time processing, multiple writing styles, and enhanced customization options.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}