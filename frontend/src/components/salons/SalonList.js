import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { salonAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const SalonList = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  // Fetch salons from API
  useEffect(() => {
    const fetchSalons = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedCategory && selectedCategory !== 'All Categories') {
          params.category = selectedCategory;
        }
        if (selectedPriceRange && selectedPriceRange !== 'Any Price') {
          params.priceRange = selectedPriceRange.split(' ')[0];
        }
        if (selectedRating && selectedRating !== 'Any Rating') {
          params.minRating = selectedRating.split('+')[0];
        }
        
        const response = await salonAPI.getAllSalons(params);
        setSalons(response.data.salons || []);
      } catch (error) {
        console.error('Error fetching salons:', error);
        toast.error('Failed to load salons. Please try again.');
        // Fallback to mock data for development
        const mockSalons = [
          {
            _id: 1,
            name: "Glamour Studio",
            image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            rating: { average: 4.8, count: 127 },
            address: { city: "Downtown" },
            category: "Hair & Beauty",
            priceRange: "$$",
            description: "Professional hair styling and beauty services in the heart of downtown.",
            isOpen: true,
            distance: "0.5 km"
          },
          {
            _id: 2,
            name: "Serenity Spa",
            image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            rating: { average: 4.9, count: 89 },
            address: { city: "Westside" },
            category: "Spa & Wellness",
            priceRange: "$$$",
            description: "Luxurious spa treatments and wellness therapies for ultimate relaxation.",
            isOpen: true,
            distance: "1.2 km"
          }
        ];
        setSalons(mockSalons);
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, [selectedCategory, selectedPriceRange, selectedRating]);

  const categories = ["All Categories", "hair", "nail", "spa", "massage"];
  const priceRanges = ["Any Price", "$ (Budget)", "$$ (Moderate)", "$$$ (Premium)"];
  const ratings = ["Any Rating", "4.5+ Stars", "4.0+ Stars", "3.5+ Stars"];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i 
        key={i} 
        className={`fas fa-star ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      ></i>
    ));
  };

  const filteredSalons = salons.filter(salon => {
    const matchesSearch = salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (salon.address?.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         salon.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All Categories' || 
                           salon.category === selectedCategory;
    
    const matchesPrice = selectedPriceRange === '' || selectedPriceRange === 'Any Price' || 
                        salon.priceRange === selectedPriceRange.split(' ')[0];
    
    const matchesRating = selectedRating === '' || selectedRating === 'Any Rating' || 
                         (selectedRating === '4.5+ Stars' && salon.rating?.average >= 4.5) ||
                         (selectedRating === '4.0+ Stars' && salon.rating?.average >= 4.0) ||
                         (selectedRating === '3.5+ Stars' && salon.rating?.average >= 3.5);
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Find Your Perfect Salon
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover and book appointments at the best salons near you
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-pink-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search salons, locations, or services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {priceRanges.map(price => (
                  <option key={price} value={price}>{price}</option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {ratings.map(rating => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${filteredSalons.length} salons found`}
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Sort by:</span>
            <select className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-pink-500 focus:border-transparent">
              <option>Recommended</option>
              <option>Rating</option>
              <option>Distance</option>
              <option>Price</option>
            </select>
          </div>
        </div>

        {/* Salon Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredSalons.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-search text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No salons found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedPriceRange('');
                setSelectedRating('');
              }}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSalons.map((salon) => (
              <Link key={salon._id} to={`/salons/${salon._id}`} className="group">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 border border-pink-100">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={salon.logo ? `http://localhost:5000${salon.logo}` : '/default-salon.png'} 
                      alt={salon.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-800">
                      {salon.priceRange}
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        salon.isOpen 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {salon.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-800">
                      {salon.distance}
                    </div>
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
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {salon.description}
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
              </Link>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && filteredSalons.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 font-semibold">
              Load More Salons
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalonList; 