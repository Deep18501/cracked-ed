import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import "../styles/application_form.css"; // Assuming you have a CSS file for styling
import ConfirmPaymentPopup from "./ConfirmPaymentPopup"
import { LoadingComponent } from "./LoadingComponent";
import Spinner from 'react-bootstrap/Spinner';

const Input = ({ label, required, inputType, name, value, disabled, readOnly, onChange }) => {

  if (inputType === "file" && value !== "" && value !== undefined) {
    required = false;
    label += " - Uploaded";
    value = null;
  }
  return (
    <div className="input-group">
      <label className="input-label">
        {label} {required && <span className="required">*</span>}
      </label>
      <input
        type={inputType}
        name={name}
        className="input-field"
        defaultValue={value || ""}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        onChange={onChange}
      />
    </div>
  );
}


const ApplicationForm = () => {

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  // const contextData = useContext(DataContext);
  const [loading, setLoading] = useState(true);
  const { getApplicationData, applicationData, setApplicationData, updateApplicationData ,dataLoading,setDataError} = useContext(DataContext);
  const [currentStepData, setCurrentStepData] = useState(null);
  const [formData, setFormData] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [showPaymentPopup, setPaymentPopup] = useState(false);


  useEffect(() => {
    console.log("Application Data setting:", applicationData);
    if (applicationData !== null) {
      console.log("Application Data setting:", applicationData !== null);
      if (applicationData.current_application_step === 3) {
        var stepData = { "sections": [] };


        for (let i = 0; i < applicationData.steps.length; i++) {
          let step = applicationData.steps[i];
          for (let j = 0; j < step.sections.length; j++) {
            let section = step.sections[j];
            stepData.sections.push(section);
          }
        }

        setCurrentStepData(stepData);

      } else {

        for (let i = 0; i < applicationData.steps.length; i++) {
          let step = applicationData.steps[i];

          console.log("Step Data:", step, applicationData.current_application_step);
          if (step.step.toString() == (applicationData.current_application_step)) {
            setCurrentStepData(step);
            break;
          }
        }
      }
      if(applicationData.status=="Submitted"){
        setAgreed(true);
      }
      console.log("Current Step Data:", currentStepData);
    }
  }, [applicationData]);



  useEffect(() => {
    if (currentStepData) {
      const newFormData = {};

      currentStepData.sections.forEach((section) => {
        section.fields.forEach((field) => {
          let fieldName = field.field_name;
          newFormData[fieldName] = field.value || "";
          console.log("Field Data:", field.field_name, field.value, newFormData[fieldName]);
        });
      });
      setFormData(newFormData);
    }
  }, [currentStepData]);

  useEffect(() => {
    console.log("Application Data req sent:", applicationData);
    getApplicationData();
  }, []);



  const handleBackStep = async () => {
    try {
      const updatedStep = applicationData.current_application_step - 1;
      // const response = await fetch(`/api/update-application-step`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     application_id: applicationData.application_id,
      //     current_application_step: updatedStep,
      //   }),
      // });

      // if (!response.ok) throw new Error("Failed to update step");

      // Update local state or context
      setApplicationData(prev => ({
        ...prev,
        current_application_step: updatedStep,
      }));
    } catch (error) {
      console.error("Error while going back:", error);
    }
  };

  const handlePayment=async(e)=>{
    e.preventDefault();
    if(!agreed){
      setDataError({"type":"error","message":"Please confirm the disclaimer"});
      return;
    }
    if(agreed && applicationData.status!="Submitted"){
      setPaymentPopup(true);
      console.log("tapped ",showPaymentPopup);
    }
      
  }


  
  const handleOnPayment = async (e) => {
    e.preventDefault();

    try {
      let totalMissingFields = 0;
      
      for(let k =0;k<applicationData.steps.length;k++){

        for (let i = 0; i < applicationData.steps[k].length; i++) {
        let section = applicationData.steps[k].sections[i];
        for (let j = 0; j < section.fields.length; j++) {

          let field = section.fields[j];
          let fieldName = field.field_name;

          if (field.required && !formData[fieldName]?.toString().trim()) {
            setDataError({"type":"error","message":"Please fill "+field.label});
            totalMissingFields++;
          }
        }
      }}
      if (totalMissingFields > 0) {
        return;
      }

      const updatedStep = 4;
      formData["current_application_step"] = updatedStep;
      formData["status"] = "Submitted";
      const response = await updateApplicationData({
        data: formData,
      });

      console.log("Response:", response);
      navigate('/portal/dashboard');
      setApplicationData(prev => ({
        ...prev,
        current_application_step: updatedStep,
      }));
    } catch (error) {
      console.error("Error while going to next step:", error);
    }
  };


  const handleOnNext = async (e) => {
    e.preventDefault();

    try {
      let totalMissingFields = 0;
      for (let i = 0; i < currentStepData.sections.length; i++) {
        let section = currentStepData.sections[i];
        for (let j = 0; j < section.fields.length; j++) {

          let field = section.fields[j];
          let fieldName = field.field_name;

          if (field.required && !formData[fieldName]?.toString().trim()) {
            setDataError({"type":"error","message":"Please fill "+field.label});
            totalMissingFields++;
          }
        }
      }
      if (totalMissingFields > 0) {
        return;
      }

      const updatedStep = applicationData.current_application_step + 1;
      formData["current_application_step"] = updatedStep;
      const response = await updateApplicationData({
        data: formData,
      });

      console.log("Response:", response);
      setApplicationData(prev => ({
        ...prev,
        current_application_step: updatedStep,
      }));
    } catch (error) {
      console.error("Error while going to next step:", error);
    }
  };

  if (!applicationData) {
    return <LoadingComponent/>
  }

  return (

    <div className="application-form-container">
      {/* Header */}
      <div className="application-header">
        <p>
          <span className="label-bold">Candidate Name: </span>{" "}
          {applicationData.name}
        </p>
        <p>
          <span className="label-bold">Application Number:</span>{" "}
          {applicationData.application_id}
        </p>
      </div>

      {applicationData && dataLoading? <LoadingComponent/>:null}
  

      {/* Navigation Tabs */}
      <div className="application-tabs">
        <div className="nav-tabs">
          {applicationData.steps.map((step) => (
            <div
              key={step.step}
              className={
                step.step.toString() == (applicationData.current_application_step).toString()
                  ? "tab-active"
                  :(applicationData.status=="Submitted"&&step.step<3)?"tab-inactive":"tab"
              }
            >
              {step.title}
            </div>
          ))}
        </div>
      </div>

      {/* Form Sections */}
      {applicationData.current_application_step === 4 ?
        <form className="form-section">
          <div className="section-box" key={applicationData.current_application_step}>
            <div className="section-title">Payment</div>
            <div className="application-fee-container">
              <div className="fee-row">
                <div className="fee-label">Application Fee</div>
                <div className="fee-amount">Rs 100</div>
              </div>

              <div className="disclaimer-row">
                <input
                  type="checkbox"
                  id="confirmation"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <label htmlFor="confirmation" className="disclaimer-text">
                  I confirm that the information provided by me is true in all respects and if any information is
                  found to be false, I understand that my application / candidature will stand cancelled and
                  no refund of fee will be claimed
                </label>
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="form-footer">
            <button
                type="button"
                className="back-button"
                onClick={handleBackStep}
              >
                Back
              </button>

            <button type="submit" className="submit-button" onClick={handlePayment}>
            {applicationData.status=="Submitted"?"Payment Confirmed": "Click to Pay"}
            </button>
          </div>

        </form>
        :
        <form className="form-section">
          {currentStepData?.sections?.map((section, idx) => (
            <div className="section-box" key={idx}>
              <div className="section-title">{section.section}</div>
              <div className="grid-container">
                {section.fields.map((field, fieldIdx) => (
                  <Input
                    key={field.field_name}
                    label={field.label}
                    required={field.required}
                    inputType={field.input_type}
                    name={field.field_name}
                    value={formData[field.field_name] || ""}
                    disabled={applicationData.current_application_step === 3 ? true : false}
                    readOnly={applicationData.current_application_step === 3 ? true : false}
                    onChange={(e) => {
                      const field_name = field.field_name;

                      if (field.input_type === "file") {
                        const file = e.target.files?.[0];
                        console.log("Selected File for:", field_name, file);
                        if (file) {
                          setFormData((prev) => ({
                            ...prev,
                            [field_name]: file,
                          }));
                        }
                      } else {
                        console.log("Editing Field Name:", field_name, "Value:", e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          [field_name]: e.target.value,
                        }));
                      }
                    }}

                  />
                ))}
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className="form-footer">
            {applicationData?.current_application_step > 0 && !(applicationData?.current_application_step==3 && applicationData.status =="Submitted")? (
              <button
                type="button"
                className="back-button"
                onClick={handleBackStep}
              >
                Back
              </button>
            ):null}

            <button type="submit" className="submit-button" onClick={handleOnNext}>
              {(applicationData.current_application_step === 3 )? "Proceed to Payment" : "Next"}
            </button>
          </div>

        </form>
      }

      {showPaymentPopup &&( applicationData.current_application_step===4)? (
        <ConfirmPaymentPopup
          onClose={() => setPaymentPopup(false)}
          onConfirm={handleOnPayment}
        />
      ):null}
    </div>
  );
};

export default ApplicationForm;