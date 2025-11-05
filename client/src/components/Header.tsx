import { Button } from "@/components/ui/button";
import { APP_LOGO } from "@/const";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <img src={APP_LOGO} alt="Siggiewi Logo" className="h-12 cursor-pointer hover:opacity-80 transition-opacity" />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <a href="/#about" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
            About
          </a>
          <a href="/#races" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
            Races
          </a>
          <a href="/#routes" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
            Routes
          </a>
          <Link href="/previous-editions" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
            Previous Editions
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
            Contact
          </Link>
        </nav>
        <Link href="/register">
          <Button className="bg-orange-500 hover:bg-orange-600">Register Now</Button>
        </Link>
      </div>
    </header>
  );
}

