'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Car, Phone, Mail, MapPin, Star, Menu, X, ChevronLeft, ChevronRight, ChevronDown,
  Plus, Edit, Trash2, Eye, Check, Search, Upload, Image as ImageIcon,
  DollarSign, Calendar, Gauge, Palette, Settings, Users, FileText,
  Home, ShoppingCart, Truck, MessageSquare, ThumbsUp, Clock
} from 'lucide-react';
import { toast } from 'sonner';

// Types
interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  price: number;
  mileage: number;
  color: string;
  vin?: string;
  engine?: string;
  transmission?: string;
  fuelType?: string;
  condition?: string;
  vehicleType: string;
  status: string;
  dailyRate?: number;
  weeklyRate?: number;
  featured: boolean;
  images: string;
  description?: string;
  createdAt: string;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  status: string;
  createdAt: string;
}

interface ContactInquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  vehicleId?: string;
  message: string;
  read: boolean;
  createdAt: string;
  vehicle?: Vehicle;
}

interface RentalApplication {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  driverLicense?: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  hasInsurance: boolean;
  insuranceDoc?: string;
  dealerInsurance?: number;
  agreedToTerms: boolean;
  status: string;
  createdAt: string;
  vehicle?: Vehicle;
}

interface PurchaseApplication {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  vehicleId: string;
  agreedToTerms: boolean;
  status: string;
  createdAt: string;
  vehicle?: Vehicle;
}

interface WholesaleVehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  price: number;
  mileage: number;
  location: string;
  radius: number;
  images: string;
  description?: string;
  status: string;
  createdAt: string;
}

// Business Info
const BUSINESS_INFO = {
  name: "Top Auto Rental & Sales LLC",
  address: "815 SW Evangeline Thruway, Lafayette, LA 70501",
  phone: "337-706-7863",
  email: "nzenon@expoautos.net",
  hours: "Mon-Fri: 9AM-6PM | Sat: 10AM-4PM | Sun: Closed"
};

// Louisiana Purchase Agreement Text
const PURCHASE_AGREEMENT = `
LOUISIANA VEHICLE PURCHASE AGREEMENT

This Vehicle Purchase Agreement ("Agreement") is entered into on this date between:

SELLER: Top Auto Rental & Sales LLC
Address: 815 SW Evangeline Thruway, Lafayette, LA 70501
Phone: 337-706-7863
Email: nzenon@expoautos.net

BUYER: [Customer Name]
Address: [Customer Address]
Phone: [Customer Phone]
Email: [Customer Email]

VEHICLE INFORMATION:
Year: [Year]
Make: [Make]
Model: [Model]
VIN: [VIN]
Mileage: [Mileage] miles
Color: [Color]

PURCHASE TERMS:
1. Purchase Price: $[Price]
2. Payment Method: As agreed between parties
3. Vehicle is sold "AS IS" with no warranty, either expressed or implied, unless otherwise stated in writing.

ODOMETER DISCLOSURE:
Seller certifies that the mileage stated above is accurate to the best of their knowledge. The odometer has not been altered, disconnected, or replaced except as permitted by Louisiana law.

TITLE TRANSFER:
Seller agrees to provide a clear title to the Buyer upon full payment. Buyer is responsible for all title transfer fees, registration fees, and applicable taxes.

AS IS DISCLAIMER (Per Louisiana Civil Code):
This vehicle is sold in its present condition. Seller makes no warranties regarding the vehicle's condition, fitness for a particular purpose, or merchantability. Buyer acknowledges they have had the opportunity to inspect the vehicle before purchase.

ACKNOWLEDGMENT:
By agreeing below, Buyer acknowledges they have read, understood, and agree to all terms of this Agreement. Buyer has had the opportunity to have this Agreement reviewed by legal counsel.

This Agreement is governed by the laws of the State of Louisiana.
`;

// Louisiana Rental Agreement Text
const RENTAL_AGREEMENT = `
LOUISIANA VEHICLE RENTAL AGREEMENT

This Vehicle Rental Agreement ("Agreement") is entered into on this date between:

LESSOR: Top Auto Rental & Sales LLC
Address: 815 SW Evangeline Thwy, Lafayette, LA 70501
Phone: 337-706-7863
Email: nzenon@expoautos.net

LESSEE: [Customer Name]
Address: [Customer Address]
Phone: [Customer Phone]
Email: [Customer Email]
Driver License: [DL Number]

VEHICLE INFORMATION:
Year: [Year]
Make: [Make]
Model: [Model]
VIN: [VIN]
Mileage at Pickup: [Mileage] miles
Color: [Color]

RENTAL PERIOD:
Start Date: [Start Date]
End Date: [End Date]

RATES:
Daily Rate: $[Daily Rate]
Weekly Rate: $[Weekly Rate]
Estimated Total: Calculated based on rental duration

INSURANCE REQUIREMENTS:
Per Louisiana law, all rental vehicles must be covered by valid insurance.

Option 1: Lessee provides proof of valid auto insurance covering rental vehicles.
Option 2: Lessor provides insurance at additional daily cost.

[Insurance details to be filled based on customer selection]

SECURITY DEPOSIT: $[Deposit Amount]
Refundable upon return of vehicle in good condition.

TERMS AND CONDITIONS:

1. VEHICLE USE
   - Vehicle shall only be used for lawful purposes
   - Vehicle shall not be used for racing, towing, or off-road driving
   - Vehicle shall not be taken outside the State of Louisiana without prior written consent

2. FUEL POLICY
   - Vehicle must be returned with the same fuel level as at pickup
   - Failure to do so will result in a refueling fee

3. MILEAGE LIMITATIONS
   - Unlimited mileage within Louisiana
   - Out-of-state mileage subject to additional fees

4. LATE RETURN FEES
   - Grace period: 30 minutes
   - Late fee: 1.5x daily rate for each additional day

5. DAMAGE RESPONSIBILITY
   - Lessee is responsible for all damage to the vehicle during rental period
   - Normal wear and tear excluded
   - All damage must be reported within 24 hours

6. PROHIBITED ACTIVITIES
   - No smoking in vehicle
   - No pets without prior approval
   - No unauthorized drivers

7. RETURN CONDITION
   - Vehicle must be returned in the same condition as received
   - Interior must be clean
   - All personal items removed

ACKNOWLEDGMENT:
By agreeing below, Lessee acknowledges they have read, understood, and agree to all terms of this Agreement. Lessee has had the opportunity to have this Agreement reviewed by legal counsel.

This Agreement is governed by the laws of the State of Louisiana.
`;

