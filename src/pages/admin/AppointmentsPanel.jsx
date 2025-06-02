import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, User, Mail, Phone, 
  Filter, Search, ChevronLeft, ChevronRight, 
  Edit, Trash2, X, Check, AlertTriangle, Eye
} from 'lucide-react';
import { appointmentAPI } from '../../services/api';
import { toast } from 'react-toastify';

const AppointmentsPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [notes, setNotes] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    date: '',
    search: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, filters]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Build query parameters
      const params = new URLSearchParams();
      params.append('pageNumber', currentPage);
      
      if (filters.status) {
        params.append('status', filters.status);
      }
      
      if (filters.date) {
        params.append('date', filters.date);
      }
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      const response = await appointmentAPI.getAll(`?${params.toString()}`);
      setAppointments(response.data.appointments || []);
      setTotalPages(response.data.pages || 1);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again.');
      if (err.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      date: '',
      search: ''
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already applied by the useEffect watching filters
  };

  const openViewModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewModalOpen(true);
  };

  const openEditModal = (appointment) => {
    setSelectedAppointment(appointment);
    setStatusUpdate(appointment.status);
    setNotes(appointment.notes || '');
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedAppointment(null);
    setStatusUpdate('');
    setNotes('');
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await appointmentAPI.update(selectedAppointment._id, {
        status: statusUpdate,
        notes: notes
      });
      
      // Update local state
      setAppointments(prev => 
        prev.map(app => 
          app._id === selectedAppointment._id ? response.data : app
        )
      );
      
      toast.success('Appointment status updated successfully');
      closeModals();
    } catch (err) {
      console.error('Error updating appointment:', err);
      toast.error('Failed to update appointment status. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await appointmentAPI.delete(selectedAppointment._id);
      
      // Update local state
      setAppointments(prev => 
        prev.filter(app => app._id !== selectedAppointment._id)
      );
      
      toast.success('Appointment deleted successfully');
      closeModals();
    } catch (err) {
      console.error('Error deleting appointment:', err);
      toast.error('Failed to delete appointment. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Appointment Management</h1>
      
      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center">
              <Filter size={16} className="mr-2 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="ml-2 text-sm border rounded-md px-2 py-1"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="ml-2 text-sm border rounded-md px-2 py-1"
            />
            
            <button
              onClick={clearFilters}
              className="ml-2 text-xs text-blue-600 hover:text-blue-800"
            >
              Clear Filters
            </button>
          </div>
          
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by name or email..."
              className="text-sm border rounded-l-md px-3 py-1.5 w-full md:w-64"
            />
            <button
              type="submit"
              className="bg-primary text-white rounded-r-md px-3 py-1.5"
            >
              <Search size={16} />
            </button>
          </form>
        </div>
      </div>
      
      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading appointments...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            <AlertTriangle size={32} className="mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Calendar size={32} className="mx-auto mb-2" />
            <p>No appointments found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Consultation Type
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
                  {appointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User size={16} className="text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.firstName} {appointment.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(appointment.consultationDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.consultationTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.assistanceType}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => openViewModal(appointment)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => openEditModal(appointment)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(appointment)}
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
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex-1 flex justify-end">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* View Appointment Modal */}
      {isViewModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 shadow-xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold">Appointment Details</h3>
              <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm uppercase text-gray-500 font-medium mb-3">Customer Information</h4>
                  <div className="space-y-3">
                    <p className="flex items-start">
                      <User className="mr-2 h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800">
                        {selectedAppointment.firstName} {selectedAppointment.lastName}
                      </span>
                    </p>
                    <p className="flex items-start">
                      <Mail className="mr-2 h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800">{selectedAppointment.email}</span>
                    </p>
                    <p className="flex items-start">
                      <Phone className="mr-2 h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800">{selectedAppointment.phone}</span>
                    </p>
                    {selectedAppointment.city && (
                      <p className="text-gray-800">
                        <span className="font-medium">Location:</span> {selectedAppointment.city}
                        {selectedAppointment.state ? `, ${selectedAppointment.state}` : ''}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm uppercase text-gray-500 font-medium mb-3">Appointment Details</h4>
                  <div className="space-y-3">
                    <p className="flex items-start">
                      <Calendar className="mr-2 h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800">{formatDate(selectedAppointment.consultationDate)}</span>
                    </p>
                    <p className="flex items-start">
                      <Clock className="mr-2 h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-800">{selectedAppointment.consultationTime}</span>
                    </p>
                    <p className="text-gray-800">
                      <span className="font-medium">Consultation Type:</span> {selectedAppointment.assistanceType}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-medium">Budget:</span> {selectedAppointment.budget ? `₹${selectedAppointment.budget}` : 'Not specified'}
                    </p>
                    <p className="flex items-start">
                      <span className="font-medium mr-2">Status:</span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedAppointment.status)}`}>
                        {selectedAppointment.status || 'pending'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              {selectedAppointment.additionalDetails && (
                <div className="mt-6">
                  <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Additional Details</h4>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded">{selectedAppointment.additionalDetails}</p>
                </div>
              )}
              
              {selectedAppointment.notes && (
                <div className="mt-6">
                  <h4 className="text-sm uppercase text-gray-500 font-medium mb-2">Admin Notes</h4>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded">{selectedAppointment.notes}</p>
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
              <button
                onClick={() => {
                  closeModals();
                  openEditModal(selectedAppointment);
                }}
                className="ml-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Appointment Modal */}
      {isEditModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full mx-4 shadow-xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold">Update Appointment Status</h3>
              <button onClick={closeModals} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <p className="text-gray-800">
                  {selectedAppointment.firstName} {selectedAppointment.lastName}
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date & Time
                </label>
                <p className="text-gray-800">
                  {formatDate(selectedAppointment.consultationDate)} | {selectedAppointment.consultationTime}
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="notes">
                  Admin Notes
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Add notes about this appointment..."
                ></textarea>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeModals}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="ml-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full mx-4 shadow-xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-red-600">Delete Appointment</h3>
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
                Are you sure you want to delete the appointment for <span className="font-medium">{selectedAppointment.firstName} {selectedAppointment.lastName}</span> on <span className="font-medium">{formatDate(selectedAppointment.consultationDate)}</span>?
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

export default AppointmentsPanel; 