import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-600">
            {initialData ? "Edit Category" : "Add Category"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointer rounded-full bg-gray-200 p-1 hover:bg-gray-300"
          >
            <X size={18}/>
          </button>
        </div>

        <input
          type="text"
          className="w-full border border-violet-400 p-2 rounded-full mb-4 text-gray-600"
          placeholder="Enter category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end gap-3">
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
