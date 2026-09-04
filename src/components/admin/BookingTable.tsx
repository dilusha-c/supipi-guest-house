"use client";

import { useState } from "react";
import { Check, X, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type Booking = {
  id: string;
  bookingReference: string;
  guestName: string;
  email: string | null;
  phone: string;
  checkIn: Date | string;
  checkOut: Date | string;
  adults: number;
  children: number;
  status: string;
  amountPaid?: number;
  totalPrice?: number | null;
  createdAt: Date | string;
};

export default function BookingTable({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-700"
  };

  // Modal State
  const [activeModal, setActiveModal] = useState<{
    type: 'CONFIRM' | 'REJECT' | 'CANCEL' | 'PAYMENT' | null;
    bookingId: string | null;
  }>({ type: null, bookingId: null });
  
  // Form State
  const [price, setPrice] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [reason, setReason] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  const closeModals = () => {
    setActiveModal({ type: null, bookingId: null });
    setPrice('');
    setPaymentAmount('');
    setReason('');
    setCustomMessage('');
  };

  const submitAction = async () => {
    if (!activeModal.bookingId || !activeModal.type) return;
    
    const id = activeModal.bookingId;
    let newStatus = '';
    if (activeModal.type === 'CONFIRM') newStatus = 'CONFIRMED';
    if (activeModal.type === 'REJECT') newStatus = 'REJECTED';
    if (activeModal.type === 'CANCEL') newStatus = 'CANCELLED';

    setUpdatingId(id);
    
    try {
      if (activeModal.type === 'PAYMENT') {
        const amount = parseFloat(paymentAmount);
        if (isNaN(amount) || amount <= 0) {
          alert("Please enter a valid payment amount");
          setUpdatingId(null);
          return;
        }
        
        const res = await fetch('/api/admin/bookings/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, amount })
        });
        
        if (res.ok) {
          const { booking: updatedBooking } = await res.json();
          setBookings(bookings.map(b => b.id === id ? updatedBooking : b));
          closeModals();
        } else {
          alert("Failed to log payment");
        }
      } else {
        const res = await fetch("/api/admin/bookings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            id, 
            status: newStatus,
            price: price ? `LKR ${price}` : undefined,
            reason: reason || undefined,
            customMessage: customMessage || undefined
          })
        });
        
        if (res.ok) {
          const { booking: updatedBooking } = await res.json();
          setBookings(bookings.map(b => b.id === id ? updatedBooking : b));
          closeModals();
          
          if (newStatus === "CONFIRMED") {
            alert("Booking Confirmed! An email has been sent to the guest if they provided an email address.");
          }
        } else {
          alert("Failed to update status");
        }
      }
    } catch (e) {
      alert("Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-[16px] shadow-sm border border-light-border overflow-hidden">
        <div className="p-6 border-b border-light-border bg-cream/30">
          <h2 className="text-xl font-heading text-forest">Recent Booking Requests</h2>
        </div>
        <div className="p-6 text-center text-muted">
          No bookings found.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-light-border overflow-hidden">
      <div className="p-6 border-b border-light-border bg-cream/30">
        <h2 className="text-xl font-heading text-forest">Recent Booking Requests</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted uppercase bg-cream/10 border-b border-light-border">
            <tr>
              <th className="px-6 py-4 font-medium">Ref / Guest</th>
              <th className="px-6 py-4 font-medium">Dates</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Payment</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-light-border hover:bg-cream/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-dark">{booking.bookingReference}</div>
                  <div className="text-muted mt-1">{booking.guestName}</div>
                  <div className="text-xs text-muted mt-1">{booking.adults} Adults, {booking.children} Children</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-dark">{new Date(booking.checkIn).toLocaleDateString()}</div>
                  <div className="text-muted text-xs mx-2">to</div>
                  <div className="font-medium text-dark">{new Date(booking.checkOut).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-dark font-medium">{booking.phone}</div>
                  {booking.email && (
                    <div className="flex items-center text-muted text-xs mt-1">
                      <Mail className="w-3 h-3 mr-1" />
                      {booking.email}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    statusColors[booking.status] || "bg-gray-100 text-gray-700"
                  )}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-dark">LKR {booking.amountPaid?.toFixed(2) || '0.00'}</div>
                  {booking.totalPrice && (
                    <div className="text-xs text-muted">of LKR {booking.totalPrice.toFixed(2)}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                  {booking.status === 'PENDING' && (
                    <>
                      <button 
                        onClick={() => setActiveModal({ type: 'CONFIRM', bookingId: booking.id })}
                        disabled={updatingId === booking.id}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50"
                        title="Accept Booking"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setActiveModal({ type: 'REJECT', bookingId: booking.id })}
                        disabled={updatingId === booking.id}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                        title="Reject Booking"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {booking.status === 'CONFIRMED' && (
                    <>
                      <button 
                        onClick={() => setActiveModal({ type: 'PAYMENT', bookingId: booking.id })}
                        disabled={updatingId === booking.id}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-50"
                        title="Log Payment"
                      >
                        <span className="font-bold text-sm">LKR</span>
                      </button>
                      <button 
                        onClick={() => setActiveModal({ type: 'CANCEL', bookingId: booking.id })}
                        disabled={updatingId === booking.id}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                        title="Cancel Booking"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Modal */}
      {activeModal.type && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-dark mb-4">
              {activeModal.type === 'CONFIRM' && 'Confirm Booking'}
              {activeModal.type === 'REJECT' && 'Reject Booking'}
              {activeModal.type === 'CANCEL' && 'Cancel Booking'}
              {activeModal.type === 'PAYMENT' && 'Log Payment'}
            </h3>
            
            <div className="space-y-4">
              {activeModal.type === 'PAYMENT' ? (
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Payment Amount Received (LKR)</label>
                  <input 
                    type="number"
                    placeholder="e.g. 5000"
                    className="w-full px-3 py-2 border border-light-border rounded-md focus:outline-none focus:border-forest"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted mt-2">This amount will be added to the guest's total amount paid.</p>
                </div>
              ) : (
                <>
                  {activeModal.type === 'CONFIRM' && (
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1">Total Price (Optional)</label>
                      <input 
                        type="number"
                        placeholder="e.g. 15000"
                        className="w-full px-3 py-2 border border-light-border rounded-md focus:outline-none focus:border-forest"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                  )}

                  {(activeModal.type === 'REJECT' || activeModal.type === 'CANCEL') && (
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1">Reason</label>
                      <select 
                        className="w-full px-3 py-2 border border-light-border rounded-md focus:outline-none focus:border-forest"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      >
                        <option value="">Select a reason...</option>
                        {activeModal.type === 'REJECT' ? (
                          <>
                            <option value="Fully booked on these dates">Fully booked</option>
                            <option value="Room maintenance">Room maintenance</option>
                            <option value="Other">Other</option>
                          </>
                        ) : (
                          <>
                            <option value="Guest requested cancellation">Guest requested cancellation</option>
                            <option value="Emergency closure">Emergency closure</option>
                            <option value="Payment not received">Payment not received</option>
                            <option value="Other">Other</option>
                          </>
                        )}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">Custom Message to Guest (Optional)</label>
                    <textarea 
                      rows={3}
                      className="w-full px-3 py-2 border border-light-border rounded-md focus:outline-none focus:border-forest"
                      placeholder="Type a friendly message..."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={closeModals}
                className="px-4 py-2 text-sm font-medium text-muted hover:text-dark"
                disabled={updatingId === activeModal.bookingId}
              >
                Cancel
              </button>
              <button 
                onClick={submitAction}
                disabled={updatingId === activeModal.bookingId}
                className={cn(
                  "px-4 py-2 text-sm font-medium text-white rounded-md transition-colors",
                  activeModal.type === 'CONFIRM' ? "bg-forest hover:bg-forest/90" : "bg-red-600 hover:bg-red-700"
                )}
              >
                {updatingId === activeModal.bookingId ? 'Processing...' : (activeModal.type === 'CONFIRM' ? 'Send Confirmation' : 'Send')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
