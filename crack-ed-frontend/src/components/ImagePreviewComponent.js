
import React, { useState, useEffect, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const ImagePreviewComponent = ({ field, formData, setFormData }) => {
    const {
        applicationData,
    } = useContext(DataContext);
    const [showPreview, setShowPreview] = useState(false);

    const {
        label: originalLabel,
        input_type: inputType,
        field_name: name,
        error_message,
    } = field;

    let required = field.required;
    let value = formData[name] || "";
    const showPreviewBtn = (inputType === "file" && field.value !== null && field.value !== "" && field.value !== undefined);

    let label = originalLabel;
    const disabled = applicationData.current_application_step === 3;
    const readOnly = disabled;

    const [error, setError] = useState("");

    if (showPreviewBtn) {
        console.log("Show preview Button",);

        console.log(field.value !== "", field.value !== undefined);
        required = false;

        value = null;
    }
    const isImageFile = (filename) => {
        return /\.(jpe?g|png|gif|bmp|webp)$/i.test(filename);
    };


    const showImage = () => {
        console.log(field.value);
        setShowPreview(true);
    }

    return (
        <>
            {showPreview &&
                <div className="image-preview-overlay" onClick={() => setShowPreview(false)}>
                    <div className="image-preview-container">
                        <img
                            src={process.env.REACT_APP_BASE_URL + "/" + field.value + "?token=" + localStorage.getItem("TOKEN")}
                            alt="Document image"
                            className='image-preview-image'
                        />
                    </div>
                </div>
            }

            <div className="custom-input-group">
                <label className="input-label">
                    {label} {required && <span className="required">*</span>}
                </label>
                {field.value && (isImageFile(field.value) ?
                    <img
                        src={process.env.REACT_APP_BASE_URL + "/" + field.value + "?token=" + localStorage.getItem("TOKEN")}
                        alt="Document image"
                        className='image-field-image'
                        onClick={() => setShowPreview(true)}
                    ></img> : <a
                        href={`${process.env.REACT_APP_BASE_URL}/${field.value}?token=${localStorage.getItem("TOKEN")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className='image-preview'
                        download
                    >
                        Download File
                    </a>)
                }
                {error && <span className="error-text">{error}</span>}
            </div>
        </>
    );
};
