import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import api from "../utils/api";
import { formatWeight, formatDate } from "../utils/formatters";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const bulkCategories = ["Earrings", "Baby Rings", "Bracelets"];

  useEffect(() => {
    fetchProducts();
  }, [search, category, status]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products", {
        params: { search, category, status },
      });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product) => {
    if (bulkCategories.includes(product.category)) {
      setSelectedProduct(product);
      setShowActionModal(true);
    } else {
      navigate(`/products/${product._id}/edit`);
    }
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setShowDeleteModal(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const categories = [
    "Earrings",
    "Gents Ring",
    "Ladies Ring",
    "Baby Rings",
    "Couple Ring",
    "God Ring",
    "Bracelets",
  ];

  const statuses = ["In Stock", "Sold", "Returned"];

  return (
    <div className="space-y-4 md:space-y-6">
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-bold text-red-600">Delete Product</h2>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-500">
                    Product Code
                  </span>

                  <span>{selectedProduct.productCode}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-500">Category</span>

                  <span>{selectedProduct.category}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-gray-500">
                    Gross Weight
                  </span>

                  <span>{formatWeight(selectedProduct.weight?.gross)} g</span>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">
                  ⚠️ This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedProduct(null);
                }}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDelete(selectedProduct._id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {showActionModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Select Action</h2>

            <p className="text-gray-600 mb-3">
              Product Code: {selectedProduct.productCode}
            </p>

            <p className="text-gray-600 mb-3">
              Category: {selectedProduct.category}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  navigate(`/products/${selectedProduct._id}/edit`);
                  setShowActionModal(false);
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg"
              >
                Edit Product
              </button>

              <button
                onClick={() => {
                  navigate(`/products/${selectedProduct._id}/stock-out`);
                  setShowActionModal(false);
                }}
                className="w-full bg-red-600 text-white py-3 rounded-lg"
              >
                Stock Out
              </button>

              <button
                onClick={() => setShowActionModal(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 border py-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-matte-black">
          📦 Products
        </h1>
        <Link
          to="/products/add"
          className="flex items-center space-x-1 md:space-x-2 bg-gold text-matte-black px-3 md:px-4 py-2 rounded-lg hover:bg-yellow-600 transition text-sm md:text-base"
        >
          <AddIcon className="text-sm md:text-base" /> <span>Add</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3 md:p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        <input
          type="text"
          placeholder="Search code, barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
        >
          <option value="">All Status</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-row items-center justify-between">
        <p className="text-sm md:text-lg text-gray-600">
          Total: {products.length} product{products.length !== 1 ? "s" : ""}
        </p>

        <p className="text-sm md:text-lg text-gray-600">
          Gross Wt:{" "}
          {products
            .filter((product) => product.status)
            .reduce((total, product) => total + (product.weight?.gross || 0), 0)
            .toFixed(3)}
          g
        </p>
      </div>

      {/* Products Table - Desktop View */}
      <div className="bg-white rounded-lg shadow overflow-hidden hidden md:block">
        {loading ? (
          <div className="p-8 text-center text-sm md:text-base">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-xs md:text-sm text-gray-600">
            No products found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-matte-black text-white">
                <tr>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm">
                    Code
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm hidden lg:table-cell">
                    Category
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm">
                    Gross Wt.
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm">
                    Stone Wt.
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm">
                    Tag Wt.
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm">
                    Net Wt.
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm">
                    Status
                  </th>
                  <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-2 md:py-4 font-semibold text-gold text-xs md:text-sm">
                      {product.productCode}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm hidden lg:table-cell">
                      {product.category}
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                      {formatWeight(product.weight?.gross)}g
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                      {formatWeight(product.weight?.stone)}g
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                      {formatWeight(product.weight?.tag)}g
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm">
                      {formatWeight(product.weight?.net)}g
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4">
                      <span
                        className={`px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-semibold ${
                          product.status === "In Stock"
                            ? "bg-green-100 text-green-800"
                            : product.status === "Sold"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-2 md:py-4 flex space-x-1 md:space-x-2">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EditIcon className="text-sm md:text-base" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(product)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <DeleteIcon className="text-sm md:text-base" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Products Cards - Mobile View */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {loading ? (
          <div className="p-8 text-center text-sm">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-600">
            No products found
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow p-3 border-l-4 border-gold"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-bold text-gold">
                    {product.productCode}
                  </p>
                  <p className="text-xs mt-1 text-gray-600">
                    {product.category}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    product.status === "In Stock"
                      ? "bg-green-100 text-green-800"
                      : product.status === "Sold"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {product.status}
                </span>
              </div>
              <div className="flex flex-row gap-2 mb-3 text-xs">
                <p className="text-gray-600">
                  Gross: {formatWeight(product.weight?.gross)}g
                </p>
                <p className="text-gray-600">
                  Stone: {formatWeight(product.weight?.stone)}g
                </p>
                <p className="text-gray-600">
                  Tag: {formatWeight(product.weight?.tag)}g
                </p>
                <p className="text-gray-600">
                  Net: {formatWeight(product.weight?.net)}g
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClick(product)}
                  className="flex-1 text-blue-600 hover:text-blue-800 text-xs bg-blue-50 p-2 rounded text-center"
                >
                  <EditIcon className="text-sm" /> Edit
                </button>
                <button
                  onClick={() => openDeleteModal(product)}
                  className="flex-1 text-red-600 hover:text-red-800 text-xs bg-red-50 p-2 rounded"
                >
                  <DeleteIcon className="text-sm" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
