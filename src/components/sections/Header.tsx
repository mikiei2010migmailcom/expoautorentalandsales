'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Car, Phone, Mail, MapPin, LogIn } from 'lucide-react';

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#inventory', label: 'Inventory' },
  { href: '#rentals', label: 'Rentals' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-red-900/10'
            : 'bg-transparent'
        }`}
      >
        {/* Top bar */}
        <div className="hidden md:block bg-gradient-to-r from-red-600 to-red-700 text-white py-1.5">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:337-706-7863" className="flex items-center gap-2 hover:text-red-200 transition-colors">
                <Phone className="w-3.5 h-3.5" />
                337-706-7863
              </a>
              <a href="mailto:nzenon@expoautos.net" className="flex items-center gap-2 hover:text-red-200 transition-colors">
                <Mail className="w-3.5 h-3.5" />
                nzenon@expoautos.net
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                815 SW Evangeline Thruway, Lafayette, LA 70501
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Mon-Sat: 9AM-6PM | Sun: Closed</span>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="#home" className="flex items-center gap-3 group" onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}>
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Car className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight">TOP AUTO</span>
                <span className="text-xs text-red-500 font-medium tracking-widest">RENTAL & SALES LLC</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                  className="px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAdminOpen(true)}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
              <Button
                onClick={() => scrollToSection('#inventory')}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6"
              >
                View Inventory
              </Button>
            </div>

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-zinc-900 border-zinc-800 text-white w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <span className="text-lg font-bold">TOP AUTO</span>
                        <span className="block text-xs text-red-500">RENTAL & SALES</span>
                      </div>
                    </div>
                  </div>

                  <nav className="flex-1">
                    <ul className="space-y-2">
                      {navLinks.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div className="space-y-4 pt-6 border-t border-zinc-800">
                    <Button
                      onClick={() => setIsAdminOpen(true)}
                      variant="outline"
                      className="w-full border-zinc-700 text-gray-300 hover:text-white hover:bg-white/5"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                    <Button
                      onClick={() => scrollToSection('#inventory')}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      View Inventory
                    </Button>
                  </div>

                  <div className="pt-6 space-y-3 text-sm text-gray-400">
                    <a href="tel:337-706-7863" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      337-706-7863
                    </a>
                    <a href="mailto:nzenon@expoautos.net" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      nzenon@expoautos.net
                    </a>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      815 SW Evangeline Thruway, Lafayette, LA 70501
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Admin Panel */}
      <AdminPanel open={isAdminOpen} onOpenChange={setIsAdminOpen} />
    </>
  );
}
