import { PhoneCall, Mail, MapPin, Instagram, Facebook, Twitter, Clock, Award, Shield, Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">PDJ</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Delivering high quality, ethically-made jewelry at a fair price, just the way you want it. 
                  Creating beautiful moments with exceptional craftsmanship.
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <PhoneCall className="h-4 w-4 mr-3 text-primary" />
                  <span className="text-sm">1 5551234567</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Mail className="h-4 w-4 mr-3 text-primary" />
                  <span className="text-sm">ex@gmail.com</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-4 w-4 mr-3 text-primary" />
                  <span className="text-sm">Visit our Showroom</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-6">
                <h4 className="text-white font-semibold mb-3">Follow Us</h4>
                <div className="flex space-x-3">
                  <a href="#" className="bg-gray-800 hover:bg-primary p-2 rounded-full transition-colors">
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a href="#" className="bg-gray-800 hover:bg-primary p-2 rounded-full transition-colors">
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href="#" className="bg-gray-800 hover:bg-primary p-2 rounded-full transition-colors">
                    <Twitter className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Shop Categories */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Shop</h3>
              <ul className="space-y-2">
                <li><a href="/diamonds" className="text-gray-300 hover:text-primary text-sm transition-colors">Natural Diamonds</a></li>
                <li><a href="/diamonds" className="text-gray-300 hover:text-primary text-sm transition-colors">Lab-Grown Diamonds</a></li>
                <li><a href="/jewelry?category=engagement" className="text-gray-300 hover:text-primary text-sm transition-colors">Engagement Rings</a></li>
                <li><a href="/jewelry?category=wedding" className="text-gray-300 hover:text-primary text-sm transition-colors">Wedding Rings</a></li>
                <li><a href="/jewelry?category=earrings" className="text-gray-300 hover:text-primary text-sm transition-colors">Diamond Earrings</a></li>
                <li><a href="/jewelry?category=pendant" className="text-gray-300 hover:text-primary text-sm transition-colors">Diamond Pendants</a></li>
                <li><a href="/book-appointment" className="text-gray-300 hover:text-primary text-sm transition-colors">Book Consultation</a></li>
              </ul>
            </div>

            {/* Support & Services */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="/about-us" className="text-gray-300 hover:text-primary text-sm transition-colors">About Us</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-primary text-sm transition-colors">Contact Us</a></li>
                {/* <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors">Care Instructions</a></li> */}
                <li><a href="/contact" className="text-gray-300 hover:text-primary text-sm transition-colors">Returns & Exchanges</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-primary text-sm transition-colors">Shipping Info</a></li>
                {/* <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors">FAQ</a></li> */}
                <li><a href="/contact" className="text-gray-300 hover:text-primary text-sm transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Business Hours & Guarantees */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Business Hours</h3>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-gray-300">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <div className="text-sm">
                    <div>Monday - Friday: 10:30 AM - 6:30 PM</div>
                    <div>Saturday: 10:30 AM - 5:30 PM</div>
                    <div>Sunday: Closed</div>
                  </div>
                </div>
              </div>

              <h4 className="text-white font-semibold mb-3">Our Promise</h4>
              <div className="space-y-2">
                <div className="flex items-center text-gray-300">
                  <Shield className="h-4 w-4 mr-2 text-green-400" />
                  <span className="text-sm">Ethical Sourcing</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Award className="h-4 w-4 mr-2 text-blue-400" />
                  <span className="text-sm">Expert Craftsmanship</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Heart className="h-4 w-4 mr-2 text-red-400" />
                  <span className="text-sm">Lifetime Care</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-6">
                <a 
                  href="/book-appointment" 
                  className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Book Appointment
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 text-green-400 mb-2" />
              <span className="text-xs text-gray-400 font-medium">Ethical Sourcing</span>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-8 w-8 text-blue-400 mb-2" />
              <span className="text-xs text-gray-400 font-medium">Certified Quality</span>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="h-8 w-8 text-red-400 mb-2" />
              <span className="text-xs text-gray-400 font-medium">Lifetime Warranty</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="h-8 w-8 text-yellow-400 mb-2" />
              <span className="text-xs text-gray-400 font-medium">Expert Consultation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 PDiamonds & Jewelry. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Terms & Conditions</a>
              <a href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">Cookies Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;