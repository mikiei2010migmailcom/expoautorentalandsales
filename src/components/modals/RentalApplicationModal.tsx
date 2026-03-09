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
import { AlertCircle, CheckCircle2, Loader2, Upload, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  price: number;
  dailyRate: number | null;
  weeklyRate: number | null;
}

interface RentalApplicationModalProps {
  vehicle: Vehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RentalApplicationModal({
  vehicle,
  open,
  onOpenChange,
}: RentalApplicationModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    driverLicense: '',
    startDate: '',
    endDate: '',
    hasInsurance: true,
    insuranceDoc: '',
    dealerInsurance: '',
    agreedToTerms: false,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateRentalDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
    }
    return 0;
  };

  const calculateTotalCost = () => {
    const days = calculateRentalDays();
    if (days >= 7 && vehicle.weeklyRate) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      return (weeks * vehicle.weeklyRate) + (remainingDays * (vehicle.dailyRate || 0));
    }
    return days * (vehicle.dailyRate || 0);
  };

  const handleSubmit = async () => {
    if (!formData.agreedToTerms) {
      toast.error('Please agree to the rental agreement terms');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/rental-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          vehicleId: vehicle.id,
          dealerInsurance: formData.hasInsurance ? null : formData.dealerInsurance,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success('Rental application submitted successfully!');
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting rental application:', error);
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
      driverLicense: '',
      startDate: '',
      endDate: '',
      hasInsurance: true,
      insuranceDoc: '',
      dealerInsurance: '',
      agreedToTerms: false,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-red-500">
            Louisiana Vehicle Rental Application
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Complete the form below to apply for vehicle rental
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Application Submitted!</h3>
            <p className="text-gray-400 mb-6">
              We have received your rental application. Our team will review it and contact you within 24 hours.
            </p>
            <Button onClick={handleClose} className="bg-red-600 hover:bg-red-700">
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Vehicle Info */}
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Vehicle to Rent</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-400">Vehicle:</span> {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}</div>
                <div><span className="text-gray-400">Daily Rate:</span> {vehicle.dailyRate ? formatPrice(vehicle.dailyRate) : 'Contact for rate'}</div>
                {vehicle.weeklyRate && <div><span className="text-gray-400">Weekly Rate:</span> {formatPrice(vehicle.weeklyRate)}</div>}
              </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= s ? 'bg-red-600 text-white' : 'bg-zinc-700 text-gray-400'}`}>
                    {s}
                  </div>
                  {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-red-600' : 'bg-zinc-700'}`} />}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 px-2">
              <span>Your Info</span>
              <span>Rental Details</span>
              <span>Agreement</span>
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
                <div className="space-y-2">
                  <Label htmlFor="driverLicense">Driver&apos;s License Number *</Label>
                  <Input
                    id="driverLicense"
                    value={formData.driverLicense}
                    onChange={(e) => setFormData({ ...formData, driverLicense: e.target.value })}
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.customerName || !formData.customerPhone || !formData.customerEmail || !formData.customerAddress || !formData.driverLicense}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Continue to Rental Details
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                {formData.startDate && formData.endDate && (
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Rental Duration:</span>
                      <span className="font-semibold">{calculateRentalDays()} days</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-400">Estimated Total:</span>
                      <span className="font-bold text-red-500">{formatPrice(calculateTotalCost())}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <Label>Insurance Information</Label>
                  <div className="flex gap-4">
                    <div
                      className={`flex-1 p-4 rounded-lg border cursor-pointer transition-colors ${formData.hasInsurance ? 'border-red-600 bg-red-600/10' : 'border-zinc-700'}`}
                      onClick={() => setFormData({ ...formData, hasInsurance: true })}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${formData.hasInsurance ? 'border-red-600 bg-red-600' : 'border-gray-500'}`}>
                          {formData.hasInsurance && <div className="w-2 h-2 bg-white rounded-full m-auto" />}
                        </div>
                        <span className="font-medium">I Have Insurance</span>
                      </div>
                      <p className="text-sm text-gray-400">Upload proof of insurance document</p>
                    </div>
                    <div
                      className={`flex-1 p-4 rounded-lg border cursor-pointer transition-colors ${!formData.hasInsurance ? 'border-red-600 bg-red-600/10' : 'border-zinc-700'}`}
                      onClick={() => setFormData({ ...formData, hasInsurance: false })}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${!formData.hasInsurance ? 'border-red-600 bg-red-600' : 'border-gray-500'}`}>
                          {!formData.hasInsurance && <div className="w-2 h-2 bg-white rounded-full m-auto" />}
                        </div>
                        <span className="font-medium">Need Insurance</span>
                      </div>
                      <p className="text-sm text-gray-400">Add dealer-provided insurance</p>
                    </div>
                  </div>

                  {formData.hasInsurance ? (
                    <div className="space-y-2">
                      <Label htmlFor="insuranceDoc">Upload Proof of Insurance</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="insuranceDoc"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="bg-zinc-800 border-zinc-700"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // In a real app, you would upload the file
                              setFormData({ ...formData, insuranceDoc: file.name });
                            }
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="dealerInsurance">Dealer-Provided Insurance Cost ($)</Label>
                      <Input
                        id="dealerInsurance"
                        type="number"
                        value={formData.dealerInsurance}
                        onChange={(e) => setFormData({ ...formData, dealerInsurance: e.target.value })}
                        className="bg-zinc-800 border-zinc-700"
                        placeholder="Enter insurance cost"
                      />
                      <p className="text-sm text-gray-400">Our team will provide a quote for dealer insurance</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 border-zinc-700 text-gray-300 hover:bg-zinc-800"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!formData.startDate || !formData.endDate}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Continue to Agreement
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <ScrollArea className="h-56 rounded-lg border border-zinc-700 bg-zinc-800/30 p-4">
                  <div className="space-y-4 text-sm text-gray-300">
                    <h4 className="font-bold text-white text-base">LOUISIANA VEHICLE RENTAL AGREEMENT</h4>
                    
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    
                    <p><strong>PARTIES:</strong></p>
                    <p>This Vehicle Rental Agreement (&quot;Agreement&quot;) is entered into between:</p>
                    <p><strong>OWNER:</strong> Top Auto Rental & Sales LLC, 815 SW Evangeline Thruway, Lafayette, LA 70501</p>
                    <p><strong>RENTER:</strong> {formData.customerName}, of {formData.customerAddress}</p>
                    
                    <p><strong>VEHICLE:</strong></p>
                    <p>{vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim || ''}</p>
                    
                    <p><strong>RENTAL PERIOD:</strong></p>
                    <p>From: {formData.startDate} To: {formData.endDate} ({calculateRentalDays()} days)</p>
                    
                    <p><strong>RATES:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Daily Rate: {vehicle.dailyRate ? formatPrice(vehicle.dailyRate) : 'TBD'}</li>
                      {vehicle.weeklyRate && <li>Weekly Rate: {formatPrice(vehicle.weeklyRate)}</li>}
                    </ul>
                    
                    <p><strong>SECURITY DEPOSIT:</strong></p>
                    <p>A security deposit may be required and will be refunded upon return of the vehicle in satisfactory condition.</p>
                    
                    <p><strong>INSURANCE REQUIREMENTS:</strong></p>
                    <p>{formData.hasInsurance ? 'Renter has provided proof of insurance.' : 'Renter elects to purchase dealer-provided insurance.'}</p>
                    
                    <p><strong>TERMS AND CONDITIONS:</strong></p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Vehicle must be operated within Louisiana state boundaries unless prior written approval is obtained</li>
                      <li>Renter must return vehicle with the same fuel level as at pickup</li>
                      <li>Late returns will incur additional daily rental charges</li>
                      <li>Renter is responsible for all damage to the vehicle during the rental period</li>
                      <li>Smoking in the vehicle is strictly prohibited</li>
                      <li>Vehicle may not be used for illegal activities or racing</li>
                      <li>Maximum mileage: 150 miles per day (additional miles charged at $0.25/mile)</li>
                    </ul>
                    
                    <p><strong>GOVERNING LAW:</strong></p>
                    <p>This Agreement shall be governed by the laws of the State of Louisiana. Any disputes shall be resolved in Lafayette Parish courts.</p>
                    
                    <p><strong>ACKNOWLEDGMENT:</strong></p>
                    <p>By agreeing below, I acknowledge I have read, understood, and agree to all terms of this Louisiana Vehicle Rental Agreement.</p>
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
                    I have read and agree to the Louisiana Vehicle Rental Agreement. I understand that this constitutes a legally binding agreement.
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
                    onClick={() => setStep(2)}
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
