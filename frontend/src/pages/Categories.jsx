import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import CategoryTable from "../components/tables/CategoryTable";
import AddButton from "../components/buttons/AddButton";
import SearchBar from "../components/options/SearchBar";
import CategoryModal from "../components/modals/CategoryModal";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const fetchCategories = () => {
    axios
      .get("https://localhost:7207/api/categories/with-count")
      .then((res) => {
        const mapped = res.data.map((cat) => ({
          id: cat.id,
          name: cat.name,
          active: cat.activeProduct,
          inactive: cat.inactiveProduct,
        }));
        setCategories(mapped);
        setFiltered(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Search
  useEffect(() => {
    const result = categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, categories]);

  // Add or Update category
// Add or Update category
const handleSubmit = async (name) => {
  if (!name.trim()) {
    Swal.fire("Error", "Name cannot be empty", "error");
    return;
  }

  try {
    let response;

    if (editCategory) {
      // UPDATE
      response = await axios.put(
        `https://localhost:7207/api/categories/${editCategory.id}`,
        {
          id: editCategory.id,
          name,
        }
      );

      if (response.data.success === false) {
        Swal.fire("Error", response.data.message, "error");
        return;
      }

      // Update the category in the state
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editCategory.id
            ? { ...cat, name } // Update name
            : cat
        )
      );
    } else {
      // ADD
      response = await axios.post(
        "https://localhost:7207/api/categories",
        { name }
      );

      if (response.data.success === false) {
        Swal.fire("Error", response.data.message, "error");
        return;
      }

      // Add new category to state (map API response)
      const newCat = {
        id: response.data.id,
        name: response.data.name,
        active: 0,
        inactive: 0,
      };
      setCategories((prev) => [...prev, newCat]);
    }

    Swal.fire("Success", "Category saved successfully!", "success");
    setModalOpen(false);
    setEditCategory(null);
  } catch (err) {
    const msg =
      err.response?.data?.message || err.message || "Something went wrong";
    Swal.fire("Error", msg, "error");
    console.error(err);
  }
};


  const handleEdit = (category) => {
    setEditCategory(category);
    setModalOpen(true);
  };

  const handleDelete = (category) => {
    console.log("Delete", category);
  };

  if (loading) return <p>Loading categories...</p>;

  return (
    <div className="w-full space-y-4">
      {/* Row: Heading + Search + Add */}
      <div className="w-full flex items-center justify-between gap-4">
        <h3 className="text-2xl font-semibold text-violet-700 whitespace-nowrap">
          Categories
        </h3>

        <div className="flex-1 max-w-md">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Categories..."
          />
        </div>

        <AddButton onClick={() => setModalOpen(true)} />
      </div>

      <CategoryTable
        data={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <CategoryModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditCategory(null);
        }}
        onSubmit={handleSubmit}
        initialData={editCategory}
      />
    </div>
  );
}
