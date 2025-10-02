import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { DashboardContext } from '@/context/DasboardContext';
import './AddLead.scss';

interface Model {
    model_id: string;
    model_title: string;
    images: string[];
    category: string;
    price?: string;
    quantity?: number;
}

interface AddLeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    allModels: string[];
    imageUrl: string;
    modelsData?: Model[];
}

interface PriceInfo {
    modelId: string;
    price: string;
    basePrice: number;
    image: string;
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({ 
    isOpen, 
    onClose, 
    allModels, 
    imageUrl,
    modelsData
}) => {
    const navigate = useNavigate();
    const [flag, setFlag] = useState(false);
    const [isSubmitForm, setIsSubmitForm] = useState(false);
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [address, setAddress] = useState("");
    const [addressError, setAddressError] = useState("");
    const [prices, setPrices] = useState<PriceInfo[]>([]);
    const [pricesError, setPricesError] = useState("");
    const [mySelectedModal, setMySelectedModal] = useState<Model[]>([]);
    const [quantities, setQuantities] = useState<{[key: string]: number}>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createLeadMutation } = useContext(DashboardContext)!;
    useEffect(() => {
        if (isOpen && allModels.length > 0) {
            getSelectedModals();
        }
    }, [isOpen, allModels]);

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

    const getSelectedModals = () => {
        const selectedModels: Model[] = [];
        allModels.forEach(modelTitle => {
            const foundModel = modelsData.find(model => 
                model.model_title === modelTitle
            );
            if (foundModel) {
                selectedModels.push(foundModel);
            }
        });
        setMySelectedModal(selectedModels);
    };

