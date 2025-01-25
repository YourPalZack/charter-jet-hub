import React from 'react';
import { Link } from 'react-router-dom';

export function HowItWorks() {
  const steps = [
    {
      title: 'Browse Available Flights',
      description: 'Search through our extensive collection of private jet flights, including charter flights, one-way trips, empty leg specials, and last-minute deals.',
      icon: '🔍'
    },
    {
      title: 'Submit Your Own Listing',
      description: 'List your private jet flight in minutes. Add details about your aircraft, route, and pricing. Optionally feature your listing for increased visibility.',
      icon: '✈️'
    },
    {
      title: 'Feature Your Listing',
      description: 'Boost visibility by featuring your listing on the homepage or category pages. Choose from 7, 14, or 21-day featuring options.',
      icon: '⭐'
    },
    {
      title: 'Connect with Operators',
      description: 'Contact flight operators directly through our platform to discuss details and make arrangements.',
      icon: '🤝'
    }
  ];

  const features = [
    {
      title: 'Multiple Flight Types',
      description: 'Find the perfect flight option:',
      items: [
        'Charter Flights - Book entire aircraft for your group',
        'One-Way Flights - Single direction private jet travel',
        'Empty Leg Flights - Discounted repositioning flights',
        'Last Minute Deals - Special offers on urgent departures'
      ]
    },
    {
      title: 'Listing Features',
      description: 'Enhance your listing visibility:',
      items: [
        '7-day featuring: $199 per location',
        '14-day featuring: $349 per location',
        '21-day featuring: $499 per location',
        'Feature in multiple categories simultaneously'
      ]
    },
    {
      title: 'User Benefits',
      description: 'Enjoy platform advantages:',
      items: [
        'No account required to submit listings',
        'Direct communication with operators',
        'Flexible search options',
        'Real-time availability updates'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          How JetListings Works
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Your marketplace for private jet flights. Whether you're looking to book a flight or list your aircraft,
          we make the process simple and efficient.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <div className="text-4xl mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <ul className="space-y-2">
              {feature.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg mb-6">
          Start browsing available flights or submit your own listing today.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/"
            className="bg-white text-blue-600 px-6 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            Browse Flights
          </Link>
          <Link
            to="/submit-flight"
            className="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors"
          >
            Submit a Listing
          </Link>
        </div>
      </div>
    </div>
  );
}