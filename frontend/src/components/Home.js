import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { salonAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Home.css';

const Home = () => {
  const [featuredSalons, setFeaturedSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Fetch top-rated salons for featured section
  useEffect(() => {
    const fetchFeaturedSalons = async () => {
      try {
        setLoading(true);
        const response = await salonAPI.getAllSalons(); // Fetch all salons
        let salons = response.data.salons || [];
        // Sort by rating.average descending
        salons = salons.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
        // Take top 4
        setFeaturedSalons(salons.slice(0, 4));
      } catch (error) {
        console.error('Error fetching featured salons:', error);
        toast.error('Failed to load featured salons.');
        // Fallback to mock data for development
        const mockSalons = [
          {
            _id: 1,
            name: "Glamour Studio",
            image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            rating: { average: 4.8, count: 127 },
            address: { city: "Downtown" },
            category: "Hair & Beauty",
            priceRange: "$$"
          },
          {
            _id: 2,
            name: "Serenity Spa",
            image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            rating: { average: 4.9, count: 89 },
            address: { city: "Westside" },
            category: "Spa & Wellness",
            priceRange: "$$$"
          }
        ];
        setFeaturedSalons(mockSalons);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedSalons();
  }, []);

  const services = [
    {
      icon: "fas fa-cut",
      title: "Hair Styling",
      description: "Professional haircuts, coloring, and styling services"
    },
    {
      icon: "fas fa-spa",
      title: "Spa Treatments",
      description: "Relaxing facials, massages, and wellness therapies"
    },
    {
      icon: "fas fa-paint-brush",
      title: "Nail Care",
      description: "Manicures, pedicures, and nail art services"
    },
    {
      icon: "fas fa-magic",
      title: "Makeup",
      description: "Professional makeup for special occasions"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      rating: 5,
      text: "Found the perfect salon for my wedding! The booking process was so easy and the service was amazing."
    },
    {
      name: "Michael Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      rating: 5,
      text: "Great platform! I can easily compare prices and book appointments that fit my schedule."
    },
    {
      name: "Emily Rodriguez",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      rating: 5,
      text: "Love how I can read reviews and see photos before booking. Makes choosing a salon so much easier!"
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i 
        key={i} 
        className={`fas fa-star ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      ></i>
    ));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Animated moving background */}
        <div className="absolute inset-0 move-bg z-0" />
        
        {/* Animated floating bubbles - Evenly distributed */}
        <div className="bubble bubble-1" style={{ top: '10%', left: '5%' }}></div>
        <div className="bubble bubble-2" style={{ top: '20%', left: '25%' }}></div>
        <div className="bubble bubble-3" style={{ top: '30%', left: '45%' }}></div>
        <div className="bubble bubble-4" style={{ top: '40%', left: '65%' }}></div>
        <div className="bubble bubble-1" style={{ top: '50%', left: '85%' }}></div>
        <div className="bubble bubble-2" style={{ top: '60%', left: '15%' }}></div>
        <div className="bubble bubble-3" style={{ top: '70%', left: '35%' }}></div>
        <div className="bubble bubble-4" style={{ top: '80%', left: '55%' }}></div>
        <div className="bubble bubble-1" style={{ top: '90%', left: '75%' }}></div>
        <div className="bubble bubble-2" style={{ bottom: '10%', left: '10%' }}></div>
        <div className="bubble bubble-3" style={{ bottom: '20%', left: '30%' }}></div>
        <div className="bubble bubble-4" style={{ bottom: '30%', left: '50%' }}></div>
        <div className="bubble bubble-1" style={{ bottom: '40%', left: '70%' }}></div>
        <div className="bubble bubble-2" style={{ bottom: '50%', left: '90%' }}></div>
        <div className="bubble bubble-3" style={{ bottom: '60%', left: '20%' }}></div>
        <div className="bubble bubble-4" style={{ bottom: '70%', left: '40%' }}></div>
        <div className="bubble bubble-1" style={{ bottom: '80%', left: '60%' }}></div>
        <div className="bubble bubble-2" style={{ bottom: '90%', left: '80%' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center slide-up-fade-in" style={{ animationDelay: '0.05s' }}>
            <h1
              className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 slide-up-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                Beauty Salon
              </span>
            </h1>
            <p
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto slide-up-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              Discover and book appointments at the best salons near you. 
              From haircuts to spa treatments, find everything you need for your beauty routine.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center slide-up-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              <Link 
                to="/salons" 
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Find Salons
              </Link>
              {!isAuthenticated ? (
                <Link 
                  to="/register" 
                  className="border-2 border-pink-500 text-pink-500 px-8 py-4 rounded-lg hover:bg-pink-500 hover:text-white transition-all duration-200 font-semibold text-lg"
                >
                  Join as Salon
                </Link>
              ) : (
                <Link 
                  to={user?.role === 'salon_owner' ? '/salon-dashboard' : '/dashboard'}
                  className="border-2 border-pink-500 text-pink-500 px-8 py-4 rounded-lg hover:bg-pink-500 hover:text-white transition-all duration-200 font-semibold text-lg"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>



      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 slide-up-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-3xl font-bold text-gray-800">Our Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <div
                key={service.title}
                className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center group card-hover slide-up-fade-in ghover"
                style={{ animationDelay: `${0.15 + idx * 0.1}s` }}
              >
                <i
                  className={`${service.icon} text-4xl text-pink-500 mb-4`}
                ></i>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Salons Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12 slide-up-fade-in" style={{ animationDelay: '0.1s' }}>
            Featured Salons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredSalons.map((salon, idx) => (
              <div
                key={salon._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer card-hover slide-up-fade-in ghover"
                style={{ animationDelay: `${0.15 + idx * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={salon.logo || '/default-salon.png'}
                    alt={salon.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ghover-img"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-pink-500 transition-colors duration-200">
                    {salon.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{salon.category}</p>
                  <p className="text-gray-500 mb-3 flex items-center">
                    <i className="fas fa-map-marker-alt text-pink-500 mr-2"></i>
                    {salon.address?.city || 'Location not specified'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {renderStars(salon.rating?.average || 0)}
                      </div>
                      <span className="text-sm text-gray-600">({salon.rating?.count || 0})</span>
                    </div>
                    <span className="text-pink-500 font-semibold">{salon.rating?.average || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              to="/salons" 
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 font-semibold ghover-btn"
            >
              View All Salons
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12 slide-up-fade-in" style={{ animationDelay: '0.1s' }}>
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={testimonial.name}
                className="bg-pink-50 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center slide-up-fade-in card-hover ghover"
                style={{ animationDelay: `${0.15 + idx * 0.1}s` }}
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full object-cover mb-4 shadow ghover-img"
                />
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{testimonial.name}</h4>
                <div className="flex items-center justify-center mb-2">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-600">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 slide-up-fade-in" style={{ animationDelay: '0.1s' }}>
            Ready to Transform Your Look?
          </h2>
          <p className="text-xl text-pink-100 mb-8 slide-up-fade-in" style={{ animationDelay: '0.2s' }}>
            Join thousands of satisfied customers who found their perfect salon through Salonease
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up-fade-in" style={{ animationDelay: '0.3s' }}>
            {!isAuthenticated ? (
              <Link 
                to="/register" 
                className="bg-white text-pink-500 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold text-lg ghover-btn"
              >
                Get Started Today
              </Link>
            ) : (
              <Link 
                to={user?.role === 'salon_owner' ? '/salon-dashboard' : '/dashboard'}
                className="bg-white text-pink-500 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold text-lg ghover-btn"
              >
                Go to Dashboard
              </Link>
            )}
            <Link 
              to="/salons" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-pink-500 transition-all duration-200 font-semibold text-lg ghover-btn"
            >
              Browse Salons
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 