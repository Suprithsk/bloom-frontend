/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useRef, useState, useEffect, useContext } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import apiClient from "../../api/apiService";
import { useNavigate } from "react-router-dom";
// import { DashboardContext } from "../context/DashboardContext";
import { DashboardContext } from "../../context/DasboardContext";
import { toast } from "sonner";
import axios from "axios";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// React Image component
const Image = ({ src, alt, className, ...props }) => (
    <img src={src} alt={alt} className={className} {...props} />
);
import ProgressBar from "@ramonak/react-progress-bar";
// Import images - update these paths as needed
import uploadimg from "../../assets/images/uploadimg.svg";
import blankImg from "../../assets/images/blank.jpg";
import buffer from "../../assets/images/buffer.png";
import uploadedtick from "../../assets/images/uploaded-tick.svg";
// Import components
import AddLeadModal from "./AddLead";
// import ModalContact from "./ModalContact";
// Import SCSS styles
import "./TryonUploadImg.scss";
import { fetchDashboardData, getModels } from "../../api/dashboardService";

function downloadModelInBackground(url) {
    fetch(url, { cache: "force-cache", mode: "cors" })
        .then(() => console.log(`Model prefetched: ${url}`))
        .catch((err) => console.warn(`Prefetch failed for ${url}`, err));
}

