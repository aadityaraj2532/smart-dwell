import { Link } from "react-router-dom";
import { Facebook, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 text-gray-900 dark:text-white mb-4">
              <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_319_new-footer)">
                  <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
                </g>
                <defs>
                  <clipPath id="clip0_6_319_new-footer">
                    <rect fill="white" height="48" width="48"></rect>
                  </clipPath>
                </defs>
              </svg>
              <h2 className="text-xl font-bold tracking-tight">SmartDwell</h2>
            </div>
            <p className="text-sm">Your partner in finding the perfect home.</p>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>
                <a className="hover:text-primary transition-colors" href="tel:+1234567890">
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="mailto:contact@smartdwell.com">
                  contact@smartdwell.com
                </a>
              </li>
              <li>
                <Link className="hover:text-primary transition-colors" to="/contact">
                  Contact Page
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Follow Us</h3>
            <div className="flex items-center space-x-4">
              <a className="text-gray-500 hover:text-primary dark:hover:text-primary transition-colors" href="#">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06c0 4.98 3.66 9.14 8.44 9.9v-7.03h-2.5v-2.87h2.5V9.9c0-2.5 1.5-3.88 3.77-3.88 1.08 0 2.24.19 2.24.19v2.44h-1.29c-1.21 0-1.55.73-1.55 1.51v1.85h2.78l-.45 2.87h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94C22 6.53 17.5 2.04 12 2.04z"></path>
                </svg>
              </a>
              <a className="text-gray-500 hover:text-primary dark:hover:text-primary transition-colors" href="#">
                <Instagram className="h-6 w-6" />
              </a>
              <a className="text-gray-500 hover:text-primary dark:hover:text-primary transition-colors" href="#">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zM8.5 7H6v10h2.5V7zM7.25 6.25A1.25 1.25 0 106 5a1.25 1.25 0 001.25 1.25zM17.5 7H15.1c-1.5 0-2.6.9-2.6 2.5v1.2H10V13h2.5v4H15v-4h2.5l-.5-2.3H15v-1c0-.6.4-1 1-1h1.5V7z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 text-center text-sm">
          <p>© {currentYear} SmartDwell. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
