import { useState } from "react";
import { ArrowRight } from "lucide-react";

// Import images from assets/images directory
import sofa1 from "@/assets/images/sofa1.png";
import sofa2 from "@/assets/images/sofa2.png";
import sofa3 from "@/assets/images/sofa3.png";

import color1a from "@/assets/images/color1a.png";
import color1b from "@/assets/images/color1b.png";
import color1c from "@/assets/images/color1c.png";
import color1d from "@/assets/images/color1d.png";

import color2a from "@/assets/images/color2a.png";
import color2b from "@/assets/images/color2b.png";
import color2c from "@/assets/images/color2c.png";
import color2d from "@/assets/images/color2d.png";

import color3a from "@/assets/images/color3a.png";
import color3b from "@/assets/images/color3b.png";

import variant1a from "@/assets/images/variant1a.png";
import variant1b from "@/assets/images/variant1b.png";
import variant1c from "@/assets/images/variant1c.png";
import variant1d from "@/assets/images/variant1d.png";

import variant2a from "@/assets/images/variant2a.png";
import variant2b from "@/assets/images/variant2b.png";
import variant2c from "@/assets/images/variant2c.png";
import variant2d from "@/assets/images/variant2d.png";

import grey from "@/assets/images/grey.png";
import cream from "@/assets/images/cream.png";

import mainimage from "@/assets/images/mainimage.jpg";

// Define the sofa variants data structure
const sofaVariants = [
  {
    name: "Orelia Daybed",
    base: sofa1,
    variants: [
      { swatch: color1d, image: variant1d },
      { swatch: color1b, image: variant1b },
      { swatch: color1c, image: variant1c },
      { swatch: color1a, image: variant1a },
    ],
  },
  {
    name: "Rejoice Sofa",
    base: sofa2,
    variants: [
      { swatch: color2a, image: variant2a },
      { swatch: color2c, image: variant2c },
      { swatch: color2b, image: variant2b },
      { swatch: color2d, image: variant2d },
    ],
  },
  {
    name: "Nuvia Sofa",
    base: sofa3,
    variants: [
      { swatch: color3a, image: grey },
      { swatch: color3b, image: cream },
    ],
  },
];

export default function ReplaciAction() {
  const [activeSofaIndex, setActiveSofaIndex] = useState<number | null>(null);
  const [selectedVariantImages, setSelectedVariantImages] = useState<(string | null)[]>(
    Array(sofaVariants.length).fill(null)
  );

  const handleSofaClick = (index: number) => {
    if (activeSofaIndex === index) {
      setActiveSofaIndex(null);
    } else {
      setActiveSofaIndex(index);
      setSelectedVariantImages((prev) => {
        const updated = [...prev];
        if (!updated[index]) {
          updated[index] = sofaVariants[index].variants[0].image;
        }
        return updated;
      });
    }
  };

  const handleColorClick = (sofaIndex: number, variant: { swatch: string; image: string }) => {
    const updatedSelections = [...selectedVariantImages];
    updatedSelections[sofaIndex] = variant.image;
    setSelectedVariantImages(updatedSelections);
  };

  // Get the current display image - either the main room or the selected variant
  const getCurrentDisplayImage = () => {
    if (activeSofaIndex !== null && selectedVariantImages[activeSofaIndex]) {
      return selectedVariantImages[activeSofaIndex];
    }
    return mainimage;
  };

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Background matching other sections */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 via-transparent to-teal-100/20"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-emerald-200/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-teal-200/20 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight text-slate-800 flex items-center justify-center gap-4">
            See{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              REPLACI
            </span>{" "}
            in action
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Experience how furniture looks in real spaces with AI-powered visualization
          </p>
        </div>

        {/* Gallery Content */}
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Sofa Selection Column - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {sofaVariants.map((sofa, sofaIndex) => (
              <div 
                key={sofaIndex} 
                className="bg-white/80 backdrop-blur-sm border border-emerald-200/40 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Sofa Image */}
                <div 
                  className={`relative cursor-pointer rounded-lg overflow-hidden mb-4 transition-all duration-300 ${
                    activeSofaIndex === sofaIndex 
                      ? "ring-4 ring-emerald-500 ring-opacity-50" 
                      : "hover:ring-2 hover:ring-emerald-300 hover:ring-opacity-30"
                  }`}
                  onClick={() => handleSofaClick(sofaIndex)}
                >
                  <img
                    src={sofa.base}
                    alt={sofa.name}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {activeSofaIndex === sofaIndex && (
                    <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                      <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Selected
                      </div>
                    </div>
                  )}
                </div>

                {/* Sofa Name */}
                <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">
                  {sofa.name}
                </h3>

                {/* Color Options - Only show if this sofa is active */}
                {activeSofaIndex === sofaIndex && (
                  <div className="flex justify-center gap-2">
                    {sofa.variants.map((variant, vIndex) => (
                      <button
                        key={vIndex}
                        onClick={() => handleColorClick(sofaIndex, variant)}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                          selectedVariantImages[sofaIndex] === variant.image
                            ? "border-emerald-500 ring-2 ring-emerald-200" 
                            : "border-gray-300 hover:border-emerald-400"
                        }`}
                      >
                        <img
                          src={variant.swatch}
                          alt={`Color ${vIndex}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Room Display - 3 columns */}
          <div className="lg:col-span-3 ">
            <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/40 rounded-xl p-6 shadow-sm">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <img
                  src={getCurrentDisplayImage()}
                  alt={activeSofaIndex !== null ? "Room with selected furniture" : "Empty Room"}
                  className="object-cover transition-all duration-500 w-full h-full"
                />

                {/* Instructions Overlay - Only show when no sofa is selected */}
                {activeSofaIndex === null && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center max-w-sm">
                      <h4 className="text-lg font-bold text-slate-800 mb-2">
                        Try REPLACI Now!
                      </h4>
                      <p className="text-slate-600 text-sm">
                        Click on any sofa to see how it looks in this room
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Room Info */}
              <div className="mt-4 text-center">
                <h4 className="text-lg font-semibold text-slate-800 mb-1">
                  Modern Living Room
                </h4>
                <p className="text-slate-600 text-sm">
                  {activeSofaIndex !== null 
                    ? `Showing ${sofaVariants[activeSofaIndex].name} in natural lighting`
                    : "Select a sofa to see it in this space"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};