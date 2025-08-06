// LandingComponent.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Hero from "./Hero";
import ReusableComponent from "./ReusableComponent";
import ReusableComponentReverse from "./ReusableComponentReverse";
import ScrollToTop from "./subcomponent/ScrollToTop";
import sectionImage from "../assets/global/equipment.png";

const LandingComponent = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(`/${path.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <>
      <Hero />

      <ReusableComponent
        title="Equipment"
        description="We specialize in lab setup services, textile testing equipment, and instruments."
        description2="Ensure precision and reliability with our top-grade testing tools."
        image={sectionImage}
        onButtonClick={() => handleNavigate("Equipment")}
        buttonText="More Equipment"
      />

      <ReusableComponentReverse
        title="Test Materials"
        description="We provide test materials for quality checks and assurance processes."
        description2="Reliable, certified consumables tailored for your lab’s needs."
        image={sectionImage}
        onButtonClick={() => handleNavigate("Test Materials")}
        buttonText="More Materials"
      />

      <ReusableComponent
        title="Mold Prevention"
        description="Protect your textiles and labs with our advanced mold prevention solutions."
        description2="Effective and safe methods that maintain quality and hygiene."
        image={sectionImage}
        onButtonClick={() => handleNavigate("Mold Prevention")}
        buttonText="Prevent Mold"
      />

      <ReusableComponentReverse
        title="Proficiency Test"
        description="Participate in our international proficiency testing programs."
        description2="Benchmark your lab performance and improve accuracy."
        image={sectionImage}
        onButtonClick={() => handleNavigate("Proficiency Test")}
        buttonText="Join Test"
      />

      <ReusableComponent
        title="Consultancy"
        description="Expert consultancy for lab setup, quality control, and system improvements."
        description2="Achieve excellence with tailored guidance and professional support."
        image={sectionImage}
        onButtonClick={() => handleNavigate("Consultancy")}
        buttonText="View Consultancy"
      />

      <ReusableComponentReverse
        title="Calibration"
        description="Ensure your instruments are calibrated for the highest accuracy."
        description2="Certified calibration services with detailed documentation."
        image={sectionImage}
        onButtonClick={() => handleNavigate("Calibration")}
        buttonText="Get Calibrated"
      />

      <ReusableComponent
        title="Others"
        description="We also provide a wide range of other laboratory services and products."
        description2="Explore our additional offerings customized for your business."
        image={sectionImage}
        onButtonClick={() => handleNavigate("Others")}
        buttonText="Explore More"
      />

      <ReusableComponentReverse
        title="Contact Us"
        description="Reach out to us for any queries, custom orders, or support."
        description2="We're here to help you find the right solution."
        image={sectionImage}
        onButtonClick={() => handleNavigate("Contact Us")}
        buttonText="Get in Touch"
      />

    </>
  );
};

export default LandingComponent;
