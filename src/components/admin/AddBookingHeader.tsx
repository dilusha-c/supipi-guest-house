"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddBookingModal from "./AddBookingModal";

export default function AddBookingHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    setIsModalOpen(false);
    // Refresh the page to show the new booking
    window.location.reload();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading text-forest">Dashboard Overview</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Booking
        </button>
      </div>

      {isModalOpen && (
        <AddBookingModal 
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
