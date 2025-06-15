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
  ChevronRight
} from 'lucide-react';
import { contactAPI } from '../../services/api';

const ContactPanel = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchContacts();
  }, [pagination.page, statusFilter, searchTerm]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await contactAPI.getAll(`?${queryParams}`);
      setContacts(response.data.contacts);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages
      }));
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const openViewModal = (contact) => {
    setSelectedContact(contact);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (contact) => {
    setSelectedContact(contact);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedContact(null);
  };

  const handleStatusUpdate = async (contactId, newStatus) => {
    try {
      await contactAPI.update(contactId, { status: newStatus });
      fetchContacts(); // Refresh the list
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedContact) return;

    try {
      await contactAPI.delete(selectedContact._id);
      fetchContacts(); // Refresh the list
      closeModals();
    } catch (error) {
      console.error('Error deleting contact:', error);
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
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      case 'resolved':
        return 'bg-gray-100 text-gray-800';
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
          <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
          <p className="text-gray-600">Manage customer inquiries and messages</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, phone, or message..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={statusFilter}
                onChange={handleFilterChange}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {contacts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contact messages found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Contact messages will appear here when customers submit the contact form'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message Preview
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User size={20} className="text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {contact.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {contact.email || contact.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {contact.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(contact.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={contact.status}
                          onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => openViewModal(contact)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(contact)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      {[...Array(pagination.pages)].map((_, index) => {
                        const page = index + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === pagination.page
                                ? 'z-10 bg-primary border-primary text-white'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.pages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Contact Modal */}
      {isViewModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold">Contact Message Details</h3>
              <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm uppercase text-gray-500 font-medium mb-3">Contact Information</h4>
                  <div className="space-y-3">
                    <p className="flex items-start">
                      <User className="mr-2 h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800">{selectedContact.fullName}</span>
                    </p>
                    <p className="flex items-start">
                      <Phone className="mr-2 h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800">{selectedContact.phone}</span>
                    </p>
                    {selectedContact.email && (
                      <p className="flex items-start">
                        <Mail className="mr-2 h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800">{selectedContact.email}</span>
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm uppercase text-gray-500 font-medium mb-3">Message Details</h4>
                  <div className="space-y-3">
                    <p className="flex items-start">
                      <Calendar className="mr-2 h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800">{formatDateTime(selectedContact.createdAt)}</span>
                    </p>
                    <p className="flex items-start">
                      <span className="font-medium mr-2">Status:</span>
                      {getStatusBadge(selectedContact.status)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Message</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>
              
              {selectedContact.adminNotes && (
                <div>
                  <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Admin Notes</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedContact.adminNotes}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeModals}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full mx-4 shadow-xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-red-600">Delete Contact Message</h3>
              <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center text-amber-600 bg-amber-50 p-3 rounded-md mb-4">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <p>This action cannot be undone.</p>
              </div>
              
              <p className="text-gray-700">
                Are you sure you want to delete the contact message from <span className="font-medium">{selectedContact.fullName}</span>?
              </p>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeModals}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="ml-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPanel; 