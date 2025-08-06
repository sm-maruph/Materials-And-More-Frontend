import React from "react";
import "./css/loader.css";

const LoadWithText = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-28 h-28 relative">
        <div className="box1 absolute"></div>
        <div className="box2 absolute"></div>
        <div className="box3 absolute"></div>
      </div>
      <p className="mt-6 text-gray-600 text-lg">Products is loading...</p>
    </div>
  );
};

export default LoadWithText;
