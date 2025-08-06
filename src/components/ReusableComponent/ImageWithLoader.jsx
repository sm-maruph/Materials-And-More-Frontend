import React, { useState } from "react";

const ImageWithLoader = ({ src, alt, className }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className={`relative w-full ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-lg" />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-contain rounded-lg transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </div>
  );
};

export default ImageWithLoader;
