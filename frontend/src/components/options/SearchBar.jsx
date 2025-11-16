import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
    return (
        <div className="w-full max-w-sm flex items-center bg-white border border-gray-300 rounded-full px-3 py-2 shadow-sm">
            <Search className="text-gray-500 w-5 h-5" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="ml-2 w-full outline-none text-gray-700"
            />
        </div>
    );
}
