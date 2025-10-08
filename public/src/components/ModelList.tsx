import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DashboardContext } from "@/context/DasboardContext";
import { Model } from "@/types/dashboard";
import { toast } from "sonner";

const TryonProducts = () => {
    const { modelsDataList } = useContext(DashboardContext);
    const [products, setProducts] = useState<Model[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [modelsDataList]);

    const fetchProducts = () => {
        setLoading(true);
        try {
            const approvedProducts = modelsDataList.filter(
                (product: Model) =>
                    product.status === "APPROVED" &&
                    product.tripo_status !== "pending"
            );
            setProducts(approvedProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts =
        selectedCategory === "all"
            ? products
            : products.filter((product) => product.category === selectedCategory);

    const categories = ["all", ...new Set(products.map((p) => p.category))];

    return (
        <Card className="h-fit sticky top-20">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">My Products</CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="lg:hidden"
                    >
                        {isCollapsed ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronUp className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className={isCollapsed ? "hidden lg:block" : ""}>
                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                            className={
                                selectedCategory === category
                                    ? "bg-green-600 hover:bg-green-700"
                                    : ""
                            }
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Button>
                    ))}
                </div>

                {/* Product List */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Loading products...
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div
                                key={product.model_id}
                                className="border rounded-lg p-4 hover:border-green-500 transition-colors cursor-pointer product-item"
                                data-model-id={product.model_id}
                            >
                                {/* Product Image */}
                                <div className="aspect-square mb-3 overflow-hidden rounded-md bg-gray-100">
                                    <img
                                        src={product.images[0]}
                                        alt={product.model_title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Product Info */}
                                <h3 className="font-medium mb-1 line-clamp-1">
                                    {product.model_title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Category: {product.category}
                                </p>

                                {/* Replace Button */}
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700 import-model"
                                    size="sm"
                                    id={product.model_title}
                                >
                                    Replace Now
                                </Button>

                                {/* Texture List */}
                                {product.new_images_list &&
                                    product.new_images_list.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-xs text-muted-foreground mb-2">
                                                Textures:
                                            </p>
                                            <div className="flex gap-2 flex-wrap">
                                                {product.new_images_list.map((texture, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`texture-item ${product.model_title}`}
                                                    >
                                                        <button
                                                            className="w-12 h-12 rounded border-2 border-border hover:border-green-500 overflow-hidden transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                            }}
                                                        >
                                                            <img
                                                                src={
                                                                    texture.thumbnailUrl ||
                                                                    texture.albedoMapPathUrl
                                                                }
                                                                alt={`Texture ${idx + 1}`}
                                                                className="w-full h-full object-cover"
                                                                data-albedo={
                                                                    texture.albedoMapPathUrl
                                                                }
                                                                data-roughness={
                                                                    texture.roughnessMapPathUrl
                                                                }
                                                                data-normal={
                                                                    texture.normalMapPathUrl
                                                                }
                                                                data-ao={texture.aoMapPathUrl}
                                                                data-em={
                                                                    texture.emissiveMapPathUrl
                                                                }
                                                                data-metal={
                                                                    texture.metallicMapPathUrl
                                                                }
                                                                data-height={
                                                                    texture.heightMapPathUrl
                                                                }
                                                            />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-muted-foreground mb-4">
                                <svg
                                    className="w-16 h-16 mx-auto mb-4 opacity-30"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p className="font-medium mb-2">No Models Created Yet</p>
                                <p className="text-sm">
                                    Create 3D models to use them in try-on
                                </p>
                            </div>
                            <Button
                                onClick={() => (window.location.href = "/configurator")}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Create 3D Model
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default TryonProducts;