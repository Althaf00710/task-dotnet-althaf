import { RefreshCw  } from "lucide-react";

export default function RefreshButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        group flex items-center bg-gray-400 hover:bg-gray-500 text-white 
        px-3 py-2 rounded-full transition-all cursor-pointer
      "
    >
      <RefreshCw size={18} />
      <span
        className="
          max-w-0 overflow-hidden opacity-0 
          group-hover:max-w-[100px] group-hover:opacity-100 
          transition-all duration-300 group-hover:ml-2
        "
      >
        Refresh
      </span>
    </button>
  );
}
