import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { calculateNetWeight } from '../utils/formatters';

const AddProductPage = () => {
  const [entryMode, setEntryMode] = useState(null); // 'manual' or 'barcode'
  const [formData, setFormData] = useState({
    productCode: '',
    category: '',
    weight: { gross: '', stone: '', tag: '' },
    notes: '',
  });
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const scanInputRef = useRef(null);

  const categories = [
    'Earrings',
    'Gents Ring',
    'Ladies Ring',
    'Baby Rings',
    'Couple Ring',
    'God Ring',
    'Bracelets',
  ];

  // Check if category uses simplified weight fields (only gross, no stone)
  const isSimplifiedWeight = (category) => {
    return ['Earrings', 'Baby Rings'].includes(category);
  };

  // Check if category needs tag weight (Earrings)
  const needsTagWeight = (category) => {
    return category === 'Earrings';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    setError('');

    if (
      !formData.productCode ||
      !formData.category ||
      formData.weight.gross === ''
    ) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setSaving(true);
      const netWeight = calculateNetWeight(
        formData.weight.gross,
        formData.weight.stone,
        formData.weight.tag
      );

      console.log('Before API');

      const response = await api.post('/products', {
        productCode: formData.productCode,
        category: formData.category,
        weight: {
          gross: parseFloat(formData.weight.gross),
          stone: parseFloat(formData.weight.stone) || 0,
          tag: parseFloat(formData.weight.tag) || 0,
          net: netWeight,
        },
      });

      console.log('API Response:', response);

      navigate('/products');
    } catch (err) {
      console.error('Create Product Error:', err);

      if (err.response) {
        console.log(err.response.data);
      }
    
    }
    finally {
      setLoading(false);
      setSaving(false);
    }
  };

  const netWeight = calculateNetWeight(
    formData.weight.gross,
    formData.weight.stone,
    formData.weight.tag
  );

  const handleBarcodeInput = (e) => {
    const code = e.target.value;
    setScannedBarcode(code);

    if (code.length > 3) {
      // Auto-fill barcode field
      setFormData((prev) => ({
        ...prev,
        barcode: code,
      }));
    }
  };

  const resetForm = () => {
    setEntryMode(null);
    setFormData({
      productCode: '',
      category: '',
      weight: { gross: '', stone: '', tag: '' },
      notes: '',
    });
    setScannedBarcode('');
    setError('');
  };

  const handleBackButton = () => {
    if (entryMode) {
      resetForm();
    } else {
      navigate('/products');
    }
  };

  // Show mode selection screen
  if (!entryMode) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/products')}
          className="mb-6 border border-gray-300 text-gray-700 font-semibold py-2 px-4 md:px-6 rounded-lg hover:bg-gray-50 transition text-xs md:text-sm"
        >
          ← Go Back
        </button>

        <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-matte-black mb-6 md:mb-8">➕ Add New Product</h1>
        {/* <p className="text-xs md:text-sm text-gray-600 mb-6 md:mb-12">Choose how you want to add the product</p> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Manual Entry Option */}
          <div
            onClick={() => setEntryMode('manual')}
            className="bg-white rounded-lg shadow-lg p-4 md:p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
          >
            <div className="text-4xl md:text-6xl mb-3 md:mb-4">📝</div>
            <h2 className="text-lg md:text-2xl font-bold text-matte-black mb-2 md:mb-3">
              Add Manually
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
              Enter product information directly. Best for products with barcodes.
            </p>
            <div className="bg-gold text-matte-black font-semibold py-2 px-3 md:px-4 rounded-lg text-center text-xs md:text-sm">
              Start Manual Entry
            </div>
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
              <p className="text-xs md:text-sm text-gray-600 font-semibold mb-2 md:mb-3">Fields:</p>
              <ul className="text-xs md:text-sm text-gray-600 space-y-1">
                <li>✓ Product Code</li>
                <li>✓ Category</li>
                <li>✓ Gross Weight</li>
                <li>✓ Stone Weight</li>
                <li>✓ Tag Weight</li>
                <li>✓ Net Weight (Auto)</li>
              </ul>
            </div>
          </div>

          {/* Barcode Entry Option */}
          {/* <div
            onClick={() => setEntryMode('barcode')}
            className="bg-white rounded-lg shadow-lg p-4 md:p-8 cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
          >
            <div className="text-4xl md:text-6xl mb-3 md:mb-4">📱</div>
            <h2 className="text-lg md:text-2xl font-bold text-matte-black mb-2 md:mb-3">
              Scan Barcode
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
              Scan barcode/QR first, then enter details. Fast for factory-tagged items.
            </p>
            <div className="bg-gold text-matte-black font-semibold py-2 px-3 md:px-4 rounded-lg text-center text-xs md:text-sm">
              Start Barcode Scan
            </div>
            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
              <p className="text-xs md:text-sm text-gray-600 font-semibold mb-2 md:mb-3">Steps:</p>
              <ol className="text-xs md:text-sm text-gray-600 space-y-1">
                <li>1. Scan barcode/QR</li>
                <li>2. Fill details</li>
                <li>3. Enter weights</li>
                <li>4. Save</li>
              </ol>
            </div>
          </div> */}
        </div>

      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-row items-start sm:items-center justify-between gap-2 mb-4 md:mb-6">
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-matte-black">
            {entryMode === 'manual' ? '📝 Manual Entry' : '📱 Barcode Scan'}
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            {entryMode === 'manual'
              ? 'Enter all product information manually'
              : 'Scan factory barcode, then fill in details'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 md:p-4 rounded-lg mb-4 md:mb-6 text-xs md:text-sm">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 md:p-8 space-y-4 md:space-y-6">
        {/* Barcode Scanning Input (Hidden for Desktop Scanner) */}
        {/* {entryMode === 'barcode' && (
          <div className="hidden">
            <input
              ref={scanInputRef}
              type="text"
              value={scannedBarcode}
              onChange={handleBarcodeInput}
              placeholder="Scanner input"
              autoFocus
            />
          </div>
        )} */}

        {/* Barcode Entry Instructions */}
        {/* {entryMode === 'barcode' && (
          <div className="bg-blue-50 border border-blue-200 p-3 md:p-4 rounded-lg">
            <p className="text-blue-700 font-semibold mb-2 text-xs md:text-sm">📱 Barcode Scanning Active</p>
            <p className="text-blue-600 text-xs md:text-sm mb-2">
              {formData.barcode
                ? `✓ Barcode scanned: ${formData.barcode}`
                : 'Click button or connect USB scanner to read barcode'}
            </p>
            <button
              type="button"
              onClick={() => scanInputRef.current?.focus()}
              className="w-full md:w-auto bg-blue-600 text-white font-semibold px-3 md:px-4 py-2 rounded-lg hover:bg-blue-700 transition text-xs md:text-sm"
            >
              🔄 Activate Scanner
            </button>
          </div>
        )} */}

        {/* Product Code */}
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
            Product Code *
          </label>
          <input
            type="text"
            name="productCode"
            value={formData.productCode}
            onChange={handleChange}
            placeholder="e.g., RING-001"
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
            required
          />
        </div>

        {/* Category */}
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

        {/* Weights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4">
          {/* Gross Weight - shown for all */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              {isSimplifiedWeight(formData.category) ? 'Total Weight (g) *' : 'Gross Weight (g) *'}
            </label>
            <input
              type="number"
              name="weight.gross"
              value={formData.weight.gross}
              onChange={handleChange}
              step="0.001"
              placeholder="0.000"
              className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
              required
            />
          </div>

          {/* Stone Weight - only for regular items (not simplified) */}
          {!isSimplifiedWeight(formData.category) && (
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Stone Weight (g) *
              </label>
              <input
                type="number"
                name="weight.stone"
                value={formData.weight.stone}
                onChange={handleChange}
                step="0.001"
                placeholder="0.000"
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
              />
            </div>
          )}

          {/* Tag Weight - for Earrings or regular items */}
          {(needsTagWeight(formData.category)) && (
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Tag Weight (g) *
              </label>
              <input
                type="number"
                name="weight.tag"
                value={formData.weight.tag}
                onChange={handleChange}
                step="0.001"
                placeholder="0.000"
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
                required
              />
            </div>
          )}

          {/* Net Weight Display */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Net Weight (g)
            </label>
            <input
              type="text"
              value={netWeight}
              disabled
              className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-xs md:text-sm"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gold text-matte-black font-semibold py-2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 text-xs md:text-sm"
          >
            {loading ? '⏳ Creating...' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={handleBackButton}
            className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition text-xs md:text-sm"
          >
            {entryMode ? 'Back' : '✕ Cancel'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddProductPage;
