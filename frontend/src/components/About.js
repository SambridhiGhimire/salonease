import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const About = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">🧴 About Salonease</h1>
          <p className="text-xl text-pink-100 max-w-3xl mx-auto">
            Your smart solution to salon appointment management. We bridge the gap between local salons and modern, tech-savvy customers.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Who We Are Section */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-12 border border-pink-100">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">💡</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Who We Are</h2>
          </div>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Welcome to Salonease – your smart solution to salon appointment management. We are a passionate team dedicated to transforming the salon experience by bridging the
              gap between local salons and modern, tech-savvy customers.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Founded in 2025, Salonease was created to solve a common but often overlooked problem: complicated, outdated, and unorganized salon booking systems. Whether you're a
              customer looking for a quick appointment or a salon owner trying to manage your bookings, Salonease is designed with you in mind.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8 shadow-2xl mb-12 border border-pink-200">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <p className="text-gray-700 text-lg leading-relaxed">
              Our mission is simple: To streamline and simplify the salon appointment process through an accessible, mobile-responsive, and user-friendly digital platform—helping
              both customers and small salons thrive in a digital-first world.
            </p>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-pink-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                <i className="fas fa-users text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">For Customers</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">We help you discover salons, compare services, and book your appointments seamlessly—all in just a few clicks.</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-pink-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <i className="fas fa-store text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">For Salons</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We empower you with a smart dashboard to manage appointments, services, time slots, and customer engagement without the chaos of manual scheduling.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-12 border border-pink-100">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">💖</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Intuitive user experience",
              "Fast and secure booking process",
              "Real-time updates and notifications",
              "Perfect for small & medium-sized local salons",
              "Designed with feedback from real users",
              "24/7 customer support",
            ].map((feature, index) => (
              <div key={index} className="flex items-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-check text-white text-sm"></i>
                </div>
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8 shadow-2xl mb-12 border border-pink-200">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">📞</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Contact Us</h2>
          </div>
          <p className="text-gray-700 mb-8 text-lg">We're always here to help. Have a question, suggestion, or issue? Reach out to us using the details below.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">📬</span>
                Get in Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-map-marker-alt text-pink-500"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-gray-800 font-semibold">Tokha, Kathmandu, Nepal</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-phone text-blue-500"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-gray-800 font-semibold">+977 9849536283</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-envelope text-green-500"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-800 font-semibold">ghimiresambridhi518@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-globe text-purple-500"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    <p className="text-gray-800 font-semibold">www.salonease.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">🕘</span>
                Support Hours
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Monday – Friday</span>
                  <span className="text-gray-800 font-semibold">9:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Saturday – Sunday</span>
                  <span className="text-gray-800 font-semibold">10:00 AM – 2:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-12 border border-pink-100">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">❓</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            {[
              {
                q: "How do I book a salon appointment?",
                a: "Simply browse salons, choose a service, pick a time slot, and confirm your booking—all within a few clicks.",
              },
              {
                q: "Can I cancel or reschedule my booking?",
                a: "Yes, you can cancel or reschedule from your profile dashboard up to 2 hours before your appointment.",
              },
              {
                q: "Is Salonease free to use?",
                a: "Yes, Salonease is free for customers. Salons can choose between a free plan and premium tools for additional features.",
              },
              {
                q: "How can my salon join Salonease?",
                a: "Click on the 'Register Your Salon' button on the homepage and follow the simple onboarding process.",
              },
              {
                q: "Is my personal data safe?",
                a: "Absolutely. We use secure login methods and encrypted storage to protect all user information.",
              },
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                  <span className="text-pink-500 mr-3">Q{index + 1}:</span>
                  {faq.q}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  <span className="text-purple-500 font-semibold">A: </span>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-pink-100">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
              <span className="text-2xl">🗺</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Find Us on the Map</h2>
          </div>
          <div className="h-96 rounded-2xl overflow-hidden shadow-lg">
            <MapContainer
              center={[27.7172, 85.324]} // Kathmandu coordinates
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              className="z-0"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[27.7172, 85.324]}>
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold text-lg mb-2">Salonease</h3>
                    <p className="text-gray-600">Tokha, Kathmandu, Nepal</p>
                    <p className="text-gray-600">+977 9849536283</p>
                    <p className="text-gray-600">ghimiresambridhi518@gmail.com</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
