import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression"; // 🔼 Add this at top
const API_BASE = process.env.REACT_APP_API_BASE_URL;

function AdminPartners() {
  const [title, setTitle] = useState("");
  const [website, setWebsite] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [fetchingPartners, setFetchingPartners] = useState(false);
  const fileInputRef = useRef(null); // 1. Create ref for file input

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setFetchingPartners(true);
    try {
      const res = await axios.get(`${API_BASE}/partners`);
      setPartners(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load partners");
    } finally {
      setFetchingPartners(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setWebsite("");
    setImage(null);
    setImagePreview(null);
    setEditingId(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // 2. Reset file input value
    }
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 0.02, // ≈20KB
      maxWidthOrHeight: 300,
      useWebWorker: true,
      fileType: "image/webp",
    };

    try {
      const compressed = await imageCompression(file, options);

      if (compressed.size > 20000) {
        setError("Compressed image is still larger than 20KB.");
        return;
      }

      setError("");
      setImage(compressed);
      setImagePreview(URL.createObjectURL(compressed));
    } catch (err) {
      console.error("Image compression error:", err);
      setError("Image compression failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !website || (!image && !editingId)) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("website", website);
    if (image) formData.append("image", image);

    try {
      if (editingId) {
        await axios.put(
          `${API_BASE}/partners/${editingId}`,
          formData
        );
      } else {
        await axios.post(`${API_BASE}/partners`, formData);
      }
      resetForm();
      fetchPartners();
    } catch (err) {
      setError("Failed to save partner.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this partner?"))
      return;

    setDeletingId(id);
    try {
      await axios.delete(`${API_BASE}/partners/${id}`);
      // If deleting the partner being edited, reset form
      if (editingId === id) resetForm();
      fetchPartners();
    } catch {
      setError("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (partner) => {
    setTitle(partner.title);
    setWebsite(partner.website);
    setImagePreview(partner.image_url);
    setImage(null); // Reset image input; user can upload new one if desired
    setEditingId(partner.id);
    setError("");
    if (!isOpen) setIsOpen(true); // Open the manager if closed
  };

  return (
    <div className="max-w-5xl mx-auto p-4 relative">
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
    text-base       /* mobile default font size */
    sm:text-lg      /* small screens */
    md:text-2xl     /* medium and above */
    hover:bg-mm-primary-dark
    active:scale-95
    transition-all
    duration-300
    ease-in-out
    shadow-md
    hover:shadow-lg
  "
>
  {isOpen ? "▲ Hide Partner Manager" : "▼ Click Here To Manage Partners"}
</button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white rounded shadow p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Company Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Company Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
                required
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Company Logo
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/webp"
                onChange={handleImageChange}
                className="w-full mt-1"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 h-20 rounded"
                />
              )}
            </div>
            {error && <p className="text-red-600">{error}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-mm-primary text-white px-4 py-2 rounded hover:bg-mm-primary/90 transition flex items-center justify-center"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Partner"
                  : "Add Partner"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          <hr className="my-6" />

          {fetchingPartners ? (
            <p className="text-center py-10 text-gray-500">
              Loading partners...
            </p>
          ) : partners.length === 0 ? (
            <p className="text-center py-10 text-gray-500">
              No partners found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="border p-4 rounded shadow-sm bg-gray-50 relative"
                >
                  <img
                    src={partner.image_url}
                    alt={partner.title}
                    className="h-16 mx-auto mb-2"
                  />
                  <h4 className="text-lg font-semibold text-center">
                    {partner.title}
                  </h4>
                  <p className="text-sm text-blue-600 text-center break-words">
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {partner.website}
                    </a>
                  </p>

                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => handleEdit(partner)}
                      className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(partner.id)}
                      disabled={deletingId === partner.id}
                      className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      {deletingId === partner.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPartners;
