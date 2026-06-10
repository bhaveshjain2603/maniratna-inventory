import React, { useState, useRef } from 'react';
import api from '../utils/api';

const ScannerPage = () => {
  const [scannedCode, setScannedCode] = useState('');
  const [product, setProduct] = useState(null);
  const [action, setAction] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [stockOutWeight, setStockOutWeight] = useState({ gross: '', tag: '' });
  const scanInputRef = useRef(null);

  // Check if category uses bulk weight reduction
  const isBulkWeightCategory = (category) => {
    return ['Earrings', 'Baby Rings', 'Bracelets'].includes(category);
  };

  // Check if category needs tag weight (Earrings)
  const needsTagWeight = (category) => {
    return category === 'Earrings';
  };

  const handleScan = async (e) => {
    const code = e.target.value;
    setScannedCode(code);

    if (code.length > 3) {
      try {
        setLoading(true);
        const response = await api.get('/products/search', {
          params: { barcode: code },
        });
        setProduct(response.data.product);
        setMessage('Product found!');
        setAction('');
        setReason('');
      } catch (error) {
        setProduct(null);
        setMessage('Product not found');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAction = async () => {
    if (!product) return;

    // Validate weight inputs for bulk categories during stock-out
    if (action === 'stock-out' && isBulkWeightCategory(product.category)) {
      if (stockOutWeight.gross === '' || (needsTagWeight(product.category) && stockOutWeight.tag === '')) {
        setMessage('Please enter all required weight fields');
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);

      if (action === 'stock-in') {
        await api.post('/transactions/stock-in', {
          productId: product._id,
          device: 'Desktop Scanner',
        });
      } else if (action === 'stock-out') {
        if (!reason) {
          setMessage('Please select a reason');
          setLoading(false);
          return;
        }

        // For bulk weight categories, include weight data
        const payload = {
          productId: product._id,
          reason,
          device: 'Desktop Scanner',
        };

        if (isBulkWeightCategory(product.category)) {
          payload.reductionWeight = {
            gross: parseFloat(stockOutWeight.gross) || 0,
            tag: parseFloat(stockOutWeight.tag) || 0,
          };
        }

        await api.post('/transactions/stock-out', payload);
      }

      setMessage(`Action completed successfully!`);
      setScannedCode('');
      setProduct(null);
      setAction('');
      setReason('');
      setStockOutWeight({ gross: '', tag: '' });
      scanInputRef.current?.focus();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-matte-black mb-4 md:mb-6">
        📱 Barcode Scanner
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Scanner Input (Hidden) */}
        <div className="hidden">
          <input
            ref={scanInputRef}
            type="text"
            value={scannedCode}
            onChange={handleScan}
            placeholder="Scanner input"
            autoFocus
          />
        </div>

        {/* Scanner Panel */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="bg-white rounded-lg shadow p-4 md:p-8">
            <div className="text-center">
              <div className="text-4xl md:text-6xl mb-2 md:mb-4">📱</div>
              <h2 className="text-lg md:text-2xl font-bold text-matte-black mb-1 md:mb-2">
                Ready to Scan
              </h2>
              <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
                Click below to activate scanner
              </p>
              <button
                onClick={() => scanInputRef.current?.focus()}
                className="bg-gold text-matte-black font-semibold px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-yellow-600 transition text-xs md:text-sm"
              >
                Activate Scanner
              </button>
            </div>

            {/* Messages */}
            {message && (
              <div
                className={`mt-4 md:mt-6 p-3 md:p-4 rounded-lg text-xs md:text-sm ${
                  message.includes('successfully')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : message.includes('found')
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {message.includes('successfully') && '✓'} {message.includes('found') && '🔍'} {message}
              </div>
            )}
          </div>

          {/* Product Details */}
          {product && (
            <div className="bg-white rounded-lg shadow p-4 md:p-8">
              <h3 className="text-sm md:text-lg lg:text-xl font-bold text-matte-black mb-4 md:mb-6">
                📦 Product Details
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Product Code</p>
                  <p className="text-sm md:text-lg font-semibold text-gold">
                    {product.productCode}
                  </p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Category</p>
                  <p className="text-sm md:text-lg font-semibold">{product.category}</p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Gross</p>
                  <p className="text-sm md:text-lg font-semibold">
                    {product.weight?.gross}g
                  </p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Net</p>
                  <p className="text-sm md:text-lg font-semibold">
                    {product.weight?.net}g
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Status</p>
                  <span
                    className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                      product.status === 'In Stock'
                        ? 'bg-green-100 text-green-800'
                        : product.status === 'Sold'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {product.status === 'In Stock' ? '✓' : product.status === 'Sold' ? '💰' : '↩️'} {product.status}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Select Action
                  </label>
                  <select
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
                  >
                    <option value="">-- Select Action --</option>
                    <option value="stock-in">📥 Stock In</option>
                    <option value="stock-out">📤 Stock Out</option>
                  </select>
                </div>

                {action === 'stock-out' && (
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      Reason for Stock Out
                    </label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
                    >
                      <option value="">-- Select Reason --</option>
                      <option value="Customer Sale">💰 Customer Sale</option>
                      <option value="Return to Factory">🏭 Return to Factory</option>
                      <option value="Damaged">⚠️ Damaged</option>
                      <option value="Loss">🔍 Loss</option>
                      <option value="Other">📝 Other</option>
                    </select>
                  </div>
                )}

                {/* Weight fields for bulk categories during stock-out */}
                {action === 'stock-out' && product && isBulkWeightCategory(product.category) && (
                  <div className="space-y-3">
                    <p className="text-xs md:text-sm font-medium text-gray-700 mb-2">
                      Weight to Remove (g)
                    </p>
                    <div className={`grid gap-3 ${needsTagWeight(product.category) ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Gross Weight *
                        </label>
                        <input
                          type="number"
                          value={stockOutWeight.gross}
                          onChange={(e) =>
                            setStockOutWeight({
                              ...stockOutWeight,
                              gross: e.target.value,
                            })
                          }
                          step="0.001"
                          placeholder="0.000"
                          className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
                        />
                      </div>
                      {needsTagWeight(product.category) && (
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Tag Weight *
                          </label>
                          <input
                            type="number"
                            value={stockOutWeight.tag}
                            onChange={(e) =>
                              setStockOutWeight({
                                ...stockOutWeight,
                                tag: e.target.value,
                              })
                            }
                            step="0.001"
                            placeholder="0.000"
                            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent text-xs md:text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleAction}
                  disabled={!action || loading}
                  className="w-full bg-gold text-matte-black font-semibold py-2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 text-xs md:text-sm"
                >
                  {loading ? '⏳ Processing...' : '✓ Complete Action'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h3 className="text-sm md:text-lg font-bold text-matte-black mb-3 md:mb-4">
            📖 Scanner Guide
          </h3>
          <div className="space-y-3 md:space-y-4 text-xs md:text-sm text-gray-600">
            <div>
              <p className="font-semibold text-matte-black mb-1">🔌 USB Scanner</p>
              <p>Connect USB barcode scanner and activate field above.</p>
            </div>
            <div>
              <p className="font-semibold text-matte-black mb-1">⚙️ Actions</p>
              <ul className="list-disc list-inside space-y-1 text-xs md:text-sm">
                <li>📥 Stock In - Add to inventory</li>
                <li>📤 Stock Out - Remove from inventory</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-matte-black mb-1">💡 Tips</p>
              <ul className="list-disc list-inside space-y-1 text-xs md:text-sm">
                <li>Ensure scanner is connected</li>
                <li>Scanner field must be active</li>
                <li>Scan factory barcodes/QR</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
