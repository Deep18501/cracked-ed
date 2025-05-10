import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { DataContext } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import "../styles/application_form.css"; // Assuming you have a CSS file for styling
import ConfirmPaymentPopup from "./ConfirmPaymentPopup"
import { LoadingComponent } from "./LoadingComponent";
import Spinner from 'react-bootstrap/Spinner';
import { get_payment_screen } from '../controllers/dataController';
import RegistrationFormThankYou from "./RegistrationFormThankYou";
import { CustomFormInput } from "./CustomFormInput";
import {ImagePreviewComponent} from "./ImagePreviewComponent";


const ApplicationForm = () => {

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  // const contextData = useContext(DataContext);
  const [loading, setLoading] = useState(true);
  const { getApplicationData, applicationData, setApplicationData, updateApplicationData, dataLoading, setDataError } = useContext(DataContext);
  const [currentStepData, setCurrentStepData] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
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
      if (applicationData.status == "Completed") {
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
      setCurrentStep(updatedStep);
      setApplicationData(prev => ({
        ...prev,
        current_application_step: updatedStep,
      }));
    } catch (error) {
      console.error("Error while going back:", error);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setDataError({ "type": "error", "message": "Please confirm the disclaimer" });
      return;
    }
    if (agreed && applicationData.status != "Completed") {
      setPaymentPopup(true);
      console.log("tapped ", showPaymentPopup);
    }

  }



  const handleOnPayment = async (e) => {
    e.preventDefault();

    try {

      setPaymentPopup(false);
      formData["status"] = "Completed";
      const response = await updateApplicationData({
        data: formData,
      });

      navigate("/portal/application-success")
    } catch (error) {
      console.error("Error while going to next step:", error);
    }
  };


  const handleOnNext = async (e) => {
    e.preventDefault();

    try {
      let totalMissingFields = 0;
      if (applicationData.status == "Completed") {
        const updatedStep = applicationData.current_application_step + 1;
        setCurrentStep(updatedStep);
        setApplicationData(prev => ({
          ...prev,
          current_application_step: updatedStep,
        }));
        return;
      }
      if (applicationData.current_application_step == 3) {
        for (let k = 0; k < applicationData.steps.length; k++) {
          for (let i = 0; i < applicationData.steps[k].length; i++) {
            let section = applicationData.steps[k].sections[i];
            for (let j = 0; j < section.fields.length; j++) {

              let field = section.fields[j];
              let fieldName = field.field_name;

              if (field.required && !formData[fieldName]?.toString().trim()) {
                setDataError({ "type": "error", "message": "Please fill " + field.label });
                totalMissingFields++;
              }
            }
          }
        }
        if (totalMissingFields > 0) {
          return;
        }
        setPaymentPopup(true);
        return;
      }

      for (let i = 0; i < currentStepData.sections.length; i++) {
        let section = currentStepData.sections[i];
        for (let j = 0; j < section.fields.length; j++) {

          let field = section.fields[j];
          let fieldName = field.field_name;
          const value=formData[fieldName]
          if (field.required && !value) {
            setDataError({ type: "error", message: "Please fill " + field.label });
            totalMissingFields++;
            continue;
          }
          if (value && field.pattern) {
            let regex = new RegExp(field.pattern);
            if (!regex.test(value)) {
              let message = field.error_message || `Invalid format for ${field.label}`;
              setDataError({ type: "error", message });
              totalMissingFields++;
            }
          }

          console.log("value ",field.input_type,"-",value);
          if(value && field.input_type == "year"){
            if(value<field.min_value||value>field.max_value){
              setDataError({ type: "error", "message":"Enter a valid year"});
              totalMissingFields++;
            }
          }
        }
      }
      if (totalMissingFields > 0) {
        return;
      }
      const updatedStep = applicationData.current_application_step + 1;
      setCurrentStep(updatedStep);
      formData["current_application_step"] = updatedStep;
      formData["status"] ="In Progress";
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
    return <LoadingComponent />
  }
console.log("Current Step :",applicationData.current_application_step);
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

      {applicationData && dataLoading ? <LoadingComponent /> : null}


      {/* Navigation Tabs */}
      <div className="application-tabs">
        <div className="nav-tabs">
          {applicationData.steps.map((step) => (
            <div
              key={step.step}
              className={
                step.step.toString() == (applicationData.current_application_step).toString()
                  ? "tab-active"
                  : (applicationData.status == "Completed" && step.step < 3) ? "tab-inactive" : "tab"
              }
            >
              {step.title}
            </div>
          ))}
        </div>
      </div>

      {/* Form Sections */}
 
      <form className="form-section">
        {currentStepData?.sections?.map((section, idx) => (
          <div className="section-box" key={idx}>
            <div className="section-title">{section.section}</div>
            <div className="grid-container">
              {section.fields.map((field, fieldIdx) => (
                applicationData.current_application_step==3 && field.input_type =="file" && field.value!=null?<ImagePreviewComponent
                  field={field}
                  formData={formData}
                  setFormData={setFormData}
                />:
                <CustomFormInput
                  field={field}
                  formData={formData}
                  setFormData={setFormData}
                  currentStep={currentStep}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Submit Button */}

       { applicationData.status == "Completed" ?null
            : <div className="form-footer">
          {applicationData?.current_application_step > 0? (
            <button
              type="button"
              className="back-button"
              onClick={handleBackStep}
            >
              Back
            </button>
          ) : null}

          <button type="submit" className="submit-button" onClick={handleOnNext}>
            {(applicationData.current_application_step === 3 && applicationData.status != "Completed") ? "Submit Application" : "Next"}
          </button>
        </div>}

      </form>
      

      {showPaymentPopup && (applicationData.current_application_step === 3) ? (
        <ConfirmPaymentPopup
          onClose={() => setPaymentPopup(false)}
          onConfirm={handleOnPayment}
        />
      ) : null}
    </div>
  );
};

export default ApplicationForm;