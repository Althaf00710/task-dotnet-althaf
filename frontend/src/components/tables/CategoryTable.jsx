import { Pencil, Trash2 } from "lucide-react";
import AddButton from "../buttons/AddButton";
import EditButton from "../buttons/EditButton";
import DeleteButton from "../buttons/DeleteButton";

export default function CategoryTable({ data, onEdit, onDelete }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-500 text-gray-700">
          <tr>
            <th className="py-3 px-4 text-left text-gray-100 font-medium">Name</th>
            <th className="py-3 px-4 text-center text-gray-100 font-medium">Active Products</th>
            <th className="py-3 px-4 text-center text-gray-100 font-medium">Inactive Products</th>
            <th className="py-3 px-4 text-center text-gray-100 font-medium">Total Products</th>
            <th className="py-3 px-4 text-center text-gray-100 font-medium">Active Percentage</th>
            <th className="py-3 px-4 text-center text-gray-100 font-medium">Action</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((item) => (
            <tr
              key={item.id}
              className="border-t hover:bg-gray-50 transition"
            >
              <td className="py-3 px-4 text-gray-600 font-semibold">{item.name}</td>
              <td className="py-3 px-4 text-center text-green-600 font-semibold">
                {item.active}
              </td>
              <td className="py-3 px-4 text-center text-red-600 font-semibold">
                {item.inactive}
              </td>
              <td className="py-3 px-4 text-center font-semibold text-gray-600">
                {item.active + item.inactive}
              </td>
              <td className="py-3 px-4 text-center font-semibold text-gray-600">
                {item.active / (item.active + item.inactive) * 100 || 0}%
              </td>

              <td className="py-3 px-4 text-center flex justify-center gap-3">
                <EditButton onClick={() => onEdit(item)} />
                <DeleteButton onClick={() => onDelete(item)} /> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
