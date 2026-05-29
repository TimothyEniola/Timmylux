import { useState } from "react";
import { toast } from "react-toastify";
import { Edit, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "../data/Products";

export default function AdminProducts() {
  const [productsList, setProductsList] = useState(products);

  const handleDeleteProduct = (productId) => {
    setProductsList(productsList.filter(product => product.id !== productId));
    toast.success("Product deleted successfully!");
  };

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#011F5B]">Manage Products</h1>
        <Link to="/admin/add-product" className="btn-primary flex items-center gap-2 text-white w-full sm:w-auto justify-center">
          <Plus size={20} /> Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead className="bg-[#011F5B] text-white">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left">Image</th>
                <th className="px-4 lg:px-6 py-3 text-left">Name</th>
                <th className="px-4 lg:px-6 py-3 text-left">Category</th>
                <th className="px-4 lg:px-6 py-3 text-left">Price</th>
                <th className="px-4 lg:px-6 py-3 text-left">Variations</th>
                <th className="px-4 lg:px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productsList.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 lg:px-6 py-4">
                    <img
                      src={product.variations?.[0]?.image || product.image}
                      alt={product.name}
                      className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.collection}</p>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-gray-600">{product.category}</td>
                  <td className="px-4 lg:px-6 py-4 font-semibold text-[#D4AF37]">
                    ₦{Number(product.price).toLocaleString()}
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-gray-600">
                    {product.variations?.length || 1} variation{product.variations?.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/edit-product/${product.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden">
          <div className="divide-y">
            {productsList.map((product) => (
              <div key={product.id} className="p-4 hover:bg-gray-50">
                <div className="flex gap-4">
                  <img
                    src={product.variations?.[0]?.image || product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{product.collection}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <p className="font-semibold text-[#D4AF37] mt-1">
                      ₦{Number(product.price).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {product.variations?.length || 1} variation{product.variations?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/admin/edit-product/${product.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit Product"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {productsList.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            No products available
          </div>
        )}
      </div>
    </div>
  );
}