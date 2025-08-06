import React, { useState } from "react";

const CategoryProductSection = ({ data }) => {
  const [activeCategory, setActiveCategory] = useState(data[0].name);

  const activeProducts = data.find((cat) => cat.name === activeCategory)?.products || [];

  return (
    <div className="w-[90%] mx-auto my-12 flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 space-y-4">
        {data.map((category) => (
          <button
            key={category.name}
            className={`w-full px-4 py-3 text-left rounded font-semibold border ${
              activeCategory === category.name
                ? "bg-orange-500 text-white"
                : "bg-white text-black hover:bg-orange-100"
            }`}
            onClick={() => setActiveCategory(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {activeProducts.map((product, index) => (
          <div key={index} className="border rounded shadow p-4 flex flex-col items-center text-center">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-40 object-contain mb-4"
            />
            <h4 className="font-semibold mb-2">{product.title}</h4>
            <div className="flex gap-2 mt-auto">
              <button className="bg-gray-800 text-white px-4 py-2 rounded text-sm">
                Details
              </button>
              <button className="bg-orange-500 text-white px-4 py-2 rounded text-sm">
                Add to Enquiry
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProductSection;
