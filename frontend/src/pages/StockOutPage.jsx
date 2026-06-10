import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import api from '../utils/api';

const StockOutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
      productCode: '',
      category: '',
      status: 'Sold',
      reason: 'Customer Sale',
      weight: { gross: '', stone: '', tag: '' },
  });
  const [product, setProduct] = useState(null);
  const [soldWeight, setSoldWeight] = useState('');
  const [soldTagWeight, setSoldTagWeight] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'status') {
      let reason = 'Other';
        
      switch (value) {
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


  const handleBackButton = () => {
    navigate('/products');
  };

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const remainingWeight =
    product && soldWeight
      ? (
          Number(product.weight?.gross || 0) -
          Number(soldWeight || 0)
        ).toFixed(3)
      : product?.weight?.gross?.toFixed(3) || '0.000';
    
  const remainingTagWeight =
    product && soldTagWeight
        ? (
            Number(product.weight?.tag || 0) -
            Number(soldTagWeight || 0)
        ).toFixed(3)
        : product?.weight?.tag?.toFixed(3) || '0.000';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!soldWeight || Number(soldWeight) <= 0) {
      alert('Please enter a valid sold weight');
      return;
    }

    if (Number(soldWeight) > Number(product.weight?.gross)) {
      alert('Sold weight cannot exceed current stock weight');
      return;
    }

    try {
      setSaving(true);

      await api.put(`/stock-out/${id}`, {
        soldWeight: Number(soldWeight),
        soldTagWeight: Number(soldTagWeight),
        status: formData.status,
        reason: formData.reason,
      });

      navigate('/products');
    } catch (error) {
      console.error(error);
      alert('Failed to update stock');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        Loading...
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
            Stock Out
          </h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 md:p-8">


        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Product Code */}
          <div>
            <label className="block text-xs md:text-sm  font-semibold text-gray-700 mb-2">
              Product Code
            </label>
            <input
              type="text"
              value={product.productCode}
              disabled
              className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 bg-gray-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              value={product.category}
              disabled
              className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 bg-gray-100"
            />
          </div>

          {/* Current Gross Weight */}
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Current Gross Weight
            </label>
            <input
              type="text"
              value={`${product.weight?.gross?.toFixed(3)} g`}
              disabled
              className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 bg-gray-100"
            />
          </div>

          {/* Current Tag Weight */}
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Current Tag Weight
            </label>
            <input
              type="text"
              value={`${product.weight?.tag?.toFixed(3)} g`}
              disabled
              className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 bg-gray-100"
            />
          </div>

          {/* Sold Weight */}
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Sold Weight *
            </label>
            <input
              type="number"
              step="0.001"
              value={soldWeight}
              onChange={(e) => setSoldWeight(e.target.value)}
              placeholder="Enter sold weight"
              className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                Sold Tag Weight 
            </label>
            <input
                type="number"
                step="0.001"
                value={soldTagWeight}
                onChange={(e) => setSoldTagWeight(e.target.value)}
                placeholder="0.000"
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
            >
              <option value="Sold">Sold</option>
              <option value="Returned">Returned</option>
            </select>

          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Reason
            </label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              disabled
              className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 bg-gray-100"
            />
          </div>

          {/* Remaining Weight */}
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Remaining Weight
            </label>
            <input
              type="text"
              value={`${remainingWeight} g`}
              disabled
              className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 bg-green-50 text-green-700 font-bold"
            />
          </div>

          {/* Remaining Weight */}
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Remaining Tag Weight
            </label>
            <input
              type="text"
              value={`${remainingTagWeight} g`}
              disabled
              className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 bg-green-50 text-green-700 font-bold"
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
    </div>
  );
};

export default StockOutPage;