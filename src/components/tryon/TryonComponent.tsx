/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import TryonProducts from "./TryonProducts";
import TryonUploadImg from "./TryonUploadImg";
import "./TryonComponent.scss";

const TryOn = () => {
    const [data, setData] = useState(null);
    const [isTryonActive, setIsTryonActive] = useState(true);

    function modalData(modalObj: any) {
        setData(modalObj);
    }

    function tryonActive(value: boolean) {
        setIsTryonActive(value);
    }

    useEffect(() => {
        if (!isTryonActive) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isTryonActive]);

    return (
        <div className="tryon">
            <DashboardNavbar />
            
            <main className="tryon-main">
                <div className="tryon-container">
                    <div className="tryon-header">
                        <h1 className="tryon-title">Replaci Vision</h1>
                        <p className="tryon-subtitle">
                            Upload an image and replace objects with your 3D models
                        </p>
                    </div>

                    <div className="tryon-content">
                        <div className="tryon-sidebar">
                            <TryonProducts modalData={modalData} />
                        </div>
                        <div className="tryon-upload">
                            <TryonUploadImg modalObj={data} tryonActive={tryonActive} />
                        </div>
                    </div>
                </div>

                {/* Try-On Limit Exhausted Modal */}
                {!isTryonActive && (
                    <div className="tryon-modal-overlay">
                        <div className="tryon-modal">
                            <div className="tryon-modal-content">
                                <p>
                                    You have exhausted all try-on limits! Please upgrade your plan
                                    to continue using the try-on feature.
                                </p>
                            </div>
                            <div className="tryon-modal-actions">
                                <button
                                    type="button"
                                    className="tryon-btn tryon-btn-primary"
                                    onClick={() => setIsTryonActive(true)}
                                >
                                    Ok
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default TryOn;