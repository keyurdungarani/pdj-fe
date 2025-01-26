// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Menu } from "lucide-react"; // Assuming you're using Lucide icons
// import {Button} from "../components/ui/button";

// function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link to="/" className="text-2xl font-bold text-primary">
//             PDiamonds
//           </Link>

//           {/* Mobile menu button */}
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden p-2"
//           >
//             <Menu className="h-6 w-6" />
//           </button>

//           {/* Links for larger screens */}
//           <ul className="hidden md:flex space-x-6">
//             <li>
//               <Link to="/" className="hover:text-primary">
//                 Home
//               </Link>
//             </li>
//             <li>
//               <Link to="/products" className="hover:text-primary">
//                 Products
//               </Link>
//             </li>
//             <li>
//               <Link to="/about" className="hover:text-primary">
//                 About Us
//               </Link>
//             </li>
//           </ul>

//           {/* Appointment Button */}
//           <Button className="hidden md:block">Book Appointment</Button>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden">
//             <ul className="flex flex-col space-y-2 mt-2">
//               <li>
//                 <Link to="/" onClick={() => setIsMenuOpen(false)}>
//                   Home
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/products" onClick={() => setIsMenuOpen(false)}>
//                   Products
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/about" onClick={() => setIsMenuOpen(false)}>
//                   About Us
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;



import { PhoneCall, Mail, Menu } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            PDiamonds
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-primary">Home</Link>
            <Link to="/diamonds" className="hover:text-primary">Diamonds</Link>
            <Link to="/rings" className="hover:text-primary">Wedding Rings</Link>
            <Link to="/custom" className="hover:text-primary">Custom Jewelry</Link>
          </div>

          {/* Contact Info */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <PhoneCall className="h-4 w-4" />
              <span>1 5551234567</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>ex@gmail.com</span>
            </div>
            {/* Appointment Button */}
            <Button className="hidden md:block">Book Appointment</Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="hover:text-primary">Home</Link>
              <Link to="/diamonds" className="hover:text-primary">Diamonds</Link>
              <Link to="/rings" className="hover:text-primary">Wedding Rings</Link>
              <Link to="/custom" className="hover:text-primary">Custom Jewelry</Link>
              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2 py-2">
                  <PhoneCall className="h-4 w-4" />
                  <span>1 5551234567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>ex@gmail.com</span>
                </div>
                {/* Appointment Button */}
                <Button className="w-full mt-4">Book Appointment</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;