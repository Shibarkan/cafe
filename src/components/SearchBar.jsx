// src/components/SearchBar.jsx
import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full flex items-center bg-white dark:bg-gray-800 rounded-lg shadow px-3 py-2 gap-2 border border-gray-300 dark:border-gray-700">
      <Search size={18} className="text-gray-500" />
      <input
        type="text"
        placeholder="Cari produk..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm dark:text-gray-100"
      />
    </div>
  );
}
