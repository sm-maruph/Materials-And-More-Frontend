import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const API_BASE = "http://localhost:5000";

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name"); // "name", "category", "subcategory"
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [prodForm, setProdForm] = useState({
    name: "",
    category_id: "",
    description: "",
    price: "",
    specifications: [],
    imageFile: null,
  });
  const [editingProdId, setEditingProdId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/categories`);
      const tree = buildCategoryTree(res.data);
      // console.log("Category Tree:", tree);

      setCategories(tree);
    } catch (e) {
      alert("Failed to load categories");
      console.error(e);
    }
  };

  const buildCategoryTree = (categories) => {
    const map = {};
    const roots = [];

    categories.forEach((cat) => {
      cat.subcategories = [];
      map[cat.id] = cat;
    });

    categories.forEach((cat) => {
      if (cat.parent_id === null) {
        roots.push(cat);
      } else {
        if (map[cat.parent_id]) {
          map[cat.parent_id].subcategories.push(cat);
        }
      }
    });

    return roots;
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await axios.get(`${API_BASE}/products`);
      setProducts(res.data);
    } catch (e) {
      alert("Failed to load products");
      console.error(e);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleProdFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      console.log(file);
      setProdForm((prev) => ({ ...prev, imageFile: file }));
      if (file) {
        setImagePreview(URL.createObjectURL(file)); // show preview of new selected file
      } else {
        setImagePreview("");
      }
    } else {
      setProdForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resizeImage = (img, maxWidth = 800, maxHeight = 800) => {
    const canvas = document.createElement("canvas");
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    return canvas;
  };

  const convertToWebP = (file, productName) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        img.onload = async () => {
          const canvas = resizeImage(img);

          // Try compressing with decreasing quality until under 20 KB
          let quality = 0.8;
          let blob = null;

          while (quality > 0.1) {
            blob = await new Promise((res) =>
              canvas.toBlob(res, "image/webp", quality)
            );
            if (blob && blob.size <= 20 * 1024) break;
            quality -= 0.1;
          }

          if (!blob || blob.size > 20 * 1024) {
            return reject(
              new Error("Image could not be compressed under 20 KB")
            );
          }

          const cleanName = productName
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^\w\-]+/g, ""); // removes special chars
          const timestamp = Date.now();

          const webpFile = new File(
            [blob],
            `${cleanName}_materials&more_${timestamp}.webp`,
            {
              type: "image/webp",
            }
          );

          resolve(webpFile);
        };

        img.onerror = reject;
        img.src = reader.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const uploadImageToSupabase = async (file, productName) => {
    let webpFile;
    try {
      // ✅ Convert to WebP first
      try {
        webpFile = await convertToWebP(file, productName);
        console.log("Converted file:", webpFile);
        // upload to server or Supabase here
      } catch (error) {
        console.error("Image processing failed:", error.message);
      }

      const formData = new FormData();
      formData.append("file", webpFile);

      const res = await axios.post(`${API_BASE}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", res.data);

      const publicUrl = res.data?.publicUrl;

      if (!publicUrl) {
        console.error("Upload succeeded but no public URL:", res.data);
        throw new Error("Missing publicUrl in response");
      }

      return publicUrl;
    } catch (error) {
      console.error(
        "Image upload failed in supabase:",
        error.response?.data || error.message
      );
      return null;
    }
  };

  const handleAddUpdateProduct = async () => {
    setLoading(true);
    // 1. Convert specifications
    const specificationsArray = Array.isArray(prodForm.specifications)
      ? prodForm.specifications
      : typeof prodForm.specifications === "string"
      ? prodForm.specifications.split(",").map((s) => s.trim())
      : [];

    // 2. Upload image if provided
    let imageUrl = prodForm.image_url || ""; // for editing, keep old URL if no new file
    if (prodForm.imageFile) {
      try {
        const uploadedUrl = await uploadImageToSupabase(
          prodForm.imageFile,
          prodForm.name
        );
        if (!uploadedUrl) throw new Error("Image upload failed in db 1");
        imageUrl = uploadedUrl;
      } catch (e) {
        alert("Image upload failed in db 2");
        console.error("Upload error:", e);
        return;
      }
    }

    // 3. Prepare product data
    const productData = {
      name: prodForm.name,
      category_id: prodForm.category_id,
      description: prodForm.description,
      price: Number(prodForm.price),
      image_url: imageUrl || prodForm.image_url, // ✅ Make sure this line is here
      specifications: specificationsArray,
    };

    try {
      let response;
      if (editingProdId) {
        // Update existing product
        response = await axios.put(
          `${API_BASE}/products/${editingProdId}`,
          productData
        );
      } else {
        // Create new product
        response = await axios.post(`${API_BASE}/products`, productData);
      }

      alert(
        editingProdId
          ? "Product updated successfully!"
          : "Product saved successfully!"
      );
      fetchProducts();

      setProdForm({
        name: "",
        category_id: "",
        description: "",
        price: "",
        image_url: "",
        specifications: [],
        imageFile: null,
      });
      setImagePreview(""); // <-- add this line to clear preview
      setEditingProdId(null);
    } catch (e) {
      alert(editingProdId ? "Error updating product" : "Error saving product");
      if (e.response) {
        console.error("Error response data:", e.response.data);
      } else {
        console.error("Request error:", e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (prod) => {
    setProdForm({
      name: prod.name,
      category_id: prod.category_id,
      description: prod.description || "",
      price: prod.price || "",
      specifications: prod.specifications || [],
      imageFile: null,
      image_url: prod.image_url || "",
    });
    setEditingProdId(prod.id);
    setImagePreview(prod.image_url || ""); // show existing image preview
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API_BASE}/products/${id}`);
      fetchProducts();
    } catch (e) {
      alert("Failed to delete product");
      console.error(e);
    }
  };

  const renderCategoryOptions = (cats, prefix = "") =>
    cats.flatMap((cat) => [
      <option key={cat.id} value={cat.id}>
        {prefix + cat.name}
      </option>,
      ...renderCategoryOptions(cat.subcategories, prefix + "--"),
    ]);

  // Helper to get full category path
  const getCategoryPath = (catList, id, path = []) => {
    for (const cat of catList) {
      if (String(cat.id) === String(id)) {
        return [...path, cat.name];
      }
      if (cat.subcategories && cat.subcategories.length > 0) {
        const result = getCategoryPath(cat.subcategories, id, [
          ...path,
          cat.name,
        ]);
        if (result.length) return result;
      }
    }
    return [];
  };

  const filteredSortedProducts = [...products]
    .filter((prod) => {
      const catPath = getCategoryPath(categories, prod.category_id);
      const combined = `${prod.name} ${catPath.join(" ")}`.toLowerCase();
      return combined.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);

      const aCat = getCategoryPath(categories, a.category_id).join(" ");
      const bCat = getCategoryPath(categories, b.category_id).join(" ");
      return aCat.localeCompare(bCat);
    });

  return (
    <section  className="max-w-6xl mx-auto p-4 relative">
      {/* Toggle Button */}
      <button
  onClick={() => setIsOpen((prev) => !prev)}
  className="
    w-full
    text-center
    font-semibold
    rounded
    bg-mm-primary
    text-white
    py-2
    px-4
    mb-4
    text-lg          /* base font size */
    sm:text-xl       /* small screens and up */
    md:text-2xl      /* medium screens and up */
    hover:bg-mm-primary-dark
    active:scale-95
    transition-all
    duration-300
    ease-in-out
    shadow-md
    hover:shadow-lg
  "
>
 {isOpen ? "▲ Hide Products Manager" : "▼ Click Here To Manage Products"}
</button>


      {/* Collapsible Section */}
      {isOpen && (
        <div className="p-3 border rounded shadow animate__animated animate__fadeIn">
          {/* Form */}
          <div className="container">
            <div className="row g-3">
              {/* Product Name */}
              <div className="col-12 col-md-6 col-lg-4">
                <input
                  name="name"
                  value={prodForm.name}
                  onChange={handleProdFormChange}
                  placeholder="Product name"
                  className="form-control"
                />
              </div>

              {/* Category */}
              <div className="col-12 col-md-6 col-lg-4">
                <select
                  name="category_id"
                  value={prodForm.category_id}
                  onChange={handleProdFormChange}
                  className="form-select"
                >
                  <option value="">Select category</option>
                  {renderCategoryOptions(categories)}
                </select>
              </div>

              {/* Price */}
              <div className="col-12 col-md-6 col-lg-4">
                <input
                  type="text"
                  name="price"
                  value={prodForm.price}
                  onChange={handleProdFormChange}
                  placeholder="Price"
                  className="form-control"
                />
              </div>

              {/* Image Upload */}
              <div className="col-12">
                <label className="form-label">Upload Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleProdFormChange}
                  className="form-control"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="img-thumbnail mt-2"
                    style={{ maxHeight: "150px" }}
                  />
                )}
              </div>

              {/* Description */}
              <div className="col-12">
                <input
                  type="text"
                  name="description"
                  value={prodForm.description}
                  onChange={handleProdFormChange}
                  placeholder="Description"
                  className="form-control"
                />
              </div>

              {/* Specifications */}
              <div className="col-12">
                <input
                  type="text"
                  name="specifications"
                  value={
                    Array.isArray(prodForm.specifications)
                      ? prodForm.specifications.join(", ")
                      : ""
                  }
                  onChange={(e) =>
                    setProdForm((prev) => ({
                      ...prev,
                      specifications: e.target.value
                        .split(",")
                        .map((s) => s.trim()),
                    }))
                  }
                  placeholder="Specifications (comma separated)"
                  className="form-control"
                />
              </div>

              {/* Action Buttons */}
              <div className="col-12 d-flex flex-wrap gap-2 mt-3">
                <button
                  onClick={handleAddUpdateProduct}
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : editingProdId ? (
                    "Update Product"
                  ) : (
                    "Add Product"
                  )}
                </button>

                {editingProdId && (
                  <button
                    onClick={() => {
                      setEditingProdId(null);
                      setProdForm({
                        name: "",
                        category_id: "",
                        description: "",
                        price: "",
                        img_url: "",
                        specifications: [],
                        imageFile: null,
                      });
                      setImagePreview("");
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Search and Sort */}
          <div className="row mt-4">
            <div className="col-md-6 mb-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or category..."
                className="form-control"
              />
            </div>
            <div className="col-md-6 mb-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
              >
                <option value="name">Sort by Name (A-Z)</option>
                <option value="category">Sort by Category</option>
                <option value="subcategory">Sort by Subcategory</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive mt-3">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Sub category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSortedProducts.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        className="img-fluid"
                        style={{ maxHeight: "80px" }}
                      />
                    </td>
                    <td>{prod.name}</td>
                    <td>
                      {getCategoryPath(categories, prod.category_id).join(
                        " > "
                      )}
                    </td>
                    <td>{prod.price}</td>
                    <td>
                      <button
                        onClick={() => handleEditProduct(prod)}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {isOpen && (
        <div className="p-3 border rounded shadow animate__animated animate__fadeIn">
          {/* ... All existing product management content goes here ... */}
        </div>
      )}
    </section>
  );
}

export default ProductManager;
