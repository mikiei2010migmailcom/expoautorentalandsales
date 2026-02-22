'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star, Car, Users, Award, Clock } from 'lucide-react';
import Image from 'next/image';

const stats = [
  { icon: Award, value: '15+', label: 'Years in Business' },
  { icon: Car, value: '500+', label: 'Vehicles Sold' },
  { icon: Users, value: '1000+', label: 'Happy Customers' },
  { icon: Star, value: '4.9', label: 'Star Rating' },
];

export default function HeroSection() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="Luxury vehicle"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        {/* Red accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/30 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-sm font-medium">Lafayette&apos;s Premier Auto Destination</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            DRIVE YOUR
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
              DREAMS
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-8 max-w-xl">
            Experience luxury and performance with our curated selection of premium vehicles. 
            Whether you&apos;re looking to purchase or rent, we have the perfect ride for you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <Button
              size="lg"
              onClick={() => scrollToSection('#inventory')}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-6 text-lg group"
            >
              View Inventory
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              onClick={() => scrollToSection('#rentals')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
            >
              <Play className="mr-2 w-5 h-5" />
              Rent a Vehicle
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Licensed & Insured
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Quality Guaranteed
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500" />
              Same-Day Approval
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-colors group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600/20 rounded-lg mb-3 group-hover:bg-red-600/30 transition-colors">
                <stat.icon className="w-6 h-6 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <span className="text-xs uppercase tracking-widest">Scroll to Explore</span>
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
