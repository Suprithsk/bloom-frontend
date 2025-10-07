import { Zap, Shield, Rocket, Bot, Package, Target } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Instant Product Visualization",
      tag: "In 60 seconds only",
      description: "Showcase your products directly in your customer's room — no imagination needed."
    },
    {
      icon: Shield,
      title: "Build Instant Buyer Trust",
      tag: "Boosts Confidence",
      description: "Give customers confidence with realistic previews. It feels real — because it is."
    },
    {
      icon: Rocket,
      title: "Turn Browsers into Buyers",
      tag: "Increases Conversions",
      description: "Seeing furniture in their space helps them make decisions faster — and buy with confidence."
    },
    {
      icon: Bot,
      title: "AI That Works in the Background",
      tag: "AI-Powered Tool",
      description: "No complexity, no learning curve. Our AI does the hard work for you — instantly."
    },
    {
      icon: Package,
      title: "Say Goodbye to Costly Returns",
      tag: "Reduce Return Rates",
      description: "When customers can visualize better, they buy with confidence — and keep what they love."
    },
    {
      icon: Target,
      title: "Tailored for Furniture Retailers",
      tag: "Furniture-Focused Platform",
      description: "REPLACI goes beyond generic tools to give you features that truly work in furniture retail."
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Simple background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 via-transparent to-teal-100/20"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-emerald-200/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-teal-200/20 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              REPLACI
            </span>
            ?
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
            From AI-powered visualization to real buyer confidence — everything you need to move furniture in a digital-first world.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white/80 backdrop-blur-sm border border-emerald-200/40 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl border border-emerald-200/40 shadow-sm mb-4 group-hover:bg-emerald-50 transition-colors">
                <feature.icon className="w-6 h-6 text-emerald-600" />
              </div>

              {/* Title and Tag */}
              <div className="mb-3">
                <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight">
                  {feature.title}
                </h3>
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                  {feature.tag}
                </span>
              </div>

              {/* Description */}
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}