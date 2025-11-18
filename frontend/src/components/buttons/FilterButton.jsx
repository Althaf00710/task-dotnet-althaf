import { ListFilterPlus } from "lucide-react";

export default function FilterButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        group flex items-center bg-blue-800 hover:bg-blue-900 text-white
        px-3 py-2 rounded-full transition-all cursor-pointer
      "
    >
      <ListFilterPlus size={18} />
      <span
        className="
          max-w-0 overflow-hidden opacity-0 
          group-hover:max-w-[100px] group-hover:opacity-100 
          transition-all duration-300 group-hover:ml-2
        "
      >
        Filter
      </span>
    </button>
  );
}
