/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useState, useContext } from "react";
import { DashboardContext } from "@/context/DasboardContext";
import { Model } from "@/types/dashboard";
import { toast } from "sonner";
import "./TryOnProducts.scss";

interface TryonProductsProps {
    modalData?: (modalObj: any) => void;
}

const TryonProducts: React.FC<TryonProductsProps> = ({ modalData }) => {
    const { modelsDataList } = useContext(DashboardContext);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [products, setProducts] = useState<Model[]>([]);
    const [isViewActive, setIsViewActive] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleClass = () => {
        setIsViewActive(!isViewActive);
    };

    useEffect(() => {
        fetchProducts();
    }, [modelsDataList]);

    const fetchProducts = () => {
        setLoading(true);
        try {
            const approvedProducts = modelsDataList
            console.log("Fetched products:", approvedProducts);
            setProducts(approvedProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const filteredPending = products.filter(product => product.status !== "REJECTED");
    // const filteredDraft = filteredPending.filter(product => product.status !== "DRAFT");
    const filteredProducts = selectedCategory === 'all' ? filteredPending : filteredPending.filter(ft => ft.category === selectedCategory);

    const categories = ["all", ...new Set(products.map((p) => p.category))];

    return (
        <section className={isViewActive ? 'card products-wrap hide' : 'card products-wrap'}>
            
            
            <div className="card-details">
                <h2>My Products</h2>
                
                {/* Category Filter Buttons */}
                <div className="product-category">
                    <button 
                        type='button' 
                        className={selectedCategory === 'all' ? 'product-btn active' : 'product-btn'} 
                        onClick={() => setSelectedCategory('all')}
                    >
                        All
                    </button>
                    {categories.filter(cat => cat !== 'all').map((category) => (
                        <button 
                            key={category}
                            type='button' 
                            className={selectedCategory === category ? 'product-btn active' : 'product-btn'} 
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Product List */}
                <div className="product-catalog">
                    {loading ? (
                        <div className="loading-state">
                            <p>Loading products...</p>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="product-list">
                            {filteredProducts.map((product, index) => (
                                <div key={index} className="product-item">
                                    <div className="item-img">
                                        <img
                                            src={product.images[0]}
                                            alt={product.model_title}
                                            width={180}
                                            height={150}
                                        />
                                    </div>
                                    <h3>{product.model_title}</h3>
                                    <p>Category: {product.category || "Unknown"}</p>
                                    
                                    <div className="fabric-details">
                                        {/* Additional fabric details can go here */}
                                    </div>
                                    
                                    <button
                                        type="button"
                                        className="product-btn import-model"
                                        id={product.model_title}
                                        onClick={() => modalData && modalData(product)}
                                    >
                                        Replace Now
                                    </button>
                                    
                                    {/* Horizontal Texture List */}
                                    {product.new_images_list && product.new_images_list.length > 0 && (
                                        <div className="texture-list">
                                            {product.new_images_list.map((texture: any, texIndex: number) => (
                                                <div
                                                    key={texIndex}
                                                    className={`texture-item ${product.model_title}`}
                                                >
                                                    <img
                                                        src={texture.thumbnailUrl ? texture.thumbnailUrl : texture.albedoMapPathUrl}
                                                        alt={`Texture ${texIndex + 1}`}
                                                        width={50}
                                                        height={50}
                                                        className="texture-thumbnail"
                                                        data-albedo={texture.albedoMapPathUrl}
                                                        data-roughness={texture.roughnessMapPathUrl}
                                                        data-normal={texture.normalMapPathUrl}
                                                        data-ao={texture.aoMapPathUrl}
                                                        data-em={texture.emissiveMapPathUrl}
                                                        data-metal={texture.metallicMapPathUrl}
                                                        data-height={texture.heightMapPathUrl}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="create-modal-card-block card">
                            <div className="create-img">
                                <svg 
                                    width="80" 
                                    height="80" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                    className="no-models-icon"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <h2 className="create-modal-card-heading">No Models Created Yet</h2>
                            <p className="create-modal-description">Create 3D models to use them in try-on</p>
                            <button 
                                className="btn create-model-btn"
                                onClick={() => window.location.href = "/configurator"}
                            >
                                Create 3D Model
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TryonProducts;