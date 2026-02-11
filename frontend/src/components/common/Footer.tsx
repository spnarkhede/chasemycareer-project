import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Chase My Career */}
          <div>
            <h3 className="text-lg font-semibold text-amber-800 mb-4">
              About Chase My Career
            </h3>
            <p className="text-gray-600">
              Your 50-day structured program to help you stay on track with your job search journey. Track progress, complete daily tasks, and achieve your career goals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-amber-800 mb-4">
              Quick Links
            </h3>
            <div className="text-gray-600 space-y-2">
              <div>
                <Link to="/privacy-policy" className="hover:text-amber-800 transition-colors">
                  Privacy Policy
                </Link>
              </div>
              <div>
                <Link to="/terms-of-service" className="hover:text-amber-800 transition-colors">
                  Terms of Service
                </Link>
              </div>
              <div>
                <Link to="/privacy-settings" className="hover:text-amber-800 transition-colors">
                  Privacy Settings
                </Link>
              </div>
            </div>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-lg font-semibold text-amber-800 mb-4">
              Contact & Support
            </h3>
            <div className="text-gray-600 space-y-2">
              <p>
                Email: support@chasemycareer.com
              </p>
              <p>
                Privacy: privacy@chasemycareer.com
              </p>
              <p>
                Legal: legal@chasemycareer.com
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-8 border-t border-amber-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-600 text-sm">
            <p>
              {currentYear} Chase My Career
            </p>
            <div className="flex gap-4">
              <Link to="/privacy-policy" className="hover:text-amber-800 transition-colors">
                Privacy
              </Link>
              <Link to="/terms-of-service" className="hover:text-amber-800 transition-colors">
                Terms
              </Link>
              <Link to="/privacy-settings" className="hover:text-amber-800 transition-colors">
                Your Privacy Rights
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
