import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
    Upload,
    X,
    ChevronDown,
    ImageIcon,
    Sparkles,
    CheckCircle,
} from "lucide-react";
import { createModel, getAllCategories } from "@/api/dashboardService";
import { useNavigate } from "react-router-dom";
import { DashboardNavbar } from "./dashboard-navbar";

interface Category {
    id: number;
    category: string;
}

const CreateModelComponent = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    // Form state
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [image, setImage] = useState("");
    const [texture, setTexture] = useState<string[]>([]);
    const [preview, setPreview] = useState<File | null>(null);
    const [texturePreview, setTexturePreview] = useState<File[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [catVal, setCatVal] = useState("");

    // Error states
    const [imageError, setImageError] = useState("");
    const [textureError, setTextureError] = useState("");
    const [titleError, setTitleError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [catValError, setCatValError] = useState("");

    // UI states
    const [saveAndExit, setSaveAndExit] = useState(false);
    const [flag, setFlag] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            if (response.data?.status === "true") {
                setCategoryList(response.data.category_list);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast({
                title: "Error",
                description: "Failed to load categories",
                variant: "destructive",
            });
        }
    };

    const validateImage = (file: File) => {
        const validImageTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/heic",
            "image/heics",
        ];
        const maxSizeInMB = 40;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

        if (!validImageTypes.includes(file.type)) {
            return "Only JPG, JPEG, PNG, and HEIC files are allowed.";
        }

        if (file.size > maxSizeInBytes) {
            return "File size should be less than 40 MB.";
        }

        return null;
    };

    const uploadImageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFlag(true);
        const file = event.target.files?.[0];

        if (file) {
            const validationError = validateImage(file);
            if (validationError) {
                setImageError(validationError);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target?.result as string);
                setPreview(file);
                setImageError("");
            };
            reader.readAsDataURL(file);
        } else {
            setImageError("Image is Required");
        }
    };

    const uploadTextureHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFlag(true);
        const selectedFiles = Array.from(event.target.files || []);

        // Plan-based limits (you can adjust these based on your requirements)
        const planName = localStorage.getItem("planName") || "Silver";
        let maxUploads = 1;

        switch (planName) {
            case "Silver":
                maxUploads = 1;
                break;
            case "Gold":
                maxUploads = 5;
                break;
            case "Platinum":
                maxUploads = 7;
                break;
            default:
                maxUploads = 1;
                break;
        }

        if (selectedFiles.length > 0) {
            if (selectedFiles.length + texture.length > maxUploads) {
                setTextureError(
                    `You can only upload a maximum of ${maxUploads} textures for your ${planName} plan.`
                );
                return;
            }

            const textureErrors = selectedFiles
                .map(validateImage)
                .filter(Boolean);
            if (textureErrors.length > 0) {
                setTextureError(textureErrors.join(" "));
                return;
            }

            setTexturePreview((prev) => [...prev, ...selectedFiles]);

            const textures: string[] = [];
            selectedFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    textures.push(URL.createObjectURL(file));
                    if (textures.length === selectedFiles.length) {
                        setTexture((prev) => [...prev, ...textures]);
                    }
                };
                reader.readAsDataURL(file);
            });

            setTextureError("");
        } else {
            setTextureError("Please select at least one texture to upload.");
        }
    };

    const removeTexture = (indexToRemove: number) => {
        setTexture((prev) =>
            prev.filter((_, index) => index !== indexToRemove)
        );
        setTexturePreview((prev) =>
            prev.filter((_, index) => index !== indexToRemove)
        );
        setTextureError("");
    };

    const handleSubmit = async () => {
        setFlag(true);

        // Validation
        if (!title) setTitleError("Title is Required");
        if (!preview) setImageError("Image is Required");
        if (!catVal) setCatValError("Category is Required");
        if (!description) setDescriptionError("Description is Required");
        if (texturePreview.length === 0) setTextureError("Texture is Required");

        if (
            !title ||
            !catVal ||
            !description ||
            !preview ||
            texturePreview.length === 0
        ) {
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("model_title", title);
            formData.append("category", catVal);
            formData.append("description", description);
            formData.append("image", preview);

            texturePreview.forEach((textureFile) => {
                formData.append("texture_images", textureFile);
            });

            const response = await createModel(formData);

            if (response.data.status) {
                setSaveAndExit(true);
                toast({
                    title: "Success! 🎉",
                    description: "Your 3D model has been created successfully!",
                });
            }
        } catch (error) {
            console.error("Error creating model:", error);
            toast({
                title: "Error",
                description: "Failed to create 3D model. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setTitle("");
        setImage("");
        setPreview(null);
        setTexture([]);
        setTexturePreview([]);
        setCatVal("");
        setDescription("");
        // Clear all errors
        setTitleError("");
        setImageError("");
        setCatValError("");
        setDescriptionError("");
        setTextureError("");
        setFlag(false);
        navigate("/dashboard");
    };

    const handleClose = () => {
        setSaveAndExit(false);
        navigate("/dashboard");
    };

    if (saveAndExit) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="w-full max-w-md mx-4">
                    <CardContent className="p-8 text-center">
                        <div className="flex justify-end mb-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClose}
                                className="p-1"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                            New Product Added Successfully
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Your product has been successfully uploaded and is
                            now queued for conversion into a stunning 3D model.
                        </p>
                        <Button onClick={handleClose} className="w-full">
                            SAVE & EXIT
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <DashboardNavbar />
            <main className="pt-16">
                <div className="max-w-6xl mx-auto p-6">
                    <Card>
                        <CardContent className="p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                                    Transform Images into 3D Models with REPLACI
                                </h2>
                                <p className="text-lg text-slate-600">
                                    Discover the future of digital content
                                    creation with REPLACI, a revolutionary tool
                                    that seamlessly converts your images into
                                    intricate 3D models
                                </p>
                            </div>

                            <form className="grid lg:grid-cols-2 gap-8">
                                {/* Left Form */}
                                <div className="space-y-6">
                                    {/* Title */}
                                    <div>
                                        <Input
                                            type="text"
                                            value={title}
                                            maxLength={50}
                                            placeholder="Title of Model"
                                            onChange={(e) => {
                                                setFlag(true);
                                                setTitle(e.target.value);
                                                if (
                                                    e.target.value.length === 0
                                                ) {
                                                    setTitleError(
                                                        "Title is Required"
                                                    );
                                                } else {
                                                    setTitleError("");
                                                }
                                            }}
                                            className="h-12"
                                        />
                                        {titleError && flag && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {titleError}
                                            </p>
                                        )}
                                    </div>

                                    {/* Category */}
                                    <div className="relative">
                                        <select
                                            className="w-full h-12 px-3 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                                            value={catVal}
                                            onChange={(e) => {
                                                setFlag(true);
                                                setCatVal(e.target.value);
                                                if (
                                                    e.target.value.length === 0
                                                ) {
                                                    setCatValError(
                                                        "Category is Required"
                                                    );
                                                } else {
                                                    setCatValError("");
                                                }
                                            }}
                                        >
                                            <option value="" disabled>
                                                Select Category
                                            </option>
                                            {categoryList.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.category}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/3 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                        {catValError && flag && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {catValError}
                                            </p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <textarea
                                            placeholder="Description"
                                            maxLength={200}
                                            value={description}
                                            onChange={(e) => {
                                                setFlag(true);
                                                setDescription(e.target.value);
                                                if (
                                                    e.target.value.length === 0
                                                ) {
                                                    setDescriptionError(
                                                        "Description is Required"
                                                    );
                                                } else {
                                                    setDescriptionError("");
                                                }
                                            }}
                                            className="w-full h-32 px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                                        />
                                        {descriptionError && flag && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {descriptionError}
                                            </p>
                                        )}
                                    </div>

                                    {/* Instructions */}
                                    <div className="bg-slate-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-slate-800 mb-2">
                                            Instructions:
                                        </h3>
                                        <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5">
                                            <li>
                                                Image formats should be PNG,
                                                JPG, JPEG, or HEIC
                                            </li>
                                            <li>
                                                File size should be less than
                                                40 MB
                                            </li>
                                            <li>
                                                Quality of image in HD or
                                                higher
                                            </li>
                                            <li>
                                                Background should be clean and
                                                clutter-free
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Right Form - Image Uploads */}
                                <div className="space-y-6">
                                    {/* Main Image Upload */}
                                    <div>
                                        {!image ? (
                                            <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    accept="image/jpeg,image/jpg,image/png,image/heic,image/heics"
                                                    onChange={
                                                        uploadImageHandler
                                                    }
                                                />
                                                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                                <p className="text-lg font-medium text-slate-700 mb-2">
                                                    Upload Image
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Click to browse or drag and
                                                    drop
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <img
                                                    src={image}
                                                    alt="Model preview"
                                                    className="w-full h-64 object-cover rounded-lg"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => {
                                                        setImage("");
                                                        setPreview(null);
                                                    }}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                        {imageError && flag && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {imageError}
                                            </p>
                                        )}
                                    </div>

                                    {/* Texture Upload */}
                                    <div>
                                        <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                                            <input
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                accept="image/jpeg,image/jpg,image/png"
                                                onChange={uploadTextureHandler}
                                                multiple
                                            />
                                            <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                            <p className="font-medium text-slate-700 mb-1">
                                                Upload Textures
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Multiple files allowed
                                            </p>
                                        </div>

                                        {/* Texture Preview */}
                                        {texture.length > 0 && (
                                            <div className="grid grid-cols-3 gap-2 mt-4">
                                                {texture.map(
                                                    (textureUrl, index) => (
                                                        <div
                                                            key={index}
                                                            className="relative"
                                                        >
                                                            <img
                                                                src={textureUrl}
                                                                alt={`Texture ${
                                                                    index + 1
                                                                }`}
                                                                className="w-full h-20 object-cover rounded"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="sm"
                                                                className="absolute -top-1 -right-1 w-6 h-6 p-0"
                                                                onClick={() =>
                                                                    removeTexture(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}

                                        {textureError && flag && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {textureError}
                                            </p>
                                        )}
                                    </div>

                                    {/* Powered By Section */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                <Sparkles className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-slate-800">
                                                    Powered by Tripo SR AI
                                                </p>
                                                <p className="text-xs text-slate-600">
                                                    Images to 3D Model
                                                    reconstruction capabilities
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                <ImageIcon className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-slate-800">
                                                    Visualize by REPLACI
                                                </p>
                                                <p className="text-xs text-slate-600">
                                                    Models are used to visualize
                                                    furniture in room spaces
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                >
                                    {isSubmitting
                                        ? "Creating..."
                                        : "Create Model"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

// <main className="pt-16">
//     <Create3DModel />

export default CreateModelComponent;
