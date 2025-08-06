import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const TextSectionContent = ({ title, description, description2, onButtonClick, buttonText }) => {
  // Setup intersection observer
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3, // Adjust trigger sensitivity (30% visible)
  });

  return (
    <div className="bg-mm-secondery text-white p-8 rounded-lg shadow-lg z-10 relative flex flex-col">
      {/* Animate only the content inside, not the container */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col"
      >
       <h3 className="primary-color text-3xl font-extrabold mb-4">{title}</h3>

        <p className="text-base leading-relaxed text-gray-300 mb-4">{description}</p>
        {description2 && (
          <p className="text-base leading-relaxed text-gray-300 mb-8">{description2}</p>
        )}
        <div className="flex justify-center">
          <button
            onClick={onButtonClick}
            className="bg-primary-color text-white px-4 py-2 rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            {buttonText}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TextSectionContent;
