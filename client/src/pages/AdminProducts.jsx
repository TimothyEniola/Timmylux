import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function AdminProducts() {
  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#011F5B]">Manage Products</h1>
        <Link to="/admin/add-product" className="btn-primary flex items-center gap-2 text-white">
          <Plus size={20} /> Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#011F5B] text-white">
            <tr>
              <th className="px-6 py-3 text-left">Image</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                No products available (Backend removed)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}