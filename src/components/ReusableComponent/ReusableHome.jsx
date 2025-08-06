import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import SidebarSection from "./SidebarSection";
import ProductCard from "./ProductCard";
import heroBannerImageEquipment from "../../assets/global/equipment.png";
import heroBannerImageTest from "../../assets/global/testing.png";
import LoadWithText from "./LoadWithText";
const normalize = (text) => text?.toLowerCase().replace(/[\s/-]+/g, "");

const ReusableHome = () => {
  const navigate = useNavigate();
  const { category, subcategory } = useParams();

  const [productDatabase, setProductDatabase] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch and structure data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");
        const rawProducts = res.data;

        // Convert flat list to nested productDatabase structure
        const structuredData = {};
        rawProducts.forEach((item) => {
          const mainCategory = item.category?.trim();
          const subCategory = item.subcategory?.trim();

          if (!structuredData[mainCategory]) {
            structuredData[mainCategory] = {};
          }
          if (!structuredData[mainCategory][subCategory]) {
            structuredData[mainCategory][subCategory] = [];
          }

          structuredData[mainCategory][subCategory].push({
            id: item.id,
            name: item.name,
            image: item.image_url,
            description: item.description,
            price: item.price,
            specs: item.specifications || [],
            category: item.category,
            subcategory: item.subcategory,
            created_at: item.created_at,
          });
        });

        setProductDatabase(structuredData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Normalize input from the URL
  const matchedCategoryKeyInput = normalize(category);
  const normalizedSubcategoryInput = normalize(subcategory);

  // Match category key dynamically
  const matchedCategoryKey = Object.keys(productDatabase).find(
    (key) => normalize(key) === matchedCategoryKeyInput
  );

  const availableCategory = matchedCategoryKey
    ? productDatabase[matchedCategoryKey]
    : null;
  const subItems = availableCategory ? Object.keys(availableCategory) : [];

  // Match subcategory key dynamically
  const matchedSubcategoryKey =
    availableCategory &&
    Object.keys(availableCategory).find(
      (subKey) => normalize(subKey) === normalizedSubcategoryInput
    );

  // Get products
  const products = matchedSubcategoryKey
    ? availableCategory[matchedSubcategoryKey]
    : availableCategory
    ? Object.values(availableCategory).flat()
    : [];

  if (loading) {
    return <LoadWithText />;
  }

  if (!availableCategory) {
    return (
      <div className="pt-[100px] text-center py-20 text-gray-500">
        Opps! No product added yet for this {subcategory}.
      </div>
    );
  }

  const backgroundImages = {
    Equipment: heroBannerImageEquipment,
    "Test Materials": heroBannerImageTest,
    Category2: heroBannerImageEquipment,
    // ...other categories
  };
  console.log("Mateched ", matchedCategoryKey);
  const bgImage =
    backgroundImages[matchedCategoryKey] || heroBannerImageEquipment;

  const normalizeText = (text) => {
    if (!text) return "";
    return text
      .replace(/[-_]/g, " ") // Replace dashes and underscores with spaces
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  };

  return (
    <div>
      <Navbar />
      <div
        className="relative bg-cover bg-center h-48 md:h-64 flex flex-col items-center justify-center text-white"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Normalized Category */}
        <h1 className="relative z-10 text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          {normalizeText(matchedCategoryKey)}
        </h1>

        {/* Normalized Subcategory (if exists) */}
        {subcategory && (
          <p className="relative z-10 text-lg sm:text-xl mt-2 text-center font-medium text-gray-200">
            {normalizeText(subcategory)}
          </p>
        )}
      </div>

      {/* Breadcrumbs */}
      <div className="bg-gray-100 py-3 px-4 md:px-8 text-sm text-gray-700">
        <div className="max-w-7xl mx-auto">
          <a href="/" className="hover:underline text-fineetex-gray-text">
            Home
          </a>
          <span className="mx-2">&gt;</span>
          <a
            href={`/${encodeURIComponent(matchedCategoryKey)}`}
            className="text-mm-secondery font-medium hover:underline text-sty"
          >
            {matchedCategoryKey}
          </a>

          {matchedSubcategoryKey && (
            <>
              <span className="mx-2">&gt;</span>
              <a
                href={`/${encodeURIComponent(
                  matchedCategoryKey
                )}/${encodeURIComponent(matchedSubcategoryKey)}`}
                className="text-mm-primary font-medium hover:underline capitalize"
              >
                {matchedSubcategoryKey}
              </a>
            </>
          )}
        </div>
      </div>

      {/* Layout */}
      <div className="px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <SidebarSection
            items={subItems}
            onItemClick={(subcategory) =>
              navigate(
                `/${encodeURIComponent(category)}/${encodeURIComponent(
                  subcategory
                )}`
              )
            }
            activeItem={matchedSubcategoryKey}
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">
              No products available for {subcategory || matchedCategoryKey}.
            </p>
          ) : (
            products.map((product, idx) => (
              <ProductCard
                key={idx}
                id={product.id}
                name={product.name}
                image={product.image}
                description={product.description}
                category={product.category}
                subcategory={product.subcategory}
                specifications={product.specs}
                created_at={product.created_at}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReusableHome;
