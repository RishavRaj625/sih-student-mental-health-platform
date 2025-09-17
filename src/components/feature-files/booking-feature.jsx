// components/feature-files/booking-feature.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FeatureViewer from '../FeatureViewer';

const BookingFeature = () => {
  const navigate = useNavigate();
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingStep, setBookingStep] = useState('select'); // select, details, confirm
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    phone: "",
    email: "",
    reason: '',
    urgency: 'normal',
    sessionType: 'video',
    notes: ''
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [status, setStatus] = useState("");

  // Mock counselor data
  const counselors = [
    {
      id: 1,
      name: 'Dr. Sarah Wilson',
      specialization: 'Anxiety & Depression',
      rating: 4.9,
      experience: '8 years',
      image: '👩‍⚕️',
      availability: 'Available today',
      nextSlot: '2:00 PM'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialization: 'Trauma & PTSD',
      rating: 4.8,
      experience: '12 years',
      image: '👨‍⚕️',
      availability: 'Available tomorrow',
      nextSlot: '10:00 AM'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialization: 'Relationship & Family',
      rating: 4.9,
      experience: '6 years',
      image: '👩‍⚕️',
      availability: 'Available today',
      nextSlot: '4:30 PM'
    }
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleCounselorSelect = (counselor) => {
    setSelectedCounselor(counselor);
    setBookingStep('details');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setIsBooking(true);

    try {
      const response = await fetch(
        // "https://akg003.app.n8n.cloud/webhook/tallyforms",
        "https://aniitt.app.n8n.cloud/webhook-test/tallyforms ",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...bookingDetails,
            counselorName: selectedCounselor?.name,
            counselorSpecialization: selectedCounselor?.specialization,
            selectedDate,
            selectedTime,
            featureType: "counseling-booking",
            submittedAt: new Date().toISOString()
          }),
        }
      );

      if (response.ok) {
        setStatus("✅ Success! We'll call you shortly to confirm your counseling session.");
        setBookingComplete(true);
        setBookingStep('confirm');
      } else {
        setStatus("❌ Error booking session. Please try again.");
      }
    } catch (error) {
      setStatus("⚠️ Network error. Please check your connection and try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleChange = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  const generateNextDays = (count = 7) => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    
    return dates;
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleNavigateToResources = () => {
    navigate('/resources');
  };

  const resetBooking = () => {
    setBookingStep('select');
    setSelectedCounselor(null);
    setSelectedDate('');
    setSelectedTime('');
    setBookingComplete(false);
    setStatus("");
    setBookingDetails({
      name: "",
      phone: "",
      email: "",
      reason: '',
      urgency: 'normal',
      sessionType: 'video',
      notes: ''
    });
  };

  if (bookingStep === 'confirm' && bookingComplete) {
    return (
      <FeatureViewer title="Booking Confirmation">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking in progress!</h3>
          <p className="text-gray-600 mb-6">Your are in waitlist. We'll call you to confirm the appointment.</p>
          
          <div className="bg-green-50 p-6 rounded-lg text-left max-w-md mx-auto">
            <h4 className="font-semibold text-green-800 mb-3">Session Details</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Counselor:</strong> {selectedCounselor?.name}</p>
              <p><strong>Specialization:</strong> {selectedCounselor?.specialization}</p>
              <p><strong>Contact:</strong> {bookingDetails.name}</p>
              <p><strong>Phone:</strong> {bookingDetails.phone}</p>
              <p><strong>Email:</strong> {bookingDetails.email}</p>
              <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Type:</strong> {bookingDetails.sessionType === 'video' ? 'Video Call' : bookingDetails.sessionType === 'phone' ? 'Phone Call' : 'In-Person'}</p>
              <p><strong>Session ID:</strong> #BK{Math.floor(Math.random() * 10000)}</p>
            </div>
          </div>

          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={handleNavigateToDashboard}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={resetBooking}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Book Another Session
            </button>
          </div>
        </div>
      </FeatureViewer>
    );
  }

  return (
    <FeatureViewer title="Book a Counseling Session">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={handleNavigateToDashboard}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
          >
            <span>🏠</span>
            <span>Home</span>
          </button>
          <button
            onClick={handleNavigateToResources}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
          >
            <span>📚</span>
            <span>Resources</span>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            bookingStep === 'select' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>1</div>
          <div className="w-8 h-0.5 bg-gray-300"></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            bookingStep === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>2</div>
        </div>
      </div>

      {bookingStep === 'select' && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Choose Your Counselor</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {counselors.map(counselor => (
              <div
                key={counselor.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCounselorSelect(counselor)}
              >
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-2xl">{counselor.image}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{counselor.name}</h4>
                    <p className="text-sm text-gray-600">{counselor.specialization}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <span className="flex items-center">
                      ⭐ {counselor.rating}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Experience:</span>
                    <span>{counselor.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Available:</span>
                    <span className="text-green-600">{counselor.nextSlot}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {counselor.availability}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {bookingStep === 'details' && selectedCounselor && (
        <div className="max-w-3xl mx-auto p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setBookingStep('select')}
              className="text-blue-600 hover:text-blue-700 mr-4"
            >
              ← Back
            </button>
            <div className="text-center flex-1">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                📅 Book with {selectedCounselor.name}
              </h3>
              <p className="text-gray-600">
                Schedule your counseling session - We'll call you to confirm
              </p>
            </div>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={bookingDetails.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingDetails.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1234567890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={bookingDetails.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
              />
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {generateNextDays().map(date => (
                  <button
                    key={date.value}
                    type="button"
                    onClick={() => setSelectedDate(date.value)}
                    className={`p-3 text-sm rounded-lg border transition-colors ${
                      selectedDate === date.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {date.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Time *
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {timeSlots.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      selectedTime === time
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Session Type */}
            <div>
              {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Type *
              </label> */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {[
                  { value: 'phone', label: 'Call to Book Appointment', icon: '📞' }
                  // { value: 'video', label: 'Video Call', icon: '📹' },
                  // { value: 'in-person', label: 'In-Person', icon: '🏢' }
                ].map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setBookingDetails(prev => ({ ...prev, sessionType: type.value }))}
                    className={`p-3 rounded-lg border transition-colors flex items-center justify-center space-x-2 ${
                      bookingDetails.sessionType === type.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reason for Session */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Session *
              </label>
              <select
                name="reason"
                value={bookingDetails.reason}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                required
              >
                <option value="">Select reason...</option>
                <option value="anxiety">Anxiety Management</option>
                <option value="depression">Depression Support</option>
                <option value="stress">Stress Management</option>
                <option value="relationship">Relationship Issues</option>
                <option value="trauma">Trauma Recovery</option>
                <option value="general">General Mental Health</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <div className="flex space-x-2">
                {[
                  { value: 'low', label: 'Low', color: 'green' },
                  { value: 'normal', label: 'Normal', color: 'blue' },
                  { value: 'high', label: 'High', color: 'red' }
                ].map(urgency => (
                  <button
                    key={urgency.value}
                    type="button"
                    onClick={() => setBookingDetails(prev => ({ ...prev, urgency: urgency.value }))}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      bookingDetails.urgency === urgency.value
                        ? `bg-${urgency.color}-600 text-white border-${urgency.color}-600`
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {urgency.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={bookingDetails.notes}
                onChange={handleChange}
                placeholder="Any additional information you'd like to share with your counselor..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedDate || !selectedTime || !bookingDetails.reason || !bookingDetails.name || !bookingDetails.phone || !bookingDetails.email || isBooking}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isBooking ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Booking session...</span>
                </>
              ) : (
                <>
                  <span>Book Counseling Session</span>
                  <span>📞</span>
                </>
              )}
            </button>
          </form>

          {status && (
            <div className={`mt-4 p-3 rounded-lg text-center font-medium ${
              status.includes('Success') 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {status}
            </div>
          )}

          {/* Feature Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <span className="mr-2">ℹ️</span>
              How counseling booking works
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Our team will call you within 3 mins to confirm your session</li>
              <li>• We'll coordinate with your selected counselor for availability</li>
              <li>• You'll receive session details via SMS and email</li>
              <li>• High urgency sessions are prioritized and handled immediately</li>
              <li>• All personal information is kept strictly confidential</li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
              <div className="text-red-600 font-semibold mb-1">🚨 Crisis?</div>
              <div className="text-red-700 text-xs">Call crisis line: <strong>988</strong></div>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-center">
              <div className="text-purple-600 font-semibold mb-1">⏰ Urgent Session</div>
              <div className="text-purple-700 text-xs">Same-day appointments available</div>
            </div>
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-center">
              <div className="text-teal-600 font-semibold mb-1">💬 Support Groups</div>
              <div className="text-teal-700 text-xs">Join peer support</div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Info - Only show on counselor selection step */}
      {bookingStep === 'select' && (
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">About Our Counseling Services</h4>
          <p className="text-blue-800 text-sm mb-2">
            Book sessions with licensed mental health professionals who specialize in various areas of mental wellness.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <p><strong>✅ Licensed Professionals:</strong> All counselors are licensed and experienced</p>
              <p><strong>🔒 Confidential:</strong> Your privacy is protected</p>
            </div>
            <div>
              <p><strong>💻 Flexible Options:</strong> Video, phone, or in-person sessions</p>
              <p><strong>📅 Easy Scheduling:</strong> Book and manage appointments online</p>
            </div>
          </div>
        </div>
      )}
    </FeatureViewer>
  );
};

export default BookingFeature;