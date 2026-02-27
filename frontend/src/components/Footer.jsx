import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHeart, 
  FaInstagram, 
  FaTwitter, 
  FaFacebookF, 
  FaPinterest, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPhone 
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black  border text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Section */}
          <div className="space-y-5">
            <Link to="/" className="inline-block">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Pixora
              </h2>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Discover and share stunning photography from creators around the world. 
              Join our community of visual storytellers.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3 pt-3">
              {[
                { icon: FaInstagram, color: 'hover:bg-pink-600', href: '#' },
                { icon: FaTwitter, color: 'hover:bg-blue-500', href: '#' },
                { icon: FaFacebookF, color: 'hover:bg-blue-700', href: '#' },
                { icon: FaPinterest, color: 'hover:bg-red-600', href: '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center 
                    transition-all duration-300 hover:scale-110 ${social.color} hover:text-white`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-white relative pb-3 
              after:content-[''] after:absolute after:left-0 after:bottom-0 
              after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-pink-500">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Featured Photos', path: '/featured' },
                { name: 'Categories', path: '/categories' },
                { name: 'Blog', path: '/blog' },
                { name: 'Careers', path: '/careers' },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-300 
                      flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r 
                      from-purple-500 to-pink-500 transition-all duration-300 mr-0 group-hover:mr-2">
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-white relative pb-3 
              after:content-[''] after:absolute after:left-0 after:bottom-0 
              after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-pink-500">
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Help Center', path: '/help' },
                { name: 'FAQs', path: '/faqs' },
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-300 
                      flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r 
                      from-purple-500 to-pink-500 transition-all duration-300 mr-0 group-hover:mr-2">
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <h3 className="text-xl font-semibold text-white relative pb-3 
              after:content-[''] after:absolute after:left-0 after:bottom-0 
              after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-pink-500">
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-purple-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Creative Street,<br />New York, NY 10001
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-purple-400 flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-purple-400 flex-shrink-0" />
                <span className="text-gray-400">hello@pixora.com</span>
              </li>
            </ul>

           
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Pixora. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>Made with</span>
              <FaHeart className="text-red-500 animate-pulse mx-1" />
              <span>by Pixora Team</span>
            </div>

            <div className="flex space-x-6">
              {['Privacy', 'Terms', 'Sitemap'].map((item, index) => (
                <Link
                  key={index}
                  to={`/${item.toLowerCase()}`}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;