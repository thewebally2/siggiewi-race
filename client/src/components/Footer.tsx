import { APP_LOGO, APP_TITLE } from "@/const";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <img src={APP_LOGO} alt="Logo" className="h-16 mb-4" />
            <p className="text-gray-400">Is-Siggiewi End of Year Race</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              <li><a href="/#races" className="text-gray-400 hover:text-white transition-colors">Races</a></li>
              <li><a href="/#routes" className="text-gray-400 hover:text-white transition-colors">Routes</a></li>
              <li>
                <Link href="/previous-editions" className="text-gray-400 hover:text-white transition-colors">
                  Previous Editions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Kunsill Lokali Is-Siggiewi</li>
              <li>Città Ferdinand</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
            <p>&copy; {new Date().getFullYear()} {APP_TITLE}. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span>another website by</span>
              <a 
                href="https://www.thewebally.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-80 transition-opacity"
              >
                <img 
                  src="https://www.thewebally.com/resource/TWA-web.png" 
                  alt="TheWebAlly Logo" 
                  width="40" 
                  height="20" 
                  className="inline-block" 
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

