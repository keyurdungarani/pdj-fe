import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  X, 
  AlertTriangle,
  Mail,
  Phone,
  User,
  MessageSquare,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Package,
  DollarSign,
  Star,
  Clock
} from 'lucide-react';
import { orderAPI } from '../../services/api';

const OrderPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [productTypeFilter, setProductTypeFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, statusFilter, priorityFilter, productTypeFilter, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(priorityFilter !== 'all' && { priority: priorityFilter }),
        ...(productTypeFilter !== 'all' && { productType: productTypeFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await orderAPI.getAll(`?${queryParams}`);
      setOrders(response.data.orders);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePriorityFilterChange = (e) => {
    setPriorityFilter(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleProductTypeFilterChange = (e) => {
    setProductTypeFilter(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setProductTypeFilter('all');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const openViewModal = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdate = async (orderId, newStatus, newPriority = null) => {
    try {
      const updateData = { status: newStatus };
      if (newPriority) updateData.priority = newPriority;
      
      await orderAPI.update(orderId, updateData);
      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleNotesUpdate = async (orderId, adminNotes) => {
    try {
      await orderAPI.update(orderId, { adminNotes });
      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error('Error updating order notes:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedOrder) return;

    try {
      await orderAPI.delete(selectedOrder._id);
      fetchOrders(); // Refresh the list
      closeModals();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    
    return new Date(dateTimeString).toLocaleDateString('en-US', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status) => {
    const colors = getStatusColor(status);
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = getPriorityColor(priority);
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-600">Manage customer orders and inquiries</p>
        </div>
        <div className="text-sm text-gray-500">
          Total Orders: {pagination.total}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, phone, product, or stock number..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="relative">
              <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={priorityFilter}
                onChange={handlePriorityFilterChange}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={productTypeFilter}
                onChange={handleProductTypeFilterChange}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white"
              >
                <option value="all">All Products</option>
                <option value="Product">Products</option>
                <option value="Diamond">Diamonds</option>
                <option value="Jewelry">Jewelry</option>
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">No orders found</p>
                    <p className="text-sm">Orders will appear here when customers place them.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          <User size={16} className="mr-2 text-gray-400" />
                          {order.fullName}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Phone size={12} className="mr-1 text-gray-400" />
                          {order.phone}
                        </div>
                        {order.email && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Mail size={12} className="mr-1 text-gray-400" />
                            {order.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.productName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Type: {order.productType}
                        </div>
                        {order.stockNumber && (
                          <div className="text-sm text-gray-500">
                            Stock: {order.stockNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-primary flex items-center">
                        <DollarSign size={14} className="mr-1" />
                        {order.productPrice?.toLocaleString('en-US') || '0'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(order.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1 text-gray-400" />
                        {formatDateTime(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openViewModal(order)}
                          className="text-primary hover:text-primary-dark"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(order)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
              <h3 className="text-lg font-bold">Order Details</h3>
              <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="mr-2" size={18} />
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-gray-900">{selectedOrder.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{selectedOrder.phone}</p>
                  </div>
                  {selectedOrder.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedOrder.email}</p>
                    </div>
                  )}
                </div>
                {selectedOrder.message && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700">Message</label>
                    <p className="text-gray-900 bg-white p-3 rounded border mt-1">
                      {selectedOrder.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Package className="mr-2" size={18} />
                  Product Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Product Name</label>
                    <p className="text-gray-900">{selectedOrder.productName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Product Type</label>
                    <p className="text-gray-900">{selectedOrder.productType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Price</label>
                    <p className="text-primary font-bold text-lg">
                      ${selectedOrder.productPrice?.toLocaleString('en-US') || '0'}
                    </p>
                  </div>
                  {selectedOrder.stockNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Stock Number</label>
                      <p className="text-gray-900">{selectedOrder.stockNumber}</p>
                    </div>
                  )}
                </div>
                {selectedOrder.productImage && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-700 block mb-2">Product Image</label>
                    <img 
                      src={selectedOrder.productImage} 
                      alt={selectedOrder.productName}
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Order Management */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Clock className="mr-2" size={18} />
                  Order Management
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => {
                        handleStatusUpdate(selectedOrder._id, e.target.value);
                        setSelectedOrder(prev => ({ ...prev, status: e.target.value }));
                      }}
                      className="mt-1 block w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Priority</label>
                    <select
                      value={selectedOrder.priority}
                      onChange={(e) => {
                        handleStatusUpdate(selectedOrder._id, selectedOrder.status, e.target.value);
                        setSelectedOrder(prev => ({ ...prev, priority: e.target.value }));
                      }}
                      className="mt-1 block w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Created</label>
                    <p className="text-sm text-gray-900">{formatDateTime(selectedOrder.createdAt)}</p>
                  </div>
                  {selectedOrder.contactedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Contacted</label>
                      <p className="text-sm text-gray-900">{formatDateTime(selectedOrder.contactedAt)}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700 block mb-2">Admin Notes</label>
                  <textarea
                    value={selectedOrder.adminNotes || ''}
                    onChange={(e) => setSelectedOrder(prev => ({ ...prev, adminNotes: e.target.value }))}
                    onBlur={(e) => handleNotesUpdate(selectedOrder._id, e.target.value)}
                    placeholder="Add notes about this order..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold text-red-600 flex items-center">
                <AlertTriangle className="mr-2" size={20} />
                Delete Order
              </h3>
              <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this order from <strong>{selectedOrder.fullName}</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeModals}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPanel;