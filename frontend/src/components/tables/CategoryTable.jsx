import { Pencil, Trash2, MoreVertical, FolderOpen } from "lucide-react";
import AddButton from "../buttons/AddButton";
import EditButton from "../buttons/EditButton";
import DeleteButton from "../buttons/DeleteButton";
import { useState } from "react";

export default function CategoryTable({ data, onEdit, onDelete }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);

  // Toggle mobile menu
  const toggleMobileMenu = (itemId) => {
    setMobileMenuOpen(mobileMenuOpen === itemId ? null : itemId);
  };

  // Calculate percentage safely
  const calculatePercentage = (active, inactive) => {
    const total = active + inactive;
    return total > 0 ? ((active / total) * 100).toFixed(1) : 0;
  };

  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden lg:block w-full overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-300 text-gray-600 text-sm">
            <tr>
              <th className="py-3 px-4 text-left font-medium">Name</th>
              <th className="py-3 px-4 text-center font-medium">Active Products</th>
              <th className="py-3 px-4 text-center font-medium">Inactive Products</th>
              <th className="py-3 px-4 text-center font-medium">Total Products</th>
              <th className="py-3 px-4 text-center font-medium">Active Percentage</th>
              <th className="py-3 px-4 text-center font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4 text-gray-600 font-semibold">{item.name}</td>
                <td className="py-3 px-4 text-center text-green-600 font-medium">
                  {item.active}
                </td>
                <td className="py-3 px-4 text-center text-red-600 font-medium">
                  {item.inactive}
                </td>
                <td className="py-3 px-4 text-center font-medium text-gray-500">
                  {item.active + item.inactive}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-20 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          calculatePercentage(item.active, item.inactive) >= 70 ? 'bg-green-500' :
                          calculatePercentage(item.active, item.inactive) >= 40 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${calculatePercentage(item.active, item.inactive)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-500 w-10">
                      {calculatePercentage(item.active, item.inactive)}%
                    </span>
                  </div>
                </td>

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
        {data?.map((item) => {
          const totalProducts = item.active + item.inactive;
          const activePercentage = calculatePercentage(item.active, item.inactive);
          
          return (
            <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200 p-4">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h3>
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

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {/* Active Products */}
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <p className="text-green-600 font-bold text-lg">{item.active}</p>
                  <p className="text-green-700 text-xs font-medium">Active</p>
                </div>

                {/* Inactive Products */}
                <div className="text-center p-2 bg-red-50 rounded-lg">
                  <p className="text-red-600 font-bold text-lg">{item.inactive}</p>
                  <p className="text-red-700 text-xs font-medium">Inactive</p>
                </div>

                {/* Total Products */}
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="text-blue-600 font-bold text-lg">{totalProducts}</p>
                  <p className="text-blue-700 text-xs font-medium">Total</p>
                </div>

                {/* Active Percentage */}
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                  <p className="text-purple-600 font-bold text-lg">{activePercentage}%</p>
                  <p className="text-purple-700 text-xs font-medium">Active %</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {(!data || data.length === 0) && (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium mb-2">No Categories Found</p>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Get started by creating your first product category to organize your inventory.
          </p>
        </div>
      )}

      {/* Tablet Optimized View (768px - 1024px) */}
      <div className="hidden md:block lg:hidden">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 divide-y">
            {data?.map((item) => {
              const totalProducts = item.active + item.inactive;
              const activePercentage = calculatePercentage(item.active, item.inactive);
              
              return (
                <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    {/* Category Name */}
                    <div className="flex items-center gap-3 flex-1">
                      <span className="font-semibold text-gray-800">{item.name}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-green-600 font-bold">{item.active}</div>
                        <div className="text-gray-500 text-xs">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-red-600 font-bold">{item.inactive}</div>
                        <div className="text-gray-500 text-xs">Inactive</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-600 font-bold">{totalProducts}</div>
                        <div className="text-gray-500 text-xs">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-600 font-bold">{activePercentage}%</div>
                        <div className="text-gray-500 text-xs">Active %</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 ml-4">
                      <EditButton onClick={() => onEdit(item)} />
                      <DeleteButton onClick={() => onDelete(item)} />
                    </div>
                  </div>
 
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}