import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import api from '../utils/api';

const BULK_CATEGORIES = [
  'Earrings',
  'Baby Rings',
  'Bracelets',
  'Gents Ring (Without Tag)',
  'Ladies Ring (Without Tag)',
];

const StockOutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [soldWeight, setSoldWeight] = useState('');
  const [soldStoneWeight, setSoldStoneWeight] = useState('');
  const [soldTagWeight, setSoldTagWeight] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    status: 'Sold',
    reason: 'Customer Sale',
  });

  // --------------------------------------------------
  // FETCH PRODUCT
  // --------------------------------------------------

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);

      setProduct(res.data.product);

    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // CHECK BULK CATEGORY
  // --------------------------------------------------

  const isBulkCategory =
    product &&
    BULK_CATEGORIES.includes(product.category);

  // --------------------------------------------------
  // HANDLE STATUS
  // --------------------------------------------------

  const handleStatusChange = (e) => {
    const value = e.target.value;

    let reason = 'Other';

    if (value === 'Sold') {
      reason = 'Customer Sale';
    }

    if (value === 'Returned') {
      reason = 'Returned to Factory';
    }

    setFormData({
      status: value,
      reason,
    });
  };

  // --------------------------------------------------
  // REMAINING GROSS WEIGHT
  // --------------------------------------------------

  const remainingGross =
    product && soldWeight
      ? Number(
          (
            Number(product.weight?.gross || 0) -
            Number(soldWeight || 0)
          ).toFixed(3)
        )
      : Number(product?.weight?.gross || 0).toFixed(3);

  // --------------------------------------------------
  // REMAINING TAG WEIGHT
  // --------------------------------------------------

  const remainingTag =
    product && soldTagWeight
      ? Number(
          (
            Number(product.weight?.tag || 0) -
            Number(soldTagWeight || 0)
          ).toFixed(3)
        )
      : Number(product?.weight?.tag || 0).toFixed(3);

  // --------------------------------------------------
  // REMAINING STONE WEIGHT
  // --------------------------------------------------

  const remainingStone =
    product && soldStoneWeight
      ? Number(
          (
            Number(product.weight?.stone || 0) -
            Number(soldStoneWeight || 0)
          ).toFixed(3)
        )
      : Number(product?.weight?.stone || 0).toFixed(3);

  // --------------------------------------------------
  // REMAINING NET WEIGHT
  // --------------------------------------------------

  const remainingNet = Number(
    (
      Number(remainingGross || 0) -
      Number(remainingStone || 0) -
      Number(remainingTag || 0)
    ).toFixed(3)
  );

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product) {
      return;
    }

    // -----------------------------------------------
    // Validate sold gross
    // -----------------------------------------------

    if (!soldWeight || Number(soldWeight) <= 0) {
      alert('Please enter a valid sold weight');
      return;
    }

    // -----------------------------------------------
    // Validate gross
    // -----------------------------------------------

    if (
      Number(soldWeight) >
      Number(product.weight?.gross || 0)
    ) {
      alert(
        'Sold weight cannot exceed current gross weight'
      );

      return;
    }

    // -----------------------------------------------
    // BULK VALIDATION
    // -----------------------------------------------

    if (isBulkCategory) {

      if (
        Number(soldTagWeight || 0) >
        Number(product.weight?.tag || 0)
      ) {
        alert(
          'Sold tag weight cannot exceed current tag weight'
        );

        return;
      }

    }

    // -----------------------------------------------
    // NORMAL PRODUCT VALIDATION
    // -----------------------------------------------

    if (!isBulkCategory) {

      if (
        Number(soldStoneWeight || 0) >
        Number(product.weight?.stone || 0)
      ) {
        alert(
          'Sold stone weight cannot exceed current stone weight'
        );

        return;
      }

      if (
        Number(soldTagWeight || 0) >
        Number(product.weight?.tag || 0)
      ) {
        alert(
          'Sold tag weight cannot exceed current tag weight'
        );

        return;
      }
    }

    try {

      setSaving(true);

      // ---------------------------------------------
      // API DATA
      // ---------------------------------------------

      const payload = {
        soldWeight: Number(soldWeight),

        soldTagWeight: Number(
          soldTagWeight || 0
        ),

        status: formData.status,

        reason: formData.reason,
      };

      // ---------------------------------------------
      // Only normal products send stone weight
      // ---------------------------------------------

      if (!isBulkCategory) {
        payload.soldStoneWeight = Number(
          soldStoneWeight || 0
        );
      }

      console.log('Stock Out Payload:', payload);

      await api.put(
        `/stock-out/${id}`,
        payload
      );

      navigate('/products');

    } catch (error) {

      console.error(
        'Stock Out Error:',
        error
      );

      alert(
        error.response?.data?.message ||
        'Failed to update stock'
      );

    } finally {

      setSaving(false);

    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="text-center py-10">
        Loading...
      </div>
    );
  }

  // --------------------------------------------------
  // PRODUCT NOT FOUND
  // --------------------------------------------------

  if (!product) {
    return (
      <div className="text-center py-10 text-red-600">
        Product not found
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="max-w-2xl mx-auto">

      {/* HEADER */}

      <div className="flex items-center gap-3 mb-6">

        <button
          onClick={() => navigate('/products')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowBackIcon />
        </button>

        <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-matte-black">
          Stock Out
        </h1>

      </div>

      {/* FORM */}

      <div className="bg-white rounded-lg shadow p-6 md:p-8">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* PRODUCT CODE */}

          <div>

            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Product Code
            </label>

            <input
              type="text"
              value={product.productCode}
              disabled
              className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 bg-gray-100"
            />

          </div>

          {/* CATEGORY */}

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

          {/* CURRENT GROSS */}

          <div>

            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Current Gross Weight
            </label>

            <input
              type="text"
              value={`${Number(
                product.weight?.gross || 0
              ).toFixed(3)} g`}
              disabled
              className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 bg-gray-100"
            />

          </div>

          {/* CURRENT STONE - ONLY NORMAL */}

          {!isBulkCategory && (

            <div>

              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                Current Stone Weight
              </label>

              <input
                type="text"
                value={`${Number(
                  product.weight?.stone || 0
                ).toFixed(3)} g`}
                disabled
                className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 bg-gray-100"
              />

            </div>

          )}

          {/* CURRENT TAG */}

          <div>

            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Current Tag Weight
            </label>

            <input
              type="text"
              value={`${Number(
                product.weight?.tag || 0
              ).toFixed(3)} g`}
              disabled
              className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 bg-gray-100"
            />

          </div>

          {/* SOLD GROSS */}

          <div>

            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Sold Weight *
            </label>

            <input
              type="number"
              step="0.001"
              min="0"
              value={soldWeight}
              onChange={(e) =>
                setSoldWeight(e.target.value)
              }
              placeholder="Enter sold weight"
              className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold focus:outline-none"
              required
            />

          </div>

          {/* SOLD STONE - ONLY NORMAL */}

          {!isBulkCategory && (

            <div>

              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                Sold Stone Weight
              </label>

              <input
                type="number"
                step="0.001"
                min="0"
                value={soldStoneWeight}
                onChange={(e) =>
                  setSoldStoneWeight(e.target.value)
                }
                placeholder="Enter sold stone weight"
                className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold focus:outline-none"
              />

            </div>

          )}

          {/* SOLD TAG */}

          <div>

            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Sold Tag Weight
            </label>

            <input
              type="number"
              step="0.001"
              min="0"
              value={soldTagWeight}
              onChange={(e) =>
                setSoldTagWeight(e.target.value)
              }
              placeholder="Enter sold tag weight"
              className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-gold focus:outline-none"
            />

          </div>

          {/* STATUS */}

          <div>

            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>

            <select
              value={formData.status}
              onChange={handleStatusChange}
              className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
            >

              <option value="Sold">
                Sold
              </option>

              <option value="Returned">
                Returned
              </option>

            </select>

          </div>

          {/* REASON */}

          <div>

            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Reason
            </label>

            <input
              type="text"
              value={formData.reason}
              disabled
              className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 bg-gray-100"
            />

          </div>

          {/* REMAINING GROSS */}

          <div>

            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Remaining Gross Weight
            </label>

            <input
              type="text"
              value={`${Number(
                remainingGross
              ).toFixed(3)} g`}
              disabled
              className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 bg-green-50 text-green-700 font-bold"
            />

          </div>

          {/* REMAINING STONE - ONLY NORMAL */}

          {!isBulkCategory && (

            <div>

              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                Remaining Stone Weight
              </label>

              <input
                type="text"
                value={`${Number(
                  remainingStone
                ).toFixed(3)} g`}
                disabled
                className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 bg-green-50 text-green-700 font-bold"
              />

            </div>

          )}

          {/* REMAINING TAG */}

          <div>

            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Remaining Tag Weight
            </label>

            <input
              type="text"
              value={`${Number(
                remainingTag
              ).toFixed(3)} g`}
              disabled
              className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 bg-green-50 text-green-700 font-bold"
            />

          </div>

          {/* REMAINING NET */}

          <div>

            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
              Remaining Net Weight
            </label>

            <input
              type="text"
              value={`${Number(
                remainingNet
              ).toFixed(3)} g`}
              disabled
              className="text-xs md:text-sm w-full border rounded-lg px-4 py-3 bg-green-50 text-green-700 font-bold"
            />

          </div>

          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-4 md:pt-6">

            <button
              type="button"
              onClick={() => navigate('/products')}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-xs md:text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-gold text-matte-black font-semibold rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 text-xs md:text-sm"
            >
              {saving
                ? 'Saving...'
                : 'Save Changes'}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default StockOutPage;