import React, { useState } from "react";
import { Search, ListFilterPlus } from "lucide-react";
import ProductFilterModal from "../modals/ProductFilterModal";

export default function ProductSearchBar({ value, onChange, onSearch, categories, onFilterApply }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="relative flex items-center gap-2 w-full max-w-md">
            {/* Search Input */}
            <div className="flex flex-1 items-center bg-white border border-gray-300 rounded-full px-3 pr-2 py-2 shadow-sm">
                <Search className="text-gray-500 w-5 h-5" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search Products..."
                    className="ml-2 w-full outline-none text-gray-700"
                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                />
                <button
                    onClick={onSearch}
                    className="ml-2 bg-gray-400 hover:bg-gray-600 text-white px-3 py-1 rounded-full transition cursor-pointer ring-1 ring-blue-500"
                >
                    Search
                </button>
            </div>

            {/* Filter Button */}
            <div className="relative">
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
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

                {/* Filter Modal */}
                <ProductFilterModal
                    open={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    onApply={onFilterApply}
                    categories={categories}
                />
            </div>
        </div>
    );
}
