import React from 'react';
import TextSectionContent from './subcomponent/TextSectionContent';

const ReusableComponentReverse = ({
  title,
  description,
  description2,
  image,
  onButtonClick,
  buttonText = "Learn More"
}) => {
  

  return (
    <div className="bg-gray-100 px-4 py-8 md:p-12 rounded-lg shadow-lg relative overflow-visible flex flex-row justify-center">

      {/* --- Mobile Layout --- */}
      <div className="block md:hidden text-center space-y-6">
        <img
          src={image}
          alt={title}
          className="w-full max-w-md mx-auto rounded-xl shadow-md"
        />
        <h2 className="text-3xl font-bold text-mm-primary">{title}</h2>
        <p className="text-sm text-gray-700 px-2">{description}</p>
        {description2 && (
          <p className="text-sm text-gray-700 px-2">{description2}</p>
        )}
        <button
          onClick={onButtonClick}
          className="bg-mm-primary text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-orange-600 transition"
        >
          {buttonText}
        </button>
      </div>

      {/* --- Desktop Layout --- */}
      <div className="hidden md:grid grid-cols-2 gap-1 items-center">
        {/* Left Section - Image */}
        <div className="flex items-center justify-end relative z-30 h-full">
          <img
            src={image}
            alt={title}
            className="h-full max-w-[550px] rounded-xl shadow-2xl relative top-1 -left-0 transform -rotate-0 hover:h-[120%] hover:rotate-0 hover:scale-105 transition-all duration-500 ease-in-out"
          />
        </div>

         {/* Left Section */}
        <TextSectionContent
          title={title}
          description={description}
          description2={description2}
          onButtonClick={onButtonClick}
          buttonText={buttonText}
        />
      </div>
    </div>
  );
};

export default ReusableComponentReverse;
