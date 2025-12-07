import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  ChevronRight,
  Home,
  Image
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [usersMenuOpen, setUsersMenuOpen] = useState(false);
  const [homeMenuOpen, setHomeMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      active: location.pathname === '/admin/dashboard'
    },
    {
      title: 'Home Page',
      icon: Home,
      hasSubmenu: true,
      active: location.pathname.includes('/admin/home'),
      submenu: [
        { title: 'Featured Images', path: '/admin/home/featured-images' },
        { title: 'Shop Categories', path: '/admin/home/shop-categories' }
      ]
    },
    {
      title: 'Products',
      icon: Package,
      hasSubmenu: true,
      active: location.pathname.includes('/admin/product'),
      submenu: [
        { title: 'Add Product', path: '/admin/products/add' },
        { title: 'Bulk Uploads', path: '/admin/products/bulk-upload' },
        { title: 'Manage Products', path: '/admin/product-panel' },
        { title: 'Customer Reviews', path: '/admin/products/customer-reviews' }
      ]
    },
    {
      title: 'Appointments',
      icon: Calendar,
      path: '/admin/appointments',
      active: location.pathname === '/admin/appointments'
    },
    {
      title: 'Users',
      icon: Users,
      hasSubmenu: true,
      active: location.pathname.includes('/admin/users') || location.pathname.includes('/admin/contacts') || location.pathname.includes('/admin/orders'),
      submenu: [
        { title: 'User Management', path: '/admin/users/management' },
        { title: 'User Wishlists', path: '/admin/users/wishlists' },
        { title: 'Orders', path: '/admin/orders' },
        { title: 'Contact Us', path: '/admin/contacts' }
      ]
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      active: location.pathname === '/admin/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PDJ</span>
                </div>
                <span className="font-semibold text-gray-800">Admin Panel</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.hasSubmenu ? (
                <div>
                  <button
                    onClick={() => {
                      if (item.title === 'Products') {
                        setProductMenuOpen(!productMenuOpen);
                      } else if (item.title === 'Users') {
                        setUsersMenuOpen(!usersMenuOpen);
                      } else if (item.title === 'Home Page') {
                        setHomeMenuOpen(!homeMenuOpen);
                      }
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      item.active ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon size={20} />
                      {sidebarOpen && <span className="font-medium">{item.title}</span>}
                    </div>
                    {sidebarOpen && (
                      ((item.title === 'Products' && productMenuOpen) || 
                       (item.title === 'Users' && usersMenuOpen) || 
                       (item.title === 'Home Page' && homeMenuOpen)) 
                        ? <ChevronDown size={16} /> 
                        : <ChevronRight size={16} />
                    )}
                  </button>
                  
                  {((item.title === 'Products' && productMenuOpen) || 
                    (item.title === 'Users' && usersMenuOpen) || 
                    (item.title === 'Home Page' && homeMenuOpen)) && sidebarOpen && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.path}
                          className={`block p-2 rounded-lg text-sm transition-colors ${
                            location.pathname === subItem.path 
                              ? 'bg-primary/10 text-primary font-medium' 
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    item.active ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={20} />
                  {sidebarOpen && <span className="font-medium">{item.title}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              {location.pathname === '/admin/dashboard' && 'Dashboard'}
              {location.pathname.includes('/admin/home') && 'Home Page Management'}
              {location.pathname.includes('/admin/product') && 'Product Management'}
              {location.pathname === '/admin/appointments' && 'Appointments'}
              {location.pathname.includes('/admin/users') && 'User Management'}
              {location.pathname.includes('/admin/contacts') && 'Contact Management'}
              {location.pathname.includes('/admin/orders') && 'Order Management'}
              {location.pathname === '/admin/settings' && 'Settings'}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;