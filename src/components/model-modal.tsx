import { useState, useRef, useEffect } from "react";
import { X, Edit, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Model } from "@/types/dashboard";
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useContext } from "react";
import { DashboardContext } from "@/context/DasboardContext";
// Import the edit modal
import EditModelModal from "./edit-model-modal";

interface ModelDetailModalProps {
    model: Model;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: () => void;
    onDelete?: (modelId: number) => void;
}

const ModelDetailModal = ({
    model,
    isOpen,
    onClose,
    onEdit,
    onDelete,
}: ModelDetailModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const [selectedTexture, setSelectedTexture] = useState<string>("");
    const [intersectedModel, setIntersectedModel] =
        useState<THREE.Group | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const {deleteModelMutation} = useContext(DashboardContext) || {};

    // Add state for edit modal
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && model.mtl_file && model.obj_file && canvasRef.current) {
            init3DViewer();
        }

        return () => {
            cleanup3D();
        };
    }, [isOpen, model]);

    const cleanup3D = () => {
        if (rendererRef.current) {
            rendererRef.current.dispose();
            rendererRef.current = null;
        }
        if (sceneRef.current) {
            sceneRef.current.clear();
            sceneRef.current = null;
        }
    };

    const init3DViewer = () => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const container = canvas.parentElement;
        if (!container) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f5f5);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            container.offsetWidth / container.offsetHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 5);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        });
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererRef.current = renderer;

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 2;
        controls.maxDistance = 10;
        controls.update();

        // Lighting
        addLighting(scene);

        // Load 3D model
        load3DModel(scene, camera, renderer, controls);

        // Handle resize
        const handleResize = () => {
            if (container && camera && renderer) {
                const width = container.offsetWidth;
                const height = container.offsetHeight;
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            controls.dispose();
        };
    };

    const addLighting = (scene: THREE.Scene) => {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        // Key light
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
        keyLight.position.set(-10, 10, 10);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        scene.add(keyLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.7);
        fillLight.position.set(10, 10, 10);
        scene.add(fillLight);

        // Back light
        const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
        backLight.position.set(0, 10, -10);
        scene.add(backLight);
    };

    const load3DModel = (
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera,
        renderer: THREE.WebGLRenderer,
        controls: OrbitControls
    ) => {
        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();

        mtlLoader.load(
            model.mtl_file,
            (materials) => {
                materials.preload();
                objLoader.setMaterials(materials);

                objLoader.load(
                    model.obj_file,
                    (object) => {
                        const objectGroup = new THREE.Group();
                        objectGroup.add(object);

                        // Scale the model to fit the viewport
                        const box = new THREE.Box3().setFromObject(objectGroup);
                        const size = new THREE.Vector3();
                        box.getSize(size);

                        const scaleFactor1 = 3 / size.x;
                        const scaleFactor2 = 3 / size.y;
                        const setScale = Math.min(scaleFactor1, scaleFactor2);

                        objectGroup.scale.set(setScale, setScale, setScale);
                        objectGroup.position.set(0, -1, 0);

                        scene.add(objectGroup);
                        setIntersectedModel(objectGroup);

                        // Apply default texture if available
                        if (model.texture_file) {
                            changeModelTexture(model.texture_file, objectGroup);
                        }

                        // Animation loop
                        const animate = () => {
                            requestAnimationFrame(animate);
                            controls.update();
                            renderer.render(scene, camera);
                        };
                        animate();
                    },
                    undefined,
                    (error) => {
                        console.error("Error loading OBJ file:", error);
                    }
                );
            },
            undefined,
            (error) => {
                console.error("Error loading MTL file:", error);
            }
        );
    };

    const changeModelTexture = (
        texturePath: string,
        targetModel: THREE.Group
    ) => {
        const textureLoader = new THREE.TextureLoader();

        textureLoader.load(
            texturePath,
            (texture) => {
                texture.minFilter = THREE.LinearMipMapLinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.colorSpace = THREE.SRGBColorSpace;

                targetModel.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        if (child.material instanceof THREE.Material) {
                            if ("map" in child.material && child.material.map) {
                                child.material.map = texture;
                                child.material.needsUpdate = true;
                            } else {
                                child.material = new THREE.MeshPhongMaterial({
                                    map: texture,
                                    side: THREE.DoubleSide,
                                });
                            }
                        }
                    }
                });
            },
            undefined,
            (error) => {
                console.error("Error loading texture:", error);
            }
        );
    };

    const handleTextureSelect = (textureUrl: string) => {
        setSelectedTexture(textureUrl);
        if (intersectedModel) {
            changeModelTexture(textureUrl, intersectedModel);
        }
    };

    const closeModal = (e: React.MouseEvent) => {
        if (modalRef.current && modalRef.current === e.target) {
            onClose();
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleDelete = () => {
        setConfirmDelete(true);
    };

    const confirmDeleteAction = async () => {
        if (onDelete) {
            await deleteModelMutation?.(model.model_id);
        }
        setConfirmDelete(false);
        onClose();
    };

    // Handle edit button click - show edit modal
    const handleEdit = () => {
        setShowEditModal(true);
    };
    
    // Handle edit modal save
    const handleEditSave = (updatedModel: Partial<Model>) => {
        // // Update the model data and call parent onEdit if needed
        // if (onEdit) {
        //     onEdit({ ...model, ...updatedModel } as Model);
        // }
        // setShowEditModal(false);
        // // You might want to refresh the model data here or update local state
    };

    // Handle edit modal close
    const handleEditClose = () => {
        setShowEditModal(false);
    };

    const deleteClickHandler=(id)=>{

    }
    if (!isOpen) return null;

    return (
        <>
            <div
                ref={modalRef}
                onClick={closeModal}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
                <Card className="bg-card max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    <CardContent className="p-0">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <div className="flex items-center gap-3">
                                <Badge
                                    className={`${
                                        model.status === "APPROVED"
                                            ? "bg-green-500 text-white"
                                            : model.status === "PENDING"
                                            ? "bg-yellow-500 text-white"
                                            : model.status === "REJECTED"
                                            ? "bg-red-500 text-white"
                                            : "bg-muted text-muted-foreground"
                                    } text-xs font-medium`}
                                >
                                    {model.status}
                                </Badge>
                                <h2 className="text-xl font-semibold">
                                    {model.model_title}
                                </h2>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="hover:bg-muted"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Vertical Layout */}
                        <div className="p-6 ">
                            {/* Top Section - 3D Viewer */}
                            <div className="relative aspect-[16/10] bg-muted/30 rounded-lg overflow-hidden">
                                {model.mtl_file && model.obj_file ? (
                                    <>
                                        {/* 360° View Label */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <Badge className="bg-blue-500 text-white text-xs flex items-center gap-1 hover:bg-blue-500">
                                                <RotateCcw className="w-3 h-3" />
                                                360° View
                                            </Badge>
                                        </div>

                                        {/* 3D Canvas */}
                                        <canvas
                                            ref={canvasRef}
                                            className="w-full h-full cursor-grab active:cursor-grabbing"
                                            style={{ display: "block" }}
                                        />
                                    </>
                                ) : (
                                    /* Fallback Image */
                                    <img
                                        src={
                                            model.images?.[0] ||
                                            "/placeholder.png"
                                        }
                                        alt={model.model_title}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>

                            {/* Bottom Section - Model Info and Textures */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
                                {/* Left - Model Details */}
                                <div className="space-y-4">
                                    <div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Category:
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {model.category}
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Created at:
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {formatDate(
                                                        model.created_at
                                                    )}
                                                </span>
                                            </div>

                                            {model.description && (
                                                <div>
                                                    <span className="text-sm text-muted-foreground">
                                                        Description:
                                                    </span>
                                                    <p className="text-sm mt-1">
                                                        {model.description}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4 border-t">
                                        <Button
                                            onClick={handleEdit}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={handleDelete}
                                            variant="outline"
                                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>

                                {/* Right - Available Textures */}
                                <div>
                                    {/* Texture Options from new_images_list */}
                                    {model.new_images_list &&
                                        model.new_images_list.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-medium mb-3">
                                                    Available Textures
                                                </h3>
                                                <div className="flex gap-2 flex-wrap">
                                                    {model.new_images_list.map(
                                                        (texture, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() =>
                                                                    handleTextureSelect(
                                                                        texture.thumbnailUrl
                                                                    )
                                                                }
                                                                className={`w-16 h-16 rounded-lg border-2 overflow-hidden transition-all hover:scale-105 ${
                                                                    selectedTexture ===
                                                                    texture.thumbnailUrl
                                                                        ? "border-green-500 ring-2 ring-green-500/20"
                                                                        : "border-border hover:border-green-300"
                                                                }`}
                                                            >
                                                                <img
                                                                    src={
                                                                        texture.thumbnailUrl
                                                                    }
                                                                    alt={`Texture ${
                                                                        index +
                                                                        1
                                                                    }`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {/* Texture files fallback */}
                                    {(!model.new_images_list ||
                                        model.new_images_list.length === 0) &&
                                        model.all_texture_files &&
                                        model.all_texture_files.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-medium mb-3">
                                                    Available Textures
                                                </h3>
                                                <div className="flex gap-2 flex-wrap">
                                                    {model.all_texture_files.map(
                                                        (texture, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() =>
                                                                    handleTextureSelect(
                                                                        texture
                                                                    )
                                                                }
                                                                className={`w-16 h-16 rounded-lg border-2 overflow-hidden transition-all hover:scale-105 ${
                                                                    selectedTexture ===
                                                                    texture
                                                                        ? "border-green-500 ring-2 ring-green-500/20"
                                                                        : "border-border hover:border-green-300"
                                                                }`}
                                                            >
                                                                <img
                                                                    src={
                                                                        texture
                                                                    }
                                                                    alt={`Texture ${
                                                                        index +
                                                                        1
                                                                    }`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
                    <Card className="bg-card max-w-md w-full">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold" onClick={()=>{

                                }}>
                                    Confirm Delete
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setConfirmDelete(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <p className="text-muted-foreground mb-6">
                                Are you sure you want to delete this model? This
                                action cannot be undone.
                            </p>

                            <div className="flex gap-3">
                                <Button
                                    onClick={confirmDeleteAction}
                                    className="flex-1 bg-red-600 hover:bg-red-700"
                                >
                                    Yes, Delete
                                </Button>
                                <Button
                                    onClick={() => setConfirmDelete(false)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Edit Modal - Similar to Frontend's showEditPopup */}
            {showEditModal && (
                <EditModelModal
                    model={model}
                    isOpen={showEditModal}
                    onClose={handleEditClose}
                    onSave={handleEditSave}
                    onEdit={onEdit}

                />
            )}
        </>
    );
};

export default ModelDetailModal;
