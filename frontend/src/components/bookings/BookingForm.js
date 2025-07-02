import React from 'react';
import { useParams } from 'react-router-dom';

const BookingForm = () => {
  const { salonId, serviceId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Book Appointment
          </h1>
          <p className="text-xl text-gray-600">
            Salon ID: {salonId} | Service ID: {serviceId}
          </p>
          <p className="text-gray-500 mt-4">
            This page will show the booking form with date/time selection and payment options.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingForm; 