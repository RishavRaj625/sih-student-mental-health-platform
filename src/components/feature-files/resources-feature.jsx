// components/feature-files/resources-feature.jsx
import React, { useState } from 'react';
import FeatureViewer from '../FeatureViewer';

const ResourcesFeature = ({ onNavigateToBooking }) => {
  const [activeCategory, setActiveCategory] = useState('articles');

  const categories = {
    articles: [
      {
        id: 1,
        title: 'Understanding Anxiety',
        description: 'Learn about anxiety disorders and effective coping strategies.',
        url: '#',
        readTime: '5 min read',
        category: 'Anxiety'
      },
      {
        id: 2,
        title: 'Managing Depression',
        description: 'Evidence-based techniques for dealing with depression.',
        url: '#',
        readTime: '8 min read',
        category: 'Depression'
      },
      {
        id: 3,
        title: 'Mindfulness and Mental Health',
        description: 'How mindfulness practices can improve your mental wellbeing.',
        url: '#',
        readTime: '6 min read',
        category: 'Mindfulness'
      }
    ],
    videos: [
      {
        id: 1,
        title: 'Breathing Exercises for Anxiety',
        description: 'Guided breathing techniques to reduce anxiety.',
        url: '#',
        duration: '10 minutes',
        category: 'Anxiety'
      },
      {
        id: 2,
        title: 'Daily Meditation Practice',
        description: 'Start your meditation journey with this beginner guide.',
        url: '#',
        duration: '15 minutes',
        category: 'Meditation'
      }
    ],
    tools: [
      {
        id: 1,
        title: 'Mood Tracker',
        description: 'Track your daily mood and identify patterns.',
        url: '#',
        type: 'Interactive Tool'
      },
      {
        id: 2,
        title: 'Gratitude Journal',
        description: 'Digital journal to practice gratitude daily.',
        url: '#',
        type: 'Digital Tool'
      }
    ],
    crisis: [
      {
        id: 1,
        title: 'National Suicide Prevention Lifeline',
        description: '24/7 crisis support hotline.',
        phone: '988',
        availability: 'Available 24/7'
      },
      {
        id: 2,
        title: 'Crisis Text Line',
        description: 'Text-based crisis support.',
        phone: 'Text HOME to 741741',
        availability: 'Available 24/7'
      }
    ]
  };

  const handleNavigateToBooking = () => {
    if (onNavigateToBooking) {
      onNavigateToBooking();
    }
  };

  const renderResourceCard = (resource) => {
    if (activeCategory === 'crisis') {
      return (
        <div key={resource.id} className="bg-red-50 border border-red-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <h4 className="font-semibold text-red-900 mb-2">{resource.title}</h4>
          <p className="text-red-800 text-sm mb-3">{resource.description}</p>
          <div className="flex flex-col space-y-2">
            <div className="text-red-700 font-medium text-lg">{resource.phone}</div>
            <div className="text-red-600 text-sm">{resource.availability}</div>
          </div>
        </div>
      );
    }

    return (
      <div key={resource.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-gray-900">{resource.title}</h4>
          {resource.category && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {resource.category}
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-blue-600 text-sm">
            {resource.readTime || resource.duration || resource.type}
          </span>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Access →
          </button>
        </div>
      </div>
    );
  };

  return (
    <FeatureViewer title="Mental Health Resources">
      <div className="space-y-6">
        {/* Header with Booking Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Comprehensive Mental Health Resources
            </h3>
            <p className="text-gray-600">
              Explore our curated collection of articles, videos, tools, and crisis support resources.
            </p>
          </div>
          <button
            onClick={handleNavigateToBooking}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 shadow-lg"
          >
            <span>📅</span>
            <span>Book Professional Session</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(categories).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories[activeCategory].map(renderResourceCard)}
        </div>

        {/* Call-to-Action Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-3">
            Need Personalized Support?
          </h4>
          <p className="text-gray-700 mb-4">
            While these resources are helpful, sometimes you need one-on-one support. 
            Our licensed counselors are here to provide personalized guidance tailored to your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleNavigateToBooking}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 flex-1"
            >
              <span>🗓️</span>
              <span>Schedule Counseling Session</span>
            </button>
            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 flex-1">
              <span>💬</span>
              <span>Chat with AI Counselor</span>
            </button>
          </div>
        </div>

        {/* Resource Categories Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-semibold text-green-900 mb-2">📚 Articles</h5>
            <p className="text-green-800 text-sm">
              Evidence-based articles on various mental health topics.
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-semibold text-blue-900 mb-2">🎥 Videos</h5>
            <p className="text-blue-800 text-sm">
              Guided exercises and educational content.
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h5 className="font-semibold text-purple-900 mb-2">🛠️ Tools</h5>
            <p className="text-purple-800 text-sm">
              Interactive tools for self-assessment and tracking.
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h5 className="font-semibold text-red-900 mb-2">🚨 Crisis</h5>
            <p className="text-red-800 text-sm">
              Immediate support resources for crisis situations.
            </p>
          </div>
        </div>
      </div>
    </FeatureViewer>
  );
};

export default ResourcesFeature;