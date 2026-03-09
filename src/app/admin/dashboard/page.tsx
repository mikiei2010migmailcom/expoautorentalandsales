'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Car, Star, Plus, Edit, Trash2, Eye, Check, Upload, Image as ImageIcon, LogOut, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
const formatMileage = (mileage: number) => new Intl.NumberFormat('en-US').format(mileage);
const parseImages = (imagesStr: string) => { try { return JSON.parse(imagesStr); } catch { return []; } };

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminTab, setAdminTab] = useState('vehicles');
  
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [rentalApps, setRentalApps] = useState<any[]>([]);
  const [purchaseApps, setPurchaseApps] = useState<any[]>([]);
  const [wholesaleVehicles, setWholesaleVehicles] = useState<any[]>([]);
  
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  
  const [vehicleForm, setVehicleForm] = useState({
    year: '', make: '', model: '', trim: '', price: '', mileage: '', color: '',
    vin: '', engine: '', transmission: '', fuelType: '', condition: '',
    vehicleType: 'Sedan', status: 'For Sale', dailyRate: '', weeklyRate: '',
    featured: false, images: [] as string[], description: ''
  });
  const [wholesaleForm, setWholesaleForm] = useState({
    year: '', make: '', model: '', price: '', mileage: '', location: '',
    radius: '250', images: [] as string[], description: ''
  });
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth');
        const data = await res.json();
        if (data.authenticated) {
          setAuthenticated(true);
          fetchData();
        } else {
          router.push('/admin');
        }
      } catch {
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const fetchData = async () => {
    try {
      const [vRes, rRes, iRes, rentRes, purRes, wRes] = await Promise.all([
        fetch('/api/vehicles'), fetch('/api/reviews'), fetch('/api/contact'),
        fetch('/api/rentals'), fetch('/api/purchases'), fetch('/api/wholesale')
      ]);
      setVehicles(await vRes.json());
      setAllReviews(await rRes.json());
      setInquiries(await iRes.json());
      setRentalApps(await rentRes.json());
      setPurchaseApps(await purRes.json());
      setWholesaleVehicles(await wRes.json());
    } catch { toast.error('Failed to load data'); }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) });
    router.push('/admin');
  };

  const handleAddVehicle = async () => {
    try {
      const res = await fetch('/api/vehicles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(vehicleForm) });
      if (res.ok) { toast.success('Vehicle added'); setShowVehicleForm(false); setVehicleForm({ year: '', make: '', model: '', trim: '', price: '', mileage: '', color: '', vin: '', engine: '', transmission: '', fuelType: '', condition: '', vehicleType: 'Sedan', status: 'For Sale', dailyRate: '', weeklyRate: '', featured: false, images: [], description: '' }); fetchData(); }
      else { toast.error('Failed to add'); }
    } catch { toast.error('Failed to add'); }
  };

  const handleUpdateVehicle = async () => {
    if (!editingVehicle) return;
    try {
      const res = await fetch(`/api/vehicles/${editingVehicle.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(vehicleForm) });
      if (res.ok) { toast.success('Vehicle updated'); setEditingVehicle(null); setShowVehicleForm(false); fetchData(); }
      else { toast.error('Failed to update'); }
    } catch { toast.error('Failed to update'); }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Delete this vehicle?')) return;
    try { const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' }); if (res.ok) { toast.success('Deleted'); fetchData(); } } catch { toast.error('Failed'); }
  };

  const handleApproveReview = async (id: string) => {
    try { const res = await fetch(`/api/reviews/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'approved' }) }); if (res.ok) { toast.success('Approved'); fetchData(); } } catch { toast.error('Failed'); }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try { await fetch(`/api/reviews/${id}`, { method: 'DELETE' }); toast.success('Deleted'); fetchData(); } catch { toast.error('Failed'); }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Delete?')) return;
    try { await fetch(`/api/contact/${id}`, { method: 'DELETE' }); toast.success('Deleted'); fetchData(); } catch { toast.error('Failed'); }
  };

  const handleMarkInquiryRead = async (id: string, read: boolean) => {
    try { await fetch(`/api/contact/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ read }) }); fetchData(); } catch { }
  };

  const handleRentalStatus = async (id: string, status: string) => {
    try { await fetch(`/api/rentals/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); toast.success(`Application ${status}`); fetchData(); } catch { toast.error('Failed'); }
  };

  const handleDeleteWholesale = async (id: string) => {
    if (!confirm('Delete?')) return;
    try { await fetch(`/api/wholesale/${id}`, { method: 'DELETE' }); toast.success('Deleted'); fetchData(); } catch { toast.error('Failed'); }
  };

  const handleWholesaleSubmit = async () => {
    try { const res = await fetch('/api/wholesale', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(wholesaleForm) }); if (res.ok) { toast.success('Added'); setWholesaleForm({ year: '', make: '', model: '', price: '', mileage: '', location: '', radius: '250', images: [], description: '' }); fetchData(); } } catch { toast.error('Failed'); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files) return;
    const formData = new FormData(); Array.from(files).forEach(file => formData.append('files', file));
    try { const res = await fetch('/api/upload', { method: 'POST', body: formData }); const data = await res.json(); if (data.urls) { setVehicleForm(prev => ({ ...prev, images: [...prev.images, ...data.urls] })); toast.success('Uploaded'); } } catch { toast.error('Failed'); }
  };

  const generateVehicleImage = async () => {
    if (!vehicleForm.year || !vehicleForm.make || !vehicleForm.model) { toast.error('Fill Year, Make, Model first'); return; }
    setIsGeneratingImage(true);
    try {
      const res = await fetch('/api/generate-image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: `${vehicleForm.year} ${vehicleForm.make} ${vehicleForm.model} car exterior professional photo` }) });
      const data = await res.json();
      if (data.url) { setVehicleForm(prev => ({ ...prev, images: [...prev.images, data.url] })); toast.success('Generated!'); }
      else { toast.error(data.error || 'Failed'); }
    } catch { toast.error('Failed'); }
    finally { setIsGeneratingImage(false); }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-red-500" /></div>;
  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Car className="h-8 w-8 text-red-500" />
            <div><h1 className="text-white font-bold text-lg">Admin Dashboard</h1><p className="text-gray-500 text-sm">Top Auto Rental & Sales</p></div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-gray-700 text-gray-300"><LogOut className="h-4 w-4 mr-2" /> Logout</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={adminTab} onValueChange={setAdminTab}>
          <TabsList className="bg-gray-800 w-full justify-start flex-wrap h-auto gap-1 p-1 mb-6">
            <TabsTrigger value="vehicles" className="data-[state=active]:bg-red-600">Vehicles ({vehicles.length})</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-red-600">Reviews ({allReviews.length})</TabsTrigger>
            <TabsTrigger value="inquiries" className="data-[state=active]:bg-red-600">Inquiries ({inquiries.length})</TabsTrigger>
            <TabsTrigger value="rentals" className="data-[state=active]:bg-red-600">Rentals ({rentalApps.length})</TabsTrigger>
            <TabsTrigger value="purchases" className="data-[state=active]:bg-red-600">Purchases ({purchaseApps.length})</TabsTrigger>
            <TabsTrigger value="wholesale" className="data-[state=active]:bg-red-600">Wholesale</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-semibold">Manage Vehicles</h2>
              <Button onClick={() => { setShowVehicleForm(true); setEditingVehicle(null); }} className="bg-red-600 hover:bg-red-700"><Plus className="h-4 w-4 mr-2" /> Add Vehicle</Button>
            </div>
            <div className="grid gap-4">
              {vehicles.map(vehicle => (
                <Card key={vehicle.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-700 rounded flex-shrink-0 overflow-hidden">
                      {parseImages(vehicle.images)[0] ? <img src={parseImages(vehicle.images)[0]} alt="" className="w-full h-full object-cover" /> : <Car className="h-8 w-8 text-gray-500 m-auto mt-6" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                      <p className="text-gray-400 text-sm">{formatPrice(vehicle.price)} • {formatMileage(vehicle.mileage)} miles</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="border-gray-600 text-gray-300">{vehicle.status}</Badge>
                        {vehicle.featured && <Badge className="bg-red-500">Featured</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300" onClick={() => { setEditingVehicle(vehicle); setVehicleForm({ year: vehicle.year.toString(), make: vehicle.make, model: vehicle.model, trim: vehicle.trim || '', price: vehicle.price.toString(), mileage: vehicle.mileage.toString(), color: vehicle.color, vin: vehicle.vin || '', engine: vehicle.engine || '', transmission: vehicle.transmission || '', fuelType: vehicle.fuelType || '', condition: vehicle.condition || '', vehicleType: vehicle.vehicleType, status: vehicle.status, dailyRate: vehicle.dailyRate?.toString() || '', weeklyRate: vehicle.weeklyRate?.toString() || '', featured: vehicle.featured, images: parseImages(vehicle.images), description: vehicle.description || '' }); setShowVehicleForm(true); }}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteVehicle(vehicle.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <h2 className="text-white text-xl font-semibold mb-4">Review Moderation</h2>
            <div className="grid gap-4">
              {allReviews.map(review => (
                <Card key={review.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} />)}</div>
                          <Badge className={review.status === 'approved' ? 'bg-green-600' : 'bg-yellow-600'}>{review.status}</Badge>
                        </div>
                        <p className="text-gray-300">"{review.text}"</p>
                        <p className="text-gray-500 text-sm mt-2">- {review.name}</p>
                      </div>
                      <div className="flex gap-2">
                        {review.status === 'pending' && <Button size="sm" className="bg-green-600" onClick={() => handleApproveReview(review.id)}><Check className="h-4 w-4" /></Button>}
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteReview(review.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inquiries">
            <h2 className="text-white text-xl font-semibold mb-4">Contact Inquiries</h2>
            <div className="grid gap-4">
              {inquiries.map(inquiry => (
                <Card key={inquiry.id} className={`bg-gray-800 border-gray-700 ${!inquiry.read ? 'border-l-4 border-l-red-500' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">{inquiry.name}</p>
                        <p className="text-gray-400 text-sm">{inquiry.phone} {inquiry.email && `• ${inquiry.email}`}</p>
                        <p className="text-gray-300 mt-2">{inquiry.message}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300" onClick={() => handleMarkInquiryRead(inquiry.id, !inquiry.read)}><Eye className="h-4 w-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteInquiry(inquiry.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rentals">
            <h2 className="text-white text-xl font-semibold mb-4">Rental Applications</h2>
            <div className="grid gap-4">
              {rentalApps.map(app => (
                <Card key={app.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">{app.customerName}</p>
                        <p className="text-gray-400 text-sm">{app.customerPhone} • {app.customerEmail}</p>
                        <p className="text-gray-400 text-sm">Dates: {app.startDate} to {app.endDate}</p>
                        <Badge className={`mt-2 ${app.status === 'approved' ? 'bg-green-600' : app.status === 'rejected' ? 'bg-red-600' : 'bg-yellow-600'}`}>{app.status}</Badge>
                      </div>
                      {app.status === 'pending' && <div className="flex gap-2"><Button size="sm" className="bg-green-600" onClick={() => handleRentalStatus(app.id, 'approved')}><Check className="h-4 w-4" /></Button><Button size="sm" variant="destructive" onClick={() => handleRentalStatus(app.id, 'rejected')}><X className="h-4 w-4" /></Button></div>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="purchases">
            <h2 className="text-white text-xl font-semibold mb-4">Purchase Applications</h2>
            <div className="grid gap-4">
              {purchaseApps.map(app => (
                <Card key={app.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <p className="text-white font-medium">{app.customerName}</p>
                    <p className="text-gray-400 text-sm">{app.customerPhone} • {app.customerEmail}</p>
                    <p className="text-gray-400 text-sm">{app.customerAddress}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="wholesale">
            <h2 className="text-white text-xl font-semibold mb-4">Wholesale Vehicles</h2>
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardHeader><CardTitle className="text-white text-base">Add Wholesale Vehicle</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><Label className="text-gray-300">Year</Label><Input value={wholesaleForm.year} onChange={e => setWholesaleForm({ ...wholesaleForm, year: e.target.value })} className="bg-gray-700 border-gray-600 text-white" /></div>
                <div><Label className="text-gray-300">Make</Label><Input value={wholesaleForm.make} onChange={e => setWholesaleForm({ ...wholesaleForm, make: e.target.value })} className="bg-gray-700 border-gray-600 text-white" /></div>
                <div><Label className="text-gray-300">Model</Label><Input value={wholesaleForm.model} onChange={e => setWholesaleForm({ ...wholesaleForm, model: e.target.value })} className="bg-gray-700 border-gray-600 text-white" /></div>
                <div><Label className="text-gray-300">Price</Label><Input value={wholesaleForm.price} onChange={e => setWholesaleForm({ ...wholesaleForm, price: e.target.value })} className="bg-gray-700 border-gray-600 text-white" /></div>
                <div><Label className="text-gray-300">Mileage</Label><Input value={wholesaleForm.mileage} onChange={e => setWholesaleForm({ ...wholesaleForm, mileage: e.target.value })} className="bg-gray-700 border-gray-600 text-white" /></div>
                <div><Label className="text-gray-300">Location</Label><Input value={wholesaleForm.location} onChange={e => setWholesaleForm({ ...wholesaleForm, location: e.target.value })} className="bg-gray-700 border-gray-600 text-white" /></div>
                <div className="col-span-2"><Button onClick={handleWholesaleSubmit} className="w-full bg-red-600 hover:bg-red-700">Add</Button></div>
              </CardContent>
            </Card>
            <div className="grid gap-4">
              {wholesaleVehicles.map(vehicle => (
                <Card key={vehicle.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-white font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                      <p className="text-gray-400 text-sm">{formatPrice(vehicle.price)} • {formatMileage(vehicle.mileage)} miles • {vehicle.location}</p>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteWholesale(vehicle.id)}><Trash2 className="h-4 w-4" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showVehicleForm} onOpenChange={setShowVehicleForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
          <DialogHeader><DialogTitle className="text-white">{editingVehicle ? 'Edit' : 'Add'} Vehicle</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); editingVehicle ? handleUpdateVehicle() : handleAddVehicle(); }}>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-gray-300">Year *</Label><Input value={vehicleForm.year} onChange={e => setVehicleForm({ ...vehicleForm, year: e.target.value })} className="bg-gray-700 border-gray-600 text-white" required /></div>
              <div><Label className="text-gray-300">Make *</Label><Input value={vehicleForm.make} onChange={e => setVehicleForm({ ...vehicleForm, make: e.target.value })} className="bg-gray-700 border-gray-600 text-white" required /></div>
              <div><Label className="text-gray-300">Model *</Label><Input value={vehicleForm.model} onChange={e => setVehicleForm({ ...vehicleForm, model: e.target.value })} className="bg-gray-700 border-gray-600 text-white" required /></div>
              <div><Label className="text-gray-300">Price *</Label><Input type="number" value={vehicleForm.price} onChange={e => setVehicleForm({ ...vehicleForm, price: e.target.value })} className="bg-gray-700 border-gray-600 text-white" required /></div>
              <div><Label className="text-gray-300">Mileage *</Label><Input type="number" value={vehicleForm.mileage} onChange={e => setVehicleForm({ ...vehicleForm, mileage: e.target.value })} className="bg-gray-700 border-gray-600 text-white" required /></div>
              <div><Label className="text-gray-300">Color *</Label><Input value={vehicleForm.color} onChange={e => setVehicleForm({ ...vehicleForm, color: e.target.value })} className="bg-gray-700 border-gray-600 text-white" required /></div>
              <div><Label className="text-gray-300">Type</Label><Select value={vehicleForm.vehicleType} onValueChange={v => setVehicleForm({ ...vehicleForm, vehicleType: v })}><SelectTrigger className="bg-gray-700 border-gray-600 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-gray-700 border-gray-600"><SelectItem value="Sedan">Sedan</SelectItem><SelectItem value="SUV">SUV</SelectItem><SelectItem value="Truck">Truck</SelectItem><SelectItem value="Sports">Sports</SelectItem></SelectContent></Select></div>
              <div><Label className="text-gray-300">Status</Label><Select value={vehicleForm.status} onValueChange={v => setVehicleForm({ ...vehicleForm, status: v })}><SelectTrigger className="bg-gray-700 border-gray-600 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-gray-700 border-gray-600"><SelectItem value="For Sale">For Sale</SelectItem><SelectItem value="For Rent">For Rent</SelectItem><SelectItem value="Both">Both</SelectItem></SelectContent></Select></div>
              <div className="col-span-2 flex items-center space-x-2"><Checkbox id="featured" checked={vehicleForm.featured} onCheckedChange={c => setVehicleForm({ ...vehicleForm, featured: !!c })} /><Label htmlFor="featured" className="text-gray-300">Featured</Label></div>
              <div className="col-span-2"><Label className="text-gray-300">Images</Label><div className="flex gap-2 mt-2"><Button type="button" variant="outline" className="border-gray-600 text-gray-300" onClick={() => document.getElementById('imageUpload')?.click()}><Upload className="h-4 w-4 mr-2" /> Upload</Button><Button type="button" variant="outline" className="border-gray-600 text-gray-300" onClick={generateVehicleImage} disabled={isGeneratingImage}>{isGeneratingImage ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ImageIcon className="h-4 w-4 mr-2" />} AI</Button><input id="imageUpload" type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} /></div><div className="flex flex-wrap gap-2 mt-2">{vehicleForm.images.map((img, i) => <div key={i} className="relative w-16 h-16"><img src={img} alt="" className="w-full h-full object-cover rounded" /><button type="button" className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5" onClick={() => setVehicleForm({ ...vehicleForm, images: vehicleForm.images.filter((_, idx) => idx !== i) })}><X className="h-3 w-3 text-white" /></button></div>)}</div></div>
            </div>
            <div className="flex justify-end gap-2 mt-4"><Button type="button" variant="outline" onClick={() => { setShowVehicleForm(false); setEditingVehicle(null); }} className="border-gray-600 text-gray-300">Cancel</Button><Button type="submit" className="bg-red-600 hover:bg-red-700">{editingVehicle ? 'Update' : 'Add'}</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
