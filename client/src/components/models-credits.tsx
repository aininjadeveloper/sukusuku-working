import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Image, 
  Sparkles, 
  Zap, 
  Layers, 
  Wand2, 
  ArrowUp,
  Scissors,
  RefreshCw
} from "lucide-react";

export default function ModelsCredits() {
  const penoraModels = [
    {
      name: "Mixtral 8×7B Instruct",
      provider: "Mistral AI",
      fullName: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      description: "High-performance mixture of experts model for complex reasoning",
      icon: <Brain className="w-6 h-6" />,
      category: "Large Language Model"
    },
    {
      name: "Meta Llama 3.1 8B",
      provider: "Meta",
      fullName: "meta-llama/Meta-Llama-3.1-8B-Instruct",
      description: "Advanced instruction-following model for creative writing",
      icon: <Sparkles className="w-6 h-6" />,
      category: "Large Language Model"
    },
    {
      name: "Mistral 7B Instruct",
      provider: "Mistral AI", 
      fullName: "mistralai/Mistral-7B-Instruct-v0.3",
      description: "Efficient and fast language model for text generation",
      icon: <Zap className="w-6 h-6" />,
      category: "Language Model"
    },
    {
      name: "Phi-3 Mini",
      provider: "Microsoft",
      fullName: "microsoft/Phi-3-mini",
      description: "Compact yet powerful model for quick text processing",
      icon: <Layers className="w-6 h-6" />,
      category: "Small Language Model"
    }
  ];

  const imagegeneModels = [
    {
      name: "Stable Diffusion 3.5",
      provider: "Deep Infra",
      fullName: "Deep Infra Stable Diffusion sd3.5 Medium/Turbo",
      description: "State-of-the-art image generation with exceptional quality",
      icon: <Wand2 className="w-6 h-6" />,
      category: "Image Generation"
    },
    {
      name: "Hugging Face Diffusers",
      provider: "Hugging Face",
      fullName: "Hugging Face Diffusers (SD/SDXL img2img pipelines)",
      description: "Advanced image transformation and style transfer",
      icon: <RefreshCw className="w-6 h-6" />,
      category: "Image Transform"
    },
    {
      name: "U²-Net",
      provider: "Research Community",
      fullName: "U^2 NET Background Removal",
      description: "Precise background removal with neural networks",
      icon: <Scissors className="w-6 h-6" />,
      category: "Background Removal"
    },
    {
      name: "GFPGAN",
      provider: "Tencent ARC Lab",
      fullName: "GFPGAN Image Upscaling",
      description: "AI-powered image enhancement and upscaling technology",
      icon: <ArrowUp className="w-6 h-6" />,
      category: "Image Enhancement"
    }
  ];

  const ModelCard = ({ model, accentColor }: { model: any, accentColor: string }) => (
    <Card className="bg-suku-surface border border-gray-800 hover:border-suku-red/30 transition-all duration-300 group h-full">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 ${accentColor === 'suku-red' ? 'bg-suku-red/10 border border-suku-red/20 group-hover:bg-suku-red/20' : 'bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20'} rounded-lg flex items-center justify-center transition-colors duration-300`}>
            <div className={accentColor === 'suku-red' ? 'text-suku-red' : 'text-blue-500'}>
              {model.icon}
            </div>
          </div>
          <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
            {model.category}
          </Badge>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-2">{model.name}</h3>
        <p className="text-sm text-gray-400 mb-3">{model.provider}</p>
        <p className="text-suku-text-secondary text-sm leading-relaxed mb-4">
          {model.description}
        </p>
        
        <div className="bg-gray-900/50 rounded-md p-3 border border-gray-700">
          <p className="text-xs text-gray-500 font-mono break-all">
            {model.fullName}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <section id="models" className="py-24 px-4 sm:px-6 lg:px-8 bg-suku-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-sans">
            Powered by <span className="text-suku-red">Leading AI Models</span>
          </h2>
          <p className="text-lg text-suku-text-secondary max-w-4xl mx-auto leading-relaxed">
            SukuSuku<sup className="text-xs text-gray-400 ml-0.5">™</sup>.ai integrates cutting-edge AI models from top research labs and organizations 
            to deliver exceptional creative capabilities across writing, image generation, and content enhancement.
          </p>
        </div>

        {/* Penora Models */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-suku-red/10 border border-suku-red/20 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-suku-red" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Penora AI Writing Models</h3>
              <p className="text-suku-text-secondary">Advanced language models for scriptwriting and creative content</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {penoraModels.map((model, index) => (
              <ModelCard key={index} model={model} accentColor="suku-red" />
            ))}
          </div>
        </div>

        {/* ImageGene Models */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
              <Image className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">ImageGene AI Models</h3>
              <p className="text-suku-text-secondary">Specialized models for image generation, enhancement, and manipulation</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {imagegeneModels.map((model, index) => (
              <ModelCard key={index} model={model} accentColor="blue-500" />
            ))}
          </div>
        </div>

        {/* Provider Attribution */}
        <div className="text-center bg-suku-surface rounded-2xl p-8 border border-gray-800">
          <h4 className="text-xl font-bold text-white mb-4">Infrastructure Partners</h4>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-suku-text-secondary">
            <Badge variant="outline" className="border-gray-600 text-gray-400">
              <Sparkles className="w-3 h-3 mr-1" />
              Deep Infra
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-400">
              <Brain className="w-3 h-3 mr-1" />
              Mistral AI
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-400">
              <Layers className="w-3 h-3 mr-1" />
              Meta AI
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-400">
              <Wand2 className="w-3 h-3 mr-1" />
              Hugging Face
            </Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-400">
              <Zap className="w-3 h-3 mr-1" />
              Microsoft
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-4 max-w-2xl mx-auto">
            We extend our gratitude to these leading AI research organizations and infrastructure providers 
            for making cutting-edge AI models accessible to creators worldwide.
          </p>
        </div>
      </div>
    </section>
  );
}