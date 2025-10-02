/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useRef, useState, useEffect, useContext } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TextureLoader } from "three/examples/jsm/loaders/TextureLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import apiClient from "@/api/apiService";
import { useNavigate } from "react-router-dom";
import { DashboardContext } from "@/context/DashboardContext";
import { toast } from "sonner";
import axios from "axios";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// React Image component
const Image = ({ src, alt, className, ...props }: any) => (
    <img src={src} alt={alt} className={className} {...props} />
);
import ProgressBar from "@ramonak/react-progress-bar";
// Import images - update these paths as needed
import uploadimg from "@/assets/images/uploadimg.svg";
import blankImg from "@/assets/images/blank.jpg";
import buffer from "@/assets/images/buffer.png";
import uploadedtick from "@/assets/images/uploaded-tick.svg";
// Import components
import AddLeadModal from "./AddLead";
// import ModalContact from "./ModalContact";
// Import SCSS styles
import "./TryonUploadImg.scss";
import { fetchDashboardData, getModels } from "@/api/dashboardService";

const s3Client = new S3Client({
        region: "ap-south-1",
        credentials: {
            accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
            secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY, // Changed from VITE_AWS_SECRET_ACCESS_KEY
        },
});
const TryonUploadImg = ({ modalObj, tryonActive }) => {
    const [image, setImage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [compareOriginalImg, setCompareOriginalImg] = useState(null);
    const [coordinate, setCoordinate] = useState("");
    const [getImgSize, setImgSize] = useState("");
    const [getImageId, setImgId] = useState("");
    const [removedObjImage, setremovedObjImage] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [imageFunction, setImageFunction] = useState(true);
    const [scene, setScene] = useState();
    const [allModels, setAllModels] = useState([]);
    const [products, setProducts] = useState([]);
    const [moveToAddLead, setMoveToAddLead] = useState(false);
    const [productItemStatus, setProductItemStatus] = useState(false);
    const [responseExt, setResponseExt] = useState("");
    const [sceneRenderer, setSceneRenderer] = useState("");
    const [awsImageKey, setAwsImageKey] = useState("");
    const [errorplanMsg, setErrorPlanMessage] = useState("");
    const [errorImage, setErrorMessage] = useState("");
    const [angleRotationObject, setAngleRotationObject] = useState(null);
    const [angleRotationValue, setAngleRotationValue] = useState(null);
    const [numberTryOn, setNumberTryon] = useState(0);
    // const [remainingNo, setRemainingNo] = useState(0)
    const [planId, setPlanID] = useState("");
    const token = localStorage.getItem("token");

    let imageDownloadBool = true;

    const dashboardData = async (): Promise<void> => {
        try {
            const res: any = await fetchDashboardData();
            setNumberTryon(res.data?.subscription_plan?.try_on);
            setPlanID(res.data?.subscription_plan?.plan_id);
        } catch (err: any) {
            console.error("Dashboard data fetch error:", err);
        }
    };
    
    useEffect(() => {
        dashboardData();
    }, []);

    const tryOnNumber = async (): Promise<void> => {
        try {
            const payload = new FormData();
            payload.append("plan_id", planId);

            const response: any = await apiClient.post(
                `${import.meta.env.VITE_API_BASE_URL}/try-on/`,
                payload
            );
            if (response.data) setNumberTryon(response.data?.count);
        } catch (error: any) {
            console.error("Error:", error);
            toast.error(
                error?.response?.data?.message || "Something went wrong."
            );
        }
    };

    let initialAngleValue: number = 180;
    let objectIndex: any;
    let getScene: boolean = true;
    let shadowPlane: any;
    let preservedTransform: any = null;

    useEffect(() => {
        const showroomActive = document.querySelector(".showroom-active");
        if (showroomActive) {
            showroomActive.remove();
        }
        setScene(new THREE.Scene());
    }, [image]);

    useEffect(() => {
        getModals();
    }, []);

    function getModals(): void {
        //revert
        getModels()
            .then((response: any) => {
                if (response?.data?.status === "true") {
                    setProducts(response.data.data);
                }
            })
            .catch((error: any) => {
                console.error("Error", error);
            });
    }

    // function getModals() {
    //   fetch("/modified_model.json")
    //     .then((response) => response.json())
    //     .then((data) => {
    //       if (data) {
    //         setProducts(data.data); // Assuming data is an array of models
    //       }
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching models.json:", error);
    //     });
    // }

    const uploadImageHandler = (event: any): void => {
        if (numberTryOn > 0) {
            setErrorMessage("");
            const validImageTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/heic",
                "image/heics",
            ];
            const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB limit
            const file = event.target.files[0];

            if (file && !validImageTypes.includes(file.type)) {
                return "Only JPG, JPEG, and PNG files are allowed.";
            }

            // Check if the file size exceeds the maximum allowed size
            if (file && file.size > MAX_FILE_SIZE) {
                setErrorMessage(
                    "The file size exceeds the maximum limit of 50 MB. Please upload a smaller file."
                );
                return;
            }

            const reader = new FileReader();

            reader.onload = function (e) {
                setCompareOriginalImg(e.target.result);
            };

            reader.readAsDataURL(file);

            setImage(null);
            setIsUploading(true);
            const formData = new FormData();
            formData.append("image", event.target.files[0]);
            getScene = true;

            console.log("formdata", formData);
            const fullUrl =
                import.meta.env.VITE_API_TOOL_IMAGE_BASE_URL +
                "/App/uploadImage2/";
            console.log("Full URL:", fullUrl);
            // const config = {
            //   headers: {
            //     'Content-Type': 'multipart/form-data', // Critical for file uploads
            //   },
            // };
            // axios.post("https://api.replaci.com/tool/App/uploadImage/", formData)
            axios
                .post(
                    import.meta.env.VITE_API_TOOL_IMAGE_BASE_URL +
                        "/App/uploadImage2/",
                    formData
                )

                .then((response) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(event.target.files[0]);
                    setCoordinate(response.data.XYXY_CoOrdinates);
                    setImgSize(response.data.imgSize);
                    setImgId(response.data.image_intance);
                    setResponseExt(response.data.ext);
                    setAwsImageKey(
                        response.data.aws_image_with_object_detected_key
                    );
                    setImageFunction(true);
                    setProductItemStatus(true);
                    tryOnNumber();
                    // setCanRunRemoveObject(true);
                    imageDownloadBool = true;
                    console.log("testt");
                })
                // .catch(error => {
                //   console.error("Upload failed:", error);
                //   setIsUploading(false);
                // });
                .catch((error) => {
                    console.error("Full error:", {
                        message: error.message,
                        response: error.response?.data, // API error details
                        config: error.config, // Request config
                    });
                    setIsUploading(false);
                });
            tryonActive(true);
        } else {
            tryonActive(false);
        }
    };

    // get image from s3 bucket

    // ...existing code...
    useEffect(() => {
        const getImageFromS3 = async () => {
            if (!awsImageKey) return;

            if (!s3Client) {
                console.error(
                    "S3 client not initialized - check AWS credentials"
                );
                toast.error("AWS configuration error");
                setIsUploading(false);
                return;
            }

            try {
                const bucketName = import.meta.env.VITE_BUCKET_NAME;

                if (!bucketName) {
                    throw new Error("Bucket name not configured");
                }

                const command = new GetObjectCommand({
                    Bucket: bucketName,
                    Key: awsImageKey,
                });

                const url = await getSignedUrl(s3Client, command, {
                    expiresIn: 3600, // 1 hour
                });

                console.log("Successfully generated signed URL");
                setImage(url);
                setIsUploading(false);
            } catch (error) {
                console.error("Error fetching signed URL:", error);
                setIsUploading(false);

                // More specific error messages
                if (error.message?.includes("credential")) {
                    toast.error("AWS credentials are invalid or missing");
                } else if (error.message?.includes("Bucket")) {
                    toast.error("S3 bucket configuration error");
                } else {
                    toast.error("Failed to load image from storage");
                }
            }
        };

        getImageFromS3();
    }, [awsImageKey]);
    // ...existing code...

    let objectGroup: any = null;
    const objectGroupArr: any[] = [];

    const navigate = useNavigate();

    function removeNewCoordinates(
        width: number,
        height: number,
        newWidth: number,
        newHeight: number,
        removedObjectCoordinates: number[]
    ): number[] {
        const originalX = removedObjectCoordinates[0];
        const originalY = removedObjectCoordinates[1];
        const originalX1 = removedObjectCoordinates[2];
        const originalY1 = removedObjectCoordinates[3];
        const scale1 = newWidth / width;
        const scale2 = newHeight / height;
        const newX = originalX * scale1;
        const newY = originalY * scale2;
        const newX2 = originalX1 * scale1;
        const newY2 = originalY1 * scale2;
        const newCoordinate = [newX, newY, newX2, newY2];
        return newCoordinate;
    }

    let viewZ: any;

    function convertScreenToWorldPosition(
        x: number,
        y: number,
        z: number,
        sceneWidth: number,
        sceneHeight: number,
        camera: THREE.Camera
    ): THREE.Vector3 {
        const ndcX = (x / sceneWidth) * 2 - 1;
        const ndcY = -(y / sceneHeight) * 2 + 1;
        const ndcVector = new THREE.Vector3(ndcX, ndcY, 0.5);
        const clipPosition = new THREE.Vector4(ndcX, ndcY, z * 2 - 1, 1);
        clipPosition.applyMatrix4(camera.projectionMatrixInverse);
        clipPosition.divideScalar(clipPosition.w);
        viewZ = clipPosition.z;
        const worldVector = ndcVector.unproject(camera);
        return worldVector;
    }
    function convertScreenToWorldScale(
        getWidth: number,
        getHeight: number,
        sceneWidth: number,
        sceneHeight: number,
        objectGroup: THREE.Group
    ): number {
        const scaleX = getWidth / sceneWidth;
        const scaleY = getHeight / sceneHeight;
        const box1 = new THREE.Box3().setFromObject(objectGroup);
        const size1 = new THREE.Vector3();
        box1.getSize(size1);
        const scaleFactor1 = scaleX / size1.x;
        const scaleFactor2 = scaleY / size1.y;
        return Math.min(scaleFactor1, scaleFactor2);
    }

    //toggle detectPart(the object detection buttons) visibility
    function toggleDetectPart(toggle: boolean): void {
        const detectPartAll = document.querySelectorAll(".detect-part");
        console.log("all detected parts", detectPartAll);
        if (detectPartAll.length > 0) {
            for (let i = 0; i < detectPartAll.length; i++) {
                detectPartAll[i].style.visibility = toggle
                    ? "visible"
                    : "hidden";
            }
        }
    }

    function getPreview(
        renderer: THREE.WebGLRenderer,
        scene: THREE.Scene,
        camera: THREE.Camera
    ): void {
        const preview = document.querySelector(".preview");
        preview.onclick = () => {
            const img_preview = document.querySelector(".img-preview");
            if (img_preview) return;
            else {
                renderer.render(scene, camera);
                const uploadedFilePreview =
                    document.querySelector(".canvas-wrap");
                const previewImgWrap = document.createElement("div");
                previewImgWrap.className = "img-preview";
                const imgPreview = document.createElement("img");
                imgPreview.className = "preview-image";
                previewImgWrap.appendChild(imgPreview);
                const previewClose = document.createElement("button");
                previewClose.setAttribute("type", "button");
                previewClose.className = "preview-close";
                previewImgWrap.appendChild(previewClose);
                toggleDetectPart(false);
                enhanceResolution(renderer);
                const imageUrl = renderer.domElement.toDataURL("image/jpg"); //snapshot is taken for the scene in its current form
                const compareBtn = document.createElement("button");
                compareBtn.setAttribute("type", "button");
                const compareIcon = document.createElement("i");
                compareIcon.className = "compare-icon";
                compareBtn.className = "compare-btn";
                compareBtn.innerText = "Compare";
                compareBtn.appendChild(compareIcon);
                // previewImgWrap.appendChild(compareBtn); //compare button disabled
                imgPreview.src = imageUrl;
                uploadedFilePreview.appendChild(previewImgWrap);
                closePreview(previewClose, previewImgWrap, renderer);
                getCompared(compareBtn, previewImgWrap, renderer);

                // setTimeout(() => {
                //   resetResolution(renderer);
                // }, 100);
            }
        };
    }
    function getCompared(
        compareBtn: HTMLElement,
        previewImgWrap: HTMLElement,
        renderer: THREE.WebGLRenderer
    ): void {
        compareBtn.onclick = () => {
            resetResolution(renderer);
            const showroomActive = document.querySelector(".showroom-active");
            const showroomActiveWidth = showroomActive.offsetWidth;
            const showroomActiveHeight = showroomActive.offsetHeight;
            const comparedWrap = document.createElement("div");
            comparedWrap.classList.add("compared-wrap");
            const overlayDiv = document.createElement("div");
            overlayDiv.className = "overlay-div";

            const oldImageWrap = document.createElement("div");
            oldImageWrap.className = "old-image";

            const Prev = document.createElement("div");
            Prev.className = "prev-btn";
            Prev.onclick = function (e) {
                comparedWrap.classList.remove("effect-view");
                Next.classList.remove("active");
                Prev.classList.add("active");
            };
            const oldImageBlock = document.createElement("img");
            oldImageBlock.src = compareOriginalImg;

            oldImageWrap.appendChild(oldImageBlock);
            oldImageWrap.appendChild(Prev);
            comparedWrap.appendChild(oldImageWrap);
            const newImageWrap = document.createElement("div");
            newImageWrap.className = "new-image";
            const Next = document.createElement("div");
            Next.className = "next-btn";
            const newImageBlock = document.createElement("img");
            const newImage = renderer.domElement.toDataURL("image/jpg");
            newImageBlock.src = newImage;
            newImageBlock.setAttribute("width", `${showroomActiveWidth / 2}px`);
            newImageBlock.setAttribute(
                "height",
                `${showroomActiveHeight / 2}px`
            );

            newImageWrap.appendChild(newImageBlock);
            oldImageWrap.appendChild(Next);

            comparedWrap.appendChild(newImageWrap);

            const compareClose = document.createElement("button");
            compareClose.setAttribute("type", "button");
            compareClose.className = "compare-close";
            comparedWrap.appendChild(compareClose);
            comparedWrap.appendChild(overlayDiv);
            previewImgWrap.appendChild(comparedWrap);
            Next.onclick = function (e) {
                comparedWrap.classList.add("effect-view");
                Prev.classList.remove("active");
                Next.classList.add("active");
            };
            closeCompared(comparedWrap, compareClose);
        };
    }
    function closeCompared(
        comparedWrap: HTMLElement,
        compareClose: HTMLElement
    ): void {
        compareClose.addEventListener("click", () => {
            comparedWrap.remove();
        });
    }

    function closePreview(
        previewClose: HTMLElement,
        previewImgWrap: HTMLElement,
        renderer: THREE.WebGLRenderer
    ): void {
        previewClose.onclick = () => {
            previewImgWrap.remove();
            resetResolution(renderer);
            toggleDetectPart(true);
        };
    }

    //shadow plane
    function createShadow(objectGroup: THREE.Group, scene: THREE.Scene): void {
        // Compute bounding box and center
        const bbox = new THREE.Box3().setFromObject(objectGroup);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const center = new THREE.Vector3();
        bbox.getCenter(center);

        // Plane dimensions with padding
        const padding = 20;
        const planeWidth = size.x + padding;
        const planeHeight = size.z + padding;

        // Create the plane geometry
        const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
        const planeMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 1,
            metalness: 0,
            transparent: true,
            opacity: 0.4,
        });

        shadowPlane = new THREE.Mesh(planeGeometry, planeMaterial);

        // Keep the plane flat, but rotate in Y to match objectGroup
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.rotation.y = objectGroup.rotation.y;
        shadowPlane.rotation.z = objectGroup.rotation.z;

        // Position the plane just below the objectGroup
        shadowPlane.position.set(center.x, bbox.min.y - 1, center.z);

        //scale
        shadowPlane.scale.set(0.75, 1, 0.3); // scale X more than Z for oval shape

        // Enable shadow receiving
        shadowPlane.receiveShadow = true;

        // Add to scene
        scene.add(shadowPlane);

        // //make it child of objectgroup
        // shadowPlane.parent = objectGroup;
    }

    function getSceneChild(
        object: THREE.Object3D,
        scene: THREE.Scene
    ): THREE.Object3D {
        let current = object;
        while (current.parent && current.parent !== scene) {
            current = current.parent;
        }
        return current;
    }

    function hidePopup(): void {
        const existingPopup = document.querySelector(".popup-option");
        if (existingPopup) {
            existingPopup.remove();
        }
        if (selectedCircle) {
            scene.remove(selectedCircle);
            selectedCircle = null;
        }

        intersectedObject = null;
    }

    function postResolutionChangeUpdates(renderer) {
        camera.aspect = canvasSizes.width / canvasSizes.height;
        camera.updateProjectionMatrix();
        // renderer.render(scene, camera);

        setTimeout(() => {
            perMeshOperation(renderer);
        }, 100);
    }

    function enhanceResolution(renderer) {
        // const topLevelObject = getSceneChild(intersectedObject, scene);
        // createShadow(topLevelObject, scene);
        renderer.setPixelRatio(window.devicePixelRatio);

        postResolutionChangeUpdates(renderer);

        hidePopup();
    }

    function resetResolution(renderer) {
        renderer.setPixelRatio(1);
        postResolutionChangeUpdates(renderer);
    }

    function addDefaultTexture(object: any): void {
        const defaultTexture = textureItems[0];
        const imgElement = defaultTexture.querySelector("img");
        if (imgElement) {
            console.log("texture image source", imgElement); // Logs clicked image's source path
            // changeModelTexture(imgElement.src,intersectedObject);
            const textureSet = {
                albedoMap: imgElement.dataset.albedo || null,
                roughnessMap: imgElement.dataset.roughness || null,
                normalMap: imgElement.dataset.normal || null,
                aoMap: imgElement.dataset.ao || null,
                emissiveMap: imgElement.dataset.em || null,
            };
            changeModelTexture2(textureSet, object);
        }
    }

    function changeModelTexture(
        texturePath: string,
        intersectedObject: any
    ): void {
        const textureLoader = new THREE.TextureLoader();
        if (texturePath) {
            textureLoader.load(
                texturePath,
                function (texture) {
                    if (intersectedObject) {
                        texture.colorSpace = THREE.SRGBColorSpace;
                        texture.magFilter = THREE.LinearFilter;
                        intersectedObject.traverse((child) => {
                            if (child.isMesh) {
                                if (child.material.map) {
                                    if (
                                        child.material instanceof
                                            THREE.MeshPhongMaterial ||
                                        child.material instanceof
                                            THREE.MeshStandardMaterial
                                    ) {
                                        child.material.map = texture;
                                        child.material.needsUpdate = true;
                                    } else {
                                        console.warn(
                                            "Child material is not compatible with textures:",
                                            child.material
                                        );
                                    }
                                } else {
                                    child.material =
                                        new THREE.MeshPhongMaterial({
                                            map: texture,
                                            side: THREE.DoubleSide,
                                        });
                                }
                            }
                        });
                    }
                },
                undefined,
                function (err) {
                    console.error(
                        "An error occurred while loading the texture:",
                        err
                    );
                }
            );
        }
    }

    let currentMaterial: any;
    function changeModelTexture2(
        textureSet: any,
        intersectedObject: any,
        renderer?: THREE.WebGLRenderer
    ): void {
        console.log("Changing the texture for", intersectedObject?.name);

        if (!intersectedObject) {
            console.warn("No valid object selected for texture change.");
            return;
        }

        if (!textureSet || textureSet.length === 0) {
            console.warn("No textures available.");
            return;
        }

        console.log("Albedo Map Path:", textureSet.albedoMap);
        console.log("Roughness Map Path:", textureSet.roughnessMap);
        console.log("Normal Map Path:", textureSet.normalMap);
        console.log("AO Map Path:", textureSet.aoMap);
        console.log("Emissive Map:", textureSet.emissiveMap);

        const textureLoader = new THREE.TextureLoader();

        // ✅ Load textures only if the path exists
        const loadTexture = (path) => (path ? textureLoader.load(path) : null);

        const albedoMap = loadTexture(textureSet.albedoMap);
        const roughnessMap = loadTexture(textureSet.roughnessMap);
        const normalMap = loadTexture(textureSet.normalMap);
        const aoMap = loadTexture(textureSet.aoMap);
        const emissiveMap = loadTexture(textureSet.emissiveMap);

        // ✅ Apply texture quality improvements if texture exists
        // [albedoMap, roughnessMap, normalMap, aoMap].forEach((map) => {
        //   if (map) {
        //     map.colorSpace = THREE.SRGBColorSpace; // Ensure correct color output
        //     map.magFilter = THREE.LinearFilter; // Smooth rendering
        //     map.minFilter = THREE.LinearMipMapLinearFilter; // Enable Mipmapping
        //     map.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Maximum texture sharpness
        //     map.wrapS = THREE.RepeatWrapping;
        //     map.wrapT = THREE.RepeatWrapping;
        //   }
        // });

        // ✅ Ensure correct traversal of the 3D model
        const children = intersectedObject.children || [];

        children.forEach((mesh) => {
            if (mesh.isMesh) {
                console.log("Processing mesh:", mesh.name);

                if (
                    mesh.material instanceof THREE.MeshStandardMaterial ||
                    mesh.material instanceof THREE.MeshPhysicalMaterial ||
                    mesh.material instanceof THREE.MeshPhongMaterial
                ) {
                    // ✅ Assign texture maps only if they exist
                    if (albedoMap) mesh.material.map = albedoMap;
                    if (roughnessMap) mesh.material.roughnessMap = roughnessMap;
                    if (normalMap) {
                        mesh.material.normalMap = normalMap;
                        mesh.material.normalScale = new THREE.Vector2(2, 2); // Enhance normal map effect
                    }
                    if (aoMap) mesh.material.aoMap = aoMap;
                    // if (emissiveMap) {
                    //   mesh.material.emissive = new THREE.Color(0xffffff);
                    //   mesh.material.emissiveMap = emissiveMap;
                    // }

                    if (
                        mesh.material instanceof THREE.MeshStandardMaterial ||
                        mesh.material instanceof THREE.MeshPhysicalMaterial
                    ) {
                        mesh.material.metalness = 0.2; // Adjust this value as needed**
                    }

                    mesh.material.needsUpdate = true;
                    currentMaterial = mesh.material;
                    console.log(`✅ Applied textures to ${mesh.name}`);

                    // setTimeout(() => {
                    //   applyDepthMap(mesh);
                    // }, 100);
                } else {
                    console.warn("Material not compatible:", mesh.material);
                }
            }
        });
    }

    // Enable emissive map
    function enableEmissive(): void {
        currentMaterial.emissive = new THREE.Color(0xffffff); // or desired emissive color
        currentMaterial.needsUpdate = true;
    }

    // Disable emissive map
    function disableEmissive(): void {
        currentMaterial.emissive = new THREE.Color(0x000000); // Turn off emissive color
        currentMaterial.needsUpdate = true;
    }

    function applyDepthMap(mesh: THREE.Mesh): void {
        // Preserve texture while applying depth shader
        if (depthShaderMaterial) {
            const originalMaterial = mesh.material;
            const newMaterial = originalMaterial.clone();

            newMaterial.onBeforeCompile = (shader) => {
                shader.uniforms.depthMap = { value: depthTexture };
                shader.uniforms.cameraNear = { value: camera.near };
                shader.uniforms.cameraFar = { value: camera.far };
                shader.uniforms.screenSize = { value: screenSize };

                shader.fragmentShader = shader.fragmentShader.replace(
                    "void main() {",
                    `
              uniform sampler2D depthMap;
              uniform float cameraNear;
              uniform float cameraFar;
              uniform vec2 screenSize;

              float unpackDepth(vec4 rgbaDepth) {
                  const vec4 bitShifts = vec4(1.0, 1.0 / 255.0, 1.0 / (255.0 * 255.0), 1.0 / (255.0 * 255.0 * 255.0));
                  return dot(rgbaDepth, bitShifts);
              }

              float getLinearDepth(float fragDepth) {
                  return (2.0 * cameraNear * cameraFar) / (cameraFar + cameraNear - fragDepth * (cameraFar - cameraNear));
              }

              void main() {
                  vec2 uv = gl_FragCoord.xy / screenSize;
                  float sceneDepth = unpackDepth(texture2D(depthMap, uv));
                  float linearDepth = getLinearDepth(gl_FragCoord.z);
                  linearDepth = (linearDepth - cameraNear) / (cameraFar - cameraNear);

                  if (1.0 * linearDepth > sceneDepth) discard;
              `
                );
            };

            newMaterial.transparent = true; // needed for discard to work properly
            mesh.material = newMaterial;
            mesh.material.needsUpdate = true;
        }
    }

    function adjustCameraMatrixForResize(
        cameraMatrix: any,
        newWidth: number,
        newHeight: number
    ): any {
        const originalWidth = cameraMatrix.imageWidth;
        const originalHeight = cameraMatrix.imageHeight;
        const scaleX = newWidth / originalWidth;
        const scaleY = newHeight / originalHeight;
        const adjustedCameraMatrix = {
            ...cameraMatrix,
            f_x: cameraMatrix.f_x * scaleX,
            f_y: cameraMatrix.f_y * scaleY,
            c_x: cameraMatrix.c_x * scaleX,
            c_y: cameraMatrix.c_y * scaleY,
            imageWidth: newWidth,
            imageHeight: newHeight,
            x_center: cameraMatrix.x_center * scaleX,
            y_center: cameraMatrix.y_center * scaleY,
        };
        return adjustedCameraMatrix;
    }

    function getModelCenter(object: THREE.Object3D): THREE.Vector3 {
        const box = new THREE.Box3().setFromObject(object);
        const center = new THREE.Vector3();
        box.getCenter(center);
        return center;
    }

    function normalizeScaleToFit(
        object: THREE.Object3D,
        targetWidth: number,
        targetHeight: number
    ): void {
        // Compute the bounding box of the object
        const box = new THREE.Box3().setFromObject(object);
        const size = new THREE.Vector3();
        box.getSize(size);

        // Handle cases where size is zero (to avoid division by zero errors)
        if (size.x === 0 || size.y === 0 || size.z === 0) {
            console.warn("Object size is zero. Cannot normalize scale.");
            return;
        }

        // Calculate scale factors for both width and height
        const scaleFactorWidth = targetWidth / size.x;
        const scaleFactorHeight = targetHeight / size.y;

        // Use the smaller scale factor to maintain aspect ratio
        const scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight);

        // Apply the scale uniformly to the object
        object.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }

    //the properties that need to be setup for all meshes in the scene
    function perMeshOperation(renderer: THREE.WebGLRenderer): void {
        objectGroupArr.forEach((objectGroup) => {
            objectGroup.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;

                    depthMapSetup(child, renderer); //load depthmap if only setting for first-time
                }
            });
        });
        if (shadowPlane) {
            depthMapSetup(shadowPlane);
        }
        setTimeout(() => {
            console.log(
                "Canvas:",
                renderer.domElement.width,
                renderer.domElement.height
            );
            console.log(
                "ScreenSize uniform:",
                depthShaderMaterial.uniforms.screenSize.value
            );
        }, 100);
    }

    function addObjObject(
        pathMtl: string,
        pathObj: string,
        texturePath: string,
        objectId: string,
        newWidth: number,
        newHeight: number,
        removedObjectCoordinates: number[],
        scene: THREE.Scene,
        camera: THREE.Camera,
        imageIndex: number,
        z: number,
        angleRotation: number,
        renderer: THREE.WebGLRenderer,
        cameraMatrix: any
    ): void {
        const showroomActive = document.querySelector(".showroom-active");
        const sceneWidth = showroomActive.clientWidth;
        const sceneHeight = showroomActive.clientHeight;
        const originalImageWidth = getImgSize[1];
        const originalImageHeight = getImgSize[0];
        const adjustedCameraMatrix = adjustCameraMatrixForResize(
            cameraMatrix,
            newWidth,
            newHeight
        );
        let X_world;
        let Y_world;
        const Z_world = adjustedCameraMatrix.mean_depth_estimation_img / 2;

        if (
            adjustedCameraMatrix.c_x &&
            adjustedCameraMatrix.c_y &&
            adjustedCameraMatrix.f_x &&
            adjustedCameraMatrix.f_y
        ) {
            X_world =
                ((adjustedCameraMatrix.x_center - adjustedCameraMatrix.c_x) *
                    adjustedCameraMatrix.mean_depth_estimation_img) /
                adjustedCameraMatrix.f_x;
            Y_world =
                -(
                    (adjustedCameraMatrix.y_center - adjustedCameraMatrix.c_y) *
                    adjustedCameraMatrix.mean_depth_estimation_img
                ) / adjustedCameraMatrix.f_y;
        }
        const newCoordinatesRemoval = removeNewCoordinates(
            originalImageWidth,
            originalImageHeight,
            newWidth,
            newHeight,
            removedObjectCoordinates
        );
        const newxPosition =
            (newCoordinatesRemoval[2] + newCoordinatesRemoval[0]) / 2;
        const newyPosition =
            (newCoordinatesRemoval[3] + newCoordinatesRemoval[1]) / 2;
        const getY = sceneHeight + newyPosition;
        const getWidth = newCoordinatesRemoval[2] - newCoordinatesRemoval[0];
        const getHeight = newCoordinatesRemoval[3] - newCoordinatesRemoval[1];
        const position = convertScreenToWorldPosition(
            newxPosition,
            newyPosition,
            z,
            sceneWidth,
            sceneHeight,
            camera
        );

        let setPositionY;
        let setPositionX;
        let newZPosition;
        if (X_world && Y_world && Z_world) {
            setPositionY = Y_world;
            setPositionX = position.x * 1000;
            newZPosition = -Z_world;
        } else {
            setPositionY = position.y * 100;
            setPositionX = position.x * 1000;
            newZPosition = -Z_world;
        }

        if (setPositionX < -170) {
            setPositionX = setPositionX + 50;
        } else if (setPositionX > 210) {
            setPositionX = setPositionX - 80;
        }

        const rotationAngleRad = THREE.MathUtils.degToRad(
            ((angleRotation % 360) + 360) % 360
        );

        function addLight(selectedObject, scene) {
            // Create a SpotLight
            const spotLight = new THREE.SpotLight(0xffffff, 1.5);

            // Position it directly above the object
            spotLight.position.set(
                selectedObject.position.x,
                selectedObject.position.y + 100,
                selectedObject.position.z
            );

            // Make it point toward the object
            spotLight.target.position.set(
                selectedObject.position.x,
                selectedObject.position.y,
                selectedObject.position.z
            );

            // Enable shadows
            spotLight.castShadow = true;
            spotLight.angle = Math.PI / 6; // Narrow spotlight cone
            spotLight.penumbra = 0.3;
            spotLight.decay = 2;
            spotLight.distance = 200;

            // Add light and target to the scene
            scene.add(spotLight);
            scene.add(spotLight.target);

            const spotHelper = new THREE.SpotLightHelper(spotLight);
            scene.add(spotHelper);
        }

        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();
        if (pathMtl && pathObj) {
            mtlLoader.load(pathMtl, function (materials) {
                // console.log("duie3uif3");
                materials.preload();
                objLoader.setMaterials(materials);
                objLoader.load(pathObj, function (object) {
                    console.log("duie3rjfbi4euif3");
                    objectGroup = new THREE.Group();

                    const centerPoint = getModelCenter(object);
                    object.position.sub(centerPoint);

                    objectGroup.add(object);
                    const scale = convertScreenToWorldScale(
                        getWidth,
                        getHeight,
                        sceneWidth,
                        sceneHeight,
                        objectGroup
                    );
                    const setScale = scale * 500;
                    objectGroup.scale.set(setScale, setScale, setScale);
                    // normalizeScaleToFit(objectGroup, getWidth, getHeight);
                    objectGroup.position.set(
                        setPositionX,
                        setPositionY - 35,
                        newZPosition - 150
                    );

                    objectGroup.userData.username = objectId;
                    objectGroupArr.push(objectGroup);

                    //load the depth texture
                    depthTexture = new THREE.TextureLoader().load(depthMapUrl);

                    // objectGroup.position.copy(centerPoint);
                    perMeshOperation(renderer);
                    // **CREATE SHADOW RECEIVING PLANE**
                    scene.add(objectGroup);

                    // changeModelTexture(texturePath, objectGroup);
                    // addDefaultTexture(object);
                    renderer.shadowMap.needsUpdate = true;
                    // addLight(objectGroup,scene);
                    setAllModels((prevModels) => [...prevModels, objectId]);
                    renderer.render(scene, camera);
                    setSceneRenderer([renderer, scene, camera]);
                    getPreview(renderer, scene, camera);
                    setAngleRotationObject(object);
                    setAngleRotationValue(rotationAngleRad);

                    if (preservedTransform) {
                        object.position.copy(preservedTransform.position);
                        object.rotation.copy(preservedTransform.rotation);
                        object.scale.copy(preservedTransform.scale);
                        preservedTransform = null; // consume once
                    }
                    // createShadow(objectGroup,scene)
                });
            });
        }
        removeIdentifiedObjectWrap(imageIndex);
    }

    // gltf file loader
    function gltfFileLoader(
        objectPathMtl: string,
        texturePath: string,
        objectId: string,
        newWidth: number,
        newHeight: number,
        removedObjectCoordinates: number[],
        scene: THREE.Scene,
        camera: THREE.Camera,
        imageIndex: number,
        z_value: number,
        angleRotation: number,
        renderer: THREE.WebGLRenderer,
        cameraMatrix: any
    ): void {
        const showroomActive = document.querySelector(".showroom-active");
        const sceneWidth = showroomActive.clientWidth;
        const sceneHeight = showroomActive.clientHeight;
        const originalImageWidth = getImgSize[1];
        const originalImageHeight = getImgSize[0];

        const adjustedCameraMatrix = adjustCameraMatrixForResize(
            cameraMatrix,
            newWidth,
            newHeight
        );
        let X_world;
        let Y_world;
        const Z_world = adjustedCameraMatrix.mean_depth_estimation_img / 2;

        if (
            adjustedCameraMatrix.c_x &&
            adjustedCameraMatrix.c_y &&
            adjustedCameraMatrix.f_x &&
            adjustedCameraMatrix.f_y
        ) {
            X_world =
                ((adjustedCameraMatrix.x_center - adjustedCameraMatrix.c_x) *
                    adjustedCameraMatrix.mean_depth_estimation_img) /
                adjustedCameraMatrix.f_x;
            Y_world =
                -(
                    (adjustedCameraMatrix.y_center - adjustedCameraMatrix.c_y) *
                    adjustedCameraMatrix.mean_depth_estimation_img
                ) / adjustedCameraMatrix.f_y;
        }
        const newCoordinatesRemoval = removeNewCoordinates(
            originalImageWidth,
            originalImageHeight,
            newWidth,
            newHeight,
            removedObjectCoordinates
        );
        const newxPosition =
            (newCoordinatesRemoval[2] + newCoordinatesRemoval[0]) / 2;
        const newyPosition =
            (newCoordinatesRemoval[3] + newCoordinatesRemoval[1]) / 2;
        const getY = sceneHeight + newyPosition;
        const getWidth = newCoordinatesRemoval[2] - newCoordinatesRemoval[0];
        const getHeight = newCoordinatesRemoval[3] - newCoordinatesRemoval[1];
        const position = convertScreenToWorldPosition(
            newxPosition,
            newyPosition,
            z_value,
            sceneWidth,
            sceneHeight,
            camera
        );

        let setPositionY;
        let setPositionX;
        let newZPosition;
        if (X_world && Y_world && Z_world) {
            setPositionY = Y_world;
            setPositionX = position.x * 1000;
            newZPosition = -Z_world;
        } else {
            setPositionY = position.y * 100;
            setPositionX = position.x * 1000;
            newZPosition = -Z_world;
        }

        if (setPositionX < -170) {
            setPositionX = setPositionX + 50;
        } else if (setPositionX > 210) {
            setPositionX = setPositionX - 80;
        }
        const loader = new GLTFLoader();

        loader.load(
            objectPathMtl,
            (object) => {
                objectGroup = new THREE.Group();
                const centerPoint = getModelCenter(object.scene);
                object.scene.position.sub(centerPoint);
                objectGroup.add(object.scene);
                const scale = convertScreenToWorldScale(
                    getWidth,
                    getHeight,
                    sceneWidth,
                    sceneHeight,
                    objectGroup
                );
                const setScale = scale * 500;
                objectGroup.scale.set(setScale, setScale, setScale);
                // normalizeScaleToFit(objectGroup, getWidth, getHeight);
                objectGroup.position.set(
                    setPositionX,
                    setPositionY - 70,
                    newZPosition - 150
                );
                object.scene.userData.username = objectId;
                objectGroup.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                const shadowPlaneGeometry = new THREE.PlaneGeometry(500, 500);
                const shadowPlaneMaterial = new THREE.ShadowMaterial({
                    opacity: 1, // Adjust transparency of shadow
                });

                const shadowPlane = new THREE.Mesh(
                    shadowPlaneGeometry,
                    shadowPlaneMaterial
                );
                shadowPlane.rotation.x = -Math.PI / 2; // Lay flat on the ground
                shadowPlane.position.set(
                    setPositionX,
                    setPositionY - 75,
                    newZPosition - 150
                ); // Slightly below the model
                shadowPlane.receiveShadow = true;

                scene.add(shadowPlane);
                scene.add(objectGroup);
                changeModelTexture(texturePath, objectGroup);
                setAllModels((prevModels) => [...prevModels, objectId]);
                renderer.render(scene, camera);
                setSceneRenderer([renderer, scene, camera]);
                getPreview(renderer, scene, camera);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            (error) => {
                console.error(
                    "An error occurred while loading the model:",
                    error
                );
            }
        );
        removeIdentifiedObjectWrap(imageIndex);
    }

    useEffect(() => {
        if (angleRotationObject && angleRotationValue) {
            angleRotationObject.rotation.y = angleRotationValue;
        }
    }, [angleRotationObject, angleRotationValue]);

    function removeIdentifiedObjectWrap(index: number): void {
        const detectPart = document.querySelectorAll(".detect-part");
        detectPart.forEach(function (e, i) {
            const objectIndicator = e.querySelector(".object-indicator");
            if (index == objectIndicator.innerText - 1) {
                e.remove();
            }
        });
    }

    function addDefaultObject(
        objectPathMtl: string,
        objectPathObj: string,
        textureFile: string,
        objectId: string,
        scene: THREE.Scene,
        camera: THREE.Camera,
        renderer: THREE.WebGLRenderer
    ): void {
        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();
        if (objectPathMtl && objectPathObj) {
            mtlLoader.load(objectPathMtl, function (materials) {
                // console.log("duie3uif334567898765");
                materials.preload();
                objLoader.setMaterials(materials);
                objLoader.load(objectPathObj, function (object) {
                    objectGroup = new THREE.Group();
                    objectGroup.add(object);
                    const box1 = new THREE.Box3().setFromObject(objectGroup);
                    const size1 = new THREE.Vector3();
                    box1.getSize(size1);
                    const scaleFactor1 = 150 / size1.x;
                    const scaleFactor2 = 150 / size1.y;
                    const setScale = Math.min(scaleFactor1, scaleFactor2);
                    objectGroup.scale.set(setScale, setScale, setScale);
                    objectGroup.position.set(0, -100, -70);
                    objectGroup.userData.username = objectId;
                    // object.rotation.y = 75.53 ;
                    scene.add(objectGroup);
                    changeModelTexture(textureFile, objectGroup);
                    setAllModels((prevModels) => [...prevModels, objectId]);
                    renderer.render(scene, camera);
                    getPreview(renderer, scene, camera);
                    setSceneRenderer([renderer, scene, camera]);
                    // createCustomShadow(object,setScale);
                });
            });
        }
    }

    let depthMapUrl: string;
    const counter: number = 0;
    const removeObjectHandler = (
        objectPathMtl: string,
        objectPathObj: string,
        textureFile: string,
        objectId: string,
        newWidth: number,
        newHeight: number,
        scene: THREE.Scene,
        camera: THREE.Camera,
        imageIndex: number,
        renderer: THREE.WebGLRenderer
    ): void => {
        const formData = new FormData();
        formData.append("objIndex", objectIndex);
        formData.append("imageId", getImageId);
        formData.append("image_base64", image);
        formData.append("ext", responseExt);
        formData.append("newWidth", newWidth);
        formData.append("newHeight", newHeight);

        getScene = false;
        setIsUploading(true);
        axios
            .post(
                import.meta.env.VITE_API_TOOL_IMAGE_BASE_URL +
                    "/App/RemoveObjectViaFlux/",
                formData
            )
            .then((response) => {
                // setremovedObjImage(response.data.removedImageToBase64);
                setImageFunction(false);
                const removedObjectCoordinates =
                    response.data.cordinates_Of_Obj;
                const z_value = response.data.z_axis_depth_obj;
                const cameraMatrix = response.data.camera_metrix;
                const angleRotation = response.data.angle_deg;
                // let depthMapUrl = process.env.S3_BUCKET_URL + response.data.depth_map;
                // depthMapUrl =
                //   "https://replacii.s3.ap-south-1.amazonaws.com/" +
                //   response.data.depth_map;
                depthMapUrl = `https://replacii.s3.ap-south-1.amazonaws.com/${
                    response.data.depth_map
                }?t=${Date.now()}`;
                // if(counter == 0)
                // {
                //   depthMapUrl = `https://replacii.s3.ap-south-1.amazonaws.com/depth_maps/13922__image_depth_map.png`;
                // }
                // if(counter == 1)
                // {
                //   depthMapUrl = `https://replacii.s3.ap-south-1.amazonaws.com/depth_maps/13923__image_depth_map.png`;
                // }
                // counter ++;

                console.log("updated depthmap", depthMapUrl);

                // if (!imageDownloadBool)
                // {
                //     console.log("Skipping removeObjectHandler — already executed for current image.");
                //     setIsUploading(false);
                // }
                // else{
                // imageDownloadBool = false;
                // getReplacedImageS3(response.data.aws_inpainted_img_key);
                // }

                getReplacedImageS3(response.data.aws_inpainted_img_key);
                // condition to check obj and glb
                const extension = objectPathObj.split(".").pop();
                if (extension === "obj") {
                    addObjObject(
                        objectPathMtl,
                        objectPathObj,
                        textureFile,
                        objectId,
                        newWidth,
                        newHeight,
                        removedObjectCoordinates,
                        scene,
                        camera,
                        imageIndex,
                        z_value,
                        angleRotation,
                        renderer,
                        cameraMatrix
                    );
                } else if (extension === "glb") {
                    gltfFileLoader(
                        objectPathObj,
                        textureFile,
                        objectId,
                        newWidth,
                        newHeight,
                        removedObjectCoordinates,
                        scene,
                        camera,
                        imageIndex,
                        z_value,
                        angleRotation,
                        renderer,
                        cameraMatrix
                    );
                }
            })
            // .then(() => )
            .catch((error) => {
                console.error("Upload failed:", error);
                setIsUploading(false);
            });
    };

    // fetch replaced image from s3

    const getReplacedImageS3 = async (imageKey: string): Promise<void> => {
        if (!imageKey) return;

        if (!s3Client) {
            console.error("S3 client not initialized");
            toast.error("AWS service not available");
            setIsUploading(false);
            return;
        }

        try {
            const bucketName = import.meta.env.VITE_BUCKET_NAME;

            if (!bucketName) {
                throw new Error("Bucket name not configured");
            }

            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: imageKey,
            });

            const url = await getSignedUrl(s3Client, command, {
                expiresIn: 3600,
            });

            setremovedObjImage(url);
            setIsUploading(false);
        } catch (error) {
            console.error("Error fetching signed URL:", error);
            setIsUploading(false);

            if (error.message?.includes("credential")) {
                toast.error("AWS credentials are invalid or missing");
            } else {
                toast.error("Failed to load processed image");
            }
        }
    };

    let camera: THREE.PerspectiveCamera,
        canvas: HTMLCanvasElement,
        canvasSizes: { width: number; height: number };
    let textureItems: NodeListOf<Element>;
    let intersectedObject: any = null;

    let selectedCircle: any = null;

    useEffect(() => {
        const productBtn = document.querySelectorAll(".import-model");
        const boundDrag = false;
        if (image) {
            const preCanvas = document.querySelector("#mycanvas-showroom");
            if (preCanvas) {
                preCanvas.remove();
            }
            canvas = document.createElement("canvas");
            canvas.classList.add("showroom-active");
            canvas.setAttribute("id", "mycanvas-showroom");
            const uploadedWrap = document.querySelector(".canvas-wrap");
            uploadedWrap.appendChild(canvas);
            const productItem = document.querySelectorAll(".product-item");
            const uploadedFile = document.querySelector(".uploaded-file ");
            textureItems = document.querySelectorAll(".texture-item");
            let renderer;
            let dynamicHeight;
            function newHieght() {
                dynamicHeight =
                    uploadedFile.offsetWidth * (getImgSize[0] / getImgSize[1]);
            }
            newHieght();

            // sizes of Canvas Upload New Image￼￼Choose fileNo file chosen
            if (productItemStatus) {
                productItem.forEach((item) => {
                    item.classList.add("active"); //product list becomes active when image is uploaded
                });

                addModelToScene();
            }
            canvasSizes = {
                width: uploadedFile.offsetWidth,
                height: dynamicHeight,
            };

            const updateCanvasSize = (canvas) => {
                canvas.width = canvasSizes.width;
                canvas.height = canvasSizes.height;
            };

            updateCanvasSize(canvas);

            // scene & camera integration
            // const fov = 2 * Math.atan(4.8 / (2 * 17)) * (180 / Math.PI);

            camera = new THREE.PerspectiveCamera(
                75,
                canvasSizes.width / canvasSizes.height,
                0.1,
                2000
            );
            camera.position.z = 150;
            camera.rotation.x = THREE.MathUtils.degToRad(-65);
            camera.lookAt(0, 5, 0);

            // eslint-disable-next-line prefer-const
            renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                antialias: true,
                preserveDrawingBuffer: true,
            });
            renderer.depthTest = true;
            renderer.gammaInput = true;
            renderer.gammaOutput = true;
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            // Optional: enable physically correct lighting if using PBR materials
            renderer.physicallyCorrectLights = true;

            // Optional: tone mapping and output encoding (important for realistic materials)
            // renderer.outputEncoding = THREE.sRGBEncoding;
            // renderer.toneMapping = THREE.ACESFilmicToneMapping;
            // renderer.toneMappingExposure = 1.0;
            renderer.setSize(canvasSizes.width, canvasSizes.height);

            // Postprocessing setup
            // const composer = new EffectComposer(renderer);
            // composer.addPass(new RenderPass(scene, camera));

            // const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
            // composer.addPass(outlinePass);

            // // Highlight settings
            // outlinePass.edgeStrength = 3.0;
            // outlinePass.edgeGlow = 1.0;
            // outlinePass.edgeThickness = 1.0;
            // outlinePass.pulsePeriod = 2;
            // outlinePass.visibleEdgeColor.set('#ffff00'); // Yellow
            // outlinePass.hiddenEdgeColor.set('#190a05');  // Subtle dark

            // // Highlight this mesh (same as Babylon HighlightLayer.addMesh)
            // outlinePass.selectedObjects = [];

            // renderer.setPixelRatio(window.devicePixelRatio);
            // resize function
            window.addEventListener("resize", () => {
                const uploadedFile = document.querySelector(".uploaded-file ");
                if (uploadedFile) {
                    canvasSizes.width = uploadedFile.offsetWidth;
                    camera.aspect = canvasSizes.width / canvasSizes.height;
                    updateCanvasSize(canvas);
                    camera.updateProjectionMatrix();
                    renderer.setSize(canvasSizes.width, canvasSizes.height);
                }
            });

            // image select
            function selectImage(): void {
                if (coordinate) {
                    for (let i = 0; i < coordinate.length; i++) {
                        const detectedObject = coordinate[i];
                        const xCoordinate = detectedObject[0];
                        const yCoordinate = detectedObject[1];
                        const x2Coordinate = detectedObject[2];
                        const y2Coordinate = detectedObject[3];
                        createSelectionDiv(
                            xCoordinate,
                            yCoordinate,
                            x2Coordinate,
                            y2Coordinate,
                            i
                        );
                    }
                }
            }

            // make active category list
            function activeProductList(
                newWidth: number,
                newHeight: number,
                imageIndex: string
            ): void {
                productItem.forEach((e) => {
                    e.classList.add("active");
                });
                enableAllProducts();
                textureItems.forEach((e) => {
                    e.addEventListener("click", () => {
                        const imgElement = e.querySelector("img");
                        if (imgElement) {
                            console.log("texture image source", imgElement); // Logs clicked image's source path
                            // changeModelTexture(imgElement.src,intersectedObject);
                            const textureSet = {
                                albedoMap: imgElement.dataset.albedo || null,
                                roughnessMap:
                                    imgElement.dataset.roughness || null,
                                normalMap: imgElement.dataset.normal || null,
                                aoMap: imgElement.dataset.ao || null,
                                emissiveMap: imgElement.dataset.em || null,
                            };
                            changeModelTexture2(textureSet, intersectedObject);
                        }
                    });
                });
                addModelToScene(newWidth, newHeight, imageIndex);
            }

            // remove detect part from uploaded image
            function removeDetectPart(): void {
                const detectPartAll = document.querySelectorAll(".detect-part");
                if (detectPartAll.length > 0) {
                    for (let i = 0; i < detectPartAll.length; i++) {
                        detectPartAll[i].remove();
                    }
                }
            }
            removeDetectPart();

            // scaled coordinates
            function newCoordinates(
                width: number,
                height: number,
                newWidth: number,
                newHeight: number,
                x: number,
                y: number,
                x2: number,
                y2: number
            ): number[] {
                const scale1 = newWidth / width;
                const scale2 = newHeight / height;
                const newX = x * scale1;
                const newY = y * scale2;
                const newX2 = x2 * scale1;
                const newY2 = y2 * scale2;
                const newCoordinate = [newX, newY, newX2, newY2];
                return newCoordinate;
            }

            // create selection object div
            function createSelectionDiv(
                x: number,
                y: number,
                x2: number,
                y2: number,
                index: number
            ): void {
                const coordinatesArr = newCoordinates(
                    getImgSize[1],
                    getImgSize[0],
                    canvasSizes.width,
                    canvasSizes.height,
                    x,
                    y,
                    x2,
                    y2
                );
                const getWidth = coordinatesArr[2] - coordinatesArr[0];
                const getHeight = coordinatesArr[3] - coordinatesArr[1];
                const detectPart = document.createElement("div");
                const objectIndicator = document.createElement("span");
                objectIndicator.classList.add("object-indicator");
                objectIndicator.innerHTML = index + 1;
                detectPart.classList.add("detect-part");
                detectPart.style.width = `${getWidth}px`;
                detectPart.style.height = `${getHeight}px`;
                detectPart.style.top = `${coordinatesArr[1]}px`;
                detectPart.style.left = `${coordinatesArr[0]}px`;
                detectPart.setAttribute("id", index);
                detectPart.appendChild(objectIndicator);
                uploadedWrap.appendChild(detectPart);
                optionUserImage(
                    detectPart,
                    objectIndicator,
                    canvasSizes.width,
                    canvasSizes.height
                );
            }

            // create option for userImage
            function optionUserImage(
                parent: HTMLElement,
                clickPart: HTMLElement,
                newWidth: number,
                newHeight: number
            ): void {
                const optionDiv = document.createElement("div");
                optionDiv.classList.add("option-user");
                const optionReplace = document.createElement("span");
                optionReplace.classList.add("option-replace");
                optionReplace.classList.add("option");
                let insideOptionReplace = "";
                insideOptionReplace = "<span class='swap-btn-child'></span>";
                optionReplace.innerHTML = insideOptionReplace;
                const toolTipText = document.createElement("span");
                toolTipText.className = "tooltiptext";
                toolTipText.innerText = "Replace";
                optionReplace.appendChild(toolTipText);
                optionDiv.appendChild(optionReplace);
                const optionClose = document.createElement("span");
                optionClose.classList.add("option-close");
                optionClose.innerHTML = "<span class='close-btn-child'></span>";
                optionDiv.appendChild(optionClose);
                parent.appendChild(optionDiv);
                clickPart.onclick = () => {
                    hidePopup();
                    const allOptionDiv =
                        document.querySelectorAll(".option-user");
                    for (let i = 0; i < allOptionDiv.length; i++) {
                        allOptionDiv[i].classList.remove("active");
                    }
                    const optionDiv = parent.querySelector(".option-user");
                    optionDiv.classList.add("active");
                    const closeOption =
                        optionDiv.querySelector(".option-close");
                    closeOption.onclick = function closeReplace() {
                        optionDiv.classList.remove("active");
                    };
                    const replaceOption =
                        optionDiv.querySelector(".option-replace");
                    replaceOption.onclick = function getImageIndex() {
                        const imageIndex = parent.getAttribute("id");
                        objectIndex = imageIndex;
                        if (imageIndex) {
                            optionDiv.classList.remove("active"); //closes the popup when replace button is clicked
                            activeProductList(newWidth, newHeight, imageIndex);
                        }
                    };
                };
            }

            // popup creation
            let isDragging: boolean = false;
            const offset: THREE.Vector3 = new THREE.Vector3();
            const dragStartPoint: THREE.Vector2 = new THREE.Vector2();
            const initialObjectPosition: THREE.Vector3 = new THREE.Vector3();
            const initialObjectRotation: THREE.Euler = new THREE.Euler();

            let initialDistance: number;
            let initialScale: number;

            canvas.addEventListener("click", onClick, false);

            let resetPopup: any;
            let resetDrag: boolean = false;
            let resetPopupUuid: string;

            function onClick(event: MouseEvent): void {
                const rightDiv = document.querySelector(".showroom-active");
                const rect = rightDiv.getBoundingClientRect();

                const raycaster = new THREE.Raycaster();
                const mouse = new THREE.Vector2();
                mouse.x = ((event.clientX - rect.left) / canvas.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / canvas.height) * 2 + 1;
                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(
                    objectGroupArr,
                    true
                );

                //REMOVE OUTLINE
                // disableEmissive();

                if (intersects.length > 0) {
                    if (resetPopup == intersects[0].object) {
                        resetDrag = false;
                    } else {
                        resetDrag = true;
                        resetPopup = intersects[0].object;
                    }
                    // let selectedObjectId = intersectedObject.parent.userData.username;
                    removeTextureWrap();
                    // getTextures(selectedObjectId);

                    // // REMOVE existing outline
                    // removeOutline();

                    showPopup(intersects[0].object.parent);
                    intersectedObject = intersects[0].object.parent;
                    initialObjectRotation.copy(intersectedObject.rotation);

                    // //ADD Outline
                    // addOutline(intersectedObject);
                    // enableEmissive();

                    // if (intersects.length > 0) {
                    //   outlinePass.selectedObjects = [intersectedObject];
                    // } else {
                    //   outlinePass.selectedObjects = [];
                    // }

                    // showSelectionCircle(intersectedObject);
                    optionUserRemove();
                }
                if (resetPopup) {
                    resetPopupUuid = resetPopup.parent.uuid;
                }
            }

            function optionUserRemove(): void {
                const optionUser = document.querySelectorAll(".option-user");
                optionUser.forEach(function (e) {
                    if (e) {
                        e.classList.remove("active");
                    }
                });
            }

            //Outline
            let outlineMesh: any = null;
            function addOutline(object: any): void {
                removeOutline(); // Make sure to remove any previous outlines

                const outlineMaterial = new THREE.MeshBasicMaterial({
                    color: 0xffff00, // Yellow outline
                    side: THREE.BackSide, // Draw behind the object
                });

                outlineMesh = object.clone();
                outlineMesh.material = outlineMaterial;
                outlineMesh.scale.multiplyScalar(1.05); // Slightly larger than original
                object.add(outlineMesh); // Attach to the original for positioning
            }

            function removeOutline(): void {
                if (outlineMesh && outlineMesh.parent) {
                    outlineMesh.parent.remove(outlineMesh);
                    outlineMesh = null;
                }
            }

            let getModelTextures: any;

            // function getTextures(objectId) {

            //   const allFilteredTextures = products.filter(itm => itm.model_id === objectId);

            //   if (allFilteredTextures[0].all_texture_files[0]) {
            //     getModelTextures = allFilteredTextures[0].all_texture_files;
            //   }
            //   else {
            //     getModelTextures = [];
            //   }

            // }

            function getTextures(textureFiles: any[]): any[] {
                let getModelTextures: any[] = [];

                if (textureFiles && Array.isArray(textureFiles)) {
                    getModelTextures = textureFiles
                        .map((texture: any) => texture.albedoMapPath)
                        .filter(Boolean);
                }

                console.log("getModelTextures:", getModelTextures);
                return getModelTextures;
            }

            function showPopup(object: any): void {
                const existingPopup = document.querySelector(".popup-option");
                if (existingPopup) {
                    if (resetDrag) {
                        existingPopup.remove();
                        createPopup();
                        movePopup(object);
                    }
                } else {
                    createPopup();
                    movePopup(object);
                }
                document.querySelector(".gizmo .drag")?.click();
            }

            function createPopup(): void {
                const rightDiv = document.querySelector(".uploaded-wrap");

                const popup = document.createElement("div");
                popup.classList.add("popup-option");
                popup.classList.add("active");
                // popup.addEventListener("mousedown", (event) => {
                //   event.preventDefault(); // Prevent text selection or dragging
                //   event.stopPropagation(); // (optional) Prevent bubbling if needed
                // });
                popup.innerHTML = `
                <div class="option remove-btn" onclick="deleteObject()"><span class="remove-btn-child"></span><span class="tooltiptext">Remove</span>
                </div>
                <div class="option rotate-btn" onclick="rotateObject()"><span class="rotate-btn-child"></span><span class="tooltiptext">Rotate</span>
                </div>
                <div class="option resize-btn" onclick="resizeObject()"><span class="resize-btn-child"></span><span class="tooltiptext">Resize</span>
                </div>
                <div class="option drag-btn" onclick="dragObject()"><span class="drag-btn-child"></span><span class="tooltiptext">Drag</span>
                </div>
                <div class="rotation-range"><input type="range" min="0" max="360" value="180" id="rotationInput"></div>
                <div class="size-range"><input type="range" min="0.1" max="5" step="0.1" value="1" id="sizeInput"></div>
                <div class="hide-popup" onclick="hidePopup()"><span class="hide-btn-child"></span></div>
            `;
                rightDiv.appendChild(popup);
            }
            window.textureWrap = function (e) {
                console.log("texture event", e);
                removeActiveColor();
                const textureDivElement =
                    document.querySelector(".texture-btn");
                addActiveColor(textureDivElement);
                removeTextureWrap();
                const previousTextureWrap = document.querySelector(
                    ".texture-wrap-element"
                );
                if (!previousTextureWrap) {
                    const canvasWrap = document.querySelector(".canvas-wrap");
                    const textureWrapElement = document.createElement("div");
                    textureWrapElement.className = "texture-wrap-element";
                    let textureBlock = "";
                    // getTextures(textureFiles);

                    getModelTextures = [
                        "/3D/penn_sofa/Texture/penn_suede/penn_sofa_Base_color_1001.png",
                        "/3D/penn_sofa/Texture/Penn_Fabric/penn_sofa_Base_color.png",
                    ];
                    if (getModelTextures[0]) {
                        getModelTextures.forEach(function (item) {
                            textureBlock += `<div class="texture-block"><img src=${item} alt="textures"></div>`;
                        });
                        textureBlock += `<div class="hide-popup texture-hide"><span class="hide-btn-child"></span></div>`;
                        textureWrapElement.innerHTML = textureBlock;
                        canvasWrap.appendChild(textureWrapElement);
                        updateTextures();
                    }
                }
                hideTexturePopup();
                isDragging = false;
                dragble = false;
                const rotationRange = document.querySelector(".rotation-range");
                rotationRange.classList.remove("active");
                const popUp = document.querySelector(".popup-option");
                popUp.classList.add("active");
                const sizeRange = document.querySelector(".size-range");
                sizeRange.classList.remove("active");
            };

            function hideTexturePopup(): void {
                const textureHide = document.querySelector(".texture-hide");
                if (textureHide) {
                    textureHide.onclick = function () {
                        const textureParent = textureHide.parentElement;
                        if (textureParent) {
                            textureParent.remove();
                        }
                        removeActiveColor();
                    };
                }
            }

            function removeTextureWrap(): void {
                const textureWrapElement = document.querySelector(
                    ".texture-wrap-element"
                );
                if (textureWrapElement) {
                    textureWrapElement.remove();
                }
            }

            // update textures function

            function updateTextures(): void {
                const texturesBlock =
                    document.querySelectorAll(".texture-block");
                texturesBlock.forEach(function (e: any, i: number) {
                    e.onclick = function () {
                        for (let j = 0; j < texturesBlock.length; j++) {
                            if (j !== i) {
                                texturesBlock[j].classList.remove("active");
                            }
                        }
                        e.classList.add("active");
                        const textureImg = e.querySelector("img");
                        const imgPath = textureImg.src;
                        changeModelTexture(imgPath, intersectedObject);
                    };
                });
            }
            function movePopup(object: any): void {
                const popup = document.querySelector(".popup-option");
                const vector = new THREE.Vector3();
                object.updateMatrixWorld();
                vector.setFromMatrixPosition(object.matrixWorld);
                vector.project(camera);
                const rightDiv = document.querySelector(".uploaded-wrap");
                const widthHalf = rightDiv.clientWidth / 2;
                const heightHalf = rightDiv.clientHeight / 2;
                const x = (vector.x * widthHalf + widthHalf) * 0.7;
                const y = -(vector.y * heightHalf) + heightHalf;
                if (x > 0 && x < widthHalf / 0.7) {
                    // popup.style.left = `${x}px`;
                    // setDragOption(true);
                } else {
                    // setDragOption(false);
                }
                popup.style.top = `${y - 300}px`;
            }

            let dragble: boolean = false;

            function addActiveColor(currentDiv: Element): void {
                currentDiv.classList.add("active");
            }

            function removeActiveColor(): void {
                const optionsDiv = document.querySelectorAll(".option");
                optionsDiv.forEach((e: Element) => {
                    e.classList.remove("active");
                });
            }

            window.deleteObject = function () {
                console.log("hello");
                if (intersectedObject) {
                    console.log("hello1");
                    preservedTransform = {
                        position: intersectedObject.position.clone(),
                        rotation: intersectedObject.rotation.clone(),
                        scale: intersectedObject.scale.clone(),
                    };
                    console.log(
                        "position saved =",
                        preservedTransform.position.x,
                        preservedTransform.position.y,
                        preservedTransform.position.z
                    );
                    removeTextureWrap();
                    removeLeadModels(
                        intersectedObject.parent.userData.username
                    );
                    scene.remove(intersectedObject);

                    if (scene.getObjectById(intersectedObject.id)) {
                        if (intersectedObject.dispose) {
                            intersectedObject.dispose();
                        }

                        intersectedObject.visible = false;

                        if (intersectedObject.parent) {
                            intersectedObject.parent.remove(intersectedObject);
                        }
                    }

                    intersectedObject.traverse((child) => {
                        if (child.geometry) child.geometry.dispose();
                        if (child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach((material) =>
                                    material.dispose()
                                );
                            } else {
                                child.material.dispose();
                            }
                        }
                    });

                    const existingPopup =
                        document.querySelector(".popup-option");
                    if (existingPopup) {
                        existingPopup.remove();
                    }

                    if (selectedCircle) {
                        scene.remove(selectedCircle);
                        selectedCircle = null;
                    }

                    intersectedObject = null;

                    //enable all products
                    enableAllProducts();
                }

                if (onClick1 && onMouseMove && onMouseUp1) {
                    window.removeEventListener("mousedown", onClick1, false);
                    window.removeEventListener("mousemove", onMouseMove, false);
                    window.removeEventListener("mouseup", onMouseUp1, false);
                    window.removeEventListener("touchstart", onClick1, false);
                    window.removeEventListener("touchmove", onMouseMove, false);
                    window.removeEventListener("touchend", onMouseUp1, false);
                }
                isDragging = false;
                dragble = false;
                document.body.style.cursor = "auto";
            };

            function removeLeadModels(objectId: string): void {
                setAllModels((prevModels: string[]) =>
                    prevModels.filter((model: string) => model !== objectId)
                );
            }

            // resize function
            window.resizeObject = function () {
                removeActiveColor();
                const resizeDiv = document.querySelector(".resize-btn");
                addActiveColor(resizeDiv);
                removeTextureWrap();

                document.body.style.cursor = "auto";
                const sizeInput = document.getElementById("sizeInput");
                const sizeRange = document.querySelector(".size-range");
                sizeRange.classList.add("active");

                if (intersectedObject) {
                    sizeInput.addEventListener("input", () => {
                        const sizeValue = parseFloat(sizeInput.value);
                        if (!isNaN(sizeValue)) {
                            intersectedObject.scale.set(
                                sizeValue,
                                sizeValue,
                                sizeValue
                            );
                        }
                    });
                }

                if (onClick1 && onMouseMove && onMouseUp1) {
                    window.removeEventListener("mousedown", onClick1, false);
                    window.removeEventListener("mousemove", onMouseMove, false);
                    window.removeEventListener("mouseup", onMouseUp1, false);
                    window.removeEventListener("touchstart", onClick1, false);
                    window.removeEventListener("touchmove", onMouseMove, false);
                    window.removeEventListener("touchend", onMouseUp1, false);
                }
                isDragging = false;
                dragble = false;
                const rotationRange = document.querySelector(".rotation-range");
                rotationRange.classList.remove("active");
                const popUp = document.querySelector(".popup-option");
                popUp.classList.remove("active");
            };

            window.rotateObject = function () {
                removeActiveColor();
                const rotateDiv = document.querySelector(".rotate-btn");
                addActiveColor(rotateDiv);
                removeTextureWrap();
                document.body.style.cursor = "auto";
                const rotationInput = document.getElementById("rotationInput");
                // const byDefaultAngle = THREE.MathUtils.radToDeg(intersectedObject.rotation.y);
                const sizeRange = document.querySelector(".size-range");
                sizeRange.classList.remove("active");
                const rotationRange = document.querySelector(".rotation-range");
                rotationRange.classList.add("active");
                rotationInput.addEventListener("input", () => {
                    const rotationValue = parseFloat(rotationInput.value);
                    if (!isNaN(rotationValue) && intersectedObject) {
                        const currentRangeValue = rotationValue;
                        const delta = currentRangeValue - initialAngleValue;
                        intersectedObject.rotation.y +=
                            THREE.MathUtils.degToRad(delta);
                        initialAngleValue = currentRangeValue;
                    }
                });

                if (onClick1 && onMouseMove && onMouseUp1) {
                    window.removeEventListener("mousedown", onClick1, false);
                    window.removeEventListener("mousemove", onMouseMove, false);
                    window.removeEventListener("mouseup", onMouseUp1, false);
                    window.removeEventListener("touchstart", onClick1, false);
                    window.removeEventListener("touchmove", onMouseMove, false);
                    window.removeEventListener("touchend", onMouseUp1, false);
                }
                isDragging = false;
                dragble = false;
                const popUp = document.querySelector(".popup-option");
                popUp.classList.remove("active");
            };

            let onClick1: any;
            let onMouseUp1: any;
            let onMouseMove: any;

            function normalizeObjectScale(
                object: THREE.Object3D,
                targetSize: number = 1
            ): number {
                const boundingBox = new THREE.Box3().setFromObject(object);
                const size = new THREE.Vector3();
                boundingBox.getSize(size);

                const maxDimension = Math.max(size.x, size.y, size.z);
                const scaleFactor = targetSize / maxDimension;

                // Apply uniform scale
                object.scale.set(scaleFactor, scaleFactor, scaleFactor);

                return scaleFactor; // Return the scale factor for sensitivity adjustment
            }

            // window.dragObject = function () {
            //   removeActiveColor()
            //   const dragDiv = document.querySelector('.drag-btn')
            //   addActiveColor(dragDiv)
            //   removeTextureWrap();
            //   dragble = true;
            //   if (intersectedObject) {
            //     const rightDiv = document.querySelector('.showroom-active');
            //     document.body.style.cursor = "grab";
            //     rightDiv.addEventListener("mousedown", onClick1, false);
            //     rightDiv.addEventListener("touchstart", onClick1, false);
            //     function onClick1(event) {
            //       const rightDiv = document.querySelector('.showroom-active');
            //       const rect = rightDiv.getBoundingClientRect();
            //       const raycaster = new THREE.Raycaster();

            //       let clientX, clientY;
            //       const mouse = new THREE.Vector2();

            //       if (event.type === 'touchmove' || event.type === 'touchstart') {
            //         clientX = event.touches[0].clientX;
            //         clientY = event.touches[0].clientY;
            //       } else {
            //         clientX = event.clientX;
            //         clientY = event.clientY;
            //       }

            //       mouse.x = ((clientX - rect.left) / canvas.width) * 2 - 1;
            //       mouse.y = -((clientY - rect.top) / canvas.height) * 2 + 1;

            //       raycaster.setFromCamera(mouse, camera);
            //       const intersects = raycaster.intersectObjects(scene.children, true);
            //       let getUuid;
            //       if (intersects[0] && dragble) {
            //         getUuid = intersects[0].object.parent.uuid;

            //         if (getUuid == resetPopupUuid) {
            //           isDragging = true;
            //           window.addEventListener("mouseup", onMouseUp1, false)
            //           window.addEventListener("touchend", onMouseUp1, false)
            //           function onMouseUp1(event) {
            //             isDragging = false;

            //           }
            //         }
            //       }
            //     }

            //     const intersectedWorldPosition = intersectedObject.getWorldPosition(new THREE.Vector3());
            //     offset.copy(intersectedWorldPosition).sub(camera.position);
            //     offset.x /= camera.zoom;
            //     offset.y /= camera.zoom;
            //     offset.z /= camera.zoom;
            //     const rotationRange = document.querySelector(".rotation-range");
            //     rotationRange.classList.remove("active");
            //     const sizeRange = document.querySelector('.size-range');
            //     sizeRange.classList.remove('active');
            //     const popUp = document.querySelector('.popup-option')
            //     popUp.classList.add('active');
            //   }
            // };

            // document.addEventListener("mousedown", onMouseDown, false);
            // document.addEventListener("mousemove", onMouseMove, false);
            // document.addEventListener("mouseup", onMouseUp, false);
            // document.addEventListener("touchstart", onMouseDown, false);
            // document.addEventListener("touchmove", onMouseMove, false);
            // document.addEventListener("touchend", onMouseUp, false);

            // function onMouseDown(event) {
            //   const rightDiv = document.querySelector('.showroom-active');
            //   if (rightDiv) {
            //     const rect = rightDiv.getBoundingClientRect();
            //     const raycaster = new THREE.Raycaster();
            //     let clientX, clientY;
            //     const mouse = new THREE.Vector2();

            //     if (event.type === 'touchmove' || event.type === 'touchstart') {
            //       clientX = event.touches[0].clientX;
            //       clientY = event.touches[0].clientY;
            //     } else {
            //       clientX = event.clientX;
            //       clientY = event.clientY;
            //     }

            //     mouse.x = ((clientX - rect.left) / canvas.width) * 2 - 1;
            //     mouse.y = -((clientY - rect.top) / canvas.height) * 2 + 1;
            //     raycaster.setFromCamera(mouse, camera);
            //     const intersects = raycaster.intersectObjects(scene.children, true);
            //     if (intersects.length > 0) {
            //       const intersectedObject = intersects[0].object.parent;
            //       if (intersectedObject) {
            //         boundDrag = true;
            //         dragStartPoint.set(clientX, clientY);
            //         initialObjectPosition.copy(intersectedObject.position);
            //         initialObjectPosition.z = intersectedObject.position.z;
            //         initialDistance = intersectedObject.position.distanceTo(camera.position);
            //         initialScale = intersectedObject.scale.clone();
            //       }
            //     }
            //   }
            // }

            // function onMouseMove(event) {
            //   let clientX, clientY;
            //   if (event.type.startsWith('touch')) {
            //     clientX = event.touches[0].clientX;
            //     clientY = event.touches[0].clientY;
            //   } else {
            //     clientX = event.clientX;
            //     clientY = event.clientY;
            //   }

            //   if (isDragging) {
            //     const offsetX = clientX - dragStartPoint.x;
            //     const offsetY = clientY - dragStartPoint.y;

            //     // Calculate the scale factor to normalize drag speed
            //     const averageScaleFactor = intersectedObject.scale.length() / Math.sqrt(3); // Average of x, y, z scales
            //     const distanceToCamera = intersectedObject.position.distanceTo(camera.position);
            //     const normalizedDragSpeed = 0.3 / (averageScaleFactor * (distanceToCamera / initialDistance));

            //     // Adjust new position using normalized speed
            //     const newPosition = new THREE.Vector3(
            //       initialObjectPosition.x + (offsetX / canvas.width) * normalizedDragSpeed * camera.position.z,
            //       intersectedObject.position.y,
            //       initialObjectPosition.z + (offsetY / canvas.height) * normalizedDragSpeed * camera.position.z
            //     );

            //     // Clamp the new position to defined boundaries
            //     const minX = -100;
            //     const maxX = 100;
            //     const minZ = -100;
            //     const maxZ = 100;

            //     newPosition.x = Math.min(Math.max(newPosition.x, minX), maxX);
            //     newPosition.z = Math.min(Math.max(newPosition.z, minZ), maxZ);

            //     // Update the object's position
            //     intersectedObject.position.copy(newPosition);

            //     // Adjust the scale based on distance to camera
            //     const currentDistance = intersectedObject.position.distanceTo(camera.position);
            //     const scaleFactor = currentDistance / initialDistance;
            //     intersectedObject.scale.set(
            //       initialScale.x * scaleFactor,
            //       initialScale.y * scaleFactor,
            //       initialScale.z * scaleFactor
            //     );

            //     // If a circle is selected, move it along with the object
            //     if (isDragging && selectedCircle) {
            //       const objectBoundingBox = new THREE.Box3().setFromObject(intersectedObject);
            //       const objectBottomCenter = new THREE.Vector3();
            //       objectBoundingBox.getCenter(objectBottomCenter);
            //       const circlePosition = objectBottomCenter.clone().setY(objectBoundingBox.min.y);
            //       selectedCircle.position.copy(circlePosition);
            //     }

            //     // Move the popup to follow the dragged object
            //     movePopup(intersectedObject);
            //   }
            // }

            // function onMouseUp(event) {
            //   boundDrag = false;
            //   isDragging = false;
            //   initialDistance = null;
            //   initialScale = null;

            // }

            window.dragObject = function () {
                removeActiveColor();
                const dragDiv = document.querySelector(".drag-btn");
                addActiveColor(dragDiv);
                removeTextureWrap();
                dragble = true;

                if (intersectedObject) {
                    document.body.style.cursor = "grab";

                    const dragStart = new THREE.Vector2();
                    const initialPosition = new THREE.Vector3();
                    // let isDragging = false;

                    function getClientCoordinates(event) {
                        if (event.touches && event.touches.length > 0) {
                            return {
                                clientX: event.touches[0].clientX,
                                clientY: event.touches[0].clientY,
                            };
                        } else {
                            return {
                                clientX: event.clientX,
                                clientY: event.clientY,
                            };
                        }
                    }

                    function onMouseDown(event) {
                        if (dragble) {
                            const { clientX, clientY } =
                                getClientCoordinates(event);
                            dragStart.set(clientX, clientY);
                            try {
                                initialPosition.copy(
                                    intersectedObject.position
                                );
                            } catch (err: any) {
                                console.error("Error copying position:", err);
                            }
                            isDragging = true;
                        }
                        // Add event listeners
                        document.addEventListener("mousemove", onMouseMove);
                        document.addEventListener("touchmove", onMouseMove);
                        document.addEventListener("mouseup", onMouseUp);
                        document.addEventListener("touchend", onMouseUp);
                    }

                    function onMouseMove(event) {
                        if (!isDragging) return;

                        const { clientX, clientY } =
                            getClientCoordinates(event);
                        const offsetX = clientX - dragStart.x;
                        const offsetY = clientY - dragStart.y;

                        // If Shift key is pressed, rotate the object
                        if (event.shiftKey) {
                            // console.log("shift key pressed");
                            // Define a rotation factor (tweak this value as needed)
                            const rotationFactor = 0.01;
                            // Ensure you have captured the initial rotation when dragging started
                            // For example: initialObjectRotation = intersectedObject.rotation.clone();
                            const newRotationX =
                                initialObjectRotation.x +
                                offsetY * rotationFactor;
                            const newRotationY =
                                initialObjectRotation.y +
                                offsetX * rotationFactor;

                            // Apply the new rotation (keeping the original z-rotation)
                            intersectedObject.rotation.set(
                                newRotationX,
                                newRotationY,
                                initialObjectRotation.z
                            );
                            // console.log("rotated object", intersectedObject.rotation);
                            return; // Exit early; no panning should occur in this case
                        }

                        if (event.touches && event.touches.length === 2) {
                            event.preventDefault();
                            const rotationFactor = 0.01;
                            const newRotationX =
                                initialObjectRotation.x +
                                offsetY * rotationFactor;
                            const newRotationY =
                                initialObjectRotation.y +
                                offsetX * rotationFactor;
                            intersectedObject.rotation.set(
                                newRotationX,
                                newRotationY,
                                initialObjectRotation.z
                            );
                            if (selectedCircle) {
                                selectedCircle.visible = false;
                            }
                            return; // Skip pan/move
                        }

                        if (event.touches && event.touches.length === 3) {
                            event.preventDefault(); // prevent scroll

                            const offsetY =
                                event.touches[0].clientY - dragStart.y;
                            const sensitivity = 0.01; // tweak for feel

                            if (intersectedObject) {
                                intersectedObject.position.set(
                                    initialPosition.x,
                                    initialPosition.y - offsetY * sensitivity,
                                    initialPosition.z
                                );

                                movePopup(intersectedObject); // reposition UI if needed
                            }

                            return; // no other movement
                        }

                        // Adjust the object's position
                        const sensitivity = 0.008; // Adjust if needed
                        intersectedObject.position.set(
                            initialPosition.x + offsetX * sensitivity,
                            initialPosition.y,
                            initialPosition.z + offsetY * sensitivity // Change sign if direction is incorrect
                        );

                        // if (event.metaKey) {
                        //   // Move vertically (Y axis) when Command key is pressed
                        //   intersectedObject.position.set(
                        //     initialPosition.x,
                        //     initialPosition.y - offsetY * sensitivity, // Vertical movement
                        //     initialPosition.z
                        //   );
                        // }

                        // Vertical movement: Cmd (Mac) or Alt (Windows)
                        const isMac =
                            navigator.platform.toUpperCase().indexOf("MAC") >=
                            0;
                        const isVerticalDragKey =
                            (isMac && event.metaKey && !event.altKey) ||
                            (!isMac && event.altKey && !event.metaKey);

                        if (isVerticalDragKey) {
                            intersectedObject.position.set(
                                initialPosition.x,
                                initialPosition.y - offsetY * sensitivity,
                                initialPosition.z
                            );
                            return; // skip other movement
                        }

                        // Update the attached circle position
                        if (selectedCircle) {
                            const objectBoundingBox =
                                new THREE.Box3().setFromObject(
                                    intersectedObject
                                );
                            const objectBottomCenter = new THREE.Vector3();
                            objectBoundingBox.getCenter(objectBottomCenter);
                            const circlePosition = objectBottomCenter
                                .clone()
                                .setY(objectBoundingBox.min.y);
                            selectedCircle.position.copy(circlePosition);
                        }

                        // Optional: Move popup if needed
                        movePopup(intersectedObject);
                    }

                    function onMouseUp() {
                        isDragging = false;

                        // Remove event listeners
                        document.removeEventListener("mousemove", onMouseMove);
                        document.removeEventListener("touchmove", onMouseMove);
                        document.removeEventListener("mouseup", onMouseUp);
                        document.removeEventListener("touchend", onMouseUp);
                    }

                    document.addEventListener("mousedown", onMouseDown);
                    document.addEventListener("touchstart", onMouseDown);
                } else {
                    console.log("No intersected object found.");
                }
                const rotationRange = document.querySelector(".rotation-range");
                rotationRange.classList.remove("active");
                const sizeRange = document.querySelector(".size-range");
                sizeRange.classList.remove("active");
                const popUp = document.querySelector(".popup-option");
                popUp.classList.add("active");
            };

            window.settingObject = function () {
                removeActiveColor();
                const settingDiv = document.querySelector(".setting-btn");
                addActiveColor(settingDiv);
            };

            window.hidePopup = function () {
                const existingPopup = document.querySelector(".popup-option");
                if (existingPopup) {
                    existingPopup.remove();
                }
                if (intersectedObject) {
                    intersectedObject.traverse((child) => {
                        if (child.geometry) child.geometry.dispose();
                        if (child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach((material) =>
                                    material.dispose()
                                );
                            } else {
                                child.material.dispose();
                            }
                        }
                    });
                    if (selectedCircle) {
                        scene.remove(selectedCircle);
                        selectedCircle = null;
                    }
                }
                if (onClick1 && onMouseMove && onMouseUp1) {
                    window.removeEventListener("mousedown", onClick1, false);
                    window.removeEventListener("mousemove", onMouseMove, false);
                    window.removeEventListener("mouseup", onMouseUp1, false);
                    window.removeEventListener("touchstart", onClick1, false);
                    window.removeEventListener("touchmove", onMouseMove, false);
                    window.removeEventListener("touchend", onMouseUp1, false);
                }
                isDragging = false;
                dragble = false;
                document.body.style.cursor = "auto";
                removeTextureWrap();
            };

            // function addModelToScene(newWidth, newHeight, imageIndex) {
            //   productBtn.forEach((e, i) => {
            //     e.onclick = function add3dModel() {
            //       let userModelId = Number(e.getAttribute('id'));
            //       if (products) {
            //         const getModalObject = products.filter(itm => itm.model_id === userModelId);
            //         let objectPathMtl = getModalObject[0].mtl_file;
            //         let objectPathObj = getModalObject[0].obj_file;
            //         let objectId = getModalObject[0].model_id;
            //         let textureFile = getModalObject[0].texture_file;
            //         if (newWidth && newHeight && imageIndex) {
            //           removeObjectHandler(objectPathMtl, objectPathObj, textureFile, objectId, newWidth, newHeight, scene, camera, imageIndex, renderer);
            //         }
            //         else {
            //           addDefaultObject(objectPathMtl, objectPathObj, textureFile, objectId, scene, camera, renderer);
            //         }

            //       }

            //     }

            //   })
            // }

            function enableSpecificProduct(targetName: string): void {
                const items = productItem;

                items.forEach((item: any) => {
                    const heading = item.querySelector("h3");
                    if (heading && heading.textContent.trim() === targetName) {
                        item.style.display = "block";
                    } else {
                        item.style.display = "none";
                    }
                });
            }

            function enableAllProducts(): void {
                productItem.forEach((item: any) => {
                    item.style.display = "block";
                });
            }

            let textureFiles: any[] = [];
            function addModelToScene(
                newWidth?: number,
                newHeight?: number,
                imageIndex?: string
            ): void {
                productBtn.forEach((button, i) => {
                    button.onclick = function add3dModel() {
                        const userModelId = button.getAttribute("id");

                        if (products) {
                            const selectedModel = products.find(
                                (item) => item.model_title === userModelId
                            );

                            if (!selectedModel) {
                                console.error(
                                    `Model with ID ${userModelId} not found`
                                );
                                return;
                            }

                            enableSpecificProduct(userModelId);
                            const objectPathMtl = selectedModel.mtl_file;
                            const objectPathObj = selectedModel.obj_file;
                            const objectId = userModelId;
                            textureFiles = selectedModel.new_images_list || []; // Get first texture set or empty object

                            if (newWidth && newHeight && imageIndex) {
                                removeObjectHandler(
                                    objectPathMtl,
                                    objectPathObj,
                                    textureFiles, // Pass entire texture object
                                    objectId,
                                    newWidth,
                                    newHeight,
                                    scene,
                                    camera,
                                    imageIndex,
                                    renderer
                                );
                            } else {
                                addDefaultObject(
                                    objectPathMtl,
                                    objectPathObj,
                                    textureFiles, // Pass entire texture object
                                    objectId,
                                    scene,
                                    camera,
                                    renderer
                                );
                            }

                            productItem.forEach((e) => {
                                e.classList.remove("active");
                            });
                        }
                    };
                });
            }

            function createHollowCircle(
                radius: number,
                color: number,
                thickness: number
            ): THREE.Mesh {
                const geometry = new THREE.RingGeometry(
                    radius - thickness,
                    radius,
                    32
                );
                const material = new THREE.MeshBasicMaterial({
                    color: color,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.5,
                });
                const circle = new THREE.Mesh(geometry, material);

                // Disable raycasting for this object
                circle.raycast = () => {};
                return circle;
            }

            function showSelectionCircle(selectedObject: THREE.Object3D): void {
                if (selectedCircle !== null) {
                    scene.remove(selectedCircle);
                }

                const objectBoundingBox = new THREE.Box3().setFromObject(
                    selectedObject
                );
                const objectBottomCenter = new THREE.Vector3();
                objectBoundingBox.getCenter(objectBottomCenter);
                const circleRadius =
                    objectBoundingBox.getSize(new THREE.Vector3()).x / 1.3;
                const circleThickness = 1;
                const circlePosition = objectBottomCenter
                    .clone()
                    .setY(objectBoundingBox.min.y);
                selectedCircle = createHollowCircle(
                    circleRadius,
                    0x067f38,
                    circleThickness
                );
                selectedCircle.position.copy(circlePosition);
                selectedCircle.lookAt(camera.position);
                selectedCircle.rotation.set(1.7, 0, 0);
                selectedCircle.scale.set(0, 0, 0);
                selectedCircle.receiveShadow = true;
                scene.add(selectedCircle);
                // keyLight.target.position.set(
                //   selectedObject.position.x,
                //   selectedObject.position.y,
                //   selectedObject.position.z
                // );
                // keyLightHelper.update();
                let scale = 0;
                const scaleStep = 0.05;
                const scaleInterval = setInterval(() => {
                    scale += scaleStep;
                    if (scale >= 1) {
                        clearInterval(scaleInterval);
                    }
                    selectedCircle.scale.set(scale, scale, scale);
                }, 20);
            }

            // add light
            let keyLight: THREE.DirectionalLight, keyLightHelper: any;
            function addLight(): void {
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                scene.add(ambientLight);

                // Key Light (Main Light)
                keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
                keyLight.position.set(-30, 50, -150);

                keyLight.castShadow = true; // Enable shadows for the key light
                scene.add(keyLight);

                // Light Helper for Key Light
                // keyLightHelper = new THREE.DirectionalLightHelper(keyLight, 10);
                // scene.add(keyLightHelper);

                const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
                fillLight.position.set(10, 10, 10);

                const backLight = new THREE.DirectionalLight(0xffffff, 1.0);
                backLight.position.set(0, 10, -10);

                scene.add(keyLight);
                scene.add(fillLight);
                scene.add(backLight);
            }

            // animate function
            function animate(): void {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
                // composer.render();
            }
            setAllModels([]);
            addLight();
            selectImage();
            // addGround();
            animate();
        }
    }, [scene]);

    function redirectHandle(): void {
        if (allModels.length > 0) {
            toast.success("uploaded file successfully");
            sceneRenderer[0].render(sceneRenderer[1], sceneRenderer[2]);
            const leadPreviewImg =
                sceneRenderer[0].domElement.toDataURL("image/jpg");
            console.log("leadPreviewImg", leadPreviewImg);
            setImageUrl(leadPreviewImg);

            setTimeout(() => {
                setMoveToAddLead(true);
                document.body.style.overflow = "hidden";
            }, 1000 * 2);
        } else {
            toast.success("you need to select at least one model");
        }
    }

    function cancelHandle(): void {
        setImage(null);
    }

    let screenSize: THREE.Vector2,
        depthShaderMaterial: THREE.ShaderMaterial,
        cameraNear: number,
        cameraFar: number;
    const depthMapSetup = (
        mesh: THREE.Mesh,
        renderer?: THREE.WebGLRenderer
    ): void => {
        // if(!depthTexture){
        depthTexture.minFilter = THREE.LinearFilter;
        depthTexture.magFilter = THREE.LinearFilter;
        depthTexture.wrapS = THREE.ClampToEdgeWrapping;
        depthTexture.wrapT = THREE.ClampToEdgeWrapping;
        // }
        // Depth Shader Material
        if (canvas) {
            // screenSize = new THREE.Vector2(canvas.width, canvas.height);
            screenSize = new THREE.Vector2(
                renderer.domElement.width,
                renderer.domElement.height
            );
        }
        if (camera) {
            cameraNear = camera.near;
            cameraFar = camera.far;
        }
        depthShaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                depthMap: { value: depthTexture },
                cameraNear,
                cameraFar,
                screenSize: { value: screenSize },
            },
            vertexShader: `
            varying vec3 vPosition;
            void main() {
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
            fragmentShader: `
            uniform sampler2D depthMap;
            uniform float cameraNear;
            uniform float cameraFar;
            varying vec3 vPosition;
            uniform vec2 screenSize;        // Screen width and height

            float unpackDepth(vec4 rgbaDepth) {
                const vec4 bitShifts = vec4(1.0, 1.0 / 255.0, 1.0 / (255.0 * 255.0), 1.0 / (255.0 * 255.0 * 255.0));
                return dot(rgbaDepth, bitShifts);
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / screenSize;
                float sceneDepth = unpackDepth(texture2D(depthMap, uv));
                float fragmentDepth = gl_FragCoord.z;
                
                float linearDepth = (2.0 * cameraNear * cameraFar) / (cameraFar + cameraNear - fragmentDepth * (cameraFar - cameraNear));
                linearDepth = (linearDepth - cameraNear) / (cameraFar - cameraNear); // Normalize to [0,1]

                if (4.0*linearDepth > 1.0 - sceneDepth) { //} sceneDepth / 255.0) {
                  discard;
                }
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            }
        `,
            transparent: true,
        });

        // setTimeout(() => {
        applyDepthMap(mesh);
        // }, 100);
    };

    let depthTexture: THREE.Texture;
    useEffect(() => {
        if (image || removedObjImage) {
            function addBackground(
                setBgImage: string,
                isLoadDepthMap: boolean = true
            ): void {
                const textureLoader = new THREE.TextureLoader();
                scene.background = null;
                textureLoader.load(setBgImage, function (texture) {
                    // texture.encoding = THREE.sRGBEncoding;
                    texture.colorSpace = THREE.SRGBColorSpace;
                    texture.minFilter = THREE.LinearMipMapLinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    scene.background = texture;
                    // setTimeout(() => {
                    //   depthMapSetup(depthMapUrl); //load depthmap if only setting for first-time
                    // }, 10);
                });
            }
            if (imageFunction === true) {
                addBackground(image);
            } else if (imageFunction === false) {
                addBackground(removedObjImage, true);
            }
        }
    }, [scene, removedObjImage, image, imageFunction]);

    return (
        <section className="uploaded-file card">
            {!image && (
                <div className="hey-hey">
                    <div
                        className={`card upload-image-wrap ${
                            isUploading ? "none" : ""
                        }`}
                    >
                        <h3>
                            Disclaimer: For a better experience, please use a
                            tablet or desktop.
                        </h3>
                        {localStorage.getItem("planName") === "undefined" ? (
                            <div className="over-effect"></div>
                        ) : (
                            ""
                        )}
                        <div className="upload-block">
                            <input
                                type="file"
                                className="upload-control"
                                accept="image/jpeg, image/jpg, image/png, image/heic, image/heics"
                                onChange={uploadImageHandler}
                            />
                            <Image
                                className="upload-icon"
                                src={uploadimg}
                                alt="img"
                            ></Image>
                            <span className="upload-text">
                                Upload or Capture The Image
                            </span>
                            <button className="btn upload-dis">
                                Upload Image
                            </button>
                        </div>
                        {errorImage != "" ? (
                            <div className="display-error display-error-img">
                                {errorImage}
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                    <div
                        className={`uploaded-wrap card ${
                            isUploading ? "active" : ""
                        }`}
                    >
                        <div
                            className={`image-render ${
                                isUploading ? "active" : ""
                            } `}
                        >
                            <Image src={blankImg} alt="img"></Image>
                            {/* <div style={{ width: '100%', height: '100%', backgroundColor: 'white' }} /> */}
                            <button className="cross-btn" type="button">
                                <i className="cross-icon"></i>
                            </button>
                            <div className="overlay">
                                <div className="progress-block">
                                    <div
                                        className={`progress-handler ${
                                            isUploading ? "loader-progress" : ""
                                        }`}
                                    >
                                        <Image
                                            className="loader"
                                            src={buffer}
                                            alt="img"
                                        ></Image>
                                        <ProgressBar
                                            barContainerClassName="content"
                                            completedClassName="barCompleted"
                                            labelClassName="label"
                                            completed="60"
                                        ></ProgressBar>
                                        <span className="progress-text">
                                            Loading
                                        </span>
                                    </div>
                                    <div className="successfully-updated hide">
                                        <Image
                                            className="updated-tick"
                                            src={uploadedtick}
                                            alt="img"
                                        ></Image>
                                        <span className="progress-text">
                                            Image Upload Successful
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {image && (
                <div className="uploaded-wrap card active">
                    <div className="canvas-wrap">
                        <div
                            className={`overlay upload-overlay ${
                                isUploading ? "active" : ""
                            }`}
                        >
                            <div className="progress-block">
                                <div
                                    className={`progress-handler ${
                                        isUploading ? "loader-progress" : ""
                                    }`}
                                >
                                    <Image
                                        className="loader"
                                        src={buffer}
                                        alt="img"
                                    ></Image>
                                    <ProgressBar
                                        barContainerClassName="content"
                                        completedClassName="barCompleted"
                                        labelClassName="label"
                                        completed="60"
                                    ></ProgressBar>
                                    <span className="progress-text">
                                        Loading
                                    </span>
                                </div>
                                <div className="successfully-updated hide">
                                    <Image
                                        className="updated-tick"
                                        src={uploadedtick}
                                        alt="img"
                                    ></Image>
                                    <span className="progress-text">
                                        Image Upload Successful
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="btn-group">
                        {/* <button type='button' className='upload-btn btn'>Upload New Image</button> */}
                        <span className="upload-btn btn">
                            Upload New Image
                            <input
                                type="file"
                                className="upload-control"
                                onChange={uploadImageHandler}
                            />
                        </span>
                        <div className="button-block">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={cancelHandle}
                            >
                                Cancel
                            </button>
                            <button type="button" className="btn preview">
                                Preview
                            </button>
                            <button
                                type="button"
                                className="btn save-model-btn"
                                onClick={redirectHandle}
                            >
                                Save
                            </button>
                        </div>
                        {errorImage != "" ? (
                            <div className="display-error display-error-img">
                                {errorImage}
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            )}
            {moveToAddLead ? (
                <AddLeadModal
                    isOpen={moveToAddLead}
                    onClose={() => setMoveToAddLead(false)}
                    allModels={allModels}
                    imageUrl={imageUrl}
                    modelsData={products}
                />
            ) : (
                ""
            )}
        </section>
    );
};

export default TryonUploadImg;
