import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import './index.css';
import ProductList from './admin panel/ProductList';
import ProductAdminPanel from './admin panel/productAdminPanel';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminRegister from './pages/AdminRegister';

// import Diamonds from './pages/Diamonds';
// import Rings from './pages/Rings';
// import CustomJewelry from './pages/CustomJewelry';
// import WhyChooseUs from './pages/WhyChooseUs';
// import BookAppointment from './pages/BookAppointment';

// i want to use values from env file
// dotenv.config(); 

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              
              {/* Protected routes - user must be logged in */}
              <Route 
                path="/my-account" 
                element={
                  <ProtectedRoute>
                    <div>My Account Page (to be implemented)</div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin routes - user must be admin */}
              <Route 
                path='/admin/products' 
                element={
                  <AdminRoute>
                    <ProductList />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/product-panel" 
                element={
                  <AdminRoute>
                    <ProductAdminPanel />
                  </AdminRoute>
                } 
              />
              
              {/* Catch all - 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
}

export default App;