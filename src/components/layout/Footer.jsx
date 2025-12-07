import { PhoneCall, Mail, MapPin, Instagram, Facebook, Twitter, Clock, Award, Shield, Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info - DIDOT FOR BRAND NAME, MONTSERRAT FOR BODY TEXT */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h3 className="text-2xl font-didot font-medium text-white mb-2">LOVE & BRILLIANCE</h3>
                <p className="font-montserrat text-gray-300 text-sm leading-relaxed">
                  Delivering high quality, ethically-made jewelry at a fair price, just the way you want it. 
                  Creating beautiful moments with exceptional craftsmanship.
                </p>
              </div>
              
              {/* Contact Info - MONTSERRAT FOR BODY TEXT */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <PhoneCall className="h-4 w-4 mr-3 text-primary" />
                  <a href="tel:+1234567890" className="text-sm font-montserrat">1 5551234567</a>
                </div>
                <div className="flex items-center text-gray-300">
                  <Mail className="h-4 w-4 mr-3 text-primary" />
                  <a href="mailto:ex@gmail.com" className="text-sm font-montserrat">ex@gmail.com</a>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-4 w-4 mr-3 text-primary" />
                  <a href="/contact" className="text-sm font-montserrat">Visit our Showroom</a>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Shop Categories - BASKERVILLE FOR SECTION HEADINGS, MONTSERRAT FOR LINKS */}
            <div>
              <h3 className="text-lg font-baskerville font-semibold text-white mb-4">Shop</h3>
              <ul className="space-y-2">
                <li><a href="/diamonds" className="font-montserrat text-gray-300 hover:text-primary text-sm transition-colors">Natural Diamonds</a></li>
                <li><a href="/diamonds" className="font-montserrat text-gray-300 hover:text-primary text-sm transition-colors">Lab-Grown Diamonds</a></li>
                <li><a href="/jewelry?category=ring" className="font-montserrat text-gray-300 hover:text-primary text-sm transition-colors">Rings</a></li>
                <li><a href="/jewelry?category=band" className="font-montserrat text-gray-300 hover:text-primary text-sm transition-colors">Bands</a></li>
                <li><a href="/jewelry?category=earrings" className="font-montserrat text-gray-300 hover:text-primary text-sm transition-colors">Earrings</a></li>
                <li><a href="/jewelry?category=pendant" className="font-montserrat text-gray-300 hover:text-primary text-sm transition-colors">Diamond Pendants</a></li>
                <li><a href="/book-appointment" className="font-montserrat text-gray-300 hover:text-primary text-sm transition-colors">Book Consultation</a></li>
              </ul>
            </div>

            {/* Support & Services - BASKERVILLE FOR SECTION HEADINGS, MONTSERRAT FOR LINKS */}
            <div>
              <h3 className="text-lg font-baskerville font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="/about-us" className="font-montserrat text-gray-300 hover:text-primary text-sm transition-colors">About Us</a></li>
                <li><a href="/contact" className="font-montserrat text-gray-300 hover:text-primary text-sm transition-colors">Contact Us</a></li>
                <li><a href="/contact" className="font-montserrat text-gray-300 hover:text-primary text-sm transition-colors">Returns & Exchanges</a></li>
                <li><a href="/contact" className="font-montserrat text-gray-300 hover:text-primary text-sm transition-colors">Shipping Info</a></li>
                <li><a href="/contact" className="font-montserrat text-gray-300 hover:text-primary text-sm transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Business Hours & Guarantees - BASKERVILLE FOR SECTION HEADINGS, MONTSERRAT FOR BODY TEXT */}
            <div>
              <h3 className="text-lg font-baskerville font-semibold text-white mb-4">Business Hours</h3>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-gray-300">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <div className="text-sm font-montserrat">
                    <div>Monday - Friday: 10:30 AM - 6:30 PM</div>
                    <div>Saturday: 10:30 AM - 5:30 PM</div>
                    <div>Sunday: Closed</div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-2">
                <div className="flex items-center text-gray-300">
                  <Award className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-xs font-montserrat">Certified Quality</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Shield className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-xs font-montserrat">Lifetime Warranty</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Heart className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-xs font-montserrat">Ethically Sourced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer - MONTSERRAT FOR COPYRIGHT TEXT */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm font-montserrat mb-4 md:mb-0">
              © 2024 Love & Brilliance. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="/contact" className="font-montserrat text-gray-400 hover:text-primary text-sm transition-colors">Terms of Service</a>
              <a href="/contact" className="font-montserrat text-gray-400 hover:text-primary text-sm transition-colors">Privacy Policy</a>
              <a href="/contact" className="font-montserrat text-gray-400 hover:text-primary text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;