export default function Home() {
  // State Management
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState('vehicles');
  
  // Data States
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [rentalApps, setRentalApps] = useState<RentalApplication[]>([]);
  const [purchaseApps, setPurchaseApps] = useState<PurchaseApplication[]>([]);
  const [wholesaleVehicles, setWholesaleVehicles] = useState<WholesaleVehicle[]>([]);
  
  // Filter States
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  
  // Modal States
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  
  // Form States
  const [purchaseForm, setPurchaseForm] = useState({
    customerName: '', customerPhone: '', customerEmail: '', customerAddress: '', agreedToTerms: false
  });
  const [rentalForm, setRentalForm] = useState({
    customerName: '', customerPhone: '', customerEmail: '', customerAddress: '',
    driverLicense: '', startDate: '', endDate: '', hasInsurance: false,
    insuranceDoc: '', dealerInsurance: '', agreedToTerms: false
  });
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, text: '' });
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', vehicleId: '', message: '' });
  const [vehicleForm, setVehicleForm] = useState({
    year: '', make: '', model: '', trim: '', price: '', mileage: '', color: '',
    vin: '', engine: '', transmission: '', fuelType: '', condition: '', vehicleType: 'Sedan',
    status: 'For Sale', dailyRate: '', weeklyRate: '', featured: false, images: [] as string[],
    description: ''
  });
  const [wholesaleForm, setWholesaleForm] = useState({
    year: '', make: '', model: '', price: '', mileage: '', location: '', radius: '250', images: [] as string[], description: ''
  });

  // Fetch Functions
  const fetchVehicles = useCallback(async () => {
    try {
      const res = await fetch('/api/vehicles');
      const data = await res.json();
      setVehicles(data);
    } catch (error) {
      toast.error('Failed to load vehicles');
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch('/api/reviews?status=approved');
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      toast.error('Failed to load reviews');
    }
  }, []);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      setInquiries(data);
    } catch (error) {
      toast.error('Failed to load inquiries');
    }
  }, []);

  const fetchRentalApps = useCallback(async () => {
    try {
      const res = await fetch('/api/rentals');
      const data = await res.json();
      setRentalApps(data);
    } catch (error) {
      toast.error('Failed to load rental applications');
    }
  }, []);

  const fetchPurchaseApps = useCallback(async () => {
    try {
      const res = await fetch('/api/purchases');
      const data = await res.json();
      setPurchaseApps(data);
    } catch (error) {
      toast.error('Failed to load purchase applications');
    }
  }, []);

  const fetchWholesale = useCallback(async () => {
    try {
      const res = await fetch('/api/wholesale');
      const data = await res.json();
      setWholesaleVehicles(data);
    } catch (error) {
      toast.error('Failed to load wholesale vehicles');
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
    fetchReviews();
  }, [fetchVehicles, fetchReviews]);

  useEffect(() => {
    if (isAdmin) {
      fetchInquiries();
      fetchRentalApps();
      fetchPurchaseApps();
      fetchWholesale();
    }
  }, [isAdmin, fetchInquiries, fetchRentalApps, fetchPurchaseApps, fetchWholesale]);

  // Filter Vehicles
  const filteredVehicles = vehicles.filter(v => {
    if (vehicleFilter === 'sale' && v.status === 'For Rent') return false;
    if (vehicleFilter === 'rent' && v.status === 'For Sale') return false;
    if (vehicleTypeFilter !== 'all' && v.vehicleType !== vehicleTypeFilter) return false;
    if (priceRange !== 'all') {
      const price = v.price;
      if (priceRange === 'under10k' && price >= 10000) return false;
      if (priceRange === '10k-25k' && (price < 10000 || price >= 25000)) return false;
      if (priceRange === '25k-50k' && (price < 25000 || price >= 50000)) return false;
      if (priceRange === 'over50k' && price < 50000) return false;
    }
    return true;
  });

  const rentalVehicles = vehicles.filter(v => v.status === 'For Rent' || v.status === 'Both');
  const saleVehicles = vehicles.filter(v => v.status === 'For Sale' || v.status === 'Both');
  const featuredVehicles = vehicles.filter(v => v.featured);

  // Vehicle CRUD Operations
  const handleAddVehicle = async () => {
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleForm)
      });
      if (res.ok) {
        toast.success('Vehicle added successfully');
        setShowVehicleForm(false);
        setVehicleForm({
          year: '', make: '', model: '', trim: '', price: '', mileage: '', color: '',
          vin: '', engine: '', transmission: '', fuelType: '', condition: '', vehicleType: 'Sedan',
          status: 'For Sale', dailyRate: '', weeklyRate: '', featured: false, images: [], description: ''
        });
        fetchVehicles();
      } else {
        toast.error('Failed to add vehicle');
      }
    } catch (error) {
      toast.error('Failed to add vehicle');
    }
  };

  const handleUpdateVehicle = async () => {
    if (!editingVehicle) return;
    try {
      const res = await fetch(`/api/vehicles/${editingVehicle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleForm)
      });
      if (res.ok) {
        toast.success('Vehicle updated successfully');
        setEditingVehicle(null);
        setShowVehicleForm(false);
        setVehicleForm({
          year: '', make: '', model: '', trim: '', price: '', mileage: '', color: '',
          vin: '', engine: '', transmission: '', fuelType: '', condition: '', vehicleType: 'Sedan',
          status: 'For Sale', dailyRate: '', weeklyRate: '', featured: false, images: [], description: ''
        });
        fetchVehicles();
      } else {
        toast.error('Failed to update vehicle');
      }
    } catch (error) {
      toast.error('Failed to update vehicle');
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Vehicle deleted successfully');
        fetchVehicles();
      } else {
        toast.error('Failed to delete vehicle');
      }
    } catch (error) {
      toast.error('Failed to delete vehicle');
    }
  };

  // Submit Functions
  const handlePurchaseSubmit = async () => {
    if (!selectedVehicle) return;
    if (!purchaseForm.agreedToTerms) {
      toast.error('You must agree to the purchase agreement');
      return;
    }
    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...purchaseForm, vehicleId: selectedVehicle.id })
      });
      if (res.ok) {
        toast.success('Purchase application submitted! We will contact you shortly.');
        setShowPurchaseModal(false);
        setPurchaseForm({ customerName: '', customerPhone: '', customerEmail: '', customerAddress: '', agreedToTerms: false });
      } else {
        toast.error('Failed to submit application');
      }
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  const handleRentalSubmit = async () => {
    if (!selectedVehicle) return;
    if (!rentalForm.agreedToTerms) {
      toast.error('You must agree to the rental agreement');
      return;
    }
    if (!rentalForm.hasInsurance && !rentalForm.dealerInsurance) {
      toast.error('Please provide proof of insurance or select dealer-provided insurance');
      return;
    }
    try {
      const res = await fetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...rentalForm, vehicleId: selectedVehicle.id })
      });
      if (res.ok) {
        toast.success('Rental application submitted! We will contact you shortly.');
        setShowRentalModal(false);
        setRentalForm({
          customerName: '', customerPhone: '', customerEmail: '', customerAddress: '',
          driverLicense: '', startDate: '', endDate: '', hasInsurance: false,
          insuranceDoc: '', dealerInsurance: '', agreedToTerms: false
        });
      } else {
        toast.error('Failed to submit application');
      }
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  const handleReviewSubmit = async () => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm)
      });
      if (res.ok) {
        toast.success('Thank you! Your review is pending approval.');
        setShowReviewModal(false);
        setReviewForm({ name: '', rating: 5, text: '' });
      } else {
        toast.error('Failed to submit review');
      }
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const handleContactSubmit = async () => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        toast.success('Thank you for your inquiry! We will contact you soon.');
        setContactForm({ name: '', phone: '', email: '', vehicleId: '', message: '' });
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleWholesaleSubmit = async () => {
    try {
      const res = await fetch('/api/wholesale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wholesaleForm)
      });
      if (res.ok) {
        toast.success('Wholesale vehicle added successfully');
        setWholesaleForm({
          year: '', make: '', model: '', price: '', mileage: '', location: '', radius: '250', images: [], description: ''
        });
        fetchWholesale();
      } else {
        toast.error('Failed to add wholesale vehicle');
      }
    } catch (error) {
      toast.error('Failed to add wholesale vehicle');
    }
  };

  // Admin Actions
  const handleApproveReview = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      if (res.ok) {
        toast.success('Review approved');
        fetchReviews();
      }
    } catch (error) {
      toast.error('Failed to approve review');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Review deleted');
        fetchReviews();
      }
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Inquiry deleted');
        fetchInquiries();
      }
    } catch (error) {
      toast.error('Failed to delete inquiry');
    }
  };

  const handleMarkInquiryRead = async (id: string, read: boolean) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read })
      });
      if (res.ok) {
        fetchInquiries();
      }
    } catch (error) {
      toast.error('Failed to update inquiry');
    }
  };

  const handleRentalStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/rentals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Application ${status}`);
        fetchRentalApps();
      }
    } catch (error) {
      toast.error('Failed to update application');
    }
  };

  const handleDeleteWholesale = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wholesale listing?')) return;
    try {
      const res = await fetch(`/api/wholesale/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Wholesale vehicle deleted');
        fetchWholesale();
      }
    } catch (error) {
      toast.error('Failed to delete wholesale vehicle');
    }
  };

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isWholesale = false) => {
    const files = e.target.files;
    if (!files) return;

    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.urls) {
        if (isWholesale) {
          setWholesaleForm(prev => ({ ...prev, images: [...prev.images, ...data.urls] }));
        } else {
          setVehicleForm(prev => ({ ...prev, images: [...prev.images, ...data.urls] }));
        }
        toast.success('Images uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload images');
    }
  };

  // AI Image Generation
  const generateVehicleImage = async () => {
    const prompt = `${vehicleForm.year} ${vehicleForm.make} ${vehicleForm.model} ${vehicleForm.trim || ''} car exterior professional photo`;
    try {
      toast.info('Generating image with AI...');
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (data.url) {
        setVehicleForm(prev => ({ ...prev, images: [...prev.images, data.url] }));
        toast.success('Image generated successfully');
      }
    } catch (error) {
      toast.error('Failed to generate image');
    }
  };

  // Format helpers
  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  const formatMileage = (mileage: number) => new Intl.NumberFormat('en-US').format(mileage);
  const parseImages = (imagesStr: string) => { try { return JSON.parse(imagesStr); } catch { return []; } };

  // Navigation Component
  const Navigation = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-red-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-red-500" />
            <span className="text-xl font-bold text-white">{BUSINESS_INFO.name}</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {['home', 'inventory', 'rentals', 'reviews', 'contact'].map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`text-sm font-medium transition-colors ${activeSection === section ? 'text-red-500' : 'text-gray-300 hover:text-white'}`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdmin(!isAdmin)}
              className={`border-red-500 ${isAdmin ? 'bg-red-500 text-white' : 'text-red-500'}`}
            >
              <Settings className="h-4 w-4 mr-1" />
              Admin
            </Button>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-red-900/20">
          <div className="px-4 py-3 space-y-2">
            {['home', 'inventory', 'rentals', 'reviews', 'contact'].map(section => (
              <button
                key={section}
                onClick={() => { setActiveSection(section); setMobileMenuOpen(false); }}
                className={`block w-full text-left py-2 ${activeSection === section ? 'text-red-500' : 'text-gray-300'}`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setIsAdmin(!isAdmin); setMobileMenuOpen(false); }}
              className="w-full border-red-500 text-red-500"
            >
              <Settings className="h-4 w-4 mr-1" />
              {isAdmin ? 'Exit Admin' : 'Admin Panel'}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );

  // Hero Section
  const HeroSection = () => (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-4 tracking-tight">
          DRIVE YOUR <span className="text-red-500">DREAMS</span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Experience premium quality vehicles with flexible rental and purchase options in Lafayette, LA
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => setActiveSection('inventory')} className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Browse Inventory
          </Button>
          <Button size="lg" variant="outline" onClick={() => setActiveSection('rentals')} className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-8 py-6 text-lg">
            <Truck className="mr-2 h-5 w-5" />
            Rent a Vehicle
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-800">
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-red-500">10+</p>
            <p className="text-gray-400 text-sm">Years Experience</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-red-500">500+</p>
            <p className="text-gray-400 text-sm">Vehicles Sold</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold text-red-500">1000+</p>
            <p className="text-gray-400 text-sm">Happy Customers</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-red-500" />
      </div>
    </section>
  );

  // Featured Vehicles Section
  const FeaturedSection = () => {
    if (featuredVehicles.length === 0) return null;
    
    return (
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Featured Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVehicles.slice(0, 3).map(vehicle => (
              <Card key={vehicle.id} className="bg-gray-800 border-gray-700 overflow-hidden group cursor-pointer" onClick={() => { setSelectedVehicle(vehicle); setShowPurchaseModal(true); }}>
                <div className="relative h-48 bg-gray-700">
                  {parseImages(vehicle.images)[0] ? (
                    <img src={parseImages(vehicle.images)[0]} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Car className="h-16 w-16 text-gray-500" />
                    </div>
                  )}
                  {vehicle.featured && (
                    <Badge className="absolute top-2 right-2 bg-red-500">Featured</Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-white">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                  <p className="text-gray-400 text-sm">{formatMileage(vehicle.mileage)} miles • {vehicle.color}</p>
                  <p className="text-red-500 font-bold text-xl mt-2">{formatPrice(vehicle.price)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Vehicle Card Component
  const VehicleCard = ({ vehicle, onPurchase, onRent }: { vehicle: Vehicle; onPurchase?: () => void; onRent?: () => void }) => (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden group">
      <div className="relative h-48 bg-gray-700">
        {parseImages(vehicle.images)[0] ? (
          <img src={parseImages(vehicle.images)[0]} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Car className="h-16 w-16 text-gray-500" />
          </div>
        )}
        {vehicle.featured && <Badge className="absolute top-2 right-2 bg-red-500">Featured</Badge>}
        <Badge className="absolute top-2 left-2 bg-gray-900/80">{vehicle.vehicleType}</Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-white">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
        <p className="text-gray-400 text-sm">{vehicle.trim}</p>
        <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm">
          <span className="flex items-center gap-1"><Gauge className="h-4 w-4" />{formatMileage(vehicle.mileage)}</span>
          <span className="flex items-center gap-1"><Palette className="h-4 w-4" />{vehicle.color}</span>
        </div>
        
        {(vehicle.status === 'For Sale' || vehicle.status === 'Both') && (
          <p className="text-red-500 font-bold text-xl mt-3">{formatPrice(vehicle.price)}</p>
        )}
        {(vehicle.status === 'For Rent' || vehicle.status === 'Both') && vehicle.dailyRate && (
          <p className="text-green-500 text-sm mt-1">${vehicle.dailyRate}/day • ${vehicle.weeklyRate}/week</p>
        )}
        
        <div className="flex gap-2 mt-4">
          {(vehicle.status === 'For Sale' || vehicle.status === 'Both') && onPurchase && (
            <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700" onClick={onPurchase}>Buy Now</Button>
          )}
          {(vehicle.status === 'For Rent' || vehicle.status === 'Both') && onRent && (
            <Button size="sm" variant="outline" className="flex-1 border-green-500 text-green-500 hover:bg-green-500 hover:text-white" onClick={onRent}>Rent</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Inventory Section
  const InventorySection = () => (
    <section id="inventory" className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white text-center mb-4">Our Inventory</h2>
        <p className="text-gray-400 text-center mb-12">Browse our selection of quality pre-owned vehicles</p>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Vehicles</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={vehicleTypeFilter} onValueChange={setVehicleTypeFilter}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Sedan">Sedan</SelectItem>
              <SelectItem value="SUV">SUV</SelectItem>
              <SelectItem value="Truck">Truck</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Van">Van</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under10k">Under $10,000</SelectItem>
              <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
              <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
              <SelectItem value="over50k">Over $50,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Vehicle Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-16">
            <Car className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No vehicles found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map(vehicle => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onPurchase={() => { setSelectedVehicle(vehicle); setShowPurchaseModal(true); }}
                onRent={() => { setSelectedVehicle(vehicle); setShowRentalModal(true); }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );

  // Rentals Section
  const RentalsSection = () => (
    <section id="rentals" className="min-h-screen bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white text-center mb-4">Vehicle Rentals</h2>
        <p className="text-gray-400 text-center mb-12">Flexible rental options for your needs</p>
        
        {rentalVehicles.length === 0 ? (
          <div className="text-center py-16">
            <Car className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No rental vehicles available at this time</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentalVehicles.map(vehicle => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onRent={() => { setSelectedVehicle(vehicle); setShowRentalModal(true); }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );

  // Reviews Section
  const ReviewsSection = () => (
    <section id="reviews" className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white text-center mb-4">Customer Reviews</h2>
        <p className="text-gray-400 text-center mb-8">See what our customers have to say</p>
        
        <div className="text-center mb-12">
          <Button onClick={() => setShowReviewModal(true)} className="bg-red-600 hover:bg-red-700">
            <Star className="h-4 w-4 mr-2" />
            Leave Us a Review
          </Button>
        </div>
        
        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No reviews yet. Be the first to leave one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(review => (
              <Card key={review.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">&ldquo;{review.text}&rdquo;</p>
                  <p className="text-gray-500 text-sm">- {review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );

  // Contact Section
  const ContactSection = () => (
    <section id="contact" className="min-h-screen bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white text-center mb-4">Contact Us</h2>
        <p className="text-gray-400 text-center mb-12">Get in touch with our team</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Business Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-red-500 mt-1" />
                    <div>
                      <p className="text-white font-medium">Address</p>
                      <p className="text-gray-400">{BUSINESS_INFO.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-red-500 mt-1" />
                    <div>
                      <p className="text-white font-medium">Phone</p>
                      <a href={`tel:${BUSINESS_INFO.phone}`} className="text-gray-400 hover:text-red-500">{BUSINESS_INFO.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-red-500 mt-1" />
                    <div>
                      <p className="text-white font-medium">Email</p>
                      <a href={`mailto:${BUSINESS_INFO.email}`} className="text-gray-400 hover:text-red-500">{BUSINESS_INFO.email}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-red-500 mt-1" />
                    <div>
                      <p className="text-white font-medium">Business Hours</p>
                      <p className="text-gray-400">{BUSINESS_INFO.hours}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Google Maps */}
            <div className="rounded-lg overflow-hidden h-64 bg-gray-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3442.1!2d-92.0169!3d30.2241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86249d0c5f8b5b5b%3A0x5b5b5b5b5b5b5b5b!2s815%20SW%20Evangeline%20Thruway%2C%20Lafayette%2C%20LA%2070501!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          
          {/* Contact Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Name *</Label>
                <Input id="name" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-300">Phone *</Label>
                <Input id="phone" value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input id="email" type="email" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
              </div>
              <div>
                <Label className="text-gray-300">Vehicle Interested In</Label>
                <Select value={contactForm.vehicleId} onValueChange={v => setContactForm({ ...contactForm, vehicleId: v })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select a vehicle (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {vehicles.map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.year} {v.make} {v.model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="message" className="text-gray-300">Message *</Label>
                <Textarea id="message" value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} rows={4} className="bg-gray-700 border-gray-600 text-white" />
              </div>
              <Button onClick={handleContactSubmit} className="w-full bg-red-600 hover:bg-red-700">Send Message</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );

  // Footer
  const Footer = () => (
    <footer className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Car className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold text-white">{BUSINESS_INFO.name}</span>
            </div>
            <p className="text-gray-400 mb-4">Quality pre-owned vehicles with flexible rental and purchase options. Serving Lafayette, LA and surrounding areas.</p>
            <p className="text-gray-500 text-sm">{BUSINESS_INFO.address}</p>
            <p className="text-gray-500 text-sm">{BUSINESS_INFO.phone}</p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['home', 'inventory', 'rentals', 'reviews', 'contact'].map(section => (
                <li key={section}>
                  <button onClick={() => setActiveSection(section)} className="text-gray-400 hover:text-red-500 transition-colors">
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p className="text-gray-400 text-sm">{BUSINESS_INFO.hours}</p>
            <a href={`tel:${BUSINESS_INFO.phone}`} className="text-red-500 hover:text-red-400 block mt-2">{BUSINESS_INFO.phone}</a>
            <a href={`mailto:${BUSINESS_INFO.email}`} className="text-red-500 hover:text-red-400 block">{BUSINESS_INFO.email}</a>
          </div>
        </div>
        
        <Separator className="my-8 bg-gray-800" />
        
        <div className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );

  // Admin Dashboard
  const AdminDashboard = () => {
    const [allReviews, setAllReviews] = useState<Review[]>([]);
    
    useEffect(() => {
      const fetchAllReviews = async () => {
        try {
          const res = await fetch('/api/reviews');
          const data = await res.json();
          setAllReviews(data);
        } catch (error) {
          console.error('Failed to fetch all reviews');
        }
      };
      if (isAdmin) fetchAllReviews();
    }, [isAdmin]);

    return (
      <Dialog open={isAdmin} onOpenChange={setIsAdmin}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl">Admin Dashboard</DialogTitle>
          </DialogHeader>
          
          <Tabs value={adminTab} onValueChange={setAdminTab} className="w-full">
            <TabsList className="bg-gray-800 w-full justify-start flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="vehicles" className="data-[state=active]:bg-red-600">Vehicles</TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-red-600">Reviews</TabsTrigger>
              <TabsTrigger value="inquiries" className="data-[state=active]:bg-red-600">Inquiries</TabsTrigger>
              <TabsTrigger value="rentals" className="data-[state=active]:bg-red-600">Rentals</TabsTrigger>
              <TabsTrigger value="purchases" className="data-[state=active]:bg-red-600">Purchases</TabsTrigger>
              <TabsTrigger value="wholesale" className="data-[state=active]:bg-red-600">Wholesale</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[60vh] mt-4">
              {/* Vehicles Tab */}
              <TabsContent value="vehicles" className="mt-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-lg font-semibold">Manage Vehicles</h3>
                  <Button onClick={() => { setShowVehicleForm(true); setEditingVehicle(null); }} className="bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" /> Add Vehicle
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {vehicles.map(vehicle => (
                    <Card key={vehicle.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-700 rounded flex-shrink-0 overflow-hidden">
                          {parseImages(vehicle.images)[0] ? (
                            <img src={parseImages(vehicle.images)[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Car className="h-8 w-8 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                          <p className="text-gray-400 text-sm">{formatPrice(vehicle.price)} • {formatMileage(vehicle.mileage)} miles</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="border-gray-600 text-gray-300">{vehicle.status}</Badge>
                            {vehicle.featured && <Badge className="bg-red-500">Featured</Badge>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-gray-600 text-gray-300" onClick={() => {
                            setEditingVehicle(vehicle);
                            setVehicleForm({
                              year: vehicle.year.toString(),
                              make: vehicle.make,
                              model: vehicle.model,
                              trim: vehicle.trim || '',
                              price: vehicle.price.toString(),
                              mileage: vehicle.mileage.toString(),
                              color: vehicle.color,
                              vin: vehicle.vin || '',
                              engine: vehicle.engine || '',
                              transmission: vehicle.transmission || '',
                              fuelType: vehicle.fuelType || '',
                              condition: vehicle.condition || '',
                              vehicleType: vehicle.vehicleType,
                              status: vehicle.status,
                              dailyRate: vehicle.dailyRate?.toString() || '',
                              weeklyRate: vehicle.weeklyRate?.toString() || '',
                              featured: vehicle.featured,
                              images: parseImages(vehicle.images),
                              description: vehicle.description || ''
                            });
                            setShowVehicleForm(true);
                          }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteVehicle(vehicle.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-0">
                <h3 className="text-white text-lg font-semibold mb-4">Review Moderation</h3>
                <div className="grid gap-4">
                  {allReviews.map(review => (
                    <Card key={review.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} />
                                ))}
                              </div>
                              <Badge variant={review.status === 'approved' ? 'default' : 'secondary'} className={review.status === 'approved' ? 'bg-green-600' : 'bg-yellow-600'}>
                                {review.status}
                              </Badge>
                            </div>
                            <p className="text-gray-300">&ldquo;{review.text}&rdquo;</p>
                            <p className="text-gray-500 text-sm mt-2">- {review.name} • {new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-2">
                            {review.status === 'pending' && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveReview(review.id)}>
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteReview(review.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Inquiries Tab */}
              <TabsContent value="inquiries" className="mt-0">
                <h3 className="text-white text-lg font-semibold mb-4">Contact Inquiries</h3>
                <div className="grid gap-4">
                  {inquiries.map(inquiry => (
                    <Card key={inquiry.id} className={`bg-gray-800 border-gray-700 ${!inquiry.read ? 'border-l-4 border-l-red-500' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-medium">{inquiry.name}</p>
                            <p className="text-gray-400 text-sm">{inquiry.phone} {inquiry.email && `• ${inquiry.email}`}</p>
                            {inquiry.vehicle && (
                              <p className="text-red-500 text-sm mt-1">Interested in: {inquiry.vehicle.year} {inquiry.vehicle.make} {inquiry.vehicle.model}</p>
                            )}
                            <p className="text-gray-300 mt-2">{inquiry.message}</p>
                            <p className="text-gray-500 text-sm mt-2">{new Date(inquiry.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-gray-600 text-gray-300" onClick={() => handleMarkInquiryRead(inquiry.id, !inquiry.read)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteInquiry(inquiry.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Rentals Tab */}
              <TabsContent value="rentals" className="mt-0">
                <h3 className="text-white text-lg font-semibold mb-4">Rental Applications</h3>
                <div className="grid gap-4">
                  {rentalApps.map(app => (
                    <Card key={app.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="text-white font-medium">{app.customerName}</p>
                              <Badge variant={app.status === 'approved' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'} className={app.status === 'approved' ? 'bg-green-600' : app.status === 'pending' ? 'bg-yellow-600' : ''}>
                                {app.status}
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-sm">{app.customerPhone} • {app.customerEmail}</p>
                            {app.vehicle && (
                              <p className="text-red-500 text-sm mt-1">Vehicle: {app.vehicle.year} {app.vehicle.make} {app.vehicle.model}</p>
                            )}
                            <p className="text-gray-400 text-sm mt-1">Dates: {app.startDate} to {app.endDate}</p>
                            <p className="text-gray-400 text-sm">Insurance: {app.hasInsurance ? 'Customer Provided' : `Dealer Insurance - $${app.dealerInsurance}`}</p>
                            <p className="text-gray-500 text-sm mt-2">{new Date(app.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2">
                            {app.status === 'pending' && (
                              <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleRentalStatus(app.id, 'approved')}>
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleRentalStatus(app.id, 'rejected')}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Purchases Tab */}
              <TabsContent value="purchases" className="mt-0">
                <h3 className="text-white text-lg font-semibold mb-4">Purchase Applications</h3>
                <div className="grid gap-4">
                  {purchaseApps.map(app => (
                    <Card key={app.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <p className="text-white font-medium">{app.customerName}</p>
                              <Badge variant={app.status === 'approved' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'} className={app.status === 'approved' ? 'bg-green-600' : app.status === 'pending' ? 'bg-yellow-600' : ''}>
                                {app.status}
                              </Badge>
                            </div>
                            <p className="text-gray-400 text-sm">{app.customerPhone} • {app.customerEmail}</p>
                            <p className="text-gray-400 text-sm">{app.customerAddress}</p>
                            {app.vehicle && (
                              <p className="text-red-500 text-sm mt-1">Vehicle: {app.vehicle.year} {app.vehicle.make} {app.vehicle.model} - {formatPrice(app.vehicle.price)}</p>
                            )}
                            <p className="text-gray-500 text-sm mt-2">{new Date(app.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* Wholesale Tab */}
              <TabsContent value="wholesale" className="mt-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white text-lg font-semibold">Wholesale & Auctions (Within 250 miles of Lafayette, LA)</h3>
                </div>
                
                <Card className="bg-gray-800 border-gray-700 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Add Wholesale Vehicle</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-gray-300">Year</Label>
                      <Input value={wholesaleForm.year} onChange={e => setWholesaleForm({ ...wholesaleForm, year: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Make</Label>
                      <Input value={wholesaleForm.make} onChange={e => setWholesaleForm({ ...wholesaleForm, make: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Model</Label>
                      <Input value={wholesaleForm.model} onChange={e => setWholesaleForm({ ...wholesaleForm, model: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Price</Label>
                      <Input value={wholesaleForm.price} onChange={e => setWholesaleForm({ ...wholesaleForm, price: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Mileage</Label>
                      <Input value={wholesaleForm.mileage} onChange={e => setWholesaleForm({ ...wholesaleForm, mileage: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Location</Label>
                      <Input value={wholesaleForm.location} onChange={e => setWholesaleForm({ ...wholesaleForm, location: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Radius (miles)</Label>
                      <Input value={wholesaleForm.radius} onChange={e => setWholesaleForm({ ...wholesaleForm, radius: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label className="text-gray-300">Description</Label>
                      <Input value={wholesaleForm.description} onChange={e => setWholesaleForm({ ...wholesaleForm, description: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div className="col-span-2">
                      <Button onClick={handleWholesaleSubmit} className="w-full bg-red-600 hover:bg-red-700">Add Wholesale Vehicle</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid gap-4">
                  {wholesaleVehicles.map(vehicle => (
                    <Card key={vehicle.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-white font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                          <p className="text-gray-400 text-sm">{formatPrice(vehicle.price)} • {formatMileage(vehicle.mileage)} miles</p>
                          <p className="text-gray-400 text-sm">{vehicle.location} ({vehicle.radius} miles from Lafayette)</p>
                        </div>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteWholesale(vehicle.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  };

  // Vehicle Form Modal
  const VehicleFormModal = () => (
    <Dialog open={showVehicleForm} onOpenChange={setShowVehicleForm}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Year *</Label>
            <Input value={vehicleForm.year} onChange={e => setVehicleForm({ ...vehicleForm, year: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">Make *</Label>
            <Input value={vehicleForm.make} onChange={e => setVehicleForm({ ...vehicleForm, make: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">Model *</Label>
            <Input value={vehicleForm.model} onChange={e => setVehicleForm({ ...vehicleForm, model: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">Trim</Label>
            <Input value={vehicleForm.trim} onChange={e => setVehicleForm({ ...vehicleForm, trim: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">Price *</Label>
            <Input type="number" value={vehicleForm.price} onChange={e => setVehicleForm({ ...vehicleForm, price: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">Mileage *</Label>
            <Input type="number" value={vehicleForm.mileage} onChange={e => setVehicleForm({ ...vehicleForm, mileage: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">Color *</Label>
            <Input value={vehicleForm.color} onChange={e => setVehicleForm({ ...vehicleForm, color: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">VIN</Label>
            <Input value={vehicleForm.vin} onChange={e => setVehicleForm({ ...vehicleForm, vin: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">Engine</Label>
            <Input value={vehicleForm.engine} onChange={e => setVehicleForm({ ...vehicleForm, engine: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">Transmission</Label>
            <Input value={vehicleForm.transmission} onChange={e => setVehicleForm({ ...vehicleForm, transmission: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">Fuel Type</Label>
            <Input value={vehicleForm.fuelType} onChange={e => setVehicleForm({ ...vehicleForm, fuelType: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">Condition</Label>
            <Select value={vehicleForm.condition} onValueChange={v => setVehicleForm({ ...vehicleForm, condition: v })}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-300">Vehicle Type *</Label>
            <Select value={vehicleForm.vehicleType} onValueChange={v => setVehicleForm({ ...vehicleForm, vehicleType: v })}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="Sedan">Sedan</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Truck">Truck</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Van">Van</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-300">Status *</Label>
            <Select value={vehicleForm.status} onValueChange={v => setVehicleForm({ ...vehicleForm, status: v })}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="For Sale">For Sale</SelectItem>
                <SelectItem value="For Rent">For Rent</SelectItem>
                <SelectItem value="Both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(vehicleForm.status === 'For Rent' || vehicleForm.status === 'Both') && (
            <>
              <div>
                <Label className="text-gray-300">Daily Rate</Label>
                <Input type="number" value={vehicleForm.dailyRate} onChange={e => setVehicleForm({ ...vehicleForm, dailyRate: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
              </div>
              <div>
                <Label className="text-gray-300">Weekly Rate</Label>
                <Input type="number" value={vehicleForm.weeklyRate} onChange={e => setVehicleForm({ ...vehicleForm, weeklyRate: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
              </div>
            </>
          )}
          <div className="col-span-2">
            <Label className="text-gray-300">Description</Label>
            <Textarea value={vehicleForm.description} onChange={e => setVehicleForm({ ...vehicleForm, description: e.target.value })} className="bg-gray-700 border-gray-600 text-white" rows={3} />
          </div>
          <div className="col-span-2 flex items-center space-x-2">
            <Checkbox id="featured" checked={vehicleForm.featured} onCheckedChange={c => setVehicleForm({ ...vehicleForm, featured: !!c })} />
            <Label htmlFor="featured" className="text-gray-300">Featured Vehicle</Label>
          </div>
          
          {/* Image Upload Section */}
          <div className="col-span-2 border-t border-gray-700 pt-4">
            <Label className="text-gray-300 block mb-2">Vehicle Images</Label>
            <div className="flex gap-2 mb-4">
              <Button type="button" variant="outline" className="border-gray-600 text-gray-300" onClick={() => document.getElementById('imageUpload')?.click()}>
                <Upload className="h-4 w-4 mr-2" /> Upload Images
              </Button>
              <Button type="button" variant="outline" className="border-gray-600 text-gray-300" onClick={generateVehicleImage}>
                <ImageIcon className="h-4 w-4 mr-2" /> Generate with AI
              </Button>
              <input id="imageUpload" type="file" multiple accept="image/*" className="hidden" onChange={e => handleImageUpload(e)} />
            </div>
            <div className="flex flex-wrap gap-2">
              {vehicleForm.images.map((img, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={img} alt="" className="w-full h-full object-cover rounded" />
                  <button type="button" className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5" onClick={() => setVehicleForm({ ...vehicleForm, images: vehicleForm.images.filter((_, idx) => idx !== i) })}>
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => { setShowVehicleForm(false); setEditingVehicle(null); }} className="border-gray-600 text-gray-300">Cancel</Button>
          <Button onClick={editingVehicle ? handleUpdateVehicle : handleAddVehicle} className="bg-red-600 hover:bg-red-700">
            {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Purchase Modal
  const PurchaseModal = () => {
    if (!selectedVehicle) return null;
    
    const agreementText = PURCHASE_AGREEMENT
      .replace('[Customer Name]', purchaseForm.customerName || '___________')
      .replace('[Customer Address]', purchaseForm.customerAddress || '___________')
      .replace('[Customer Phone]', purchaseForm.customerPhone || '___________')
      .replace('[Customer Email]', purchaseForm.customerEmail || '___________')
      .replace('[Year]', selectedVehicle.year.toString())
      .replace('[Make]', selectedVehicle.make)
      .replace('[Model]', selectedVehicle.model)
      .replace('[VIN]', selectedVehicle.vin || 'N/A')
      .replace('[Mileage]', formatMileage(selectedVehicle.mileage))
      .replace('[Color]', selectedVehicle.color)
      .replace('[Price]', formatPrice(selectedVehicle.price));
    
    return (
      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Purchase Application</DialogTitle>
            <DialogDescription className="text-gray-400">
              Complete the form below to apply for purchasing this vehicle
            </DialogDescription>
          </DialogHeader>
          
          {/* Vehicle Info */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 flex gap-4">
              <div className="w-24 h-24 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                {parseImages(selectedVehicle.images)[0] ? (
                  <img src={parseImages(selectedVehicle.images)[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Car className="h-8 w-8 text-gray-500" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-white font-semibold">{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</h3>
                <p className="text-gray-400 text-sm">{selectedVehicle.trim}</p>
                <p className="text-red-500 font-bold text-xl mt-1">{formatPrice(selectedVehicle.price)}</p>
                <p className="text-gray-400 text-sm">{formatMileage(selectedVehicle.mileage)} miles • {selectedVehicle.color}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Customer Form */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Full Name *</Label>
              <Input value={purchaseForm.customerName} onChange={e => setPurchaseForm({ ...purchaseForm, customerName: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">Phone *</Label>
              <Input value={purchaseForm.customerPhone} onChange={e => setPurchaseForm({ ...purchaseForm, customerPhone: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">Email</Label>
              <Input type="email" value={purchaseForm.customerEmail} onChange={e => setPurchaseForm({ ...purchaseForm, customerEmail: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">Address *</Label>
              <Input value={purchaseForm.customerAddress} onChange={e => setPurchaseForm({ ...purchaseForm, customerAddress: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
            </div>
          </div>
          
          {/* Agreement */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto">
            <pre className="text-gray-300 text-xs whitespace-pre-wrap font-mono">{agreementText}</pre>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="agreePurchase" checked={purchaseForm.agreedToTerms} onCheckedChange={c => setPurchaseForm({ ...purchaseForm, agreedToTerms: !!c })} />
            <Label htmlFor="agreePurchase" className="text-gray-300 text-sm">I have read and agree to the Purchase Agreement above</Label>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPurchaseModal(false)} className="border-gray-600 text-gray-300">Cancel</Button>
            <Button onClick={handlePurchaseSubmit} disabled={!purchaseForm.agreedToTerms || !purchaseForm.customerName || !purchaseForm.customerPhone || !purchaseForm.customerAddress} className="bg-red-600 hover:bg-red-700">
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Rental Modal
  const RentalModal = () => {
    if (!selectedVehicle) return null;
    
    const agreementText = RENTAL_AGREEMENT
      .replace('[Customer Name]', rentalForm.customerName || '___________')
      .replace('[Customer Address]', rentalForm.customerAddress || '___________')
      .replace('[Customer Phone]', rentalForm.customerPhone || '___________')
      .replace('[Customer Email]', rentalForm.customerEmail || '___________')
      .replace('[DL Number]', rentalForm.driverLicense || '___________')
      .replace('[Year]', selectedVehicle.year.toString())
      .replace('[Make]', selectedVehicle.make)
      .replace('[Model]', selectedVehicle.model)
      .replace('[VIN]', selectedVehicle.vin || 'N/A')
      .replace('[Mileage]', formatMileage(selectedVehicle.mileage))
      .replace('[Color]', selectedVehicle.color)
      .replace('[Start Date]', rentalForm.startDate || '___________')
      .replace('[End Date]', rentalForm.endDate || '___________')
      .replace('[Daily Rate]', selectedVehicle.dailyRate?.toString() || 'N/A')
      .replace('[Weekly Rate]', selectedVehicle.weeklyRate?.toString() || 'N/A')
      .replace('[Deposit Amount]', '500')
      .replace('[Insurance details]', rentalForm.hasInsurance ? 'Customer provides valid insurance' : `Dealer insurance at $${rentalForm.dealerInsurance || '0'}/day`);
    
    return (
      <Dialog open={showRentalModal} onOpenChange={setShowRentalModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Rental Application</DialogTitle>
            <DialogDescription className="text-gray-400">
              Complete the form below to apply for renting this vehicle
            </DialogDescription>
          </DialogHeader>
          
          {/* Vehicle Info */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 flex gap-4">
              <div className="w-24 h-24 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                {parseImages(selectedVehicle.images)[0] ? (
                  <img src={parseImages(selectedVehicle.images)[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Car className="h-8 w-8 text-gray-500" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-white font-semibold">{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</h3>
                <p className="text-gray-400 text-sm">{selectedVehicle.trim}</p>
                {selectedVehicle.dailyRate && <p className="text-green-500 font-bold">${selectedVehicle.dailyRate}/day • ${selectedVehicle.weeklyRate}/week</p>}
                <p className="text-gray-400 text-sm">{formatMileage(selectedVehicle.mileage)} miles • {selectedVehicle.color}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Customer Form */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Full Name *</Label>
              <Input value={rentalForm.customerName} onChange={e => setRentalForm({ ...rentalForm, customerName: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">Phone *</Label>
              <Input value={rentalForm.customerPhone} onChange={e => setRentalForm({ ...rentalForm, customerPhone: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">Email *</Label>
              <Input type="email" value={rentalForm.customerEmail} onChange={e => setRentalForm({ ...rentalForm, customerEmail: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">Driver License # *</Label>
              <Input value={rentalForm.driverLicense} onChange={e => setRentalForm({ ...rentalForm, driverLicense: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div className="col-span-2">
              <Label className="text-gray-300">Address *</Label>
              <Input value={rentalForm.customerAddress} onChange={e => setRentalForm({ ...rentalForm, customerAddress: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">Start Date *</Label>
              <Input type="date" value={rentalForm.startDate} onChange={e => setRentalForm({ ...rentalForm, startDate: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label className="text-gray-300">End Date *</Label>
              <Input type="date" value={rentalForm.endDate} onChange={e => setRentalForm({ ...rentalForm, endDate: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
            </div>
          </div>
          
          {/* Insurance Section */}
          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
            <h4 className="text-white font-medium mb-3">Insurance Options</h4>
            <p className="text-gray-400 text-sm mb-3">Per Louisiana law, rental vehicles must be covered by valid insurance.</p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="hasInsurance" checked={rentalForm.hasInsurance} onCheckedChange={c => setRentalForm({ ...rentalForm, hasInsurance: !!c, dealerInsurance: '' })} />
                <Label htmlFor="hasInsurance" className="text-gray-300">I have my own insurance (upload proof below)</Label>
              </div>
              
              {rentalForm.hasInsurance && (
                <div>
                  <Label className="text-gray-300 text-sm">Upload Proof of Insurance</Label>
                  <Input type="file" accept="image/*,.pdf" className="bg-gray-700 border-gray-600 text-white mt-1" onChange={e => {
                    // Handle file upload - for now just store filename
                    if (e.target.files?.[0]) {
                      setRentalForm({ ...rentalForm, insuranceDoc: e.target.files[0].name });
                    }
                  }} />
                </div>
              )}
              
              {!rentalForm.hasInsurance && (
                <div className="mt-3 p-3 bg-gray-700 rounded">
                  <p className="text-gray-300 text-sm mb-2">Dealer-Provided Insurance</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <Input type="number" value={rentalForm.dealerInsurance} onChange={e => setRentalForm({ ...rentalForm, dealerInsurance: e.target.value })} placeholder="Enter daily insurance cost" className="bg-gray-600 border-gray-500 text-white" />
                    <span className="text-gray-400 text-sm">/day</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Agreement */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto">
            <pre className="text-gray-300 text-xs whitespace-pre-wrap font-mono">{agreementText}</pre>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="agreeRental" checked={rentalForm.agreedToTerms} onCheckedChange={c => setRentalForm({ ...rentalForm, agreedToTerms: !!c })} />
            <Label htmlFor="agreeRental" className="text-gray-300 text-sm">I have read and agree to the Rental Agreement above</Label>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRentalModal(false)} className="border-gray-600 text-gray-300">Cancel</Button>
            <Button 
              onClick={handleRentalSubmit} 
              disabled={!rentalForm.agreedToTerms || !rentalForm.customerName || !rentalForm.customerPhone || !rentalForm.customerEmail || !rentalForm.customerAddress || !rentalForm.startDate || !rentalForm.endDate || (!rentalForm.hasInsurance && !rentalForm.dealerInsurance)} 
              className="bg-green-600 hover:bg-green-700"
            >
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Review Modal
  const ReviewModal = () => (
    <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Leave a Review</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-gray-300">Your Name</Label>
            <Input value={reviewForm.name} onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })} className="bg-gray-700 border-gray-600 text-white" />
          </div>
          <div>
            <Label className="text-gray-300">Rating</Label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} onClick={() => setReviewForm({ ...reviewForm, rating: i })}>
                  <Star className={`h-8 w-8 ${i <= reviewForm.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-gray-300">Your Review</Label>
            <Textarea value={reviewForm.text} onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })} rows={4} className="bg-gray-700 border-gray-600 text-white" />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowReviewModal(false)} className="border-gray-600 text-gray-300">Cancel</Button>
          <Button onClick={handleReviewSubmit} disabled={!reviewForm.name || !reviewForm.text} className="bg-red-600 hover:bg-red-700">Submit Review</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="pt-16">
        {activeSection === 'home' && (
          <>
            <HeroSection />
            <FeaturedSection />
          </>
        )}
        {activeSection === 'inventory' && <InventorySection />}
        {activeSection === 'rentals' && <RentalsSection />}
        {activeSection === 'reviews' && <ReviewsSection />}
        {activeSection === 'contact' && <ContactSection />}
      </main>
      
      <Footer />
      
      {/* Modals */}
      <AdminDashboard />
      <VehicleFormModal />
      <PurchaseModal />
      <RentalModal />
      <ReviewModal />
    </div>
  );
}
