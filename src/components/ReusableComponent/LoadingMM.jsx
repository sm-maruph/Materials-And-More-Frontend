import React from "react";
import "./css/LoadingMM.css"
const LoadingMM = () => {
  const bubbles = Array.from({ length: 150 });

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden flex items-center justify-center">
      {/* Center Outward Bubbles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {bubbles.map((_, i) => {
          // Random angle and distance
          const angle = Math.random() * 2 * Math.PI;
          const distance = Math.random() * 300 + 100; // outward distance (px)
          const translateX = Math.cos(angle) * distance;
          const translateY = Math.sin(angle) * distance;
          const size = Math.random() * 30 + 20;

          return (
            <span
              key={i}
              className="absolute rounded-full animate-bubbleOut"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: "50%",
                top: "70%",
                transform: `translate(-50%, -50%)`,
                backgroundColor: Math.random() > 0.5 ? "#05b088" : "#27006f", // mm-primary or mm-secondery
                opacity: 0.2,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random()}s`,
                "--tx": `${translateX}px`,
                "--ty": `${translateY}px`,
              }}
            />
          );
        })}
      </div>

      {/* M & M Text */}
      <div className="z-10 text-6xl md:text-8xl font-extrabold font-sans flex items-center space-x-4">
        <span className="text-[#05b088] animate-pulse">M</span>
        <span className="text-mm-secondery animate-bounce text-5xl md:text-7xl">&</span>
        <span className="text-[#05b088] animate-pulse">M</span>
      </div>
    </div>
  );
};

export default LoadingMM;
