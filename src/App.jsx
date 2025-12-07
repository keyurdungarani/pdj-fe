import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
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
import CustomerLoginModal from './components/common/CustomerLoginModal';
import useLoginPrompt from './hooks/useLoginPrompt';
import AppointmentsPanel from './pages/admin/AppointmentsPanel';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddProduct from './pages/admin/AddProduct';
import BulkUpload from './pages/admin/BulkUpload';
import ContactPanel from './pages/admin/ContactPanel';
import OrderPanel from './pages/admin/OrderPanel';
import FeaturedImagesPanel from './pages/admin/FeaturedImagesPanel';
import ShopCategoryPanel from './pages/admin/ShopCategoryPanel';
import CustomerReviewsPanel from './pages/admin/CustomerReviewsPanel';
import UserManagementPanel from './pages/admin/UserManagementPanel';
import UsersWishlistPanel from './pages/admin/UsersWishlistPanel';

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
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';

// i want to use values from env file
// dotenv.config(); 

// Wrapper component to use hooks inside AuthProvider
function AppContent() {
  const { showLoginModal, closeLoginModal } = useLoginPrompt();
  
  return (
    <>
      <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Public routes with Navbar and Footer */}
            <Route path="/" element={
              <>
                <Navbar />
                <main className="flex-grow pt-20">
                  <Home />
                </main>
                <Footer />
              </>
            } />
            <Route path="/login" element={
              <>
                <Navbar />
                <main className="flex-grow pt-20">
                  <Login />
                </main>
                <Footer />
              </>
            } />
            <Route path="/register" element={
              <>
                <Navbar />
                <main className="flex-grow pt-20">
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
                <main className="flex-grow pt-20">
                  <ForgotPassword />
                </main>
                <Footer />
              </>
            } />
            <Route path="/reset-password/:token" element={
              <>
                <Navbar />
                <main className="flex-grow pt-20">
                  <ResetPassword />
                </main>
                <Footer />
              </>
            } />
            
            {/* Navbar link routes */}
            <Route path="/engagement" element={
              <>
                <Navbar />
                <main className="flex-grow pt-20">
                  <Engagement />
                </main>
                <Footer />
              </>
            } />
            <Route path="/wedding" element={
              <>
                <Navbar />
                <main className="flex-grow pt-20">
                  <Wedding />
                </main>
                <Footer />
              </>
            } />
            <Route path="/diamonds" element={
              <>
                <Navbar />
                <main className="flex-grow pt-20">
                  <Diamonds />
                </main>
                <Footer />
              </>
            } />
            <Route path="/jewelry" element={
              <>
                <Navbar />
                <main className="flex-grow pt-20">
                  <Jewelry />
                </main>
                <Footer />
              </>
            } />
            <Route path="/about-us" element={
              <>
                <Navbar />
                <main className="flex-grow pt-20">
                  <WhyChooseUs />
                </main>
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Navbar />
                <main className="flex-grow pt-20">
                  <Contact />
                </main>
                <Footer />
              </>
            } />
            <Route path="/book-appointment" element={
              <>
                <Navbar />
                <main className="flex-grow pt-20">
                  <BookAppointment />
                </main>
                <Footer />
              </>
            } />
            <Route path="/wishlist" element={
              <>
                <Navbar />
                <main className="flex-grow pt-20">
                  <Wishlist />
                </main>
                <Footer />
              </>
            } />
            <Route path="/profile" element={
              <>
                <Navbar />
                <main className="flex-grow pt-20">
                  <Profile />
                </main>
                <Footer />
              </>
            } />
            
            {/* Product detail routes */}
            <Route path="/jewelry/:id" element={
              <>
                <Navbar />
                <main className="flex-grow pt-20">
                  <ProductDetailPage type="jewelry" />
                </main>
                <Footer />
              </>
            } />
            <Route path="/diamonds/:id" element={
              <>
                <Navbar />
                <main className="flex-grow pt-20">
                  <ProductDetailPage type="diamonds" />
                </main>
                <Footer />
              </>
            } />
            <Route path="/rings/:id" element={
              <>
                <Navbar />
                <main className="flex-grow pt-20">
                  <ProductDetailPage type="ring" />
                </main>
                <Footer />
              </>
            } />
            <Route path="/engagement/:id" element={
              <>
                <Navbar />
                <main className="flex-grow pt-20">
                  <ProductDetailPage type="engagement" />
                </main>
                <Footer />
              </>
            } />
            <Route path="/wedding/:id" element={
              <>
                <Navbar />
                <main className="flex-grow pt-20">
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
            <Route 
              path="/admin/home/shop-categories" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ShopCategoryPanel />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/products/customer-reviews" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <CustomerReviewsPanel />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/users/management" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <UserManagementPanel />
                  </AdminLayout>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/users/wishlists" 
              element={
                <AdminRoute>
                  <AdminLayout>
                    <UsersWishlistPanel />
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
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Auto-trigger login modal after 1 minute for non-logged-in users */}
      <CustomerLoginModal 
        isOpen={showLoginModal} 
        onClose={closeLoginModal} 
        autoTrigger={true} 
      />
    </>
  );
}

function App() {
  // Get Google Client ID from environment variable
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;