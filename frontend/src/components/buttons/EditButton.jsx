import React from "react";
import { Pencil } from "lucide-react";

export default function EditButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-light px-4 py-2 rounded-full transition-all cursor-pointer"
    >
      <Pencil size={16} />
      Edit
    </button>
  );
}
