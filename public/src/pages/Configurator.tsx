import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sofa, 
  Package, 
  Home,
  RotateCcw,
  Palette,
  Layers,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

// Model data
const models = [
  { id: "sofa", name: "Sofa", icon: Sofa, price: "$1,299" },
  { id: "table", name: "Table", icon: Package, price: "$599" },
  { id: "cupboard", name: "Cupboard", icon: Home, price: "$899" },
];

// Variant data
const colorVariants = [
  { id: "navy", name: "Navy Blue", hex: "#1e3a5f" },
  { id: "forest", name: "Forest Green", hex: "#2d5016" },
  { id: "charcoal", name: "Charcoal", hex: "#36454f" },
  { id: "burgundy", name: "Burgundy", hex: "#800020" },
  { id: "sand", name: "Sand", hex: "#c2b280" },
];

const materialVariants = [
  { id: "leather", name: "Leather", texture: "Premium leather finish" },
  { id: "fabric", name: "Fabric", texture: "Soft cotton blend" },
  { id: "velvet", name: "Velvet", texture: "Luxurious velvet touch" },
];

const Configurator = () => {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [selectedColor, setSelectedColor] = useState(colorVariants[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(materialVariants[0]);
  const [isRotating, setIsRotating] = useState(false);

  const handleReset = () => {
    setSelectedModel(models[0]);
    setSelectedColor(colorVariants[0]);
    setSelectedMaterial(materialVariants[0]);
    setIsRotating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">3D Configurator</h1>
              <p className="text-sm text-muted-foreground">Customize your perfect furniture</p>
            </div>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="gap-2 hover:scale-105 transition-transform"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Model Selection */}
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Select Model</h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {models.map((model) => {
                  const Icon = model.icon;
                  return (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all duration-200",
                        "hover:scale-105 hover:shadow-md",
                        "flex flex-col items-center gap-2",
                        selectedModel.id === model.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Icon className="h-8 w-8 text-foreground" />
                      <span className="text-xs font-medium">{model.name}</span>
                      <span className="text-xs text-muted-foreground">{model.price}</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Customization Options */}
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <Tabs defaultValue="colors" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="colors" className="gap-1">
                    <Palette className="h-3 w-3" />
                    Colors
                  </TabsTrigger>
                  <TabsTrigger value="materials" className="gap-1">
                    <Layers className="h-3 w-3" />
                    Materials
                  </TabsTrigger>
                  <TabsTrigger value="extras" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    Extras
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="space-y-3">
                  <div className="grid grid-cols-5 gap-2">
                    {colorVariants.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "h-12 w-12 rounded-lg transition-all duration-200",
                          "hover:scale-110 hover:shadow-lg",
                          "ring-offset-2 ring-offset-background",
                          selectedColor.id === color.id
                            ? "ring-2 ring-primary scale-110"
                            : "hover:ring-2 hover:ring-primary/50"
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: <span className="font-medium text-foreground">{selectedColor.name}</span>
                  </p>
                </TabsContent>

                <TabsContent value="materials" className="space-y-3">
                  {materialVariants.map((material) => (
                    <button
                      key={material.id}
                      onClick={() => setSelectedMaterial(material)}
                      className={cn(
                        "w-full p-3 rounded-lg border-2 transition-all duration-200",
                        "hover:scale-[1.02] hover:shadow-md text-left",
                        selectedMaterial.id === material.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <p className="font-medium text-sm">{material.name}</p>
                      <p className="text-xs text-muted-foreground">{material.texture}</p>
                    </button>
                  ))}
                </TabsContent>

                <TabsContent value="extras" className="space-y-3">
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <div>
                        <p className="text-sm font-medium">Premium Cushions</p>
                        <p className="text-xs text-muted-foreground">+$149</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <div>
                        <p className="text-sm font-medium">Extended Warranty</p>
                        <p className="text-xs text-muted-foreground">+$99/year</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <div>
                        <p className="text-sm font-medium">Assembly Service</p>
                        <p className="text-xs text-muted-foreground">+$75</p>
                      </div>
                    </label>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Summary */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-3">Configuration Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model:</span>
                  <span className="font-medium">{selectedModel.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Color:</span>
                  <span className="font-medium">{selectedColor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Material:</span>
                  <span className="font-medium">{selectedMaterial.name}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-base">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-primary">{selectedModel.price}</span>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4" variant="hero">
                Add to Cart
              </Button>
            </Card>
          </div>

          {/* 3D Viewer */}
          <div className="lg:col-span-2">
            <Card className="p-8 h-[600px] bg-gradient-to-br from-muted/20 to-background relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/5 bg-grid-16 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
              
              {/* Placeholder 3D Viewer */}
              <div className="relative h-full flex items-center justify-center">
                <div className={cn(
                  "relative w-64 h-64 rounded-xl shadow-2xl transition-all duration-500",
                  isRotating && "animate-spin-slow"
                )}
                style={{ backgroundColor: selectedColor.hex }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <selectedModel.icon className="h-32 w-32 text-white/20" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-xs font-medium bg-black/30 backdrop-blur-sm rounded px-2 py-1 inline-block">
                      {selectedMaterial.name} • {selectedColor.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Viewer Controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-background/80 backdrop-blur-sm"
                  onClick={() => setIsRotating(!isRotating)}
                >
                  {isRotating ? "Stop" : "Rotate"} 360°
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-background/80 backdrop-blur-sm"
                >
                  Zoom
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-background/80 backdrop-blur-sm"
                >
                  Fullscreen
                </Button>
              </div>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card className="p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-primary">Free</div>
                <p className="text-sm text-muted-foreground">Shipping</p>
              </Card>
              <Card className="p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-primary">30 Days</div>
                <p className="text-sm text-muted-foreground">Return Policy</p>
              </Card>
              <Card className="p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-primary">2 Years</div>
                <p className="text-sm text-muted-foreground">Warranty</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurator;