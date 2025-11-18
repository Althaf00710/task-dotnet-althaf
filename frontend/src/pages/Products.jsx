import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductSearchBar from "../components/options/ProductSearchBar";
import AddButton from "../components/buttons/AddButton";
import RefreshButton from "../components/buttons/RefreshButton";
import ProductTable from "../components/tables/ProductTable";
import ProductModal from "../components/modals/ProductModal";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";

export default function Products() {
    const [products, setProducts] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [counts, setCounts] = useState({
        total: 0,
        active: 0,
        lowStock: 0
    });

    const [searchParams, setSearchParams] = useSearchParams();

    // States from URL
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const sortBy = searchParams.get("sortBy") || "";
    const sortDesc = searchParams.get("sortDesc") === "true";
    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = parseInt(searchParams.get("pageSize")) || 10;

    // Local state for search input (not in URL)
    const [searchInput, setSearchInput] = useState(search);

    // Sync local search input with URL when URL changes
    useEffect(() => {
        setSearchInput(search);
    }, [search]);

    // Load Categories
    const loadCategories = async () => {
        try {
            const res = await categoryService.getAll();
            setCategories(res.data);
        } catch {
            Swal.fire("Error", "Failed to load categories", "error");
        }
    };

    // Load Product Counts
    const loadProductCounts = async () => {
        try {
            const [activeRes, lowStockRes] = await Promise.all([
                productService.getActiveCount(),
                productService.getLowStockCount()
            ]);
            
            setCounts({
                total: products?.totalCount || 0,
                active: activeRes.data.total,
                lowStock: lowStockRes.data
            });
        } catch {
            console.error("Failed to load product counts");
        }
    };

    // Load Products
    const loadProducts = async () => {
        try {
            setLoading(true);

            const params = {
                searchTerm: search || null,
                categoryId: categoryId ? parseInt(categoryId) : null,
                sortBy: sortBy || null,
                sortByDescending: sortDesc,
                page: page,
                pageSize: pageSize,
            };

            const res = await productService.getAll(params);
            setProducts(res.data);

            // Update total count and reload all counts
            setCounts(prev => ({
                ...prev,
                total: res.data.totalCount
            }));
            await loadProductCounts();

        } catch {
            Swal.fire("Error", "Failed to load products", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [searchParams]);

    // 🔍 Only apply search when button is clicked
    const handleSearchClick = () => {
        setSearchParams((prev) => {
            const updated = new URLSearchParams(prev);
            if (searchInput) {
                updated.set("search", searchInput);
            } else {
                updated.delete("search");
            }
            updated.set("page", "1"); // Reset to first page on new search
            return updated;
        });
    };

    // Handle search input change
    const handleSearchChange = (value) => {
        setSearchInput(value);
    };

    // Filter apply
    const handleFilterApply = (filters) => {
        const params = new URLSearchParams(searchParams);

        if (filters.CategoryId) params.set("categoryId", filters.CategoryId);
        else params.delete("categoryId");

        if (filters.SortBy) params.set("sortBy", filters.SortBy);
        else params.delete("sortBy");

        if (filters.SortByDescending) params.set("sortDesc", true);
        else params.delete("sortDesc");

        params.set("page", "1"); // Reset to first page on filter

        setSearchParams(params);
    };

    // Pagination handlers
    const handlePageChange = (newPage) => {
        setSearchParams((prev) => {
            const updated = new URLSearchParams(prev);
            updated.set("page", newPage.toString());
            return updated;
        });
    };

    const handlePageSizeChange = (newPageSize) => {
        setSearchParams((prev) => {
            const updated = new URLSearchParams(prev);
            updated.set("pageSize", newPageSize.toString());
            updated.set("page", "1"); // Reset to first page when changing page size
            return updated;
        });
    };

    // Refresh all
    const handleRefresh = () => {
        setSearchParams({});
        setSearchInput(""); // Clear local search input
    };

    // CRUD
    const handleEdit = (item) => {
        setInitialData(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (item) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: `Delete ${item.name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await productService.delete(item.id);
            if (res.status === 204) {
                Swal.fire("Deleted!", "Product removed successfully.", "success");
                loadProducts();
            }
        } catch {
            Swal.fire("Error", "Delete failed", "error");
        }
    };

    const handleToggleStatus = async (product) => {
        try {
            const res = await productService.updateStatus(product.id, {
                id: product.id,
                status: !product.status,
            });

            toast.success(`Product "${product.name}" is now ${res.data.status ? "Active" : "Inactive"}`);
            
            // Update the specific product status in the local state
            setProducts((prev) => ({
                ...prev,
                items: prev.items.map((p) =>
                    p.id === product.id ? { ...p, status: res.data.status } : p
                ),
            }));

            // Reload counts to reflect the status change
            await loadProductCounts();

        } catch {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="w-full space-y-4">

            <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4">
                <h3 className="text-xl lg:text-2xl font-semibold text-violet-700 text-center lg:text-left">
                    Products
                </h3>

                <div className="w-full lg:flex-1 max-w-2xl px-4 lg:px-0">
                    <ProductSearchBar
                        value={searchInput}
                        onChange={handleSearchChange}
                        onSearch={handleSearchClick}
                        categories={categories}
                        onFilterApply={handleFilterApply}
                        savedFilters={{ categoryId, sortBy, sortDesc }}
                    />
                </div>

                <div className="flex gap-2 justify-center lg:justify-start">
                    <RefreshButton onClick={handleRefresh} />
                    <AddButton
                        onClick={() => {
                            setInitialData(null);
                            setIsModalOpen(true);
                        }}
                    />
                </div>
            </div>

            {loading ? (
                <p className="text-center text-gray-600 py-10">Loading...</p>
            ) : (
                <ProductTable
                    data={products}
                    counts={counts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    currentPage={page}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}

            {isModalOpen && (
                <ProductModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={async (formData) => {
                        try {
                            if (initialData) {
                                await productService.update(initialData.id, formData);
                                Swal.fire("Updated!", "Product updated successfully.", "success");
                            } else {
                                await productService.create(formData);
                                Swal.fire("Added!", "Product created successfully.", "success");
                            }
                            setIsModalOpen(false);
                            loadProducts();
                        } catch {
                            Swal.fire("Error", "Operation failed", "error");
                        }
                    }}
                    initialData={initialData}
                    categories={categories}
                />
            )}

            <ToastContainer position="bottom-right" />
        </div>
    );
}