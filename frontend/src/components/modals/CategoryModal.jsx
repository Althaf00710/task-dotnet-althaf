import React, { useState, useEffect } from "react";

export default function CategoryModal({ open, onClose, onSubmit, initialData }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    } else {
      setName("");
    }
  }, [initialData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-gray-100 p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-600">
          {initialData ? "Edit Category" : "Add Category"}
        </h2>

        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded-full mb-4 text-gray-600"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 rounded-full hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={() => onSubmit(name)}
            className="px-6 py-2 bg-purple-700 text-white rounded-full hover:bg-purple-800"
          >
            {initialData ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
