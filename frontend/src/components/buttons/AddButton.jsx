import { Plus } from "lucide-react";

export default function AddButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        group flex items-center bg-purple-700 hover:bg-purple-800 text-white 
        px-3 py-2 rounded-full transition-all cursor-pointer
      "
    >
      <Plus size={18} />
      <span
        className="
          max-w-0 overflow-hidden opacity-0 
          group-hover:max-w-[100px] group-hover:opacity-100 
          transition-all duration-300 group-hover:ml-2
        "
      >
        Add
      </span>
    </button>
  );
}
