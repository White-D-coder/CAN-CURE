export function Footer() {
    return (
      <footer className="w-full-screen bg-gray-800 text-white py-6">
        <div className="max-w-9xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} CAN-CURE. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="/privacy-policy"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Terms of Service
            </a>
            <a
              href="/contact"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    );
  }