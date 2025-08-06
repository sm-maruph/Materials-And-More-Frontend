import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

function CategoryManager() {
  // Categories state
  const [categories, setCategories] = useState([]);
  const [catName, setCatName] = useState("");
  const [editingCatId, setEditingCatId] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch categories and build nested tree
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await axios.get(`${API_BASE}/categories`);
      const categories = res.data; // already sorted by parent_id and name
      const tree = buildCategoryTree(categories);
      setCategories(tree);
    } catch (e) {
      alert("Failed to load categories");
      console.error(e);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Helper to convert flat categories list to nested tree
  function buildCategoryTree(categories) {
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
  }

  // CategoryList component with toggle and editable subcategories
  function CategoryList({ categories, onEdit, onDelete, level = 0 }) {
    const [expandedCatIds, setExpandedCatIds] = useState([]);

    const toggleCategoryExpand = (catId) => {
      setExpandedCatIds((prev) =>
        prev.includes(catId)
          ? prev.filter((id) => id !== catId)
          : [...prev, catId]
      );
    };

    return (
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="border-b py-2 flex flex-col"
            style={{ paddingLeft: level * 20 }}
          >
            <div className="flex justify-between items-center">
              <span
                onClick={() => toggleCategoryExpand(cat.id)}
                className="cursor-pointer font-medium"
                title="Click to toggle subcategories"
              >
                {cat.name}
              </span>
              <div>
                <button
                  onClick={() => onEdit(cat)}
                  className="mr-3 text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(cat.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>

            {expandedCatIds.includes(cat.id) && cat.subcategories.length > 0 && (
              <ul className="w-[90%] mt-2 ml-6 border-l pl-4">
                {[...cat.subcategories]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((subcat) => (
                    <li
                      key={subcat.id}
                      className="flex justify-between items-center py-1"
                    >
                      <span>{subcat.name}</span>
                      <div>
                        <button
                          onClick={() => onEdit(subcat)}
                          className="mr-3 px-1 py-1 text-white bg-mm-primary hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(subcat.id)}
                          className="mr-3 px-1 py-1 text-white bg-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  }

  // Category handlers
  const handleAddUpdateCategory = async () => {
    if (!catName.trim()) return alert("Category name is required");
    try {
      if (editingCatId) {
        await axios.put(`${API_BASE}/categories/${editingCatId}`, {
          name: catName,
        });
      } else {
        await axios.post(`${API_BASE}/categories`, { name: catName });
      }
      setCatName("");
      setEditingCatId(null);
      fetchCategories();
    } catch (e) {
      alert("Error saving category");
      console.error(e);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axios.delete(`${API_BASE}/categories/${id}`);
      fetchCategories();
    } catch (e) {
      alert("Failed to delete category");
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-3">Categories</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={catName}
          onChange={(e) => setCatName(e.target.value)}
          placeholder="Category name"
          className="border p-2 rounded flex-grow"
          disabled={loadingCategories}
        />
        <button
          onClick={handleAddUpdateCategory}
          className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
          disabled={loadingCategories}
        >
          {editingCatId ? "Update" : "Add"}
        </button>
        {editingCatId && (
          <button
            onClick={() => {
              setEditingCatId(null);
              setCatName("");
            }}
            className="bg-gray-600 text-white px-4 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        )}
      </div>

      <CategoryList
        categories={categories}
        onEdit={(cat) => {
          setCatName(cat.name);
          setEditingCatId(cat.id);
        }}
        onDelete={handleDeleteCategory}
      />
    </section>
  );
}

export default CategoryManager;
