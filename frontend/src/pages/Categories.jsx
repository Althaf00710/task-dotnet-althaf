import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import CategoryTable from "../components/tables/CategoryTable";
import AddButton from "../components/buttons/AddButton";
import RefreshButton from "../components/buttons/RefreshButton";
import SearchBar from "../components/options/SearchBar";
import CategoryModal from "../components/modals/CategoryModal";

import categoryService from "../services/categoryService";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  // Fetch categories using service
  const fetchCategories = async () => {
    try {
      const res = await categoryService.getWithCount();

      const mapped = res.data.map((cat) => ({
        id: cat.id,
        name: cat.name,
        active: cat.activeProduct,
        inactive: cat.inactiveProduct,
      }));

      setCategories(mapped);
      setFiltered(mapped);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Search filter
  useEffect(() => {
    const result = categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, categories]);

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
        response = await categoryService.update(editCategory.id, {
          id: editCategory.id,
          name,
        });

        if (response.data.success === false) {
          Swal.fire("Error", response.data.message, "error");
          return;
        }

        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editCategory.id ? { ...cat, name } : cat
          )
        );
      } else {
        // ADD
        response = await categoryService.create({ name });

        if (response.data.success === false) {
          Swal.fire("Error", response.data.message, "error");
          return;
        }

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

  // Edit
  const handleEdit = (category) => {
    setEditCategory(category);
    setModalOpen(true);
  };

  // Delete 
  const handleDelete = async (category) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete category "${category.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await categoryService.delete(category.id);

      // Backend returns status 204 No Content on success
      if (res.status === 204) {
        setCategories((prev) =>
          prev.filter((cat) => cat.id !== category.id)
        );

        Swal.fire("Deleted!", "Category deleted successfully.", "success");
        return;
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Something went wrong while deleting.";

      Swal.fire("Error", msg, "error");
      console.error(err);
    }
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

        <div className="flex gap-2">
          <RefreshButton onClick={fetchCategories} />
          <AddButton onClick={() => setModalOpen(true)} />
        </div>
      </div>

      <CategoryTable
        data={filtered}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
