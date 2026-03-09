'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  price: number;
  mileage: number;
  color: string;
  vin: string | null;
}

interface PurchaseAgreementModalProps {
  vehicle: Vehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PurchaseAgreementModal({
  vehicle,
  open,
  onOpenChange,
}: PurchaseAgreementModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    agreedToTerms: false,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage);
  };

  const handleSubmit = async () => {
    if (!formData.agreedToTerms) {
      toast.error('Please agree to the purchase agreement terms');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/purchase-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          vehicleId: vehicle.id,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success('Purchase application submitted successfully!');
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting purchase application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSubmitted(false);
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerAddress: '',
      agreedToTerms: false,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-500">
            Louisiana Vehicle Purchase Agreement
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Complete the form below to initiate your vehicle purchase
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Application Submitted!</h3>
            <p className="text-gray-400 mb-6">
              We have received your purchase application. Our team will contact you shortly to complete the process.
            </p>
            <Button onClick={handleClose} className="bg-red-600 hover:bg-red-700">
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Vehicle Info */}
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Vehicle Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-400">Vehicle:</span> {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}</div>
                <div><span className="text-gray-400">Price:</span> {formatPrice(vehicle.price)}</div>
                <div><span className="text-gray-400">Mileage:</span> {formatMileage(vehicle.mileage)} miles</div>
                <div><span className="text-gray-400">Color:</span> {vehicle.color}</div>
                {vehicle.vin && <div><span className="text-gray-400">VIN:</span> {vehicle.vin}</div>}
              </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-red-500' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-red-600' : 'bg-zinc-700'}`}>
                  1
                </div>
                <span className="text-sm font-medium">Your Information</span>
              </div>
              <div className="flex-1 h-0.5 bg-zinc-700" />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-red-500' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-red-600' : 'bg-zinc-700'}`}>
                  2
                </div>
                <span className="text-sm font-medium">Agreement</span>
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Phone Number *</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email Address *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerAddress">Full Address *</Label>
                  <Textarea
                    id="customerAddress"
                    value={formData.customerAddress}
                    onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                    className="bg-zinc-800 border-zinc-700"
                    rows={2}
                    required
                  />
                </div>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.customerName || !formData.customerPhone || !formData.customerEmail || !formData.customerAddress}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Continue to Agreement
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <ScrollArea className="h-64 rounded-lg border border-zinc-700 bg-zinc-800/30 p-4">
                  <div className="space-y-4 text-sm text-gray-300">
                    <h4 className="font-bold text-white text-base">LOUISIANA VEHICLE PURCHASE AGREEMENT</h4>
                    
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    
                    <p><strong>PARTIES:</strong></p>
                    <p>This Vehicle Purchase Agreement (&quot;Agreement&quot;) is entered into between:</p>
                    <p><strong>SELLER:</strong> Expo Auto Rental & Sales LLC, located at 815 SW Evangeline Thruway, Lafayette, LA 70501</p>
                    <p><strong>BUYER:</strong> {formData.customerName}, of {formData.customerAddress}</p>
                    
                    <p><strong>VEHICLE DESCRIPTION:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Year: {vehicle.year}</li>
                      <li>Make: {vehicle.make}</li>
                      <li>Model: {vehicle.model}</li>
                      <li>Trim: {vehicle.trim || 'Standard'}</li>
                      <li>Color: {vehicle.color}</li>
                      <li>VIN: {vehicle.vin || 'To be provided'}</li>
                      <li>Mileage: {formatMileage(vehicle.mileage)} miles</li>
                    </ul>
                    
                    <p><strong>PURCHASE PRICE:</strong> {formatPrice(vehicle.price)}</p>
                    
                    <p><strong>AS-IS DISCLAIMER (Louisiana Law):</strong></p>
                    <p>THE VEHICLE IS SOLD &quot;AS-IS&quot; WITHOUT ANY WARRANTY, EITHER EXPRESS OR IMPLIED. THE BUYER ACKNOWLEDGES THAT THEY HAVE HAD THE OPPORTUNITY TO INSPECT THE VEHICLE AND ACCEPTS IT IN ITS CURRENT CONDITION. UNDER LOUISIANA LAW, THERE ARE NO IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE UNLESS SPECIFICALLY PROVIDED IN WRITING.</p>
                    
                    <p><strong>ODOMETER DISCLOSURE:</strong></p>
                    <p>The Seller certifies that the odometer reading of {formatMileage(vehicle.mileage)} miles is accurate to the best of their knowledge. The Seller represents that:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>The odometer has not been altered, disconnected, or replaced</li>
                      <li>The actual mileage is as stated above</li>
                    </ul>
                    
                    <p><strong>TITLE TRANSFER:</strong></p>
                    <p>Seller agrees to provide a clear title to the Buyer upon receipt of full payment. Title transfer will be processed in accordance with Louisiana Department of Motor Vehicles requirements.</p>
                    
                    <p><strong>WARRANTY DISCLAIMER:</strong></p>
                    <p>Unless otherwise stated in writing, no warranty is provided with this vehicle. The Buyer accepts full responsibility for any repairs needed after the sale is completed.</p>
                    
                    <p><strong>GOVERNING LAW:</strong></p>
                    <p>This Agreement shall be governed by and construed in accordance with the laws of the State of Louisiana. Any disputes arising from this Agreement shall be resolved in the appropriate courts of Lafayette Parish, Louisiana.</p>
                    
                    <p><strong>ACKNOWLEDGMENT:</strong></p>
                    <p>By checking the box below, I acknowledge that I have read, understood, and agree to all terms of this Louisiana Vehicle Purchase Agreement. I understand this is a legally binding document.</p>
                  </div>
                </ScrollArea>

                <div className="flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg">
                  <Checkbox
                    id="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: checked as boolean })}
                    className="mt-1"
                  />
                  <Label htmlFor="agreedToTerms" className="text-sm text-gray-300 cursor-pointer">
                    I have read and agree to the Louisiana Vehicle Purchase Agreement. I understand that this constitutes a legally binding agreement.
                  </Label>
                </div>

                {!formData.agreedToTerms && (
                  <div className="flex items-center gap-2 text-amber-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Please review and accept the agreement to proceed
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 border-zinc-700 text-gray-300 hover:bg-zinc-800"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!formData.agreedToTerms || loading}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
