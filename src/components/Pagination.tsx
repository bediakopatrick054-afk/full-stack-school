"use client";

import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Pagination = ({ page, count }: { page: number; count: number }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalPages = Math.ceil(count / ITEM_PER_PAGE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const changePage = (newPage: number) => {
    if (!mounted) return;
    
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (page <= 3) {
        // Near start
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        // Near end
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        // Middle
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push(-2); // Ellipsis
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (!mounted) {
    return <div className="p-4 h-16 animate-pulse bg-gray-100 rounded-md" />;
  }

  return (
    <div className="p-4 flex flex-col sm:flex-row items-center justify-between text-gray-500 gap-4">
      {/* Results info */}
      <div className="text-sm text-gray-400 order-2 sm:order-1">
        Showing {Math.min((page - 1) * ITEM_PER_PAGE + 1, count)} -{' '}
        {Math.min(page * ITEM_PER_PAGE, count)} of {count} results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <button
          disabled={!hasPrev}
          className="py-2 px-3 rounded-md bg-slate-100 text-xs font-semibold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-100 transition-colors"
          onClick={() => changePage(page - 1)}
          aria-label="Previous page"
        >
          ← Prev
        </button>

        <div className="flex items-center gap-1 text-sm">
          {getPageNumbers().map((pageNum, index) => {
            if (pageNum < 0) {
              // Render ellipsis
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-gray-400"
                >
                  ⋯
                </span>
              );
            }
            
            return (
              <button
                key={pageNum}
                className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                  page === pageNum
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-slate-100 text-gray-600 hover:bg-slate-200"
                }`}
                onClick={() => changePage(pageNum)}
                aria-label={`Page ${pageNum}`}
                aria-current={page === pageNum ? "page" : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          className="py-2 px-3 rounded-md bg-slate-100 text-xs font-semibold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-100 transition-colors"
          disabled={!hasNext}
          onClick={() => changePage(page + 1)}
          aria-label="Next page"
        >
          Next →
        </button>
      </div>

      {/* Mobile simple pagination */}
      <div className="sm:hidden text-xs text-gray-400 order-3">
        Page {page} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
