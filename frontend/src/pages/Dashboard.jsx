import React, { useEffect, useState } from "react";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import { Package, Tags, AlertTriangle, CheckCircle } from "lucide-react";
import SummaryCard from "../components/SummaryCard";
import RefreshButton from "../components/buttons/RefreshButton";

// Recharts
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        lowStockProducts: 0,
        activeProducts: 0
    });

    const [catCount, setCatCount] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadDashboardStats = async () => {
        try {
            setLoading(true);

            const [
                productsRes,
                categoriesRes,
                lowStockRes,
                activeRes,
                catWithCountRes
            ] = await Promise.all([
                productService.getTotalCount(),
                categoryService.getTotalCount(),
                productService.getLowStockCount(),
                productService.getActiveCount(),
                categoryService.getWithCount()
            ]);

            setStats({
                totalProducts: productsRes.data,
                totalCategories: categoriesRes.data,
                lowStockProducts: lowStockRes.data,
                activeProducts: activeRes.data.total
            });

            // Store the category count data
            setCatCount(
                catWithCountRes.data.map(c => ({
                    name: c.name,
                    active: c.activeProduct,
                    inactive: c.inactiveProduct,
                    total: c.activeProduct + c.inactiveProduct
                }))
            );

        } catch (error) {
            console.error("Failed to load dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardStats();
    }, []);

    // Calculate percentages
    const calculatePercentage = (value, total) => {
        if (total === 0) return 0;
        return ((value / total) * 100).toFixed(1);
    };

    const lowStockPercentage = calculatePercentage(stats.lowStockProducts, stats.totalProducts);
    const activePercentage = calculatePercentage(stats.activeProducts, stats.totalProducts);

    if (loading) {
        return (
            <div className="w-full space-y-6">
                <h1 className="text-2xl font-semibold text-violet-700">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="bg-white rounded-2xl p-5 shadow-md border-t-4 border-gray-300 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-violet-700">Dashboard</h1>
                <RefreshButton onClick={loadDashboardStats} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    heading="Total Products"
                    count={stats.totalProducts}
                    color="border-blue-500 hover:border-blue-600"
                    icon={Package}
                />

                <SummaryCard
                    heading="Total Categories"
                    count={stats.totalCategories}
                    color="border-yellow-500 hover:border-yellow-400"
                    icon={Tags}
                />

                <SummaryCard
                    heading="Low Stock Products"
                    count={stats.lowStockProducts}
                    color="border-orange-500 hover:border-orange-600"
                    icon={AlertTriangle}
                    percentage={parseFloat(lowStockPercentage)}
                />

                <SummaryCard
                    heading="Active Products"
                    count={stats.activeProducts}
                    color="border-emerald-500 hover:border-emerald-600"
                    icon={CheckCircle}
                    percentage={parseFloat(activePercentage)}
                />
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md">
                <h2 className="text-lg font-semibold mb-4 text-gray-500">Category Product Overview</h2>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={catCount}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />

                        <Bar dataKey="active" stackId="count" fill="#8400ff" name="Active" />
                        <Bar dataKey="inactive" stackId="count" fill="#ff6200" name="Inactive" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
