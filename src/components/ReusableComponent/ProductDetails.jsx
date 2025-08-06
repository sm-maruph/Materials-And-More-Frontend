import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import LoadingWithText from "./LoadWithText";
import ProductEnquiryModal from "./ProductEnquiryModal";
const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setCategoryRelated] = useState([]);
  const [subrelated, setSubcategoryRelated] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Normalize category and subcategory names
  const normalizeName = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!product || !product.id || !product.category_id) return;

    // Fetch related products
    axios
      .get(`http://localhost:5000/products/related`, {
        params: {
          excludeId: product.id,
          subcategoryId: product.category_id,
        },
      })
      .then((res) => {
        console.log("subcategoryRelated:", res.data.subcategory);
        console.log("categoryRelated:", res.data.category);
        setCategoryName(res.data.categoryName);
        setSubcategoryName(res.data.subcategoryName);
        setSubcategoryRelated(res.data.subcategoryRelated || []);
        setCategoryRelated(res.data.categoryRelated || []);
      })
      .catch((err) => console.error("Error fetching related:", err));

    // Extract and normalize category and subcategory names from the product
    if (product.category) {
      setSubcategoryName(normalizeName(product.category.name));
      setCategoryName(normalizeName(product.category.parent?.name));
    }
  }, [product]);

  // Helper function to calculate time ago
  const getTimeAgo = (dateString) => {
    const createdDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - createdDate;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
    if (weeks < 5) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  };

  if (!product) return <LoadingWithText />;

  return (
    <div className="max-w-7xl mx-auto p-6 mt-10">
      {/* ✅ Breadcrumbs */}
      <div className="mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:underline text-mm-primary font-semibold">
          Home
        </Link>{" "}
        /{" "}
        <Link
          to={`/${categoryName}`}
          className="hover:underline text-mm-primary"
        >
          {categoryName}
        </Link>{" "}
        /{" "}
        <Link
          to={`/${categoryName}/${subcategoryName}`}
          className="hover:underline text-mm-primary"
        >
          {subcategoryName}
        </Link>{" "}
        / <span className="text-gray-700">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Main Content */}
       <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-xl">
  {/* Top Grid: Image + Info */}
  <div className="grid md:grid-cols-2 gap-6 mb-8">
    {/* Left: Image */}
    <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden group">
      <img
        src={product.image_url}
        alt={product.name}
        className="object-contain w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
    </div>

    {/* Right: Info */}
    <div className="flex flex-col justify-between">
      <div>
        <h3 className="text-3xl font-extrabold text-mm-secondery mb-4 leading-tight">
          {product.name}
        </h3>

        {/* Key Specifications */}
        {product.specifications?.length > 0 && (
          <div className="mb-6">
            <h6 className="text-sm font-semibold  text-mm-secondary">
              Key Specifications:
            </h6>
            <div className="flex flex-wrap gap-3 bg-mm-light p-4 rounded-lg border border-mm-primary">
              {product.specifications.map((spec, idx) => (
                <span
                  key={idx}
                  className="cursor-default select-none bg-white text-mm-primary border border-mm-primary text-sm font-semibold px-4 py-1 rounded-full shadow-sm whitespace-nowrap hover:shadow-md transition-transform duration-300 hover:scale-105"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price + Enquiry */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="bg-mm-secondery text-white rounded-lg px-6 py-2 font-bold text-lg text-center shadow-md min-w-[120px]">
            ৳ {product.price}
          </div>
          <button  onClick={() => setIsModalOpen(true)} className="bg-mm-primary text-white rounded-lg px-6 py-2 font-bold text-lg text-center shadow-md min-w-[120px]">
            ✉️ Enquiry Now
          </button>
        </div>

        {/* Payment Method */}
        <div className="text-sm font-medium text-gray-700 mb-6">
          <span className="font-semibold text-mm-secondary">Payment Method:</span>{" "}
          <span className="text-mm-primary font-bold">Cash on Delivery</span>
        </div>

        {/* Category > Subcategory */}
        <div className="flex flex-wrap gap-2 text-gray-800 font-semibold mb-6">
          <span>{categoryName}</span>
          <span className="text-mm-primary">→</span>
          <span>{subcategoryName}</span>
        </div>

        {/* Timestamps */}
        <div className="text-gray-600 text-sm space-y-1">
          <div>
            <span className="font-semibold">Posted:</span>{" "}
            {getTimeAgo(product.created_at)}
          </div>
          <div>
            <span className="font-semibold">Last Updated:</span>{" "}
            {getTimeAgo(product.updated_at)}
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Full-Width Description */}
  <div>
    <h2 className="text-xl font-semibold mb-4 text-mm-secondary">
      Description:
    </h2>
    <p className="text-gray-700 leading-relaxed text-[1.05rem]">
      {product.description}
    </p>
  </div>
</div>


        {/* ✅ Related Products Sidebar */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Related Products
          </h2>

          {subrelated.length === 0 && related.length === 0 ? (
            <p className="text-sm text-gray-500">No related products found.</p>
          ) : (
            <>
              {subrelated.length > 0 && (
                <div>
                  <h3 className="text-md font-medium text-gray-700">
                    More in {subcategoryName}
                  </h3>
                  {subrelated.map((item) => (
                    <Link
                      to={`/${item.categoryName}/${item.subcategoryName}/${item.id}`}
                      key={item.id}
                      className="block bg-white rounded-lg shadow hover:shadow-md p-3 border border-gray-200 mb-2"
                    >
                      <div className="flex gap-3 items-center">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 object-contain bg-gray-50 rounded"
                        />
                        <div className="text-sm">
                          <div className="font-semibold text-mm-primary truncate">
                            {item.name}
                          </div>
                          <div className="text-mm-secondery font-bold">
                            ৳ {item.price}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {related.length > 0 && (
                <div>
                  <h3 className="text-md font-medium text-gray-700">
                    More in {categoryName}
                  </h3>
                  {related.map((item) => (
                    <Link
                      to={`/${item.category?.parent?.name || ""}/${
                        item.category?.name || ""
                      }/${item.id}`}
                      key={item.id}
                      className="block bg-white rounded-lg shadow hover:shadow-md p-3 border border-gray-200 mb-2"
                    >
                      <div className="flex gap-3 items-center">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 object-contain bg-gray-50 rounded"
                        />
                        <div className="text-sm">
                          <div className="font-semibold text-gray-800 truncate">
                            {item.name}
                          </div>
                          <div className="text-mm-primary font-bold">
                            ৳ {item.price}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ProductEnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </div>
  );
};

export default ProductDetails;
