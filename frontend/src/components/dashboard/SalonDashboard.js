import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI, serviceAPI, salonAPI, uploadAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const SalonDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [salonData, setSalonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingService, setEditingService] = useState(null);
  const [showCreateSalon, setShowCreateSalon] = useState(false);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [newSalon, setNewSalon] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    contact: {
      phone: '',
      email: ''
    },
    location: {
      type: 'Point',
      coordinates: [0, 0] // Default coordinates (will be updated)
    },
    category: '',
    isVerified: false
  });
  const [salonImage, setSalonImage] = useState(null);
  const [editingSalon, setEditingSalon] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    category: '',
    subcategory: ''
  });

  // Fetch salon data and bookings
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch salon data
        try {
          const salonResponse = await salonAPI.getSalonByOwner();
          setSalonData(salonResponse.data.salon);
          
          // Fetch bookings for this salon
          const bookingsResponse = await bookingAPI.getBookingsByCurrentSalon();
          setBookings(bookingsResponse.data.bookings || []);
          
          // Fetch services for this salon
          const servicesResponse = await serviceAPI.getServicesByCurrentSalon();
          setServices(servicesResponse.data.services || []);
        } catch (error) {
          if (error.response?.status === 404) {
            // Salon not found - user needs to create one
            setSalonData(null);
            setBookings([]);
            setServices([]);
          } else {
            throw error;
          }
        }
        
      } catch (error) {
        console.error('Error fetching salon data:', error);
        toast.error('Failed to load salon data');
        
        // Fallback to mock data for development
        setSalonData({
          _id: '1',
          name: 'Glamour Studio',
          description: 'Premium beauty salon offering top-notch services',
          address: '123 Beauty Street, City',
          phone: '+1 234 567 8900',
          email: 'info@glamourstudio.com',
          rating: {
            average: 4.5,
            count: 128
          },
          isVerified: true
        });
        
        setBookings([
          {
            _id: '1',
            user: { name: 'Sarah Johnson', _id: '1' },
            service: { name: 'Hair Cut & Style', _id: '1' },
            appointmentDate: '2024-01-15',
            startTime: '10:00',
            endTime: '11:00',
            status: 'confirmed',
            totalAmount: 75,
            currency: 'USD',
            createdAt: '2024-01-10T10:00:00Z'
          },
          {
            _id: '2',
            user: { name: 'Emily Davis', _id: '2' },
            service: { name: 'Facial Treatment', _id: '2' },
            appointmentDate: '2024-01-15',
            startTime: '14:00',
            endTime: '15:30',
            status: 'pending',
            totalAmount: 120,
            currency: 'USD',
            createdAt: '2024-01-12T14:00:00Z'
          }
        ]);
        
        setServices([
          {
            _id: '1',
            name: 'Hair Cut & Style',
            description: 'Professional haircut and styling',
            duration: 60,
            price: 75,
            category: 'Hair',
            isActive: true
          },
          {
            _id: '2',
            name: 'Facial Treatment',
            description: 'Rejuvenating facial treatment',
            duration: 90,
            price: 120,
            category: 'Facial',
            isActive: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await bookingAPI.updateBookingStatus(bookingId, { status });
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status } : booking
      ));
      toast.success(`Booking ${status} successfully`);
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const handleAddService = async () => {
    try {
      // Validate required fields
      if (!newService.name || !newService.category || !newService.subcategory || !newService.duration || !newService.price) {
        toast.error('Please fill in all required fields');
        return;
      }

      const response = await serviceAPI.addService(newService);
      setServices([...services, response.data.service]);
      setNewService({ name: '', description: '', duration: '', price: '', category: '', subcategory: '' });
      setShowAddServiceForm(false);
      toast.success('Service added successfully');
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Failed to add service');
    }
  };

  const handleUpdateService = async (serviceId, updatedData) => {
    try {
      await serviceAPI.updateService(serviceId, updatedData);
      setServices(services.map(service => 
        service._id === serviceId ? { ...service, ...updatedData } : service
      ));
      setEditingService(null);
      toast.success('Service updated successfully');
    } catch (error) {
      toast.error('Failed to update service');
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await serviceAPI.deleteService(serviceId);
      setServices(services.filter(service => service._id !== serviceId));
      toast.success('Service deleted successfully');
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const handleUpdateSalon = async () => {
    try {
      let imageUrl = salonData.logo || '';
      
      // Upload new image if provided
      if (salonImage) {
        const formData = new FormData();
        formData.append('image', salonImage);
        const uploadResponse = await uploadAPI.uploadImage(formData);
        imageUrl = uploadResponse.data.imageUrl;
      }

      const updatedSalonData = {
        ...newSalon,
        logo: imageUrl
      };
      
      const response = await salonAPI.updateSalon(salonData._id, updatedSalonData);
      setSalonData(response.data.salon);
      setEditingSalon(false);
      setSalonImage(null);
      toast.success('Salon updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update salon');
    }
  };

  const handleCreateSalon = async () => {
    try {
      let imageUrl = '';
      
      // Upload image if provided
      if (salonImage) {
        const formData = new FormData();
        formData.append('image', salonImage);
        const uploadResponse = await uploadAPI.uploadImage(formData);
        imageUrl = uploadResponse.data.imageUrl;
      }

      // For now, use default coordinates. In a real app, you'd use a geocoding service
      const salonData = {
        ...newSalon,
        logo: imageUrl,
        location: {
          type: 'Point',
          coordinates: [0, 0] // Default coordinates - will be updated when we add geocoding
        }
      };
      
      const response = await salonAPI.createSalon(salonData);
      setSalonData(response.data.salon);
      setShowCreateSalon(false);
      setSalonImage(null);
      toast.success('Salon created successfully!');
      // Refresh the page to load the full dashboard
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create salon');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const todayBookings = bookings.filter(booking => 
    booking.appointmentDate === new Date().toISOString().split('T')[0]
  );

  const upcomingBookings = bookings.filter(booking => 
    new Date(booking.appointmentDate) > new Date() && booking.status !== 'cancelled'
  );

  const totalRevenue = bookings
    .filter(booking => booking.status === 'completed')
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  const averageRating = salonData?.rating?.average || 0;

  // Show salon creation form if no salon exists
  if (!salonData && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to Salonease!
            </h1>
            <p className="text-gray-600">
              Let's set up your salon to get started
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Your Salon</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salon Name *
                </label>
                <input
                  type="text"
                  value={newSalon.name}
                  onChange={(e) => setNewSalon({ ...newSalon, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter salon name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={newSalon.category}
                  onChange={(e) => setNewSalon({ ...newSalon, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="hair">Hair Salon</option>
                  <option value="nail">Nail Salon</option>
                  <option value="spa">Spa</option>
                  <option value="massage">Massage</option>
                  <option value="beauty">Beauty Salon</option>
                  <option value="barber">Barber Shop</option>
                  <option value="wellness">Wellness</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={newSalon.contact.phone}
                  onChange={(e) => setNewSalon({ 
                    ...newSalon, 
                    contact: { ...newSalon.contact, phone: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newSalon.contact.email}
                  onChange={(e) => setNewSalon({ 
                    ...newSalon, 
                    contact: { ...newSalon.contact, email: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter email"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newSalon.description}
                  onChange={(e) => setNewSalon({ ...newSalon, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  rows="3"
                  placeholder="Describe your salon and services"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={newSalon.address.street}
                  onChange={(e) => setNewSalon({ 
                    ...newSalon, 
                    address: { ...newSalon.address, street: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter street address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={newSalon.address.city}
                  onChange={(e) => setNewSalon({ 
                    ...newSalon, 
                    address: { ...newSalon.address, city: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={newSalon.address.state}
                  onChange={(e) => setNewSalon({ 
                    ...newSalon, 
                    address: { ...newSalon.address, state: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={newSalon.address.zipCode}
                  onChange={(e) => setNewSalon({ 
                    ...newSalon, 
                    address: { ...newSalon.address, zipCode: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter ZIP code"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salon Image
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSalonImage(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                  />
                  {salonImage && (
                    <div className="flex-shrink-0">
                      <img
                        src={URL.createObjectURL(salonImage)}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Upload a high-quality image of your salon (recommended: 800x600px)
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleCreateSalon}
                disabled={!newSalon.name || !newSalon.category || !newSalon.contact.phone || !newSalon.contact.email}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-plus mr-2"></i>
                Create Salon
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-6 pt-8 pb-4 bg-pink-50 rounded-t-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 text-left">{salonData?.name}</h1>
          <p className="text-lg text-gray-600 mb-2 text-left">Manage your salon, bookings, and services</p>
          <div className="flex items-center space-x-2 text-left">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fas fa-star text-base ${
                    salonData?.rating?.average >= star ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                ></i>
              ))}
            </div>
            <span className="text-gray-600 text-sm">
              {salonData?.rating?.average || 0} ({salonData?.rating?.count || 0} reviews)
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-pink-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-calendar-day text-white"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Today's Bookings</p>
                <p className="text-2xl font-bold text-gray-800">{todayBookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-pink-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-white"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-800">{upcomingBookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-pink-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-concierge-bell text-white"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Services</p>
                <p className="text-2xl font-bold text-gray-800">
                  {services.filter(s => s.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-pink-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-dollar-sign text-white"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">${totalRevenue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-pink-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: 'fas fa-home' },
                { id: 'bookings', label: 'Bookings', icon: 'fas fa-calendar' },
                { id: 'services', label: 'Services', icon: 'fas fa-concierge-bell' },
                { id: 'profile', label: 'Profile', icon: 'fas fa-store' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Schedule</h3>
                  {todayBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <i className="fas fa-calendar-times text-4xl text-gray-300 mb-4"></i>
                      <p className="text-gray-500">No bookings for today</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {todayBookings.map((booking) => (
                        <div key={booking._id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-800">{booking.user?.name || booking.customer?.name || 'Unknown'}</h4>
                              <p className="text-gray-600">{booking.service?.name || 'Unknown Service'}</p>
                              <p className="text-sm text-gray-500">
                                {booking.startTime} - {booking.endTime}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                              {booking.status === 'pending' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}
                                  className="text-green-500 hover:text-green-700 text-sm"
                                >
                                  Confirm
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Bookings</h3>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking._id} className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span className="text-gray-600">
                          {booking.user?.name || booking.customer?.name || 'Unknown'} booked {booking.service?.name || 'Unknown Service'}
                        </span>
                        <span className="text-gray-400">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">All Bookings</h3>
                  <div className="flex space-x-2">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <i className="fas fa-spinner fa-spin text-2xl text-pink-500 mb-4"></i>
                    <p className="text-gray-500">Loading bookings...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <i className="fas fa-calendar-times text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">No bookings found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-800">{booking.user?.name || booking.customer?.name || 'Unknown'}</h4>
                            <p className="text-gray-600">{booking.service?.name || 'Unknown Service'}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(booking.appointmentDate).toLocaleDateString()} at {booking.startTime} - {booking.endTime}
                            </p>
                            <p className="text-sm font-semibold text-gray-800">
                              ${booking.totalAmount} {booking.currency}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                            {booking.status === 'pending' && (
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}
                                  className="text-green-500 hover:text-green-700 text-sm"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')}
                                  className="text-red-500 hover:text-red-700 text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(booking._id, 'completed')}
                                className="text-blue-500 hover:text-blue-700 text-sm"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Services</h3>
                  <button
                    onClick={() => {
                      setShowAddServiceForm(true);
                      setNewService({ name: '', description: '', duration: '', price: '', category: '', subcategory: '' });
                    }}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Add Service
                  </button>
                </div>

                {/* Add New Service Form */}
                {showAddServiceForm && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-gray-800 mb-4">Add New Service</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
                        <input
                          type="text"
                          placeholder="Service Name"
                          value={newService.name}
                          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                        <select
                          value={newService.category}
                          onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          <option value="">Select Category</option>
                          <option value="hair">Hair</option>
                          <option value="nail">Nail</option>
                          <option value="spa">Spa</option>
                          <option value="massage">Massage</option>
                          <option value="beauty">Beauty</option>
                          <option value="barber">Barber</option>
                          <option value="wellness">Wellness</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory *</label>
                        <select
                          value={newService.subcategory}
                          onChange={(e) => setNewService({ ...newService, subcategory: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          <option value="">Select Subcategory</option>
                          <option value="haircut">Haircut</option>
                          <option value="coloring">Coloring</option>
                          <option value="styling">Styling</option>
                          <option value="manicure">Manicure</option>
                          <option value="pedicure">Pedicure</option>
                          <option value="facial">Facial</option>
                          <option value="massage">Massage</option>
                          <option value="waxing">Waxing</option>
                          <option value="makeup">Makeup</option>
                          <option value="eyebrows">Eyebrows</option>
                          <option value="lashes">Lashes</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes) *</label>
                        <input
                          type="number"
                          placeholder="Duration (minutes)"
                          value={newService.duration}
                          onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                        <input
                          type="number"
                          placeholder="Price"
                          value={newService.price}
                          onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          placeholder="Description"
                          value={newService.description}
                          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          rows="3"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={handleAddService}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                      >
                        Add Service
                      </button>
                      <button
                        onClick={() => {
                          setShowAddServiceForm(false);
                          setNewService({ name: '', description: '', duration: '', price: '', category: '', subcategory: '' });
                        }}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Services List */}
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service._id} className="bg-gray-50 rounded-lg p-6">
                      {editingService === service._id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={service.name}
                              onChange={(e) => setServices(services.map(s => 
                                s._id === service._id ? { ...s, name: e.target.value } : s
                              ))}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                            <input
                              type="text"
                              value={service.category}
                              onChange={(e) => setServices(services.map(s => 
                                s._id === service._id ? { ...s, category: e.target.value } : s
                              ))}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                            <input
                              type="number"
                              value={service.duration}
                              onChange={(e) => setServices(services.map(s => 
                                s._id === service._id ? { ...s, duration: e.target.value } : s
                              ))}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                            <input
                              type="number"
                              value={service.price}
                              onChange={(e) => setServices(services.map(s => 
                                s._id === service._id ? { ...s, price: e.target.value } : s
                              ))}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                            <textarea
                              value={service.description}
                              onChange={(e) => setServices(services.map(s => 
                                s._id === service._id ? { ...s, description: e.target.value } : s
                              ))}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent md:col-span-2"
                              rows="3"
                            />
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleUpdateService(service._id, service)}
                              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={() => setEditingService(null)}
                              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1 text-left">
                            <h4 className="font-semibold text-gray-800 mb-1">{service.name}</h4>
                            <p className="text-gray-600 mb-2">{service.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span><i className="fas fa-clock mr-1"></i>{service.duration} min</span>
                              <span><i className="fas fa-dollar-sign mr-1"></i>${service.price}</span>
                              <span><i className="fas fa-tag mr-1"></i>{service.category}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 md:ml-6 mt-4 md:mt-0">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {service.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <button
                              onClick={() => setEditingService(service._id)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteService(service._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Salon Profile</h3>
                  {!editingSalon && (
                    <button
                      onClick={() => {
                        setEditingSalon(true);
                        setNewSalon({
                          name: salonData?.name || '',
                          description: salonData?.description || '',
                          address: {
                            street: salonData?.address?.street || '',
                            city: salonData?.address?.city || '',
                            state: salonData?.address?.state || '',
                            zipCode: salonData?.address?.zipCode || '',
                            country: salonData?.address?.country || 'United States'
                          },
                          contact: {
                            phone: salonData?.contact?.phone || salonData?.phone || '',
                            email: salonData?.contact?.email || salonData?.email || ''
                          },
                          category: salonData?.category || ''
                        });
                      }}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                    >
                      <i className="fas fa-edit mr-2"></i>
                      Edit Profile
                    </button>
                  )}
                </div>

                {editingSalon ? (
                  <div className="max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Salon Name *
                        </label>
                        <input
                          type="text"
                          value={newSalon.name}
                          onChange={(e) => setNewSalon({ ...newSalon, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Enter salon name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          value={newSalon.category}
                          onChange={(e) => setNewSalon({ ...newSalon, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          <option value="">Select category</option>
                          <option value="hair">Hair Salon</option>
                          <option value="nail">Nail Salon</option>
                          <option value="spa">Spa</option>
                          <option value="massage">Massage</option>
                          <option value="beauty">Beauty Salon</option>
                          <option value="barber">Barber Shop</option>
                          <option value="wellness">Wellness</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={newSalon.contact.phone}
                          onChange={(e) => setNewSalon({ 
                            ...newSalon, 
                            contact: { ...newSalon.contact, phone: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={newSalon.contact.email}
                          onChange={(e) => setNewSalon({ 
                            ...newSalon, 
                            contact: { ...newSalon.contact, email: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Enter email"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={newSalon.description}
                          onChange={(e) => setNewSalon({ ...newSalon, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          rows="3"
                          placeholder="Describe your salon and services"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={newSalon.address.street}
                          onChange={(e) => setNewSalon({ 
                            ...newSalon, 
                            address: { ...newSalon.address, street: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Enter street address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={newSalon.address.city}
                          onChange={(e) => setNewSalon({ 
                            ...newSalon, 
                            address: { ...newSalon.address, city: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Enter city"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={newSalon.address.state}
                          onChange={(e) => setNewSalon({ 
                            ...newSalon, 
                            address: { ...newSalon.address, state: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Enter state"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          value={newSalon.address.zipCode}
                          onChange={(e) => setNewSalon({ 
                            ...newSalon, 
                            address: { ...newSalon.address, zipCode: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Enter ZIP code"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Salon Image
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSalonImage(e.target.files[0])}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                          />
                          {(salonImage || salonData?.logo) && (
                            <div className="flex-shrink-0">
                              <img
                                src={salonImage ? URL.createObjectURL(salonImage) : salonData.logo}
                                alt="Preview"
                                className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Upload a high-quality image of your salon (recommended: 800x600px)
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <button
                        onClick={handleUpdateSalon}
                        disabled={!newSalon.name || !newSalon.category || !newSalon.contact.phone || !newSalon.contact.email}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="fas fa-save mr-2"></i>
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setEditingSalon(false);
                          setSalonImage(null);
                        }}
                        className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div className="font-medium text-gray-700 text-right">Salon Name</div>
                      <div className="text-gray-800 text-left">{salonData?.name}</div>
                      <div className="font-medium text-gray-700 text-right">Description</div>
                      <div className="text-gray-800 text-left">{salonData?.description}</div>
                      <div className="font-medium text-gray-700 text-right">Address</div>
                      <div className="text-gray-800 text-left">
                        {salonData?.address?.street}, {salonData?.address?.city}, {salonData?.address?.state} {salonData?.address?.zipCode}, {salonData?.address?.country}
                      </div>
                      <div className="font-medium text-gray-700 text-right">Phone</div>
                      <div className="text-gray-800 text-left">{salonData?.contact?.phone || salonData?.phone}</div>
                      <div className="font-medium text-gray-700 text-right">Email</div>
                      <div className="text-gray-800 text-left">{salonData?.contact?.email || salonData?.email}</div>
                      <div className="font-medium text-gray-700 text-right">Rating</div>
                      <div className="flex items-center text-left">
                        <div className="flex items-center mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i
                              key={star}
                              className={`fas fa-star text-sm ${
                                salonData?.rating?.average >= star ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            ></i>
                          ))}
                        </div>
                        <span className="text-gray-600 text-sm">
                          {salonData?.rating?.average || 0} ({salonData?.rating?.count || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonDashboard; 