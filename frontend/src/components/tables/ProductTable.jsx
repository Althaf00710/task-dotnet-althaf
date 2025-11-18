import EditButton from "../buttons/EditButton";
import DeleteButton from "../buttons/DeleteButton";
import { Check, X, ChevronLeft, ChevronRight, Package, CheckCircle, AlertTriangle, MoreVertical } from "lucide-react";
import { useState } from "react";

export default function ProductTable({ 
    data, 
    counts,
    onEdit, 
    onDelete, 
    onToggleStatus,
    currentPage,
    pageSize,
    onPageChange,
    onPageSizeChange 
}) {
    const items = data?.items || [];
    const totalCount = data?.totalCount || 0;
    const totalPages = data?.totalPages || 0;
    const hasPreviousPage = data?.hasPreviousPage || false;
    const hasNextPage = data?.hasNextPage || false;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(null);

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return pages;
    };

    // Toggle mobile menu
    const toggleMobileMenu = (itemId) => {
        setMobileMenuOpen(mobileMenuOpen === itemId ? null : itemId);
    };

    return (
        <div className="w-full">
            {/* Counts Display */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {/* Total Products */}
                <div className="bg-white p-3 md:p-4 rounded-lg shadow border border-gray-200 hover:border-violet-600 transition-all duration-300 ease-in-out">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="p-2 bg-violet-100 rounded-lg">
                            <Package className="w-4 h-4 md:w-5 md:h-5 text-violet-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Total Products</p>
                            <p className="text-xl md:text-2xl font-bold text-violet-700 truncate">
                                {totalCount.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Active Products */}
                <div className="bg-white p-3 md:p-4 rounded-lg shadow border border-gray-200 hover:border-green-600 transition-all duration-300 ease-in-out">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Active Products</p>
                            <p className="text-xl md:text-2xl font-bold text-green-600 truncate">
                                {counts.active.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Low Stock Products */}
                <div className="bg-white p-3 md:p-4 rounded-lg shadow border border-gray-200 hover:border-orange-600 transition-all duration-300 ease-in-out">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Low Stock Products</p>
                            <p className="text-xl md:text-2xl font-bold text-orange-600 truncate">
                                {counts.lowStock.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block w-full overflow-x-auto">
                <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
                    <thead className="bg-gray-300 text-gray-600 text-sm">
                        <tr>
                            <th className="py-3 px-4 text-left font-medium">Code</th>
                            <th className="py-3 px-4 text-left font-medium">Product</th>
                            <th className="py-3 px-4 text-center font-medium">Price</th>
                            <th className="py-3 px-4 text-center font-medium">Stock</th>
                            <th className="py-3 px-4 text-center font-medium">Category</th>
                            <th className="py-3 px-4 text-center font-medium">Status</th>
                            <th className="py-3 px-4 text-center font-medium">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item) => (
                            <tr
                                key={item.id}
                                className="border-t hover:bg-gray-50 transition"
                            >
                                {/* Code */}
                                <td className="py-3 px-4 text-gray-600 text-sm font-medium">
                                    {item.code}
                                </td>

                                {/* Product Name */}
                                <td className="py-3 px-4 text-gray-700 text-sm font-semibold">
                                    {item.name}
                                </td>

                                {/* Price */}
                                <td className="py-3 px-4 text-right text-indigo-500 text-sm font-medium">
                                    Rs {item.price.toLocaleString()}
                                </td>

                                {/* Stock */}
                                <td className="py-3 px-4 text-center text-gray-500 text-sm font-medium">
                                    {item.stock < 5 ? (
                                        <span className="text-red-500 font-medium">
                                            {item.stock}
                                        </span>
                                    ) : (
                                        item.stock
                                    )}
                                </td>

                                {/* Category */}
                                <td className="py-3 px-4 text-center text-gray-500 text-sm font-medium">
                                    {item.category?.name || "-"}
                                </td>

                                {/* Status Badge */}
                                <td className="py-3 px-2 text-center whitespace-nowrap">
                                    <div className="inline-flex items-center gap-2">
                                        {item.status ? (
                                            <>
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    Active
                                                </span>
                                                <button
                                                    onClick={() => onToggleStatus(item)}
                                                    className="bg-red-100 hover:bg-red-200 text-red-700 p-1 rounded-full cursor-pointer"
                                                    title="Deactivate"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                                    Inactive
                                                </span>
                                                <button
                                                    onClick={() => onToggleStatus(item)}
                                                    className="bg-green-100 hover:bg-green-200 text-green-700 p-1 rounded-full cursor-pointer"
                                                    title="Activate"
                                                >
                                                    <Check size={12} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="py-3 px-4 text-center">
                                    <div className="flex justify-center gap-2">
                                        <EditButton onClick={() => onEdit(item)} />
                                        <DeleteButton onClick={() => onDelete(item)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
                {items.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200 p-4">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h3>
                                <p className="text-xs text-gray-500">{item.code}</p>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => toggleMobileMenu(item.id)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <MoreVertical size={16} />
                                </button>
                                
                                {/* Mobile Actions Menu */}
                                {mobileMenuOpen === item.id && (
                                    <div className="absolute right-0 top-6 bg-white shadow-lg rounded-md border border-gray-200 z-10 min-w-32">
                                        <button
                                            onClick={() => {
                                                onEdit(item);
                                                setMobileMenuOpen(null);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <EditButton size={14} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                onDelete(item);
                                                setMobileMenuOpen(null);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                                        >
                                            <DeleteButton size={14} />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs">Price</p>
                                <p className="text-indigo-600 font-medium">Rs {item.price.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Stock</p>
                                <p className={item.stock < 5 ? "text-red-500 font-medium" : "text-gray-700 font-medium"}>
                                    {item.stock}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Category</p>
                                <p className="text-gray-700">{item.category?.name || "-"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Status</p>
                                <div className="flex items-center gap-1">
                                    {item.status ? (
                                        <>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                Active
                                            </span>
                                            <button
                                                onClick={() => onToggleStatus(item)}
                                                className="bg-red-100 hover:bg-red-200 text-red-700 p-1 rounded-full cursor-pointer"
                                                title="Deactivate"
                                            >
                                                <X size={10} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                                Inactive
                                            </span>
                                            <button
                                                onClick={() => onToggleStatus(item)}
                                                className="bg-green-100 hover:bg-green-200 text-green-700 p-1 rounded-full cursor-pointer"
                                                title="Activate"
                                            >
                                                <Check size={10} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between p-3 md:p-4 border-t bg-white gap-3 md:gap-4">
                    {/* Page Size Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs md:text-sm text-gray-600">Show</span>
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
                            className="border rounded px-2 py-1 text-xs md:text-sm text-violet-600"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="text-xs md:text-sm text-gray-600">per page</span>
                    </div>

                    {/* Page Info */}
                    <div className="text-xs md:text-sm text-gray-600">
                        Page <span className="font-semibold">{currentPage}</span> of{" "}
                        <span className="font-semibold">{totalPages}</span>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-1">
                        {/* Previous Button */}
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={!hasPreviousPage}
                            className={`p-1 md:p-2 rounded ${
                                hasPreviousPage
                                    ? "hover:bg-gray-100 text-gray-600"
                                    : "text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            <ChevronLeft size={14} className="md:w-4 md:h-4" />
                        </button>

                        {/* Page Numbers - Hide on very small screens */}
                        <div className="hidden xs:flex items-center gap-1">
                            {getPageNumbers().map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => onPageChange(pageNum)}
                                    className={`px-2 py-1 rounded text-xs md:text-sm ${
                                        currentPage === pageNum
                                            ? "bg-violet-600 text-white"
                                            : "hover:bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={!hasNextPage}
                            className={`p-1 md:p-2 rounded ${
                                hasNextPage
                                    ? "hover:bg-gray-100 text-gray-600"
                                    : "text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            <ChevronRight size={14} className="md:w-4 md:h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {items.length === 0 && (
                <div className="text-center py-8 bg-white rounded-lg shadow border border-gray-200">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No products found</p>
                </div>
            )}
        </div>
    );
}