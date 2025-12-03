import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, Sparkles, Download, Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DemoImageGene() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("realistic");
  const [generatedImage, setGeneratedImage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const styles = [
    { value: "realistic", label: "Realistic" },
    { value: "artistic", label: "Artistic" },
    { value: "cartoon", label: "Cartoon" },
    { value: "abstract", label: "Abstract" },
    { value: "cyberpunk", label: "Cyberpunk" },
    { value: "watercolor", label: "Watercolor" },
  ];

  const demoImages = [
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23764ba2;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='512' height='512' fill='url(%23grad1)'/%3E%3Ccircle cx='256' cy='200' r='80' fill='%23FFD700' opacity='0.8'/%3E%3Cellipse cx='256' cy='350' rx='120' ry='40' fill='%2334C759' opacity='0.6'/%3E%3Ctext x='256' y='450' font-family='Arial' font-size='24' fill='white' text-anchor='middle'%3EAI Generated Art%3C/text%3E%3C/svg%3E",
    
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3E%3Cdefs%3E%3CradialGradient id='grad2' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' style='stop-color:%23ff6b6b;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23ee5a24;stop-opacity:1' /%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='512' height='512' fill='url(%23grad2)'/%3E%3Cpolygon points='256,100 350,300 162,300' fill='%23FFE066' opacity='0.8'/%3E%3Ccircle cx='200' cy='400' r='30' fill='%234834d4' opacity='0.7'/%3E%3Ccircle cx='312' cy='380' r='25' fill='%2300a8ff' opacity='0.7'/%3E%3Ctext x='256' y='480' font-family='Arial' font-size='20' fill='white' text-anchor='middle'%3ECreative Vision%3C/text%3E%3C/svg%3E",
    
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3E%3Cdefs%3E%3ClinearGradient id='grad3' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2341b883;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2335495e;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='512' height='512' fill='url(%23grad3)'/%3E%3Crect x='150' y='150' width='212' height='150' fill='%23F40009' opacity='0.8' rx='20'/%3E%3Ccircle cx='256' cy='225' r='40' fill='white' opacity='0.9'/%3E%3Ctext x='256' y='420' font-family='Arial' font-size='22' fill='white' text-anchor='middle'%3EImageGene AI%3C/text%3E%3C/svg%3E",
    
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3E%3Cdefs%3E%3ClinearGradient id='grad4' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23fa7298;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23fad0c4;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='512' height='512' fill='url(%23grad4)'/%3E%3Cpath d='M256 120 L350 250 L256 380 L162 250 Z' fill='%23A855F7' opacity='0.8'/%3E%3Ccircle cx='256' cy='250' r='60' fill='white' opacity='0.9'/%3E%3Ctext x='256' y='450' font-family='Arial' font-size='20' fill='%23333' text-anchor='middle'%3EDigital Dreams%3C/text%3E%3C/svg%3E"
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe the image you want to generate",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI image generation
    setTimeout(() => {
      const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
      setGeneratedImage(randomImage);
      setIsGenerating(false);
      
      toast({
        title: "Image Generated!",
        description: `Created a ${selectedStyle} style image from your prompt`,
      });
    }, 3000);
  };

  const randomPrompt = () => {
    const prompts = [
      "A futuristic city with flying cars at sunset",
      "A magical forest with glowing mushrooms",
      "A cyberpunk robot playing guitar",
      "A peaceful lake surrounded by mountains",
      "An abstract representation of creativity",
      "A steampunk airship in the clouds",
      "A digital art piece about technology",
      "A watercolor painting of flowers"
    ];
    
    const randomPromptText = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(randomPromptText);
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'imagegene-creation.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded!",
      description: "Image saved to your device",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-suku-black via-purple-900 to-suku-black p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Image className="w-8 h-8 text-suku-red" />
            <h1 className="text-3xl font-bold text-white">ImageGene AI</h1>
            <Sparkles className="w-8 h-8 text-suku-red" />
          </div>
          <p className="text-gray-400 text-lg">
            Transform your imagination into stunning visuals with AI-powered image generation
          </p>
        </div>

        {/* Input Section */}
        <Card className="bg-suku-surface border-suku-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Image className="w-5 h-5 text-suku-red" />
              <span>Image Generation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 bg-suku-black border-suku-border text-white"
              />
              <Button
                onClick={randomPrompt}
                variant="outline"
                className="border-suku-border text-suku-text-secondary hover:bg-suku-red hover:text-white"
              >
                <Shuffle className="w-4 h-4" />
              </Button>
            </div>
            
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger className="bg-suku-black border-suku-border text-white">
                <SelectValue placeholder="Select art style" />
              </SelectTrigger>
              <SelectContent className="bg-suku-surface border-suku-border">
                {styles.map((style) => (
                  <SelectItem key={style.value} value={style.value} className="text-white focus:bg-suku-red">
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              onClick={generateImage}
              disabled={isGenerating}
              className="w-full bg-suku-red hover:bg-suku-red-hover text-white font-medium py-3"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Image...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Image</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        {generatedImage && (
          <Card className="bg-suku-surface border-suku-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-suku-red" />
                  <span>Generated Image</span>
                </CardTitle>
                <Button
                  onClick={downloadImage}
                  variant="outline"
                  size="sm"
                  className="border-suku-border text-suku-text-secondary hover:bg-suku-red hover:text-white"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-suku-black p-4 rounded-lg border border-suku-border">
                <img 
                  src={generatedImage} 
                  alt="Generated artwork"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                />
                <div className="mt-4 text-center">
                  <p className="text-gray-400 text-sm">
                    <strong className="text-white">Prompt:</strong> "{prompt}"
                  </p>
                  <p className="text-gray-400 text-sm">
                    <strong className="text-white">Style:</strong> {styles.find(s => s.value === selectedStyle)?.label}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Demo Notice */}
        <Card className="bg-purple-900/20 border-purple-500/30">
          <CardContent className="p-4">
            <p className="text-purple-300 text-sm text-center">
              🎨 This is a demo version of ImageGene AI. The full version uses advanced AI models like DALL-E, 
              Midjourney, and Stable Diffusion to create high-quality, unique images from your prompts.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}