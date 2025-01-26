import { PhoneCall, Mail, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <PhoneCall className="h-5 w-5 mr-2" />
                <span>1 5551234567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>ex@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/diamonds" className="hover:text-primary">Diamonds</a></li>
              <li><a href="/rings" className="hover:text-primary">Wedding Rings</a></li>
              <li><a href="/custom" className="hover:text-primary">Custom Jewelry</a></li>
              <li><a href="/book-appointment" className="hover:text-primary">Book Appointment</a></li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4">Business Hours</h3>
            <ul className="space-y-2">
              <li>Monday - Friday: 10:30 AM - 6:30 PM</li>
              <li>Saturday: 10:30 AM - 5:30 PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p>&copy; 2024 PDiamonds & Jewelry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;