import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { salonAPI, serviceAPI, bookingAPI, reviewAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const SalonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    appointmentDate: '',
    startTime: '',
    customerNotes: ''
  });

  // Fetch salon data, services, and reviews
  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        setLoading(true);
        
        // Fetch salon details
        const salonResponse = await salonAPI.getSalonById(id);
        setSalon(salonResponse.data.salon);
        
        // Fetch services for this salon
        const servicesResponse = await serviceAPI.getServicesBySalon(id);
        setServices(servicesResponse.data.services || []);
        
        // Fetch reviews for this salon
        const reviewsResponse = await reviewAPI.getReviewsForSalon(id);
        setReviews(reviewsResponse.data.reviews || []);
        
      } catch (error) {
        console.error('Error fetching salon data:', error);
        toast.error('Failed to load salon information');
        
        // Fallback to mock data for development
        setSalon({
          _id: id,
          name: 'Glamour Studio',
          description: 'Premium beauty salon offering top-notch services with a team of experienced professionals. We specialize in hair styling, facials, and nail services.',
          logo: '/default-salon.png',
          images: ['/default-salon.png'],
          category: 'beauty',
          specialties: ['haircut', 'coloring', 'facial', 'manicure'],
          address: {
            street: '123 Beauty Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States'
          },
          contact: {
            phone: '+1 234 567 8900',
            email: 'info@glamourstudio.com',
            website: 'www.glamourstudio.com'
          },
          workingHours: [
            { day: 'monday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
            { day: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
            { day: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
            { day: 'thursday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
            { day: 'friday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
            { day: 'saturday', isOpen: true, openTime: '10:00', closeTime: '16:00' },
            { day: 'sunday', isOpen: false }
          ],
          rating: {
            average: 4.5,
            count: 128
          },
          amenities: ['wifi', 'parking', 'credit_cards', 'appointments'],
          isVerified: true,
          isFeatured: true
        });
        
        setServices([
          {
            _id: '1',
            name: 'Hair Cut & Style',
            description: 'Professional haircut and styling with consultation',
            duration: 60,
            price: 75,
            category: 'hair',
            subcategory: 'haircut',
            isActive: true
          },
          {
            _id: '2',
            name: 'Facial Treatment',
            description: 'Rejuvenating facial treatment with premium products',
            duration: 90,
            price: 120,
            category: 'beauty',
            subcategory: 'facial',
            isActive: true
          },
          {
            _id: '3',
            name: 'Manicure & Polish',
            description: 'Classic manicure with gel polish',
            duration: 45,
            price: 45,
            category: 'nail',
            subcategory: 'manicure',
            isActive: true
          }
        ]);
        
        setReviews([
          {
            _id: '1',
            customer: { name: 'Sarah Johnson' },
            rating: 5,
            comment: 'Amazing service! The stylist was very professional and the results were exactly what I wanted.',
            createdAt: '2024-01-15T10:00:00Z'
          },
          {
            _id: '2',
            customer: { name: 'Emily Davis' },
            rating: 4,
            comment: 'Great experience overall. The salon is clean and the staff is friendly.',
            createdAt: '2024-01-10T14:00:00Z'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalonData();
  }, [id]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to book a service');
      navigate('/login');
      return;
    }

    try {
      // Calculate end time based on service duration
      const startTime = new Date(`2000-01-01T${bookingData.startTime}`);
      const endTime = new Date(startTime.getTime() + 60000);
      const endTimeString = endTime.toTimeString().slice(0, 5);

      // Prevent bookings where end time is before or equal to start time
      if (endTime <= startTime) {
        toast.error('Booking cannot end before it starts. Please adjust the time or duration.');
        return;
      }

      const bookingPayload = {
        salon: salon._id,
        service: selectedService._id,
        appointmentDate: bookingData.appointmentDate,
        startTime: bookingData.startTime,
        endTime: endTimeString,
        duration: selectedService.duration,
        totalAmount: selectedService.price,
        currency: 'USD',
        customerNotes: bookingData.customerNotes
      };

      const response = await bookingAPI.createBooking(bookingPayload);
      toast.success('Booking created successfully!');
      setShowBookingForm(false);
      setSelectedService(null);
      setBookingData({ appointmentDate: '', startTime: '', customerNotes: '' });
      
      // Navigate to user dashboard to see the booking
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatWorkingHours = (workingHours) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return days.map((day, index) => {
      const hours = workingHours.find(h => h.day === day);
      return {
        day: dayNames[index],
        isOpen: hours?.isOpen || false,
        openTime: hours?.openTime || '',
        closeTime: hours?.closeTime || ''
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-pink-500 mb-4"></i>
          <p className="text-gray-600">Loading salon information...</p>
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <p className="text-gray-600">Salon not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white text-center lg:text-left max-w-2xl">
            <div className="flex items-center space-x-4 mb-4 justify-center lg:justify-start">
              {salon.isVerified && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  <i className="fas fa-check-circle mr-1"></i>
                  Verified
                </span>
              )}
              {salon.isFeatured && (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  <i className="fas fa-star mr-1"></i>
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-5xl font-bold mb-4">{salon.name}</h1>
            <p className="text-xl mb-4 max-w-2xl">{salon.description}</p>
            <div className="flex items-center space-x-6 justify-center lg:justify-start">
              <div className="flex items-center space-x-2">
                <i className="fas fa-star text-yellow-400"></i>
                <span className="font-semibold">{salon.rating.average}</span>
                <span className="text-gray-200">({salon.rating.count} reviews)</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-map-marker-alt"></i>
                <span>{salon.address.city}, {salon.address.state}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {['overview', 'services', 'reviews', 'contact'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* About Section */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">About</h3>
                  <p className="text-gray-600 leading-relaxed">{salon.description}</p>
                </div>

                {/* Specialties */}
                {salon.specialties && salon.specialties.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {salon.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium capitalize"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {salon.amenities && salon.amenities.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {salon.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <i className="fas fa-check text-green-500"></i>
                          <span className="text-gray-600 capitalize">{amenity.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Working Hours */}
                {salon.workingHours && salon.workingHours.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Working Hours</h3>
                    <div className="space-y-2">
                      {formatWorkingHours(salon.workingHours).map((day) => (
                        <div key={day.day} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-700">{day.day}</span>
                          <span className="text-gray-600">
                            {day.isOpen ? `${day.openTime} - ${day.closeTime}` : 'Closed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Services</h3>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h4>
                          <p className="text-gray-600 mb-3">{service.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span><i className="fas fa-clock mr-1"></i>{service.duration} min</span>
                            <span><i className="fas fa-dollar-sign mr-1"></i>${service.price}</span>
                            <span><i className="fas fa-tag mr-1"></i>{service.category}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleServiceSelect(service)}
                          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Reviews</h3>
                {reviews.length === 0 ? (
                  <div className="py-8">
                    <i className="fas fa-comments text-4xl text-gray-300 mb-4 block"></i>
                    <p className="text-gray-500">No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-800">{review.customer.name}</h4>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className={`fas fa-star ${
                                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                ></i>
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">Address</h4>
                    <p className="text-gray-600">
                      {salon.address.street}<br />
                      {salon.address.city}, {salon.address.state} {salon.address.zipCode}<br />
                      {salon.address.country}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">Contact Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <i className="fas fa-phone text-pink-500"></i>
                        <span className="text-gray-600">{salon.contact.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <i className="fas fa-envelope text-pink-500"></i>
                        <span className="text-gray-600">{salon.contact.email}</span>
                      </div>
                      {salon.contact.website && (
                        <div className="flex items-center space-x-3">
                          <i className="fas fa-globe text-pink-500"></i>
                          <a href={salon.contact.website} className="text-pink-600 hover:text-pink-700">
                            {salon.contact.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('services')}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                  >
                    <i className="fas fa-calendar-plus mr-2"></i>
                    Book Appointment
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200">
                    <i className="fas fa-phone mr-2"></i>
                    Call Now
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    Get Directions
                  </button>
                </div>
              </div>

              {/* Salon Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Salon Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-tag text-pink-500"></i>
                    <span className="text-gray-600 capitalize">{salon.category}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-star text-pink-500"></i>
                    <span className="text-gray-600">{salon.rating.average} ({salon.rating.count} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-map-marker-alt text-pink-500"></i>
                    <span className="text-gray-600">{salon.address.city}, {salon.address.state}</span>
                  </div>
                  {salon.pricing && (
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-dollar-sign text-pink-500"></i>
                      <span className="text-gray-600">
                        ${salon.pricing.minPrice} - ${salon.pricing.maxPrice}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Book Appointment</h3>
              <button
                onClick={() => {
                  setShowBookingForm(false);
                  setSelectedService(null);
                  setBookingData({ appointmentDate: '', startTime: '', customerNotes: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800">{selectedService.name}</h4>
              <p className="text-gray-600 text-sm">{selectedService.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500">
                  <i className="fas fa-clock mr-1"></i>{selectedService.duration} min
                </span>
                <span className="font-semibold text-gray-800">
                  ${selectedService.price}
                </span>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Date *
                </label>
                <input
                  type="date"
                  required
                  value={bookingData.appointmentDate}
                  onChange={(e) => setBookingData({ ...bookingData, appointmentDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="time"
                  required
                  value={bookingData.startTime}
                  onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={bookingData.customerNotes}
                  onChange={(e) => setBookingData({ ...bookingData, customerNotes: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Any special requests or notes..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                >
                  Confirm Booking
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBookingForm(false);
                    setSelectedService(null);
                    setBookingData({ appointmentDate: '', startTime: '', customerNotes: '' });
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonDetail; 