import { useState } from "react";
import { motion } from "framer-motion";
import { Home, User, Briefcase, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { id: "home", icon: Home, label: "Home" },
  { id: "about", icon: User, label: "About" },
  { id: "portfolio", icon: Briefcase, label: "Portfolio" },
  { id: "contact", icon: Mail, label: "Contact" },
];

export function Navbar() {
  const [active, setActive] = useState("home");

  return (
    <div className="flex justify-center items-center p-20 bg-gradient-to-br from-gray-200 to-gray-300 min-h-[400px]">
      {/* Outer Container - Frosted Glass Effect */}
      <div className="relative p-2 rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 bg-white/30 backdrop-blur-md">
        
        {/* Inner Track - More subtle frosted look */}
        <div className="relative flex items-center bg-white/20 rounded-full p-1.5 gap-1 border border-white/20 shadow-inner">
          
          {items.map((item) => {
            const isActive = active === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={cn(
                  "relative z-10 flex flex-col items-center justify-center w-28 h-20 rounded-full transition-colors duration-300",
                  isActive ? "text-white" : "text-gray-600 hover:text-gray-900"
                )}
              >
                {/* The Active Pill Background */}
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-full shadow-lg"
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 30 
                    }}
                  />
                )}

                {/* Content */}
                <span className="relative z-20 flex flex-col items-center gap-1.5">
                  <item.icon 
                    strokeWidth={2} 
                    className={cn(
                      "w-6 h-6 transition-transform duration-300",
                      isActive && "scale-110"
                    )} 
                  />
                  <span className="text-sm font-medium tracking-tight">
                    {item.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