    const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFlag(true);
        setName(e.target.value);
        if (e.target.value.length === 0) {
            setNameError("Name is Required");
            setIsSubmitForm(false);
        } else if (e.target.value.length < 3 && e.target.value.length > 0) {
            setNameError("Name must be 3 Characters Long");
            setIsSubmitForm(false);
        } else {
            setIsSubmitForm(true);
            setNameError("");
        }
    };

    const phoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const regex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
        setFlag(true);
        setPhone(e.target.value);
        if (e.target.value.length > 0 && !regex.test(e.target.value)) {
            setPhoneError("Phone must be Valid!");
            setIsSubmitForm(false);
        } else if (e.target.value.length === 0) {
            setPhoneError("Phone is Required");
            setIsSubmitForm(false);
        } else {
            setPhoneError("");
            setIsSubmitForm(true);
        }
    };

    const emailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFlag(true);
        setEmail(e.target.value);
        setEmailError("");
        setIsSubmitForm(true);
    };

    const addressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFlag(true);
        setAddress(e.target.value);
        if (e.target.value.length > 0) {
            setAddressError("");
            setIsSubmitForm(true);
        } else {
            setAddressError("Address is Required");
            setIsSubmitForm(false);
        }
    };

    const incrementQty = (modelId: string) => {
        setQuantities(prev => ({
            ...prev,
            [modelId]: (prev[modelId] || 1) + 1
        }));
        updatePrice(modelId, (quantities[modelId] || 1) + 1);
    };

    const decrementQty = (modelId: string) => {
        if ((quantities[modelId] || 1) > 1) {
            setQuantities(prev => ({
                ...prev,
                [modelId]: (prev[modelId] || 1) - 1
            }));
            updatePrice(modelId, (quantities[modelId] || 1) - 1);
        }
    };

    const updatePrice = (modelId: string, qty: number) => {
        setPrices(prev => {
            const updatedPrices = prev.map(item => {
                if (item.modelId === modelId) {
                    return {
                        ...item,
                        price: (item.basePrice * qty).toString()
                    };
                }
                return item;
            });
            return updatedPrices;
        });
    };

    const selectPrices = (e: React.ChangeEvent<HTMLInputElement>, modelId: string, image: string) => {
        const basePrice = parseFloat(e.target.value) || 0;
        const qty = quantities[modelId] || 1;

        setPrices(prev => {
            const exists = prev.find(item => item.modelId === modelId);
            if (exists) {
                return prev.map(item =>
                    item.modelId === modelId
                        ? { ...item, price: (basePrice * qty).toString(), basePrice, image }
                        : item
                );
            }
            return [...prev, { modelId, price: (basePrice * qty).toString(), basePrice, image }];
        });
    };

    const validateForm = () => {
        let isValid = true;
        
        if (name === '') {
            setNameError("Name is Required");
            isValid = false;
        }
        if (phone === '') {
            setPhoneError("Phone is Required");
            isValid = false;
        }
        if (address === '') {
            setAddressError("Address is Required");
            isValid = false;
        }
        
        setFlag(true);
        return isValid;
    };

    const submitForm = async () => {
        if (!validateForm()) return;

        const allPricesFilled = mySelectedModal.every((model) => {
            const priceInfo = prices.find((p) => p.modelId === model.model_id);
            return priceInfo && priceInfo.basePrice > 0;
        });

        if (!allPricesFilled) {
            toast.error("Please enter a valid price for all models");
            return;
        }

        await callApiForSubmit('COMPLETED');
    };

    const cancelForm = async () => {
        if (!validateForm()) return;
        await callApiForSubmit('REJECTED');
    };

    const callApiForSubmit = async (status: string) => {
        setIsSubmitting(true);
        
        try {
            const totalPrice = prices.reduce((acc, item) => acc + (+item.price), 0);

            const updatedModels = mySelectedModal.map((m) => {
                const priceInfo = prices.find((p) => p.modelId === m.model_id);
                const quantity = quantities[m.model_id] || 1;
                return priceInfo
                    ? { ...m, price: priceInfo.price, quantity: quantity }
                    : m;
            });

            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("phone_number", phone);
            formData.append("status", status);
            formData.append("model_ids", JSON.stringify(updatedModels));
            formData.append("address", address);
            formData.append("total_price", totalPrice.toString());
            formData.append("preview_Image", imageUrl);
            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }
            // Replace with your actual API call
            const response = await createLeadMutation(formData);
            // toast.success("Lead created successfully");
            setIsSubmitting(false);
            onClose();
            navigate('/dashboard');
        } catch (error) {
            console.error("Error creating lead:", error);
            toast.error("Failed to create lead");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        onClose();
        document.body.style.overflow = "auto";
    };

    if (!isOpen) return null;

    const totalPrice = prices.reduce((acc, item) => acc + (+item.price), 0);

    return (
        <div className="popup-wrap">
            <section className="lead-handler add-lead">
                <div className="lead-info">
                    <h2>Add Lead</h2>
                    <button type="button" className="cross-btn" onClick={handleClose}>
                        <X size={16} />
                    </button>
                    <div className="form-wrap">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="inside-form custom-scroll-bar">
                                <div className="form-group">
                                    <input 
                                        type="text" 
                                        placeholder="Customer Name" 
                                        aria-label="Enter Customer Name" 
                                        onChange={nameChange}
                                        disabled={isSubmitting}
                                    />
                                    {nameError !== '' && flag && (
                                        <div className="dangerError">{nameError}</div>
                                    )}
                                </div>
                                
                                <div className="form-group">
                                    <input 
                                        type="tel" 
                                        placeholder="Phone Number" 
                                        value={phone}
                                        aria-label="Enter Phone Number"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 10 && /^\d*$/.test(value)) {
                                                phoneChange(e);
                                            }
                                        }}
                                        autoComplete="off"
                                        disabled={isSubmitting}
                                    />
                                    {phoneError !== '' && flag && (
                                        <div className="dangerError">{phoneError}</div>
                                    )}
                                </div>
                                
                                <div className="form-group">
                                    <input 
                                        type="email" 
                                        placeholder="Email" 
                                        aria-label="Enter Email" 
                                        onChange={emailChange}
                                        disabled={isSubmitting}
                                    />
                                    {emailError !== '' && flag && (
                                        <div className="dangerError">{emailError}</div>
                                    )}
                                </div>
                                
                                <div className="form-group">
                                    <textarea 
                                        placeholder="Address" 
                                        aria-label="Enter Address" 
                                        onChange={addressChange}
                                        disabled={isSubmitting}
                                    />
                                    {address === '' && flag && (
                                        <div className="dangerError">{addressError}</div>
                                    )}
                                </div>
                                
                                <div className="price-block">
                                    <span className="price-label">Total Price:</span>
                                    <h2 className="price-value">
                                        ₹{totalPrice.toFixed(2)}
                                    </h2>
                                </div>
                                
                                <div className="image-gallery">
                                    {mySelectedModal?.length > 0 && (
                                        <>
                                            {mySelectedModal
                                                .filter((item, index, self) =>
                                                    index === self.findIndex((m) => m.model_id === item.model_id)
                                                )
                                                .map((m, index) => (
                                                    <div className="gallery-block" key={index}>
                                                        <img 
                                                            src={m.images[0]} 
                                                            alt={`Model ${index}`} 
                                                            width={116} 
                                                            height={116} 
                                                        />
                                                        <div className="form-group">
                                                            <input
                                                                type="number"
                                                                name="price"
                                                                className="model-price"
                                                                placeholder="Price"
                                                                onChange={(e) => selectPrices(e, m.model_id, m.images[0])}
                                                                disabled={isSubmitting}
                                                            />
                                                        </div>
                                                        <div className="quantity-container">
                                                            <button
                                                                type="button"
                                                                className="quantity-btn"
                                                                onClick={() => decrementQty(m.model_id)}
                                                                disabled={isSubmitting}
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                                type="number"
                                                                className="quantity-input"
                                                                value={quantities[m.model_id] || 1}
                                                                readOnly
                                                            />
                                                            <button
                                                                type="button"
                                                                className="quantity-btn"
                                                                onClick={() => incrementQty(m.model_id)}
                                                                disabled={isSubmitting}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </>
                                    )}
                                </div>
                                
                                {pricesError !== "" && (
                                    <div className="dangerError">{pricesError}</div>
                                )}
                            </div>
                            
                            <div className="button-group">
                                <button 
                                    type="button" 
                                    className="cancel-btn" 
                                    onClick={cancelForm}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Saving..." : "Save as Draft"}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn" 
                                    onClick={submitForm}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AddLeadModal;