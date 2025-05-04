"use client"

import { useState } from "react";

const logos = [
  { id: 1, name: "Coldwell Banker", src: "/logos/coldwell-banker.png" },
  { id: 2, name: "Compass", src: "/logos/compass.png" },
  { id: 3, name: "RE/MAX", src: "/logos/remax.png" },
  { id: 4, name: "EXP Realty", src: "/logos/exp.png" },
  { id: 5, name: "Sotheby's", src: "/logos/sothebys.png" },
  { id: 6, name: "Century 21", src: "/logos/century21.png" },
  { id: 7, name: "LPT", src: "/logos/lpt.png" },
  { id: 8, name: "Keller Williams", src: "/logos/kw.png" },
];

export default function LogoCloud() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="w-full overflow-hidden py-12 relative z-20">
      {/* Logo cloud with mask gradient effect */}
      <div
        className="relative overflow-hidden"
        role="region"
        aria-label="Partner logos"
        style={{
          maskImage: "linear-gradient(to right, rgba(0, 0, 0, 0) 1%, rgb(0, 0, 0) 10%, rgb(0, 0, 0) 90%, rgba(0, 0, 0, 0) 99%)",
          WebkitMaskImage: "linear-gradient(to right, rgba(0, 0, 0, 0) 1%, rgb(0, 0, 0) 10%, rgb(0, 0, 0) 90%, rgba(0, 0, 0, 0) 99%)"
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex items-center gap-5 md:gap-8 ${isPaused ? "animate-none" : "animate-scroll"}`}
          style={{ willChange: "transform" }}
        >
          {/* First set of logos */}
          {logos.map((logo) => (
            <div key={logo.id} className="flex-shrink-0 flex items-center justify-center">
              <img
                src={logo.src}
                alt={logo.name}
                className="opacity-50 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}

          {/* Duplicate set for seamless looping */}
          {logos.map((logo) => (
            <div key={`duplicate-${logo.id}`} className="flex-shrink-0 flex items-center justify-center">
              <img
                src={logo.src}
                alt={logo.name}
                className="opacity-50 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}

          {/* Third set for extra coverage */}
          {logos.map((logo) => (
            <div key={`triplicate-${logo.id}`} className="flex-shrink-0 flex items-center justify-center">
              <img
                src={logo.src}
                alt={logo.name}
                className="opacity-50 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
