"use client";

import { useState } from "react";
import { X, CalendarIcon, User, Phone, Mail, FileText, Users, DollarSign, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AddBookingModal({ 
  onClose,
  onSuccess
}: { 
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    source: "DIRECT",
    guestName: "",
    phone: "",
    email: "",
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    price: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/admin/bookings/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add booking");
      
      onSuccess();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-light-border bg-cream/30 shrink-0">
          <h2 className="text-xl font-heading text-forest">Add Manual Booking</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors text-muted hover:text-dark"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-6">
              <h3 className="font-medium text-dark text-lg mb-4">Select Booking Source</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, source: "DIRECT" }))}
                  className={cn(
                    "p-6 rounded-xl border-2 text-left transition-all",
                    formData.source === "DIRECT" 
                      ? "border-forest bg-forest/5 shadow-sm" 
                      : "border-light-border hover:border-forest/50"
                  )}
                >
                  <div className="font-heading text-lg text-forest mb-2">Direct Booking</div>
                  <div className="text-sm text-muted">Phone calls, walk-ins, or WhatsApp messages.</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, source: "WEBSITE" }))}
                  className={cn(
                    "p-6 rounded-xl border-2 text-left transition-all",
                    formData.source === "WEBSITE" 
                      ? "border-forest bg-forest/5 shadow-sm" 
                      : "border-light-border hover:border-forest/50"
                  )}
                >
                  <div className="font-heading text-lg text-forest mb-2">Website (Other)</div>
                  <div className="text-sm text-muted">External website or manual web entry.</div>
                </button>
              </div>
              
              <div className="pt-6 flex justify-end">
                <button 
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-primary"
                >
                  Continue to Details
                </button>
              </div>
            </div>
          ) : (
            <form id="addBookingForm" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Check-in *</label>
                  <input 
                    type="date" 
                    name="checkIn" 
                    required
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-light-border bg-white focus:ring-2 focus:ring-forest/30 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Check-out *</label>
                  <input 
                    type="date" 
                    name="checkOut" 
                    required
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-light-border bg-white focus:ring-2 focus:ring-forest/30 outline-none" 
                  />
                </div>
              </div>

              {/* Guest Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Guest Name *</label>
                  <input 
                    type="text" 
                    name="guestName" 
                    required
                    value={formData.guestName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full p-3 rounded-lg border border-light-border bg-white focus:ring-2 focus:ring-forest/30 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Phone *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+94 77..."
                    className="w-full p-3 rounded-lg border border-light-border bg-white focus:ring-2 focus:ring-forest/30 outline-none" 
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Email (Optional)</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com (Confirmation will be sent here)"
                  className="w-full p-3 rounded-lg border border-light-border bg-white focus:ring-2 focus:ring-forest/30 outline-none" 
                />
              </div>

              {/* Guests & Price */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Adults *</label>
                  <input 
                    type="number" 
                    name="adults" 
                    min="1"
                    required
                    value={formData.adults}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-light-border bg-white focus:ring-2 focus:ring-forest/30 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Children</label>
                  <input 
                    type="number" 
                    name="children" 
                    min="0"
                    value={formData.children}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-light-border bg-white focus:ring-2 focus:ring-forest/30 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Price (LKR) *</label>
                  <input 
                    type="number" 
                    name="price" 
                    required
                    placeholder="15000"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-light-border bg-white focus:ring-2 focus:ring-forest/30 outline-none" 
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {step === 2 && (
          <div className="p-6 border-t border-light-border bg-cream/30 flex justify-between shrink-0">
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-2 rounded-lg font-medium text-muted hover:text-dark transition-colors"
            >
              Back
            </button>
            <button 
              type="submit"
              form="addBookingForm"
              disabled={isSubmitting}
              className="btn-primary flex items-center justify-center min-w-[140px]"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save & Confirm"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
