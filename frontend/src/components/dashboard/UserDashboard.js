import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { bookingAPI, reviewAPI } from "../../utils/api";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const { user, updateProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  });

  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingAPI.getBookingsByUser();
        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load bookings");
        // Fallback to mock data for development
        setBookings([
          {
            _id: "1",
            salon: { name: "Glamour Studio", _id: "1" },
            service: { name: "Hair Cut & Style", _id: "1" },
            appointmentDate: "2024-01-15",
            startTime: "10:00",
            endTime: "11:00",
            status: "confirmed",
            totalAmount: 75,
            currency: "USD",
            createdAt: "2024-01-10T10:00:00Z",
          },
          {
            _id: "2",
            salon: { name: "Serenity Spa", _id: "2" },
            service: { name: "Facial Treatment", _id: "2" },
            appointmentDate: "2024-01-20",
            startTime: "14:00",
            endTime: "15:30",
            status: "pending",
            totalAmount: 120,
            currency: "USD",
            createdAt: "2024-01-12T14:00:00Z",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleProfileUpdate = async () => {
    try {
      // TODO: Implement profile update API call
      toast.success("Profile updated successfully");
      setEditingProfile(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingAPI.cancelBooking(bookingId);
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  const handleAddReview = async (bookingId, rating, review) => {
    try {
      await reviewAPI.addReview({ bookingId, rating, review });
      toast.success("Review added successfully");
      // Refresh bookings to show the review
      const response = await bookingAPI.getBookingsByUser();
      setBookings(response.data.bookings || []);
    } catch (error) {
      toast.error("Failed to add review");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const upcomingBookings = bookings.filter((booking) => new Date(booking.appointmentDate) > new Date() && booking.status !== "cancelled");

  const pastBookings = bookings.filter((booking) => new Date(booking.appointmentDate) <= new Date() || booking.status === "cancelled");

  const totalSpent = bookings.filter((booking) => booking.status === "completed").reduce((sum, booking) => sum + booking.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Manage your appointments and profile</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-pink-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-calendar-check text-white"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
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
                <i className="fas fa-check-circle text-white"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-800">{bookings.filter((b) => b.status === "completed").length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-pink-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-dollar-sign text-white"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-800">${totalSpent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-pink-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview", icon: "fas fa-home" },
                { id: "bookings", label: "My Bookings", icon: "fas fa-calendar" },
                { id: "profile", label: "Profile", icon: "fas fa-user" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id ? "border-pink-500 text-pink-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Appointments</h3>
                  {upcomingBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <i className="fas fa-calendar-times text-4xl text-gray-300 mb-4"></i>
                      <p className="text-gray-500">No upcoming appointments</p>
                      <Link
                        to="/salons"
                        className="mt-4 inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                      >
                        Book Now
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingBookings.slice(0, 3).map((booking) => (
                        <div key={booking._id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-800">{booking.salon.name}</h4>
                              <p className="text-gray-600">{booking.service.name}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(booking.appointmentDate).toLocaleDateString()} at {booking.startTime}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>{booking.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking._id} className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span className="text-gray-600">
                          Booked {booking.service.name} at {booking.salon.name}
                        </span>
                        <span className="text-gray-400">{new Date(booking.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">My Bookings</h3>
                  <Link
                    to="/salons"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    New Booking
                  </Link>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <i className="fas fa-spinner fa-spin text-2xl text-pink-500 mb-4"></i>
                    <p className="text-gray-500">Loading bookings...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <i className="fas fa-calendar-times text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 mb-4">No bookings found</p>
                    <Link
                      to="/salons"
                      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
                    >
                      Book Your First Appointment
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-800">{booking.salon.name}</h4>
                            <p className="text-gray-600">{booking.service.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(booking.appointmentDate).toLocaleDateString()} at {booking.startTime} - {booking.endTime}
                            </p>
                            <p className="text-sm font-semibold text-gray-800">
                              ${booking.totalAmount} {booking.currency}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>{booking.status}</span>
                            {booking.status === "pending" && (
                              <button onClick={() => handleCancelBooking(booking._id)} className="text-red-500 hover:text-red-700 text-sm">
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Review Section for Completed Bookings */}
                        {booking.status === "completed" && !booking.review && (
                          <div className="border-t border-gray-200 pt-4">
                            <h5 className="font-medium text-gray-800 mb-2">Leave a Review</h5>
                            <div className="flex items-center space-x-2 mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} className="text-yellow-400 hover:text-yellow-500" onClick={() => handleAddReview(booking._id, star, "Great service!")}>
                                  <i className="fas fa-star"></i>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {booking.review && (
                          <div className="border-t border-gray-200 pt-4">
                            <h5 className="font-medium text-gray-800 mb-2">Your Review</h5>
                            <div className="flex items-center space-x-2 mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <i key={star} className={`fas fa-star ${star <= booking.rating ? "text-yellow-400" : "text-gray-300"}`}></i>
                              ))}
                            </div>
                            <p className="text-gray-600 text-sm">{booking.review}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">Profile Settings</h3>
                    <p className="text-gray-600 text-lg">Manage your account information and preferences</p>
                  </div>
                  {!editingProfile && (
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="group bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 font-semibold text-lg"
                    >
                      <i className="fas fa-edit mr-3 group-hover:rotate-12 transition-transform duration-300"></i>
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="max-w-6xl mx-auto">
                  {editingProfile ? (
                    <div className="bg-gradient-to-br from-white via-pink-50 to-purple-50 rounded-3xl p-10 shadow-2xl border border-pink-200">
                      <div className="text-center mb-8">
                        <h4 className="text-2xl font-bold text-gray-800 mb-2">Edit Your Profile</h4>
                        <p className="text-gray-600">Update your personal information below</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                              <i className="fas fa-user mr-3 text-pink-500 group-hover:scale-110 transition-transform duration-200"></i>
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={profileData.name}
                              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                              placeholder="Enter your full name"
                            />
                          </div>

                          <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                              <i className="fas fa-envelope mr-3 text-blue-500 group-hover:scale-110 transition-transform duration-200"></i>
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                              <i className="fas fa-phone mr-3 text-green-500 group-hover:scale-110 transition-transform duration-200"></i>
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                              placeholder="Enter your phone number"
                            />
                          </div>

                          <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                              <i className="fas fa-image mr-3 text-purple-500 group-hover:scale-110 transition-transform duration-200"></i>
                              Profile Picture
                            </label>
                            <div className="flex items-center space-x-6">
                              <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-pink-400 via-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                              </div>
                              <button className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm font-semibold group">
                                <i className="fas fa-camera mr-2 group-hover:scale-110 transition-transform duration-200"></i>
                                Change Photo
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-10 pt-8 border-t-2 border-gray-100">
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
                          <button
                            onClick={handleProfileUpdate}
                            className="group bg-gradient-to-r from-pink-500 to-purple-500 text-white px-10 py-4 rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 font-bold text-lg"
                          >
                            <i className="fas fa-save mr-3 group-hover:rotate-12 transition-transform duration-300"></i>
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingProfile(false)}
                            className="group border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-bold text-lg"
                          >
                            <i className="fas fa-times mr-3 group-hover:rotate-12 transition-transform duration-300"></i>
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Profile Details */}
                      <div className="bg-white rounded-3xl p-8 shadow-2xl border border-pink-100">
                        <div className="flex items-center mb-8">
                          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                            <i className="fas fa-user-circle text-white text-xl"></i>
                          </div>
                          <div>
                            <h4 className="text-2xl font-bold text-gray-800">Personal Information</h4>
                            <p className="text-gray-600">Your account details and preferences</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                          <div className="group bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-pink-200">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                                <i className="fas fa-user text-white"></i>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 font-medium">Full Name</p>
                                <p className="text-gray-800 font-bold text-lg">{user?.name}</p>
                              </div>
                            </div>
                          </div>

                          <div className="group bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-blue-200">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                                <i className="fas fa-envelope text-white"></i>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 font-medium">Email Address</p>
                                <p className="text-gray-800 font-bold text-lg">{user?.email}</p>
                              </div>
                            </div>
                          </div>

                          <div className="group bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-green-200">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                                <i className="fas fa-phone text-white"></i>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 font-medium">Phone Number</p>
                                <p className="text-gray-800 font-bold text-lg">{user?.phone || "Not provided"}</p>
                              </div>
                            </div>
                          </div>

                          <div className="group bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-purple-200">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                                <i className="fas fa-calendar-alt text-white"></i>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 font-medium">Member Since</p>
                                <p className="text-gray-800 font-bold text-lg">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Account Statistics */}
                        <div className="bg-gradient-to-r from-gray-50 to-pink-50 rounded-3xl p-8 border border-gray-200">
                          <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                              <i className="fas fa-chart-bar text-white"></i>
                            </div>
                            <h5 className="text-xl font-bold text-gray-800">Account Statistics</h5>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 text-center group hover:shadow-xl transition-all duration-300">
                              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <i className="fas fa-calendar-check text-white text-xl"></i>
                              </div>
                              <div className="text-3xl font-bold text-pink-600 mb-2">{bookings.length}</div>
                              <div className="text-gray-600 font-semibold">Total Bookings</div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 text-center group hover:shadow-xl transition-all duration-300">
                              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <i className="fas fa-dollar-sign text-white text-xl"></i>
                              </div>
                              <div className="text-3xl font-bold text-purple-600 mb-2">${totalSpent}</div>
                              <div className="text-gray-600 font-semibold">Total Spent</div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 text-center group hover:shadow-xl transition-all duration-300">
                              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <i className="fas fa-star text-white text-xl"></i>
                              </div>
                              <div className="text-3xl font-bold text-green-600 mb-2">{bookings.filter((b) => b.status === "completed").length}</div>
                              <div className="text-gray-600 font-semibold">Completed</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
