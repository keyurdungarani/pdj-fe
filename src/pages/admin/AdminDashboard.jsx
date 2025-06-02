import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Calendar, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Eye,
  Edit,
  BarChart3
} from 'lucide-react';
import { adminAPI, appointmentAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    totalUsers: 0,
    recentProducts: [],
    recentAppointments: [],
    // Trend data
    productTrend: null,
    appointmentTrend: null,
    userTrend: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Helper function to calculate percentage change
  const calculateTrend = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? { percentage: 100, isPositive: true } : { percentage: 0, isPositive: true };
    }
    const change = ((current - previous) / previous) * 100;
    return {
      percentage: Math.abs(change).toFixed(1),
      isPositive: change >= 0
    };
  };

  // Helper function to format trend text
  const formatTrend = (trend) => {
    if (!trend) return null;
    const sign = trend.isPositive ? '+' : '-';
    return `${sign}${trend.percentage}% from last month`;
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch current data
      const [productsRes, appointmentsRes] = await Promise.all([
        adminAPI.getProductPanel('all'),
        appointmentAPI.getAll().catch(() => ({ data: { appointments: [], total: 0 } }))
      ]);

      const currentProducts = productsRes.data.counts.jewelry + productsRes.data.counts.rings + productsRes.data.counts.diamonds + (productsRes.data.counts.labGrown || 0);
      const currentAppointments = appointmentsRes.data.appointments?.length || 0;
      const pendingAppointments = appointmentsRes.data.appointments?.filter(apt => apt.status === 'pending').length || 0;

      // Calculate trends by comparing with data from 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      try {
        // Fetch historical data for trends (you might need to implement these endpoints)
        const [historicalProducts, historicalAppointments] = await Promise.all([
          adminAPI.getProductStats().catch(() => ({ data: { previousMonth: currentProducts } })),
          appointmentAPI.getStats().catch(() => ({ data: { previousMonth: currentAppointments } }))
        ]);

        const previousProducts = historicalProducts.data.previousMonth || currentProducts;
        const previousAppointments = historicalAppointments.data.previousMonth || currentAppointments;

        // Calculate trends
        const productTrend = calculateTrend(currentProducts, previousProducts);
        const appointmentTrend = calculateTrend(currentAppointments, previousAppointments);
        const userTrend = { percentage: 5, isPositive: true }; // Placeholder until user stats are available

        setStats({
          totalProducts: currentProducts,
          totalAppointments: currentAppointments,
          pendingAppointments: pendingAppointments,
          totalUsers: 0, // Update when user API is available
          recentProducts: productsRes.data.products.slice(0, 5),
          recentAppointments: appointmentsRes.data.appointments?.slice(0, 5) || [],
          productTrend,
          appointmentTrend,
          userTrend
        });
      } catch (trendError) {
        console.log('Trend data not available, using current data only');
        // Fallback: set stats without trends
        setStats({
          totalProducts: currentProducts,
          totalAppointments: currentAppointments,
          pendingAppointments: pendingAppointments,
          totalUsers: 0,
          recentProducts: productsRes.data.products.slice(0, 5),
          recentAppointments: appointmentsRes.data.appointments?.slice(0, 5) || [],
          productTrend: null,
          appointmentTrend: null,
          userTrend: null
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 flex items-center ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.isPositive ? (
                <TrendingUp size={16} className="mr-1" />
              ) : (
                <TrendingDown size={16} className="mr-1" />
              )}
              {formatTrend(trend)}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, link, color }) => (
    <Link
      to={link}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color} group-hover:scale-110 transition-transform`}>
          <Icon size={24} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to PDJ Admin Panel</h2>
        <p className="text-primary-light">
          Manage your jewelry store, track appointments, and monitor your business performance.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="bg-blue-500"
          trend={stats.productTrend}
        />
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={Calendar}
          color="bg-green-500"
          trend={stats.appointmentTrend}
        />
        <StatCard
          title="Pending Appointments"
          value={stats.pendingAppointments}
          icon={Calendar}
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-purple-500"
          trend={stats.userTrend}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionCard
            title="Add New Product"
            description="Add diamonds, jewelry, or rings to your inventory"
            icon={Plus}
            link="/admin/products/add"
            color="bg-blue-500"
          />
          <QuickActionCard
            title="View Appointments"
            description="Manage customer appointments and bookings"
            icon={Calendar}
            link="/admin/appointments"
            color="bg-green-500"
          />
          <QuickActionCard
            title="Manage Products"
            description="Edit, update, or remove existing products"
            icon={Edit}
            link="/admin/product-panel"
            color="bg-purple-500"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
              <Link
                to="/admin/products"
                className="text-primary hover:text-primary-dark text-sm font-medium"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            {stats.recentProducts.length > 0 ? (
              <div className="space-y-4">
                {stats.recentProducts.map((product) => (
                  <div key={product._id} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package size={20} className="text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">₹{product.price?.toLocaleString()}</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {product.type}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent products</p>
            )}
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
              <Link
                to="/admin/appointments"
                className="text-primary hover:text-primary-dark text-sm font-medium"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            {stats.recentAppointments.length > 0 ? (
              <div className="space-y-4">
                {stats.recentAppointments.map((appointment) => (
                  <div key={appointment._id} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Calendar size={20} className="text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {appointment.firstName} {appointment.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{appointment.consultationDate}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent appointments</p>
            )}
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
          <BarChart3 size={20} className="text-gray-500" />
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Performance charts coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 