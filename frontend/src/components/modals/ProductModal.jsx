import React, { useState, useEffect } from "react";
import { X, Tag, DollarSign, Boxes, Tags as TagsIcon } from "lucide-react";

export default function ProductModal({
  open,
  onClose,
  onSubmit,
  initialData,
  categories = [],
}) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (initialData) {
      setId(initialData.id);
      setName(initialData.name);
      setPrice(initialData.price);
      setStock(initialData.stock);
      setCategoryId(String(initialData.categoryId));
    } else {
      setId("")
      setName("");
      setPrice("");
      setStock("");
      setCategoryId("");
    }
  }, [initialData]);

  if (!open) return null;

  const handleSubmit = () => {
    onSubmit({
      id: Number(id),
      name,
      price: Number(price),
      stock: Number(stock),
      categoryId: Number(categoryId),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-gray-100 p-6 rounded-xl w-full max-w-md shadow-lg">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-600">
            {initialData ? "Edit Product" : "Add Product"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointer rounded-full bg-gray-200 p-1 hover:bg-gray-300"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3">
          
          {/* Product Name */}
          <div className="relative">
            <Tag className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              type="text"
              className="w-full border border-violet-400 p-2 pl-10 rounded-full text-gray-600"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Price */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              type="number"
              className="w-full border border-violet-400 p-2 pl-10 rounded-full text-gray-600"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* Stock */}
          <div className="relative">
            <Boxes className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              type="number"
              className="w-full border border-violet-400 p-2 pl-10 rounded-full text-gray-600"
              placeholder="Enter stock count"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <TagsIcon className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <select
              className="w-full border border-violet-400 p-2 pl-10 rounded-full text-gray-600"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Small Note */}
          {!initialData && (
            <p className="text-xs text-gray-500 mt-1">
              Newly added products will be on{" "}
              <span className="text-green-600 font-medium">active</span> status by default.
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-purple-700 text-white rounded-full hover:bg-purple-800"
          >
            {initialData ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
