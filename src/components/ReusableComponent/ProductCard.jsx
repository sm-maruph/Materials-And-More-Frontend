import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  id,
  name,
  image,
  description,
  category,
  subcategory,
  specifications = [],
  created_at,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Normalize category/subcategory like in Navbar
  const normalizePath = (str) =>
    str?.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");

  const getTimeAgo = (dateString) => {
    const createdDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - createdDate;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours !== 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  };

  const truncateText = (text, limit = 60) =>
    text.length > limit ? text.slice(0, limit) + "..." : text;

  return (
    <div className="bg-white shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition duration-300 overflow-hidden flex flex-col p-2">
      {/* Image Section */}
      <div className="w-full h-36 sm:h-44 md:h-48 relative bg-gray-100">
        {loading && (
          <div className="absolute inset-0 animate-pulse bg-gray-300 rounded-t-xl" />
        )}
        <img
          src={image}
          alt={name}
          onLoad={() => setLoading(false)}
          className={`w-full h-full object-contain p-2 transition-opacity duration-300 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      {/* Content Section */}
      <div className="p-2 sm:p-3 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">{name}</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {truncateText(description)}
          </p>

          {specifications.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {specifications.map((spec, index) => (
                <span
                  key={index}
                  className="text-[10px] sm:text-xs bg-gray-200 text-gray-700 px-2 py-[2px] rounded-full"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}

          {(created_at || subcategory || category) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-xs text-gray-500 mt-1 gap-1 sm:gap-0">
              <span className="text-mm-primary">
                {normalizePath(category)} &gt; {normalizePath(subcategory)}
              </span>
              <span className="text-gray-400">Posted {getTimeAgo(created_at)}</span>
            </div>
          )}
        </div>

        <div className="mt-1 sm:mt-1">
          <button
            onClick={() =>
              navigate(
                `/${normalizePath(category)}/${normalizePath(subcategory)}/${id}`
              )
            }
            className="w-full bg-mm-primary text-white text-xs sm:text-sm px-3 py-2 rounded-md hover:bg-mm-secondary transition"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
