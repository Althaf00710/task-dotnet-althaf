import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

export default function ProductFilterModal({
  open,
  onClose,
  onApply,
  categories,
  savedFilters,
}) {
  const [categoryId, setCategoryId] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDesc, setSortDesc] = useState(false);

  // Load saved values
  useEffect(() => {
    if (savedFilters) {
      setCategoryId(savedFilters.categoryId || "");
      setSortBy(savedFilters.sortBy || "");
      setSortDesc(savedFilters.sortDesc || false);
    }
  }, [savedFilters]);

  if (!open) return null;

  const handleApply = () => {
    onApply({
      CategoryId: categoryId || null,
      SortBy: sortBy || null,
      SortByDescending: sortDesc,
    });
    onClose();
  };

  return (
    <div className="absolute z-50 mt-2 p-4 w-72 bg-white shadow-lg rounded-lg border border-gray-200 right-0">

      <h4 className="text-lg font-semibold mb-3 text-gray-600">
        Filter Products
      </h4>

      {/* Category */}
      <label className="text-sm font-medium text-gray-500">Category</label>
      <select
        className="w-full mt-1 border border-blue-200 rounded-full px-2 py-1 text-gray-400"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">All</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* Sort */}
      <div className="mt-3">
        <label className="text-sm font-medium text-gray-500">Sort By</label>
        <div className="mt-1 flex gap-3 text-gray-400">
          <button
            className={`px-3 py-1 rounded-full border hover:bg-violet-100 ${
              sortBy==="Price"?"bg-violet-600 text-white":""
            }`}
            onClick={() => setSortBy("Price")}
          >
            Price
          </button>

          <button
            className={`px-3 py-1 rounded-full border hover:bg-violet-100 ${
              sortBy==="Stock"?"bg-violet-600 text-white":""
            }`}
            onClick={() => setSortBy("Stock")}
          >
            Stock
          </button>

          <button
            className={`px-2 py-1 rounded-full border text-sm hover:bg-gray-200 cursor-pointer ${
              sortBy === "" ? "bg-gray-400 text-white" : "bg-white text-gray-700"
            }`}
            onClick={() => setSortBy("")}
          >
            <X size={14}/>
          </button>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sortDesc}
              onChange={(e)=>setSortDesc(e.target.checked)}
              className="
                w-4 h-4 
                text-violet-600 
                bg-gray-100 
                border-gray-300 
                cursor-pointer
                "
            />
            Desc
          </label>
        </div>
      </div>

      <button
        className="mt-4 w-full bg-blue-500 text-white py-1 rounded-full"
        onClick={handleApply}
      >
        <Check size={16} className="inline-block mr-2" />
        Apply
      </button>
    </div>
  );
}