let removedObjectIndexes = [];
function addRemovedIndex(idx) {
    const n = Number(idx);
    if (!removedObjectIndexes.includes(n)) {
        removedObjectIndexes.push(n);
    }
    console.log("will remove:", removedObjectIndexes);
}
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
    const [imgUrl, setImgUrl] = useState(null);
    const [objectIndices, setObjectIndices] = useState([]);

    // const [remainingNo, setRemainingNo] = useState(0)
    const [planId, setPlanID] = useState("");
    const token = localStorage.getItem("token");
    const CANVAS_H = 900;

    const preservedTransformRef = React.useRef(null);
    const preservedTransformRefParent = React.useRef(null);

    const dashboardData = async () => {
        try {
            let res = await fetchDashboardData();
            setNumberTryon(res.data?.subscription_plan?.try_on);
            setPlanID(res.data?.subscription_plan?.plan_id);
        } catch (err) {}
    };
    useEffect(() => {
        dashboardData();
    }, []);

    const tryOnNumber = async () => {
        try {
            const payload = new FormData();
            payload.append("plan_id", planId);

            const response = await apiClient.post(
                `${import.meta.env.VITE_API_BASE_URL}/try-on/`,
                payload
            );
            if (response.data) setNumberTryon(response.data?.count);
        } catch (error) {
            console.error("Error:", error);
            toast.error(
                error?.response?.data?.message || "Something went wrong."
            );
        }
    };

    let initialAngleValue = 180;
    let objectIndex = null;
    let isReplace = false;
    let getScene = true;
    let shadowPlane;
    let savedCoordinates = null;
    let savedAngleRotation = null;
    let savedCameraMatrix = null;
    let savedZ_value = null;
    // let imgUrl = null;

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

    function getModals() {
        getModels()
            .then((response) => {
                if (response?.data?.status === "true") {
                    setProducts(response.data.data);
                }
            })
            .catch((error) => {
                console.error("Error", error);
            });
    }

    function restoreTransform(group) {
        const t = preservedTransformRef.current;
        const p = preservedTransformRefParent.current;
        if (!t) return;
        group.children[0].position.copy(t.position);
        group.children[0].rotation.copy(t.rotation);
        group.children[0].scale.copy(t.scale);
        preservedTransformRef.current = null; // consume once

        group.position.copy(p.position);
        group.rotation.copy(p.rotation);
        group.scale.copy(p.scale);
        preservedTransformRefParent.current = null;
    }

    function restoreTransformGLB(group) {
        const t = preservedTransformRef.current;
        if (!t) return;
        group.children[0].children[0].position.copy(t.position);
        group.children[0].children[0].rotation.copy(t.rotation);
        group.children[0].children[0].scale.copy(t.scale);
        preservedTransformRef.current = null; // consume once
    }

    function restoreTransformGLB(group) {
        const t = preservedTransformRef.current;
        if (!t) return;
        group.children[0].children[0].position.copy(t.position);
        group.children[0].children[0].rotation.copy(t.rotation);
        group.children[0].children[0].scale.copy(t.scale);
        preservedTransformRef.current = null; // consume once
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

    const uploadImageHandler = (event) => {
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
                    // reader.onloadend = () => {
                    //     dispatch(ploadImageSlice(reader.result)); // Dispatch Base64 string (serializable)
                    // };
                    // dispatch(ploadImageSlice(event.target.files[0]))
                    setCoordinate(response.data.XYXY_CoOrdinates);
                    setImgSize(response.data.imgSize);
                    setImgId(response.data.image_intance);
                    setResponseExt(response.data.ext);
                    setAwsImageKey(
                        response.data.aws_image_with_object_detected_key
                    );
                    setImageFunction(true);
                    setProductItemStatus(true);
                    removedObjectIndexes = [];
                    tryOnNumber();
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

    let objectGroup = null;
    let objectGroupArr = [];

    // const router = useRouter();

    function removeNewCoordinates(
        width,
        height,
        newWidth,
        newHeight,
        removedObjectCoordinates
    ) {
        // defaults
        let originalX = 0;
        let originalY = 0;
        let originalX1 = width;
        let originalY1 = height;

        // safe-extract each coordinate
        try {
            originalX = removedObjectCoordinates[0];
        } catch (e) {
            console.warn("removeNewCoordinates: invalid originalX, using 0");
        }
        try {
            originalY = removedObjectCoordinates[1];
        } catch (e) {
            console.warn("removeNewCoordinates: invalid originalY, using 0");
        }
        try {
            originalX1 = removedObjectCoordinates[2];
        } catch (e) {
            console.warn(
                `removeNewCoordinates: invalid originalX1, using ${width}`
            );
        }
        try {
            originalY1 = removedObjectCoordinates[3];
        } catch (e) {
            console.warn(
                `removeNewCoordinates: invalid originalY1, using ${height}`
            );
        }

        // compute scales
        let scale1 = newWidth / width;
        let scale2 = newHeight / height;

        // apply
        let newX = originalX * scale1;
        let newY = originalY * scale2;
        let newX2 = originalX1 * scale1;
        let newY2 = originalY1 * scale2;

        return [newX, newY, newX2, newY2];
    }

    let viewZ;

    function convertScreenToWorldPosition(
        x,
        y,
        z,
        sceneWidth,
        sceneHeight,
        camera
    ) {
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
        getWidth,
        getHeight,
        sceneWidth,
        sceneHeight,
        objectGroup
    ) {
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
    function toggleDetectPart(toggle) {
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

    function getPreview(renderer, scene, camera) {
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
                const imageUrl = renderer.domElement.toDataURL("image/png"); //snapshot is taken for the scene in its current form
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
    function getCompared(compareBtn, previewImgWrap, renderer) {
        compareBtn.onclick = () => {
            resetResolution(renderer);
            let showroomActive = document.querySelector(".showroom-active");
            let showroomActiveWidth = showroomActive.offsetWidth;
            let showroomActiveHeight = showroomActive.offsetHeight;
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
            let newImage = renderer.domElement.toDataURL("image/png");
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
    function closeCompared(comparedWrap, compareClose) {
        compareClose.addEventListener("click", () => {
            comparedWrap.remove();
        });
    }

    function closePreview(previewClose, previewImgWrap, renderer) {
        previewClose.onclick = () => {
            previewImgWrap.remove();
            resetResolution(renderer);
            toggleDetectPart(true);
        };
    }

    //shadow plane
    function createShadow(objectGroup, scene) {
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

    function getSceneChild(object, scene) {
        let current = object;
        while (current.parent && current.parent !== scene) {
            current = current.parent;
        }
        return current;
    }

    function hidePopup() {
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
        renderer.setPixelRatio(window.devicePixelRatio);

        postResolutionChangeUpdates(renderer);

        hidePopup();
    }

    function resetResolution(renderer) {
        renderer.setPixelRatio(1);
        postResolutionChangeUpdates(renderer);
    }

    function addDefaultTexture(object) {
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

    function changeModelTexture(texturePath, intersectedObject) {
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

    let currentMaterial;
    function changeModelTexture2(textureSet, intersectedObject, renderer) {
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

        // ✅ Ensure correct traversal of the 3D model
        let children = intersectedObject.children || [];

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
    function enableEmissive() {
        currentMaterial.emissive = new THREE.Color(0xffffff); // or desired emissive color
        currentMaterial.needsUpdate = true;
    }

    // Disable emissive map
    function disableEmissive() {
        currentMaterial.emissive = new THREE.Color(0x000000); // Turn off emissive color
        currentMaterial.needsUpdate = true;
    }

    function applyDepthMap(mesh) {
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

    function adjustCameraMatrixForResize(cameraMatrix, newWidth, newHeight) {
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

    function getModelCenter(object) {
        const box = new THREE.Box3().setFromObject(object);
        const center = new THREE.Vector3();
        box.getCenter(center);
        return center;
    }

    function normalizeScaleToFit(object, targetWidth, targetHeight) {
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
    function perMeshOperation(renderer) {
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

        stopUploadingAfterDelay();
    }
    function stopUploadingAfterDelay(delay = 7000) {
        setTimeout(() => {
            setIsUploading(false);
        }, delay);
    }

    function addObjObject(
        pathMtl,
        pathObj,
        texturePath,
        objectId,
        newWidth,
        newHeight,
        removedObjectCoordinates,
        scene,
        camera,
        imageIndex,
        z,
        angleRotation,
        renderer,
        cameraMatrix
    ) {
        let showroomActive = document.querySelector(".showroom-active");
        let sceneWidth = showroomActive.clientWidth;
        let sceneHeight = showroomActive.clientHeight;
        let originalImageWidth = getImgSize[1];
        let originalImageHeight = getImgSize[0];
        let adjustedCameraMatrix = adjustCameraMatrixForResize(
            cameraMatrix,
            newWidth,
            newHeight
        );
        let X_world;
        let Y_world;
        let Z_world = adjustedCameraMatrix.mean_depth_estimation_img / 2;

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
        let newxPosition =
            (newCoordinatesRemoval[2] + newCoordinatesRemoval[0]) / 2;
        let newyPosition =
            (newCoordinatesRemoval[3] + newCoordinatesRemoval[1]) / 2;
        let getY = sceneHeight + newyPosition;
        let getWidth = newCoordinatesRemoval[2] - newCoordinatesRemoval[0];
        let getHeight = newCoordinatesRemoval[3] - newCoordinatesRemoval[1];
        let position = convertScreenToWorldPosition(
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

        let rotationAngleRad = THREE.MathUtils.degToRad(
            ((angleRotation % 360) + 360) % 360
        );

        function addLight(scene, renderer) {
            /* --- three-point rig --- */
            const key = new THREE.DirectionalLight(0xffffff, 0.75);
            key.position.set(5, 5, 5);
            scene.add(key);

            const fill = new THREE.DirectionalLight(0xffffff, 0.5);
            fill.position.set(-4, 2, 4);
            scene.add(fill);

            const back = new THREE.DirectionalLight(0xffffff, 0.5);
            back.position.set(0, 3, -5);
            scene.add(back);

            /* --- neutral HDRI environment --- */
            const HDR_URL =
                "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/studio_small_09_2k.hdr";

            const pmrem = new THREE.PMREMGenerator(renderer);
            pmrem.compileEquirectangularShader();

            new RGBELoader()
                .setDataType(THREE.FloatType) // keep 32-bit precision
                .load(
                    HDR_URL,
                    (hdr) => {
                        const envTex = pmrem.fromEquirectangular(hdr).texture;
                        scene.environment = envTex; // reflections / IBL
                        renderer.toneMapping = THREE.ACESFilmicToneMapping;
                        renderer.toneMappingExposure = 1.0; // neutral preset
                        hdr.dispose();
                        pmrem.dispose();
                    },
                    undefined,
                    (err) => console.error("HDR load error:", err)
                );
        }

        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();
        if (pathMtl && pathObj) {
            mtlLoader.load(pathMtl, function (materials) {
                materials.preload();
                objLoader.setMaterials(materials);
                objLoader.load(pathObj, function (object) {
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
                    let setScale = scale * 500;
                    objectGroup.scale.set(setScale, setScale, setScale);
                    // normalizeScaleToFit(objectGroup, getWidth, getHeight);
                    objectGroup.position.set(
                        setPositionX,
                        setPositionY - 35,
                        newZPosition - 150
                    );
                    restoreTransform(objectGroup);
                    objectGroup.userData.username = objectId;
                    objectGroupArr.push(objectGroup);

                    //load the depth texture
                    // depthTexture = new THREE.TextureLoader().load(depthMapUrl);

                    // objectGroup.position.copy(centerPoint);
                    // perMeshOperation(renderer);
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
                    // createShadow(objectGroup,scene)
                });
            });
        }
        removeIdentifiedObjectWrap(imageIndex);
    }

    async function fetchDepthMap(inpaintedImageUrl, renderer) {
        if (!inpaintedImageUrl) {
            throw new Error("No inpainted image URL provided");
        }

        // 1) Download the inpainted image
        const resp = await fetch(inpaintedImageUrl, { mode: "cors" });
        if (!resp.ok) {
            throw new Error(
                `Failed to download image: ${resp.status} ${resp.statusText}`
            );
        }
        const blob = await resp.blob();

        // 2) POST that Blob to depth-map endpoint
        const form = new FormData();
        form.append("file", blob, "inpainted.jpg");

        setIsUploading(true);
        const { data } = await axios.post(
            "https://api.replaci.com/depthmap/depth",
            form,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        depthTexture = new THREE.TextureLoader().load(data.url);

        // objectGroup.position.copy(centerPoint);
        perMeshOperation(renderer);
        return data;
    }

    // gltf file loader
    function gltfFileLoader(
        objectPathMtl,
        texturePath,
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
    ) {
        let showroomActive = document.querySelector(".showroom-active");
        let sceneWidth = showroomActive.clientWidth;
        let sceneHeight = showroomActive.clientHeight;
        let originalImageWidth = getImgSize[1];
        let originalImageHeight = getImgSize[0];

        let adjustedCameraMatrix = adjustCameraMatrixForResize(
            cameraMatrix,
            newWidth,
            newHeight
        );
        let X_world;
        let Y_world;
        let Z_world = adjustedCameraMatrix.mean_depth_estimation_img / 2;

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
        let newxPosition =
            (newCoordinatesRemoval[2] + newCoordinatesRemoval[0]) / 2;
        let newyPosition =
            (newCoordinatesRemoval[3] + newCoordinatesRemoval[1]) / 2;
        let getY = sceneHeight + newyPosition;
        let getWidth = newCoordinatesRemoval[2] - newCoordinatesRemoval[0];
        let getHeight = newCoordinatesRemoval[3] - newCoordinatesRemoval[1];
        let position = convertScreenToWorldPosition(
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
                const meshRoot = object.scene.children[0] || object.scene;
                const modelRoot = object.scene.children[0] || object.scene;
                const centerPoint = getModelCenter(modelRoot);
                modelRoot.position.sub(centerPoint);
                objectGroup.add(modelRoot);
                const scale = convertScreenToWorldScale(
                    getWidth,
                    getHeight,
                    sceneWidth,
                    sceneHeight,
                    objectGroup
                );
                let setScale = scale * 500;
                objectGroup.scale.set(setScale, setScale, setScale);
                // normalizeScaleToFit(objectGroup, getWidth, getHeight);
                objectGroup.position.set(
                    setPositionX,
                    setPositionY - 35,
                    newZPosition - 150
                );
                object.scene.userData.username = objectId;
                objectGroup.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                // const shadowPlaneGeometry = new THREE.PlaneGeometry(500, 500);
                // const shadowPlaneMaterial = new THREE.ShadowMaterial({
                //   opacity: 1, // Adjust transparency of shadow
                // });

                // const shadowPlane = new THREE.Mesh(
                //   shadowPlaneGeometry,
                //   shadowPlaneMaterial
                // );
                // shadowPlane.rotation.x = -Math.PI / 2; // Lay flat on the ground
                // shadowPlane.position.set(
                //   setPositionX,
                //   setPositionY - 36,
                //   newZPosition - 150
                // ); // Slightly below the model
                // shadowPlane.receiveShadow = true;

                // scene.add(shadowPlane);
                restoreTransform(objectGroup);
                scene.add(objectGroup);
                // depthTexture = new THREE.TextureLoader().load(depthMapUrl);
                objectGroupArr.push(objectGroup);
                perMeshOperation(renderer);
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

    function removeIdentifiedObjectWrap(index) {
        const detectPart = document.querySelectorAll(".detect-part");
        detectPart.forEach(function (e, i) {
            const objectIndicator = e.querySelector(".object-indicator");
            if (index == objectIndicator.innerText - 1) {
                e.remove();
            }
        });
    }

    function addDefaultObject(
        objectPathMtl,
        objectPathObj,
        textureFile,
        objectId,
        scene,
        camera,
        renderer
    ) {
        const extension = objectPathObj.split(".").pop().toLowerCase();

        // ---------------------------
        // 1) OBJ
        // ---------------------------

        console.log("image URL " + imgUrl);
        fetchDepthMap(imgUrl, renderer);
        if (extension === "obj" && objectPathMtl) {
            const mtlLoader = new MTLLoader();
            const objLoader = new OBJLoader();

            mtlLoader.load(objectPathMtl, (materials) => {
                materials.preload();
                objLoader.setMaterials(materials);

                objLoader.load(objectPathObj, (object) => {
                    const group = new THREE.Group();
                    group.add(object);

                    // simple centering + scale to ~150
                    const bbox = new THREE.Box3().setFromObject(group);
                    const size = bbox.getSize(new THREE.Vector3());
                    const scale = Math.min(150 / size.x, 150 / size.y);
                    group.scale.setScalar(scale);
                    group.position.set(0, -100, -70);

                    // register
                    group.userData.username = objectId;
                    scene.add(group);
                    objectGroupArr.push(group);

                    // apply texture if provided
                    if (textureFile && textureFile.length) {
                        changeModelTexture(textureFile[0].albedoMapPath, group);
                    }

                    // make it interactive
                    renderer.render(scene, camera);
                    getPreview(renderer, scene, camera);
                    setSceneRenderer([renderer, scene, camera]);
                });
            });

            // ---------------------------
            // 2) GLB
            // ---------------------------
        } else if (extension === "glb") {
            const loader = new GLTFLoader();
            loader.load(
                objectPathObj,
                (gltf) => {
                    const group = new THREE.Group();
                    const model = gltf.scene;
                    // center
                    const center = new THREE.Box3()
                        .setFromObject(model)
                        .getCenter(new THREE.Vector3());
                    model.position.sub(center);
                    group.add(model);

                    // uniform scaling
                    const bbox = new THREE.Box3().setFromObject(group);
                    const size = bbox.getSize(new THREE.Vector3());
                    const scale = Math.min(150 / size.x, 150 / size.y);
                    group.scale.setScalar(scale);
                    group.position.set(0, -100, -70);

                    // register
                    group.userData.username = objectId;
                    scene.add(group);
                    objectGroupArr.push(group);

                    // texture override
                    if (textureFile && textureFile.length) {
                        changeModelTexture(textureFile[0].albedoMapPath, group);
                    }

                    // shadows & depth-clip
                    perMeshOperation(renderer);

                    // interactive
                    renderer.render(scene, camera);
                    getPreview(renderer, scene, camera);
                    setSceneRenderer([renderer, scene, camera]);
                },
                undefined,
                (err) => console.error("GLB load error:", err)
            );
        } else {
            console.warn(
                `addDefaultObject: unsupported extension '${extension}'`
            );
        }
    }

    // 👉 put this in UploadImg.jsx — replace the old handleGlbSelect
    const handleGlbSelect = (model) => {
        // if (!scene || !camera) return;        // safety
        console.log("`1234");
        const {
            model_title, // e.g.  “Greta_Sofa”
            glb_file, // direct .glb URL
            new_images_list = [],
        } = model;

        /* ------------------------------------------------------------------
     We call removeObjectHandler directly so the GLB goes through the
     same pipeline (depth-map, shadow, etc.) that an OBJ does.
     For a straight “add” (not replacing a detected object) we don’t
     really care about newWidth / newHeight / imageIndex, so 0 / null
     placeholders are fine.
  ------------------------------------------------------------------ */
        removeObjectHandler(
            null, // objectPathMtl  – GLB doesn’t need one
            glb_file, // objectPathObj  – yes, it’s a .glb
            new_images_list, // texture set (if any)
            model_title, // objectId
            0, // newWidth  (unused here)
            0, // newHeight (unused here)
            scene,
            camera,
            null, // imageIndex  (not replacing a bbox)
            sceneRenderer?.[0] // renderer we cached earlier
        );
    };

    let depthMapUrl;
    let counter = 0;
    const removeObjectHandler = (
        objectPathMtl,
        objectPathObj,
        textureFile,
        objectId,
        newWidth,
        newHeight,
        scene,
        camera,
        imageIndex,
        renderer
    ) => {
        console.log("hgfd");
        const formData = new FormData();
        // formData.append("objIndex", objectIndex);
        // const indicesCsv = objectIndices.join(",");
        formData.append("objIndex", removedObjectIndexes.join(","));
        // formData.append("objIndex", indicesCsv);
        formData.append("imageId", getImageId);
        formData.append("image_base64", image);
        formData.append("ext", responseExt);
        formData.append("newWidth", newWidth);
        formData.append("newHeight", newHeight);

        getScene = false;
        setIsUploading(true);
        if (!isReplace) {
            setImageFunction(false);
            setIsUploading(false);
            let removedObjectCoordinates = savedCoordinates;
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
                    savedZ_value,
                    savedAngleRotation,
                    renderer,
                    savedCameraMatrix
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
                    savedZ_value,
                    savedAngleRotation,
                    renderer,
                    savedCameraMatrix
                );
            }
        } else {
            console.log("fgh");
            downloadModelInBackground(objectPathObj);
            axios
                .post(
                    import.meta.env.VITE_API_TOOL_IMAGE_BASE_URL +
                        "/App/RemoveObjectViaFlux/",
                    formData
                )
                .then((response) => {
                    // setremovedObjImage(response.data.removedImageToBase64);
                    setImageFunction(false);
                    let removedObjectCoordinates =
                        response.data.cordinates_Of_Obj;
                    savedCoordinates = removedObjectCoordinates;
                    let z_value = response.data.z_axis_depth_obj;
                    savedZ_value = z_value;
                    let cameraMatrix = response.data.camera_metrix;
                    savedCameraMatrix = cameraMatrix;
                    let angleRotation = response.data.angle_deg;
                    savedAngleRotation = angleRotation;
                    depthMapUrl = `https://replacii.s3.ap-south-1.amazonaws.com/${
                        response.data.depth_map
                    }?t=${Date.now()}`;

                    console.log("updated depthmap", depthMapUrl);
                    console.log(
                        "camera matrix = " +
                            JSON.stringify(cameraMatrix, null, 2)
                    );
                    // fetchDepthMap(inpaintedUrl)

                    getReplacedImageS3(
                        response.data.aws_inpainted_img_key,
                        renderer
                    );
                    isReplace = false;

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
        }
    };

    const getReplacedImageS3 = async (imageKey, renderer) => {
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

            console.log("Successfully got replaced image URL");
            setremovedObjImage(url);

            // Include the fetchDepthMap part
            await fetchDepthMap(url, renderer);

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

    let camera, canvas, canvasSizes;
    let textureItems;
    let intersectedObject = null;

    let selectedCircle = null;

    useEffect(() => {
        let productBtn = document.querySelectorAll(".import-model");
        let boundDrag = false;
        if (image) {
            let preCanvas = document.querySelector("#mycanvas-showroom");
            if (preCanvas) {
                preCanvas.remove();
            }
            canvas = document.createElement("canvas");
            canvas.classList.add("showroom-active");
            canvas.setAttribute("id", "mycanvas-showroom");
            canvas.style.touchAction = "none";
            canvas.addEventListener("touchmove", (e) => e.preventDefault(), {
                passive: false,
            });
            let uploadedWrap = document.querySelector(".canvas-wrap");
            uploadedWrap.appendChild(canvas);
            let productItem = document.querySelectorAll(".product-item");
            let uploadedFile = document.querySelector(".uploaded-file ");
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
            // Optional: enable physically correct lighting if using PBR materials
            renderer.physicallyCorrectLights = true;

            // Optional: tone mapping and output encoding (important for realistic materials)
            // renderer.outputEncoding = THREE.sRGBEncoding;
            // renderer.toneMapping = THREE.ACESFilmicToneMapping;
            // renderer.toneMappingExposure = 1.0;
            renderer.setSize(canvasSizes.width, canvasSizes.height);

            // renderer.setPixelRatio(window.devicePixelRatio);
            // resize function
            window.addEventListener("resize", () => {
                let uploadedFile = document.querySelector(".uploaded-file ");
                if (uploadedFile) {
                    canvasSizes.width = uploadedFile.offsetWidth;
                    camera.aspect = uploadedFile.offsetWidth / CANVAS_H;
                    updateCanvasSize(canvas);
                    camera.updateProjectionMatrix();
                    renderer.setSize(canvasSizes.width, canvasSizes.height);
                }
            });

            // image select
            function selectImage() {
                if (coordinate) {
                    for (let i = 0; i < coordinate.length; i++) {
                        let detectedObject = coordinate[i];
                        let xCoordinate = detectedObject[0];
                        let yCoordinate = detectedObject[1];
                        let x2Coordinate = detectedObject[2];
                        let y2Coordinate = detectedObject[3];
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
            function activeProductList(newWidth, newHeight, imageIndex) {
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
                console.log("1234");
                addModelToScene(newWidth, newHeight, imageIndex);
                console.log("12345");
            }

            // remove detect part from uploaded image
            function removeDetectPart() {
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
                width,
                height,
                newWidth,
                newHeight,
                x,
                y,
                x2,
                y2
            ) {
                let scale1 = newWidth / width;
                let scale2 = newHeight / height;
                let newX = x * scale1;
                let newY = y * scale2;
                let newX2 = x2 * scale1;
                let newY2 = y2 * scale2;
                let newCoordinate = [newX, newY, newX2, newY2];
                return newCoordinate;
            }

            // create selection object div
            // Inside UploadImg.jsx (or wherever createSelectionDiv lives)

            function createSelectionDiv(x, y, x2, y2, index) {
                // 1) Measure the actual canvas on-screen
                const canvasEl = document.querySelector("#mycanvas-showroom");
                if (!canvasEl) return;
                const { width: sceneW, height: sceneH } =
                    canvasEl.getBoundingClientRect();

                // 2) Scale original image coords into live canvas size
                const origW = getImgSize[1],
                    origH = getImgSize[0];
                const [sx1, sy1, sx2, sy2] = newCoordinates(
                    origW,
                    origH,
                    sceneW,
                    sceneH,
                    x,
                    y,
                    x2,
                    y2
                );

                // 3) Compute box dimensions
                const boxW = sx2 - sx1;
                const boxH = sy2 - sy1;

                // 4) Create & absolutely position the detect-part div
                const detectPart = document.createElement("div");
                detectPart.classList.add("detect-part");
                detectPart.style.position = "absolute";
                detectPart.style.left = `${sx1}px`;
                detectPart.style.top = `${sy1}px`;
                detectPart.style.width = `${boxW}px`;
                detectPart.style.height = `${boxH}px`;
                detectPart.setAttribute("id", index);

                // 5) Numbered span (unchanged)
                const objectIndicator = document.createElement("span");
                objectIndicator.classList.add("object-indicator");
                objectIndicator.innerHTML = index + 1;
                detectPart.appendChild(objectIndicator);

                // 6) Append & wire up clicks (unchanged)
                const uploadedWrap = document.querySelector(".canvas-wrap");
                uploadedWrap.appendChild(detectPart);
                optionUserImage(detectPart, objectIndicator, sceneW, sceneH);
            }

            // create option for userImage
            function optionUserImage(parent, clickPart, newWidth, newHeight) {
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
                    let allOptionDiv =
                        document.querySelectorAll(".option-user");
                    for (let i = 0; i < allOptionDiv.length; i++) {
                        allOptionDiv[i].classList.remove("active");
                    }
                    let optionDiv = parent.querySelector(".option-user");
                    optionDiv.classList.add("active");
                    let closeOption = optionDiv.querySelector(".option-close");
                    closeOption.onclick = function closeReplace() {
                        optionDiv.classList.remove("active");
                    };
                    let replaceOption =
                        optionDiv.querySelector(".option-replace");
                    replaceOption.onclick = () => {
                        const idx = parent.getAttribute("id");
                        addRemovedIndex(idx);
                        objectIndex = idx;
                        isReplace = true;
                        optionDiv.classList.remove("active");
                        activeProductList(newWidth, newHeight, idx);
                    };
                };
            }

            // popup creation
            let isDragging = false;
            let offset = new THREE.Vector3();
            let dragStartPoint = new THREE.Vector2();
            let initialObjectPosition = new THREE.Vector3();
            let initialObjectRotation = new THREE.Euler();

            let initialDistance;
            let initialScale;

            canvas.addEventListener("click", onClick, false);

            let resetPopup;
            let resetDrag = false;
            let resetPopupUuid;

            function onClick(event) {
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

                    showPopup(intersects[0].object.parent);
                    intersectedObject = intersects[0].object.parent;
                    initialObjectRotation.copy(intersectedObject.rotation);

                    // showSelectionCircle(intersectedObject);
                    optionUserRemove();
                }
                if (resetPopup) {
                    resetPopupUuid = resetPopup.parent.uuid;
                }
            }

            function optionUserRemove() {
                const optionUser = document.querySelectorAll(".option-user");
                optionUser.forEach(function (e) {
                    if (e) {
                        e.classList.remove("active");
                    }
                });
            }

            //Outline
            let outlineMesh = null;
            function addOutline(object) {
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

            function removeOutline() {
                if (outlineMesh && outlineMesh.parent) {
                    outlineMesh.parent.remove(outlineMesh);
                    outlineMesh = null;
                }
            }

            let getModelTextures;

            function getTextures(textureFiles) {
                let getModelTextures = [];

                if (textureFiles && Array.isArray(textureFiles)) {
                    getModelTextures = textureFiles
                        .map((texture) => texture.albedoMapPath)
                        .filter(Boolean);
                }

                console.log("getModelTextures:", getModelTextures);
                return getModelTextures;
            }

            function showPopup(object) {
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
            }

            function createPopup() {
                const rightDiv = document.querySelector(".uploaded-wrap");

                const popup = document.createElement("div");
                popup.classList.add("popup-option");
                popup.classList.add("active");
                popup.innerHTML = `
                <div class="option remove-btn" onclick="deleteObject()"><span class="remove-btn-child"></span><span class="tooltiptext">Remove</span>
                </div>
                <div class="option rotate-btn" onclick="rotateObject()"><span class="rotate-btn-child"></span><span class="tooltiptext">Rotate</span>
                </div>
                <div class="option resize-btn" onclick="resizeObject()"><span class="resize-btn-child"></span><span class="tooltiptext">Resize</span>
                </div>
                <div class="option drag-btn" onclick="dragObject()"><span class="drag-btn-child"></span><span class="tooltiptext">Drag</span>
                </div>
                <div class="rotation-range"><input type="range" min="0" max="360" id="rotationInput"></div>
                <div class="size-range"><input type="range" min="0.1" max="5" step="0.1" id="sizeInput"></div>
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

            function hideTexturePopup() {
                const textureHide = document.querySelector(".texture-hide");
                if (textureHide) {
                    textureHide.onclick = function () {
                        const textureParent = textureHide.parentElement;
                        textureParent.remove();
                        removeActiveColor();
                    };
                }
            }

            function removeTextureWrap() {
                const textureWrapElement = document.querySelector(
                    ".texture-wrap-element"
                );
                if (textureWrapElement) {
                    textureWrapElement.remove();
                }
            }

            // update textures function

            function updateTextures() {
                const texturesBlock =
                    document.querySelectorAll(".texture-block");
                texturesBlock.forEach(function (e, i) {
                    e.onclick = function () {
                        for (let j = 0; j < texturesBlock.length; j++) {
                            if (j == i) {
                            } else {
                                texturesBlock[j].classList.remove("active");
                            }
                        }
                        e.classList.add("active");
                        let textureImg = e.querySelector("img");
                        let imgPath = textureImg.src;
                        changeModelTexture(imgPath, intersectedObject);
                    };
                });
            }
            function movePopup(object) {
                let popup = document.querySelector(".popup-option");
                const vector = new THREE.Vector3();
                object.updateMatrixWorld();
                vector.setFromMatrixPosition(object.matrixWorld);
                vector.project(camera);
                const rightDiv = document.querySelector(".uploaded-wrap");
                let widthHalf = rightDiv.clientWidth / 2;
                let heightHalf = rightDiv.clientHeight / 2;
                const x = (vector.x * widthHalf + widthHalf) * 0.7;
                const y = -(vector.y * heightHalf) + heightHalf;
                if (x > 0 && x < widthHalf / 0.7) {
                    popup.style.left = `${x}px`;
                    // setDragOption(true);
                } else {
                    // setDragOption(false);
                }
                popup.style.top = `${y - 300}px`;
            }

            let dragble = false;

            function addActiveColor(currentDiv) {
                currentDiv.classList.add("active");
            }

            function removeActiveColor() {
                let optionsDiv = document.querySelectorAll(".option");
                optionsDiv.forEach((e) => {
                    e.classList.remove("active");
                });
            }

            window.deleteObject = function () {
                if (intersectedObject) {
                    removeTextureWrap();
                    removeLeadModels(
                        intersectedObject.parent.userData.username
                    );
                    // --- preserve transform of the object being deleted ---
                    preservedTransformRef.current = {
                        position: intersectedObject.position.clone(),
                        rotation: intersectedObject.rotation.clone(),
                        scale: intersectedObject.scale.clone(),
                    };

                    preservedTransformRefParent.current = {
                        position: intersectedObject.parent.position.clone(),
                        rotation: intersectedObject.parent.rotation.clone(),
                        scale: intersectedObject.parent.scale.clone(),
                    };

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

            function removeLeadModels(objectId) {
                setAllModels((prevModels) =>
                    prevModels.filter((model) => model !== objectId)
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
                const currentScale = intersectedObject.scale.x;

                sizeInput.addEventListener("pointerdown", (e) =>
                    e.stopPropagation()
                );
                sizeInput.addEventListener("pointermove", (e) =>
                    e.stopPropagation()
                );
                sizeInput.addEventListener("pointerup", (e) =>
                    e.stopPropagation()
                );

                sizeInput.value = currentScale;
                const sizeRange = document.querySelector(".size-range");
                sizeRange.classList.add("active");

                if (intersectedObject) {
                    // sizeInput.addEventListener("input", () => {
                    //   const sizeValue = parseFloat(sizeInput.value);
                    //   if (!isNaN(sizeValue)) {
                    //     intersectedObject.scale.set(sizeValue, sizeValue, sizeValue);
                    //   }
                    // });
                    sizeInput.oninput = (e) => {
                        const s = parseFloat(e.target.value);
                        intersectedObject.scale.set(s, s, s);
                    };
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
                const currentDeg = THREE.MathUtils.radToDeg(
                    intersectedObject.rotation.y
                );

                rotationInput.addEventListener("pointerdown", (e) =>
                    e.stopPropagation()
                );
                rotationInput.addEventListener("pointermove", (e) =>
                    e.stopPropagation()
                );
                rotationInput.addEventListener("pointerup", (e) =>
                    e.stopPropagation()
                );

                rotationInput.value = currentDeg;
                initialAngleValue = currentDeg;
                // const byDefaultAngle = THREE.MathUtils.radToDeg(intersectedObject.rotation.y);
                const sizeRange = document.querySelector(".size-range");
                sizeRange.classList.remove("active");
                const rotationRange = document.querySelector(".rotation-range");
                rotationRange.classList.add("active");
                // rotationInput.addEventListener("input", () => {
                //   const rotationValue = parseFloat(rotationInput.value);
                //   if (!isNaN(rotationValue) && intersectedObject) {
                //     const currentRangeValue = rotationValue;
                //     const delta = currentRangeValue - initialAngleValue;
                //     intersectedObject.rotation.y += THREE.MathUtils.degToRad(delta);
                //     initialAngleValue = currentRangeValue;
                //   }
                // });

                rotationInput.oninput = (e) => {
                    const newDeg = parseFloat(e.target.value);
                    const delta = newDeg - initialAngleValue;
                    intersectedObject.rotation.y +=
                        THREE.MathUtils.degToRad(delta);
                    initialAngleValue = newDeg;
                };

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

            let onClick1;
            let onMouseUp1;

            function normalizeObjectScale(object, targetSize = 1) {
                const boundingBox = new THREE.Box3().setFromObject(object);
                const size = new THREE.Vector3();
                boundingBox.getSize(size);

                const maxDimension = Math.max(size.x, size.y, size.z);
                const scaleFactor = targetSize / maxDimension;

                // Apply uniform scale
                object.scale.set(scaleFactor, scaleFactor, scaleFactor);

                return scaleFactor; // Return the scale factor for sensitivity adjustment
            }

            window.dragObject = function () {
                removeActiveColor();
                const dragDiv = document.querySelector(".drag-btn");
                addActiveColor(dragDiv);
                removeTextureWrap();
                dragble = true;

                if (intersectedObject) {
                    document.body.style.cursor = "grab";

                    let dragStart = new THREE.Vector2();
                    let initialPosition = new THREE.Vector3();
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
                        if (!dragble || !intersectedObject) return;
                        {
                            const { clientX, clientY } =
                                getClientCoordinates(event);
                            dragStart.set(clientX, clientY);
                            initialPosition.copy(intersectedObject.position);
                            isDragging = true;
                        }
                        // Add event listeners
                        document.addEventListener("mousemove", onMouseMove);
                        document.addEventListener("touchmove", onMouseMove);
                        document.addEventListener("mouseup", onMouseUp);
                        document.addEventListener("touchend", onMouseUp);
                    }

                    function onMouseMove(event) {
                        if (!isDragging || !intersectedObject) return;

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

                        // Adjust the object's position
                        const sensitivity = 0.008; // Adjust if needed
                        intersectedObject.position.set(
                            initialPosition.x + offsetX * sensitivity,
                            initialPosition.y,
                            initialPosition.z + offsetY * sensitivity // Change sign if direction is incorrect
                        );

                        if (event.touches && event.touches.length === 3) {
                            event.preventDefault();
                            // ‘sensitivity’ is already defined above in this scope
                            intersectedObject.position.set(
                                initialPosition.x,
                                initialPosition.y - offsetY * sensitivity,
                                initialPosition.z
                            );
                            return; // skip the rest
                        }

                        if (event.metaKey) {
                            // Move vertically (Y axis) when Command key is pressed
                            intersectedObject.position.set(
                                initialPosition.x,
                                initialPosition.y - offsetY * sensitivity, // Vertical movement
                                initialPosition.z
                            );
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

            function enableSpecificProduct(targetName) {
                const items = productItem;

                items.forEach((item) => {
                    const heading = item.querySelector("h3");
                    if (heading && heading.textContent.trim() === targetName) {
                        item.style.display = "block";
                    } else {
                        item.style.display = "none";
                    }
                });
            }

            function enableAllProducts() {
                productItem.forEach((item) => {
                    item.style.display = "block";
                });
            }

            let textureFiles = [];
            function addModelToScene(newWidth, newHeight, imageIndex) {
                console.log("je;");
                productBtn.forEach((button, i) => {
                    button.onclick = function add3dModel() {
                        let userModelId = button.getAttribute("id");

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
                            let objectPathMtl = selectedModel.mtl_file;
                            let objectPathObj = selectedModel.obj_file;
                            let objectId = userModelId;
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
                                // isReplace = false;
                                // removeObjectHandler(
                                //   objectPathMtl,
                                //   objectPathObj,
                                //   textureFiles, // Pass entire texture object
                                //   objectId,
                                //   newWidth,
                                //   newHeight,
                                //   scene,
                                //   camera,
                                //   imageIndex,
                                //   renderer
                                // );
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

            function createHollowCircle(radius, color, thickness) {
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

            function showSelectionCircle(selectedObject) {
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
            // let keyLight, keyLightHelper;
            function addLight() {
                const keyLight = new THREE.DirectionalLight(0xffffff, 0.75);
                keyLight.position.set(5, 5, 5);
                scene.add(keyLight);

                const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
                fillLight.position.set(-4, 2, 4);
                scene.add(fillLight);

                const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
                backLight.position.set(0, 3, -5);
                scene.add(backLight);
            }

            // animate function
            function animate() {
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

    function redirectHandle() {
        if (allModels.length > 0) {
            toast.success("uploaded file successfully");
            sceneRenderer[0].render(sceneRenderer[1], sceneRenderer[2]);
            const leadPreviewImg =
                sceneRenderer[0].domElement.toDataURL("image/png");
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

    function cancelHandle() {
        setImage(null);
    }

    let screenSize, depthShaderMaterial, cameraNear, cameraFar;
    const depthMapSetup = (mesh, renderer) => {
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

    let depthTexture;
    useEffect(() => {
        if (image || removedObjImage) {
            function addBackground(setBgImage, isLoadDepthMap = true) {
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
    }, [scene, removedObjImage]);

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

                            {errorplanMsg && (
                                <ModalContact
                                    closeModal={() =>
                                        setErrorPlanMessage(false)
                                    }
                                />
                            )}
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
                    {/* <GlbLoader
  configUrl="https://rudr-dev-1.s3.ap-south-1.amazonaws.com/godrej/config.json"
  onSelect={handleGlbSelect}
/> */}
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
            <div
                style={{
                    position: "fixed",
                    top: "1rem",
                    right: "1rem",
                    zIndex: 1000, // keep above canvas
                }}
            >
                {/* <GlbLoader configUrl="https://rudr-dev-1.s3.ap-south-1.amazonaws.com/godrej/config.json"
    onSelect={handleGlbSelect}
    style={{ width: 220 }}/> */}
            </div>
        </section>
    );
};

export default TryonUploadImg;
