import { Trash2 } from "lucide-react";

export default function DeleteButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-light px-4 py-2 rounded-full transition-all cursor-pointer"
    >
      <Trash2 size={16} />
      Delete
    </button>
  );
}
