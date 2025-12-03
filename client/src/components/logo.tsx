import logoImage from "@assets/Adobe Express - file_1755769055710.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const sizes = {
    sm: "w-20 h-20",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  };

  return (
    <div className={`flex items-center ${className} group`}>
      <div className={`${sizes[size]} mr-6 flex-shrink-0 transition-all duration-300 group-hover:scale-105 relative`}>
        <div className="absolute inset-0 bg-suku-bg rounded-lg"></div>
        <img 
          src={logoImage}
          alt="SukuSuku™.ai Company Logo"
          className="w-full h-full object-contain relative z-10 transition-all duration-300 group-hover:brightness-110"
        />
      </div>
      
      <span className="text-white font-bold text-4xl tracking-tight transition-all duration-300 group-hover:text-gray-100">
        SukuSuku<sup className="text-base font-bold text-white/90 leading-none transition-all duration-300 group-hover:text-white">™</sup><span className="text-suku-red transition-colors duration-300 group-hover:text-red-400">.ai</span>
      </span>
    </div>
  );
}

export function LogoIcon({ className = "", size = "md" }: LogoProps) {
  const sizes = {
    sm: "w-20 h-20",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  };

  return (
    <div className={`${sizes[size]} ${className} flex-shrink-0 relative`}>
      <div className="absolute inset-0 bg-suku-bg rounded-lg"></div>
      <img 
        src={logoImage}
        alt="SukuSuku™.ai Company Logo"
        className="w-full h-full object-contain relative z-10"
      />
    </div>
  );
}