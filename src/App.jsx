import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import './index.css';
import ProductAdminPanel from './admin panel/ProductAdminPanel';
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
import AppointmentsPanel from './pages/admin/AppointmentsPanel';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddProduct from './pages/admin/AddProduct';
import BulkUpload from './pages/admin/BulkUpload';
import ContactPanel from './pages/admin/ContactPanel';
import OrderPanel from './pages/admin/OrderPanel';
import FeaturedImagesPanel from './pages/admin/FeaturedImagesPanel';

// Import page components
import Diamonds from './pages/Diamonds';
import Rings from './pages/Rings';
import CustomJewelry from './pages/CustomJewelry';
import WhyChooseUs from './pages/WhyChooseUs';
import BookAppointment from './pages/BookAppointment';
import Engagement from './pages/Engagement';
import Wedding from './pages/Wedding';
import Jewelry from './pages/Jewelry';
import Contact from './pages/Contact';
import ProductDetailPage from './pages/ProductDetailPage';

// i want to use values from env file
// dotenv.config(); 

function App() {
  return (
    <Router>
      <AuthProvider>
      <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Public routes with Navbar and Footer */}
            <Route path="/" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
              </>
            } />
            <Route path="/login" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Login />
                </main>
                <Footer />
              </>
            } />
            <Route path="/register" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Register />
                </main>
                <Footer />
              </>
            } />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/forgot-password" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <ForgotPassword />
                </main>
                <Footer />
              </>
            } />
            <Route path="/reset-password/:token" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <ResetPassword />
                </main>
                <Footer />
              </>
            } />
            
            {/* Navbar link routes */}
            <Route path="/engagement" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Engagement />
                </main>
                <Footer />
              </>
            } />
            <Route path="/wedding" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Wedding />
                </main>
                <Footer />
              </>
            } />
            <Route path="/diamonds" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Diamonds />
                </main>
                <Footer />
              </>
            } />
            <Route path="/jewelry" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Jewelry />
                </main>
                <Footer />
              </>
            } />
            <Route path="/why-choose-us" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <WhyChooseUs />
                </main>
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Contact />
                </main>
                <Footer />
              </>
            } />
            <Route path="/book-appointment" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <BookAppointment />
                </main>
                <Footer />
              </>
            } />
            
            {/* Product detail routes */}
            <Route path="/jewelry/:id" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <ProductDetailPage type="jewelry" />
                </main>
                <Footer />
              </>
            } />
            <Route path="/diamonds/:id" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <ProductDetailPage type="diamonds" />
                </main>
                <Footer />
              </>
            } />
            <Route path="/rings/:id" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <ProductDetailPage type="ring" />
                </main>
                <Footer />
              </>
            } />
            <Route path="/engagement/:id" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <ProductDetailPage type="engagement" />
                </main>
                <Footer />
              </>
            } />
            <Route path="/wedding/:id" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <ProductDetailPage type="wedding" />
                </main>
                <Footer />
              </>
            } />
            
            {/* Protected routes - user must be logged in */}
            <Route 
              path="/my-account" 
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <ProtectedRoute>
                      <div>My Account Page (to be implemented)</div>
                    </ProtectedRoute>
                  </main>
                  <Footer />
                </>
              } 
            />
            
            {/* Admin routes - user must be admin - wrapped in AdminLayout */}
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path='/admin/products/add' 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AddProduct />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path='/admin/products/bulk-upload' 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <BulkUpload />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/product-panel" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ProductAdminPanel />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/appointments" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AppointmentsPanel />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/contacts" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ContactPanel />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/orders" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <OrderPanel />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/home/featured-images" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <FeaturedImagesPanel />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            
            {/* Catch all - 404 */}
            <Route path="*" element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <NotFound />
                </main>
                <Footer />
              </>
            } />
          </Routes>
      </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
}

export default App;