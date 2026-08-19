import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { calculateNetWeight } from '../utils/formatters';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const EditProductPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    productCode: '',
    category: '',
    status: 'In Stock',
    reason: 'In Stock',
    weight: { gross: '', stone: '', tag: '' },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const categories = [
    'Earrings',
    'Gents Ring',
    'Gents Ring (Without Tag)',
    'Ladies Ring',
    'Ladies Ring (Without Tag)',
    'Baby Rings',
    'Couple Ring',
    'God Ring',
    'Bracelets',
    'Chain',
  ];

  // Check if category uses simplified weight fields (only gross, no stone)
  const isSimplifiedWeight = (category) => {
    return ['Baby Rings', 'Gents Ring (Without Tag)', 'Ladies Ring (Without Tag)', 'Bracelets'].includes(category);
  };

  // Check if category needs tag weight (Earrings)
  const needsTagWeight = (category) => {
    return category === 'Earrings';
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setFormData(response.data.product);
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'status') {
      let reason = 'Other';
        
      switch (value) {
        case 'In Stock':
          reason = 'In Stock';
          break;
      
        case 'Sold':
          reason = 'Customer Sale';
          break;
      
        case 'Returned':
          reason = 'Returned to Factory';
          break;
      
        default:
          reason = 'Other';
      }
    
      setFormData((prev) => ({
        ...prev,
        status: value,
        reason,
      }));
    
      return;
    }
  
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (name.startsWith('weight.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        weight: {
          ...prev.weight,
          [field]: parseFloat(value) || '',
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productCode || !formData.category) {
      setError('Product code and category are required');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const netWeight = calculateNetWeight(
        formData.weight.gross,
        formData.weight.stone,
        formData.weight.tag
      );
      await api.put(`/products/${id}`, {
        ...formData,
        weight: {
          ...formData.weight,
          net: netWeight,
        },
      });
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleBackButton = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg md:text-xl">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleBackButton}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowBackIcon />
        </button>
        <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-matte-black">
          Edit Product
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-xs md:text-sm">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Product Code *
            </label>
            <input
              type="text"
              name="productCode"
              value={formData.productCode}
              onChange={handleChange}
              placeholder="E.g., PROD001"
              className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Weight Information */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">
            Weight (grams)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {/* Gross Weight - shown for all */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                {isSimplifiedWeight(formData.category) ? 'Total Weight' : 'Gross Weight'}
              </label>
              <input
                type="number"
                name="weight.gross"
                value={formData.weight.gross}
                onChange={handleChange}
                placeholder="0.000"
                step="0.01"
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
              />
            </div>

            {/* Stone Weight - only for regular items (not simplified) */}
            {!isSimplifiedWeight(formData.category) && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">Stone Weight</label>
                <input
                  type="number"
                  name="weight.stone"
                  value={formData.weight.stone}
                  onChange={handleChange}
                  placeholder="0.000"
                  step="0.01"
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
                />
              </div>
            )}

            {/* Tag Weight - for Earrings or regular items */}
            {(needsTagWeight(formData.category) ) && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  {needsTagWeight(formData.category) ? 'Tag Weight' : 'Tag Weight'}
                </label>
                <input
                  type="number"
                  name="weight.tag"
                  value={formData.weight.tag}
                  onChange={handleChange}
                  placeholder="0.000"
                  step="0.01"
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
                />
              </div>
            )}

            {/* Net Weight Display */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Net Weight</label>
              <input
                type="text"
                disabled
                value={(formData.weight.gross - (formData.weight.stone || 0) - (formData.weight.tag || 0) || 0).toFixed(3)}
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-xs md:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
          >
            <option value="In Stock">In Stock</option>
            <option value="Sold">Sold</option>
            <option value="Returned">Returned</option>
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
            Reason
          </label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            disabled
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-xs md:text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-4 md:pt-6">
          <button
            type="button"
            onClick={handleBackButton}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-xs md:text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-4 py-2 bg-gold text-matte-black font-semibold rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 text-xs md:text-sm"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
