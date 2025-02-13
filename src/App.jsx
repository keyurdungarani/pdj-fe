import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import './index.css';
import ProductList from './admin panel/ProductList';
// import Diamonds from './pages/Diamonds';
// import Rings from './pages/Rings';
// import CustomJewelry from './pages/CustomJewelry';
// import WhyChooseUs from './pages/WhyChooseUs';
// import BookAppointment from './pages/BookAppointment';

// i want to use values from env file
import dotenv from 'dotenv';
import ProductAdminPanel from './admin panel/productAdminPanel';

// dotenv.config(); 

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/diamonds" element={<Diamonds />} /> */}
            {/* <Route path="/rings" element={<Rings />} /> */}
            {/* <Route path="/custom" element={<CustomJewelry />} /> */}
            {/* <Route path="/why-choose-us" element={<WhyChooseUs />} />
            <Route path="/book-appointment" element={<BookAppointment />} /> */}
            {/* <Route path="/appointment" element={<BookAppointment />} /> */}
            <Route path='/productlist' element={<ProductList />} />
            <Route path="/productAdminPanel" element={<ProductAdminPanel />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;