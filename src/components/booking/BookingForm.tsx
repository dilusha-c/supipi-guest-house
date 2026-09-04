"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { businessConfig } from "@/config/business";
import { Calendar as CalendarIcon, Users, User, Phone, Mail, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/Calendar";
import { eachDayOfInterval, format } from "date-fns";

// --- Validation Schemas ---
const bookingSchema = z.object({
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  adults: z.number().min(1, "At least 1 adult is required"),
  children: z.number().min(0).default(0),
  guestName: z.string().min(2, "Full name is required"),
  phone: z.string().min(9, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  specialRequests: z.string().max(500, "Maximum 500 characters").optional(),
}).refine((data) => {
  if (data.checkIn && data.checkOut) {
    return new Date(data.checkOut) > new Date(data.checkIn);
  }
  return true;
}, {
  message: "Check-out must be after check-in",
  path: ["checkOut"]
});

type BookingFormData = z.infer<typeof bookingSchema>;

type BookingResponse = {
  success: boolean;
  message?: string;
  bookingReference?: string;
  error?: string;
  details?: any;
};

// --- Component ---
export default function BookingForm({ 
  basePrice = 50, 
  hidePrice = false 
}: { 
  basePrice?: number;
  hidePrice?: boolean;
}) {
  const [formData, setFormData] = useState<BookingFormData>({
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    guestName: "",
    phone: "",
    email: "",
    specialRequests: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [nights, setNights] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<BookingResponse | null>(null);

  // Availability State
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined } | undefined>({ from: undefined, to: undefined });

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const res = await fetch("/api/bookings/availability");
        const data = await res.json();
        
        if (data.bookings) {
          const dates: Date[] = [];
          data.bookings.forEach((b: any) => {
            const checkIn = new Date(b.checkIn);
            const checkOut = new Date(b.checkOut);
            const interval = eachDayOfInterval({ start: checkIn, end: checkOut });
            dates.push(...interval);
          });
          setBlockedDates(dates);
        }
      } catch (err) {
        console.error("Failed to fetch availability", err);
      }
    }
    
    fetchAvailability();
  }, []);

  // Update formData when dateRange changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      checkIn: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : '',
      checkOut: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : ''
    }));
  }, [dateRange]);

  // Calculate nights when dates change
  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      if (end > start) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNights(diffDays);
      } else {
        setNights(0);
      }
    } else {
      setNights(0);
    }
  }, [formData.checkIn, formData.checkOut]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle number conversions for specific fields
    const finalValue = (name === "adults" || name === "children") ? parseInt(value) || 0 : value;
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    
    // Clear error for the field being edited
    if (errors[name as keyof BookingFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    // Local Validation
    const parseResult = bookingSchema.safeParse(formData);
    if (!parseResult.success) {
      const fieldErrors: Partial<Record<keyof BookingFormData, string>> = {};
      parseResult.error.issues.forEach((e: z.ZodIssue) => {
        if (e.path[0]) {
          fieldErrors[e.path[0] as keyof BookingFormData] = e.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      
      // Scroll to first error
      const firstErrorPath = parseResult.error.issues[0]?.path[0] as string;
      const firstErrorField = document.getElementsByName(firstErrorPath)[0];
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    try {
      // Submit to API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit booking request");
      }
      
      setSuccessData(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Success State UI ---
  if (successData) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-[20px] border border-light-border shadow-sm text-center max-w-3xl mx-auto">
        <div className="w-20 h-20 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-forest" />
        </div>
        <h2 className="font-heading text-3xl md:text-4xl text-forest mb-4">Booking Request Sent</h2>
        <p className="text-lg text-muted mb-8 leading-relaxed max-w-xl mx-auto">
          Thank you for contacting {businessConfig.name}. We have received your booking request and will contact you to confirm availability.
        </p>
        
        <div className="bg-cream p-6 rounded-[14px] border border-light-border mb-8 max-w-md mx-auto text-left">
          <div className="text-sm text-muted uppercase tracking-wider mb-2">Booking Reference</div>
          <div className="font-heading text-2xl text-dark mb-6">{successData.bookingReference}</div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted block mb-1">Check-in</span>
              <span className="font-medium text-dark">{formData.checkIn}</span>
            </div>
            <div>
              <span className="text-muted block mb-1">Check-out</span>
              <span className="font-medium text-dark">{formData.checkOut}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted block mb-1">Guests</span>
              <span className="font-medium text-dark">{formData.adults} Adults {formData.children > 0 ? `, ${formData.children} Children` : ''}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted block mb-1">Room</span>
              <span className="font-medium text-dark">Comfortable Guest Room</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="btn-secondary w-full sm:w-auto"
          >
            Back to Home
          </button>
          
          {businessConfig.whatsappEnabled && (
            <a 
              href={`https://wa.me/${businessConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${businessConfig.name}, I submitted booking request ${successData.bookingReference}. Please confirm availability.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE5D] border-transparent text-white"
            >
              Contact via WhatsApp
            </a>
          )}
        </div>
      </div>
    );
  }

  // --- Form UI ---
  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
      
      {/* LEFT: FORM */}
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Section 1: Your Stay */}
          <section className="bg-white p-6 md:p-10 rounded-[20px] border border-light-border shadow-sm">
            <h2 className="font-heading text-2xl text-forest mb-8 flex items-center">
              <CalendarIcon className="w-6 h-6 mr-3 text-sage" />
              Your Stay
            </h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-dark mb-3">Select Dates *</label>
              <div className={cn(
                "w-full flex justify-center bg-cream/30 p-4 rounded-[12px] border transition-colors",
                (errors.checkIn || errors.checkOut) ? "border-red-500" : "border-light-border"
              )}>
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                  disabled={[
                    { before: new Date() },
                    ...blockedDates
                  ]}
                  showOutsideDays={false}
                  className="bg-transparent border-none shadow-none"
                  modifiers={{
                    blocked: blockedDates
                  }}
                  modifiersClassNames={{
                    blocked: "bg-gray-200 text-gray-400 line-through opacity-50 pointer-events-none"
                  }}
                />
              </div>
              {(errors.checkIn || errors.checkOut) && (
                <p className="text-red-500 text-xs mt-2 text-center">Please select a valid Check-in and Check-out date.</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="adults" className="block text-sm font-medium text-dark mb-2">Adults *</label>
                <select 
                  id="adults" 
                  name="adults"
                  value={formData.adults}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-[12px] border border-light-border bg-cream/30 focus:outline-none focus:ring-2 focus:ring-sage/50"
                >
                  {[1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="children" className="block text-sm font-medium text-dark mb-2">Children</label>
                <select 
                  id="children" 
                  name="children"
                  value={formData.children}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-[12px] border border-light-border bg-cream/30 focus:outline-none focus:ring-2 focus:ring-sage/50"
                >
                  {[0, 1, 2, 3].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Room selection is implicitly single room for now */}
            <div className="mt-8 p-4 rounded-[12px] bg-forest/5 border border-forest/10 flex items-start">
              <div className="w-16 h-12 rounded-[8px] bg-cream overflow-hidden relative shrink-0 mr-4">
                <img src="/images/bedroom.jpg" alt="Room" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-medium text-forest">Comfortable Guest Room</h4>
                <p className="text-sm text-muted">
                  Accommodates up to 4 guests. {hidePrice ? "Price will be confirmed upon request." : `Price: LKR ${basePrice.toFixed(2)} / night`}
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Guest Details */}
          <section className="bg-white p-6 md:p-10 rounded-[20px] border border-light-border shadow-sm">
            <h2 className="font-heading text-2xl text-forest mb-8 flex items-center">
              <User className="w-6 h-6 mr-3 text-sage" />
              Guest Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="guestName" className="block text-sm font-medium text-dark mb-2">Full Name *</label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input 
                    type="text" 
                    id="guestName" 
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className={cn(
                      "w-full pl-12 pr-4 py-3 rounded-[12px] border bg-cream/30 focus:outline-none focus:ring-2 focus:ring-sage/50 transition-colors",
                      errors.guestName ? "border-red-500" : "border-light-border"
                    )}
                  />
                </div>
                {errors.guestName && <p className="text-red-500 text-xs mt-2">{errors.guestName}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-dark mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 071 123 4567"
                      className={cn(
                        "w-full pl-12 pr-4 py-3 rounded-[12px] border bg-cream/30 focus:outline-none focus:ring-2 focus:ring-sage/50 transition-colors",
                        errors.phone ? "border-red-500" : "border-light-border"
                      )}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-2">{errors.phone}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-dark mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. john@example.com"
                      className={cn(
                        "w-full pl-12 pr-4 py-3 rounded-[12px] border bg-cream/30 focus:outline-none focus:ring-2 focus:ring-sage/50 transition-colors",
                        errors.email ? "border-red-500" : "border-light-border"
                      )}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="specialRequests" className="block text-sm font-medium text-dark mb-2">Special Requests (Optional)</label>
                <div className="relative">
                  <FileText className="w-5 h-5 absolute left-4 top-4 text-muted" />
                  <textarea 
                    id="specialRequests" 
                    name="specialRequests"
                    rows={4}
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Any specific requirements or questions?"
                    className="w-full pl-12 pr-4 py-3 rounded-[12px] border border-light-border bg-cream/30 focus:outline-none focus:ring-2 focus:ring-sage/50 resize-none"
                  ></textarea>
                </div>
                {errors.specialRequests && <p className="text-red-500 text-xs mt-2">{errors.specialRequests}</p>}
              </div>
            </div>
          </section>

          {/* Mobile Submit Button (Hidden on desktop as it's in the sticky summary) */}
          <div className="lg:hidden">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary w-full py-4 text-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending Request..." : "Send Booking Request"}
            </button>
            <p className="text-center text-xs text-muted mt-4">
              Availability will be confirmed by {businessConfig.name}
            </p>
          </div>
          
        </form>
      </div>

      {/* RIGHT: STICKY SUMMARY */}
      <div className="lg:w-[380px] shrink-0 order-first lg:order-last mb-8 lg:mb-0">
        <div className="sticky top-28 bg-forest text-white p-8 rounded-[20px] shadow-lg">
          <h3 className="font-heading text-xl uppercase tracking-widest text-cream mb-8 pb-4 border-b border-white/20">
            Booking Summary
          </h3>
          
          <div className="mb-8">
            <div className="text-2xl font-heading mb-1">{businessConfig.name}</div>
            <div className="text-cream/70 text-sm flex items-center">
              {businessConfig.city}, {businessConfig.country}
            </div>
          </div>

          <div className="space-y-6 mb-8 text-cream/90">
            <div className="flex justify-between items-center">
              <div className="text-sm">Check-in</div>
              <div className="font-medium text-white text-right">
                {formData.checkIn ? new Date(formData.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric'}) : '--'}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm">Check-out</div>
              <div className="font-medium text-white text-right">
                {formData.checkOut ? new Date(formData.checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric'}) : '--'}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/20">
              <div className="text-sm">Nights</div>
              <div className="font-medium text-white text-right">{nights > 0 ? nights : '--'}</div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm">Guests</div>
              <div className="font-medium text-white text-right">
                {formData.adults} Adults {formData.children > 0 ? `, ${formData.children} Children` : ''}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm">Room</div>
              <div className="font-medium text-white text-right">Comfortable Guest Room</div>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-[12px] mb-8 text-sm">
            <strong className="block text-white mb-1">Availability:</strong>
            <span className="text-cream/80">
              To be confirmed by Supipi Guest House. {hidePrice ? "Price will be confirmed upon request." : `Estimated total for ${nights > 0 ? nights : 1} night(s): LKR ${(basePrice * (nights > 0 ? nights : 1)).toFixed(2)}`}
            </span>
          </div>

          <div className="hidden lg:block">
            <button 
              onClick={(e) => {
                // Trigger form submission manually since it's outside the <form> on desktop layout
                // In React, easiest way is to dispatch submit event to the form
                const form = document.querySelector('form');
                if (form) {
                  form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }
              }}
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center bg-cream text-forest px-6 py-4 rounded-[12px] font-semibold transition-all hover:bg-white shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending Request..." : "Send Booking Request"}
            </button>
            <p className="text-center text-xs text-cream/60 mt-4">
              No payment required at this step.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
