"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const TableSearch = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce search to avoid too many URL updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        const params = new URLSearchParams(window.location.search);
        params.set("search", searchTerm);
        params.delete("page"); // Reset to first page on new search
        router.push(`${window.location.pathname}?${params}`);
      } else {
        // Remove search param if empty
        const params = new URLSearchParams(window.location.search);
        params.delete("search");
        params.delete("page");
        router.push(`${window.location.pathname}?${params}`);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Form submit now just triggers the debounced effect
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-auto flex items-center gap-2 text-sm rounded-lg ring-1 ring-gray-200 px-3 py-1.5 hover:ring-purple-300 focus-within:ring-2 focus-within:ring-purple-400 transition-all"
    >
      <Image 
        src="/search.png" 
        alt="Search" 
        width={16} 
        height={16}
        className="opacity-40" 
      />
      <input
        type="text"
        placeholder="Search members, pastors, events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-[250px] p-1 bg-transparent outline-none text-gray-600 placeholder:text-gray-400"
      />
      
      {/* Clear button */}
      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm("")}
          className="text-gray-400 hover:text-gray-600"
        >
          <Image src="/close.png" alt="Clear" width={14} height={14} />
        </button>
      )}
      
      {/* Search hint */}
      <kbd className="hidden lg:inline-flex items-center gap-1 text-xs text-gray-400">
        <span className="text-lg">⌘</span>K
      </kbd>
    </form>
  );
};

export default TableSearch;
